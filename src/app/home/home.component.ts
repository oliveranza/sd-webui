import { Component, OnInit } from '@angular/core';
import { FileService } from '../core/services/file-service/file.service';
import { StyleModel } from '../core/services/file-service/model/StyleModel';
import { ProgressModel } from '../core/services/sd-service/model/ProgressModel';
import { TextToImageRequest } from '../core/services/sd-service/model/TextToImageRequest';
import { SDService } from '../core/services/sd-service/sd.service';
import { ToastModel } from '../shared/components/toast/toast.model';
import { InfoModel } from './model/infoModel';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public fullScreen: boolean = false;
  public zoomImg: string = '';

  public newToast: ToastModel = {} as ToastModel;

  public imageInfo: InfoModel = {};

  public loading: boolean = false;
  public defaultImg = '';
  public imgResult: string[] = [''];
  public blockScreen = false;

  public time: number = 0;
  public eta: number = 0;
  public progress: number = 0;
  public progStep: number = 0;
  public progSteps: number = 0;
  public duration: number = 0;

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
  public stylename: string = '';
  public selectedStyle: StyleModel = {} as StyleModel;
  public styles: StyleModel[] = [];

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

  constructor(private sdService: SDService, private fileService: FileService) {}

  openImg(img: string){
    if(!this.loading && this.imgResult[0] !== ''){
      this.zoomImg = img;
      this.fullScreen = true;
    }
  }

  closeImg(event: any){
    if (event === true)
    this.fullScreen = false
  }

  callToast(msg: string, type: 'success' | 'error' | 'info' | 'warning', title?: string) {
    this.newToast = new ToastModel({
      message: msg,
      type: type,
      visible: true,
      title: title,
    });
  }

  ngOnInit(): void {
    this.getModel();
    this.getStyles();
    this.randomBg();
  }

  generate() {
    this.loading = true;
    this.generateImage();
    this.getProgress();
    this.countTime();
  }

  generateImage() {
    this.randomBg();
    this.clear();
    this.sdService.text2img(this.params).subscribe((res) => {
      this.loading = false;
      let imgs: string[] = [];
      res.images.forEach((element) => {
        let img = `data:image/png;base64,${element}`;
        imgs.push(img);
        this.imageInfo = JSON.parse(res.info);
        this.saveImage(img, this.imageInfo.seed);
      });
      this.imgResult = imgs;
    }),
      (err: any) => {
        console.log(err);
      };
  }

  getProgress() {
    const interval = setInterval(() => {
      this.sdService.progress().subscribe((res: ProgressModel) => {
        if (this.loading === false) {
          clearInterval(interval);
          return;
        }
        this.eta = res.eta_relative ? Math.round(res.eta_relative) : 0;
        this.progStep = res.state?.sampling_step ? res.state.sampling_step : 0;
        this.progSteps = res.state?.sampling_steps ? res.state.sampling_steps : 0;
        this.progress = res.progress ? Math.round(res.progress * 100) : 0;
        const loadBar = document.querySelector('.loading-bar') as HTMLDivElement;
        loadBar.style.width = `${this.progress}%`;
        if (res.current_image) {
          const img = `data:image/png;base64,${res.current_image}`;
          this.imgResult.pop();
          this.imgResult.push(img);
        }
      });
    }, 2000);
  }

  saveStyle() {
    const data = [this.stylename, this.params.prompt, this.params.negative_prompt];
    this.fileService.saveStyles(data as string[]).subscribe(
      (res) => {
        this.callToast(res.toString(), 'success');
        this.stylename = '';
      },
      (error) => {
        console.log(error);
        this.callToast(error.error, 'error');
      }
    );
  }

  getStyles() {
    const list: StyleModel[] = [{ name: '', prompt: '', negative_prompt: '' }];
    this.fileService.getStyles().subscribe((res) => {
      res.map((ele, index) => {
        if (index > 0) {
          list.push(new StyleModel({ name: ele[0], prompt: ele[1], negative_prompt: ele[2] }));
        }
      });
      this.styles = list;
      this.selectedStyle = this.styles[0];
    });
  }

  applySelectedStyle() {
    this.params.prompt = this.selectedStyle.prompt;
    this.params.negative_prompt = this.selectedStyle.negative_prompt;
    this.selectedStyle = this.styles[0];
  }

  countTime() {
    const interval = setInterval(() => {
      this.time++;
      if (this.loading === false) {
        clearInterval(interval);
        this.duration = this.time;
        this.time = 0;
        this.progStep = 0;
        this.progress = 0;
      }
    }, 1000);
  }

  interrupt() {
    this.blockScreen = true;
    this.sdService.interrupt().subscribe(() => {
      setTimeout(() => {
        this.callToast('Interrompido', 'info');
        this.loading = false;
      }, 3000);
    });
  }

  skip() {
    this.sdService.skip().subscribe((res) => {
      this.callToast('Pulado', 'info');
    });
  }

  saveImage(img: string, seed: any) {
    this.fileService.savePhoto(img, seed).subscribe((res) => {
      this.callToast(res.toString(), 'success');
      this.blockScreen = false;
    });
  }

  openFolder() {
    this.fileService.openFolder().subscribe((res) => {
      this.callToast(res.toString(), 'success');
    });
  }

  changeModel() {
    this.blockScreen = true;
    this.sdService.setModel({ sd_model_checkpoint: this.selectedModel }).subscribe((res) => {
      this.callToast(this.selectedModel + ' agora é o modulo usado.', 'success');
      this.blockScreen = false;
    }),
      (error: any) => {
        this.callToast(error.error, 'error');
        console.log(error);
      };
  }

  getModel() {
    this.sdService.getModel().subscribe((res) => {
      const model = res.sd_model_checkpoint;
      const index = this.modelos.indexOf(model ? model : '');
      this.selectedModel = this.modelos[index];
      this.callToast(`${model}`, 'info', 'Selected Model');
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

  useLastSeed(){
    if(this.imageInfo.seed){
      this.params.seed = this.imageInfo.seed;
    }
  }

  randomBg() {
    const num = Math.round(1 + Math.random() * 19);
    this.defaultImg = `./../../assets/loader${num}.gif`;
  }
}
