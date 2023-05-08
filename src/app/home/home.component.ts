import { Component, OnInit } from '@angular/core';
import { of } from 'rxjs';
import { SDService } from '../core/services/SD/SD.Service';
import { ProgressModel } from '../core/services/SD/model/ProgressModel';
import { TextToImageRequest } from '../core/services/SD/model/TextToImageRequest';
import { SavePhotoService } from '../core/services/save-photo/save-photo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public loading: boolean = false;
  public imgResult: string[] = [''];
  public blockScreen = false;
  public time: number = 0;
  public eta: number = 0;
  public progress: number = 0;
  public progStep: number = 0;
  public progSteps: number = 0;
  public duration:number = 0;
  public selectedModel: string = '';
  public modelos = [
    'deliberate_v2.ckpt [b4391b7978]',
    'deliberate_v11.ckpt [10a699c0f3]',
    'model-AUTOMATIC-1111.ckpt [fe4efff1e1]',
    'perfect_nsfw.ckpt [1505169a0d]',
    'realisticVisionV13_v13.ckpt [77e392958a]',
    'sd-v1-5-inpainting.ckpt [c6bbc15e32]',
    'uberRealisticPornMerge_urpmv12-inpainting.ckpt [9621d303da]',
    'uberRealisticPornMerge_urpmv12.ckpt [500437805]',
    'uberRealisticPornMerge_urpmv13.safetensors [f93e6a50ac]',
  ];

  public samplers = [
    'Euler a',
    'Euler',
    'LMS',
    'Heun',
    'DPM2',
    'DPM2 a',
    'DPM++ 2S a',
    'DPM++ 2M',
    'DPM++ SDE',
    'DPM fast',
    'DPM adaptive',
    'LMS Karras',
    'DPM2 Karras',
    'DPM2 a Karras',
    'DPM++ 2S a Karras',
    'DPM++ 2M Karras',
    'DPM++ SDE Karras',
    'DDIM',
    'PLMS',
  ];

  public params: TextToImageRequest = new TextToImageRequest({
    sampler_name: this.samplers[15],
    width: 512,
    height: 512,
    steps: 20,
    n_iter: 1,
    batch_size: 1,
    cfg_scale: 5,
    seed: -1,
    restore_faces: true,
  });

  constructor(private service: SDService, private photoService: SavePhotoService) {}

  ngOnInit(): void {
    this.getModel();
  }

  generate() {
    this.loading = true;
    this.generateImage();
    this.getProgress();
    this.countTime();
  }

  generateImage() {
    this.clear();
    this.service.text2img(this.params).subscribe((res) => {
      this.loading = false;
      let imgs: string[] = [];
      res.images.forEach((element) => {
        let img = `data:image/png;base64,${element}`;
        imgs.push(img);
        this.saveImage(img);
      });
      this.imgResult = imgs;
    }),
      (err: any) => {
        console.log(err);
      };
  }

  getProgress() {
      const interval = setInterval(() => {
        this.service.progress().subscribe((res: ProgressModel) => {
          if (this.loading === false) {
            clearInterval(interval);
            return;
          }
          this.eta = res.eta_relative? Math.round(res.eta_relative) : 0;
          this.progStep = res.state?.sampling_step ? (res.state.sampling_step) : 0;
          this.progSteps = res.state?.sampling_steps ? (res.state.sampling_steps) : 0;
          this.progress = res.progress? Math.round(res.progress * 100) : 0;
          const loadBar = document.querySelector('.loading-bar') as HTMLDivElement;
          loadBar.style.width = `${this.progress}%`
          if (res.current_image) {
            const img = `data:image/png;base64,${res.current_image}`;
            this.imgResult.pop();
            this.imgResult.push(img);
          }
        });
      }, 2000);
  }

  countTime(){
    const interval = setInterval( () =>{
      this.time++
      if (this.loading === false) {
        clearInterval(interval);
        this.duration = this.time;
        this.time = 0;
      }
    }, 1000)
  }

  interrupt() {
    this.service.interrupt().subscribe((res) => console.log('interrompido'));
    this.loading = false;
  }

  skip() {
    this.service.skip().subscribe((res) => console.log('skiped'));
  }

  saveImage(img: string) {
    this.photoService.savePhoto(img).subscribe((resp) => {
      console.log(resp);
    });
  }

  openFolder() {
    this.photoService.openFolder().subscribe((res) => console.log(res));
  }

  changeModel() {
    console.log('chamou changeModel');
    console.log(this.selectedModel);
    this.blockScreen = true;
    this.service.setModel({ sd_model_checkpoint: this.selectedModel }).subscribe((res) => {
      console.log(res);
      this.blockScreen = false;
    }),
      (err: any) => {
        console.log(err);
      };
  }

  getModel() {
    this.service.getModel().subscribe((res) => {
      const model = res.sd_model_checkpoint;
      const index = this.modelos.indexOf(model ? model : '');
      this.selectedModel = this.modelos[index];
    });
  }

  clear() {
    this.imgResult = [''];
  }

  switchResolution() {
    const width = this.params.width;
    this.params.width = this.params.height;
    this.params.height = width;
  }

  clearPrompt() {
    this.params.prompt = '';
    this.params.negative_prompt = '';
  }
}
