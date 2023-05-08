export class TextToImageRequest {

  constructor(init?: Partial<TextToImageRequest>){
    Object.assign(this,init);
  }

  enable_hr?: boolean | false;
  denoising_strength?: number | 0;
  firstphase_width?: number | 0;
  firstphase_height?: number | 0;
  hr_scale?: number | 2;
  hr_upscaler?: string | '';
  hr_second_pass_steps?: number | 0;
  hr_resize_x?: number | 0;
  hr_resize_y?: number | 0;
  prompt?: string | '';
  styles?: string[] | null;
  seed?: number | -1;
  subseed?: number | -1;
  subseed_strength?: number | 0;
  seed_resize_from_h?: number | -1;
  seed_resize_from_w?: number | -1;
  sampler_name?: string;
  batch_size?: number | 1;
  n_iter?: number | 1;
  steps?: number | 20;
  cfg_scale?: number | 5;
  width?: number | 512;
  height?: number | 512;
  restore_faces?: boolean | false;
  tiling?: boolean | false;
  negative_prompt?: string | '';
  eta?: number | 0;
  s_churn?: number | 0;
  s_tmax?: number | 0;
  s_tmin?: number | 0;
  s_noise?: number | 1;
  override_settings?: {};
  override_settings_restore_afterwards?: boolean | false;
  script_args?: [] | null;
  sampler_index?: string | 'DPM++ 2M Karras';
  script_name?: string | '';
}
