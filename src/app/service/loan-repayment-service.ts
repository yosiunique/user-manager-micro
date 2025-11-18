import { Injectable } from '@angular/core';
import { LoanRepayment } from '../loan/model/loan-repaymenet';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment/enviroment';
import { BaseService } from '../core/baseservice/base-service';

@Injectable({
  providedIn: 'root'
})
export class LoanRepaymentService extends BaseService<LoanRepayment> {

  constructor( http: HttpClient) {
    super(http, `${enviroment.HOST}/loan-repayments`);
  }

  importCsv(file:File){
    const formData = new FormData();
  formData.append("file", file); 
  console.log("this is the file parts ",file)
     const token = localStorage.getItem('jwtToken');

  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.post(`${enviroment.HOST}/loan-repayments/import-csv`,formData,{headers});
  }
  getLoanRepaymentByEmployeeId(employeeId:string ,pageIndex :number , pageSize:number  )
  
  {
    const token = localStorage.getItem('jwtToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.get<any>(`${enviroment.HOST}/loan-repayments/search-by-employee-id/${employeeId}?page=${pageIndex}&size=${pageSize}`,{headers});
  }
  deleteByEmployeeId(employeeId:string){
    const token = localStorage.getItem('jwtToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.delete(`${enviroment.HOST}/loan-repayments/delete-by-employee-id/${employeeId}`,{headers,responseType:'text'});
  }

 

   findTotalByEmployeeId(employeeId:string){
    const token = localStorage.getItem('jwtToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.get(`${enviroment.HOST}/loan-repayments/total-cra-loan-repayments/${employeeId}`,{headers,responseType:'text'});
  }

  countAllLoanRepayments(){
       const token = localStorage.getItem('jwtToken');

  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
   return this.http.get(`${enviroment.HOST}/loan-repayments/count`,{headers});
  }
  
}
