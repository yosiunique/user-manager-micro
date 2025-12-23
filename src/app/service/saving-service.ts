import { Injectable } from '@angular/core';
import { BaseService } from '../core/baseservice/base-service';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment/enviroment';
import { SavingAndLoanRepayment } from '../saving/model/saving';

@Injectable({
  providedIn: 'root'
})
export class SavingService extends BaseService<SavingAndLoanRepayment> {

  constructor(http: HttpClient) {
    super(http, `${enviroment.HOST}/saving-and-loan-repayments`);
  }

  importCsv(file: File, forMonth: Date) {
    const formData = new FormData();
    formData.append("file", file);
    // Format the date as 'yyyy-MM-dd' which is what Java's LocalDate expects
    const formattedDate = forMonth.toISOString().split('T')[0];
    formData.append("forMonth", formattedDate);

    return this.http.post<any[]>(`${enviroment.HOST}/saving-and-loan-repayments/import-csv`, formData);
  }
  getsavingByEmployeeId(employeeId: string, pageIndex: number, pageSize: number) {
    return this.http.get<any>(`${enviroment.HOST}/saving-and-loan-repayments/search-by-employee-id/${employeeId}?page=${pageIndex}&size=${pageSize}`);
  }
  deleteByEmployeeId(employeeId: string) {
    return this.http.delete(`${enviroment.HOST}/saving-and-loan-repayments/delete-by-employee-id/${employeeId}`, { responseType: 'text' });
  }



  findTotalByEmployeeId(employeeId: string) {
    return this.http.get(`${enviroment.HOST}/saving-and-loan-repayments/total-cra-saving/${employeeId}`, { responseType: 'text' });
  }
  countAllSaving() {
    return this.http.get(`${enviroment.HOST}/saving-and-loan-repayments/count`);
  }


}
