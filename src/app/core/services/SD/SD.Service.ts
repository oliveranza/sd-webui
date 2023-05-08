import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TextToImageResponse } from './model/TextToImageResponse';
import { TextToImageRequest } from './model/TextToImageRequest';
import { ProgressModel } from './model/ProgressModel';
import { OptionsModel } from './model/OptionsModel';

@Injectable({
  providedIn: 'root',
})
export class SDService {
  private baseUrl = '/api/sdapi/v1';

  constructor(private client: HttpClient) {}

  text2img(request: TextToImageRequest): Observable<TextToImageResponse> {
    return this.client.post<TextToImageResponse>(this.baseUrl + '/txt2img', request);
  }

  interrupt(): Observable<boolean>{
    return this.client.post<boolean>(this.baseUrl + '/interrupt', null);
  }

  skip(): Observable<boolean>{
    return this.client.post<boolean>(this.baseUrl + '/skip', null);
  }

  progress(): Observable<ProgressModel>{
    return this.client.get<ProgressModel>(this.baseUrl + '/progress');
  }

  getModel(): Observable<OptionsModel>{
    return this.client.get<OptionsModel>(this.baseUrl+ '/options');
  }

  setModel(request: {sd_model_checkpoint:string}): Observable<any>{
    console.log('chegou no service setModel()');
    return this.client.post<any>(this.baseUrl+ '/options', request);
  }
}
