import { Injectable } from '@angular/core';
import { BaseService } from '../core/baseservice/base-service';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment/enviroment';
import { Loan } from '../saving/model/saving';

@Injectable({
    providedIn: 'root'
})
export class LoanService extends BaseService<Loan> {

    constructor(http: HttpClient) {
        super(http, `${enviroment.HOST}/loan`)
    }

    importCsv(file: File) {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<Loan[]>(
            `${enviroment.HOST}/loan/import-csv`,
            formData
        );
    }
}
