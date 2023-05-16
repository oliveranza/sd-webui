import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private client: HttpClient) {}

  savePhoto(request: any) {
    const req = JSON.parse(`{"data":"${request}"}`);
    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.client.post('/v1' + '/saveImage', req, options);
  }

  saveStyles(request: string[]) {
    const req = JSON.parse(`{"data": ["${request[0]}", "${request[1]}", "${request[2]}"]}`);

    const options = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return this.client.post('/v1' + '/saveStyles', req, options);
  }

  getStyles(): Observable<string[]> {
    return this.client.get<string[]>('/v1' + '/getStyles');
  }

  openFolder(): Observable<boolean> {
    return this.client.get<boolean>('/v1/openFolder');
  }
}
