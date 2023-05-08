import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SavePhotoService {
  constructor(private client: HttpClient) {}

  savePhoto(request: any) {
    const req = JSON.parse(`{"data":"${request}"}`);
    const fd = new FormData();
    fd.append('data', req);

    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.client.post('/v1' + '/saveImage', req, options);
  }

  openFolder():Observable<boolean>{
    return this.client.get<boolean>('/v1/openFolder');
  }

}
