import { Injectable } from '@angular/core';
import { BaseService } from '../core/baseservice/base-service';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment/enviroment';
import { SavingAndLoanRepayment } from '../saving/model/saving';

@Injectable({
  providedIn: 'root'
})
export class SavingService extends BaseService<SavingAndLoanRepayment> {

  constructor( http: HttpClient) {
    super(http, `${enviroment.HOST}/saving-and-loan-repayments`);
  }

  importCsv(file:File){
    const formData = new FormData();
  formData.append("file", file); 
  console.log("this is the file parts ",file)
     const token = localStorage.getItem('jwtToken');

  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.post(`${enviroment.HOST}/saving-and-loan-repayments/import-csv`,formData,{headers});
  }
  getsavingByEmployeeId(employeeId:string ,pageIndex :number , pageSize:number  )
  
  {
    const token = localStorage.getItem('jwtToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.get<any>(`${enviroment.HOST}/saving-and-loan-repayments/search-by-employee-id/${employeeId}?page=${pageIndex}&size=${pageSize}`,{headers});
  }
  deleteByEmployeeId(employeeId:string){
    const token = localStorage.getItem('jwtToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.delete(`${enviroment.HOST}/saving-and-loan-repayments/delete-by-employee-id/${employeeId}`,{headers,responseType:'text'});
  }

 

   findTotalByEmployeeId(employeeId:string){
    const token = localStorage.getItem('jwtToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.get(`${enviroment.HOST}/saving-and-loan-repayments/total-cra-saving/${employeeId}`,{headers,responseType:'text'});
  }
  countAllSaving(){
    const token = localStorage.getItem('jwtToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

   return this.http.get(`${enviroment.HOST}/saving-and-loan-repayments/count`,{headers});
  }

  
}
