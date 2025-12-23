import { Injectable } from '@angular/core';
import { LoanRepayment } from '../loan/model/loan-repaymenet';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment/enviroment';
import { BaseService } from '../core/baseservice/base-service';

@Injectable({
  providedIn: 'root'
})
export class LoanRepaymentService extends BaseService<LoanRepayment> {

  constructor(http: HttpClient) {
    super(http, `${enviroment.HOST}/loan-repayments`);
  }

  importCsv(file: File, forMonth: Date) {
    const formData = new FormData();
    formData.append("file", file);
    // Format the date as 'yyyy-MM-dd' which is what Java's LocalDate expects
    const formattedDate = forMonth.toISOString().split('T')[0];
    formData.append("forMonth", formattedDate);

    return this.http.post<LoanRepayment[]>(`${enviroment.HOST}/loan-repayments/import-csv`, formData);
  }
  getLoanRepaymentByEmployeeId(employeeId: string, pageIndex: number, pageSize: number) {
    return this.http.get<any>(`${enviroment.HOST}/loan-repayments/search-by-employee-id/${employeeId}?page=${pageIndex}&size=${pageSize}`);
  }
  deleteByEmployeeId(employeeId: string) {
    return this.http.delete(`${enviroment.HOST}/loan-repayments/delete-by-employee-id/${employeeId}`, { responseType: 'text' });
  }



  findTotalByEmployeeId(employeeId: string) {
    return this.http.get(`${enviroment.HOST}/loan-repayments/total-cra-loan-repayments/${employeeId}`, { responseType: 'text' });
  }

  countAllLoanRepayments() {
    return this.http.get(`${enviroment.HOST}/loan-repayments/count`);
  }

}
