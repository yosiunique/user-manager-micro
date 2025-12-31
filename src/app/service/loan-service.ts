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

    searchLoans(employeeId: string, pageIndex: number, pageSize: number) {
        return this.http.get<any>(`${enviroment.HOST}/loan/search-by-employee-id/${employeeId}?page=${pageIndex}&size=${pageSize}`);
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
