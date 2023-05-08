export interface ProgressModel {
  progress?: number;
  eta_relative?: number;
  state?: StateModel;
  current_image?: string;
  textinfo?: string;
}

interface StateModel {
  skipped?: boolean;
  interrupted?: boolean;
  job?: string;
  job_count?: number;
  job_timestamp?: string;
  job_no?: number;
  sampling_step?: number;
  sampling_steps?: number;
}
