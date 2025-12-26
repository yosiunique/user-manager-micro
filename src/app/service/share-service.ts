import { Injectable } from '@angular/core';
import { BaseService } from '../core/baseservice/base-service';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment/enviroment';
import { Share } from '../saving/model/saving';

@Injectable({
  providedIn: 'root'
})
export class ShareService extends BaseService<Share> {

  constructor(http: HttpClient) {
    super(http, `${enviroment.HOST}/share`)
  }

  importCsv(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Share[]>(
      `${enviroment.HOST}/share/import-csv`,
      formData
    );
  }

}
