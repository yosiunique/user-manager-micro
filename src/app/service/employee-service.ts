import { Injectable } from '@angular/core';
import { BaseService } from '../core/baseservice/base-service';
import { Employee } from '../saving/model/saving';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { enviroment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends BaseService<Employee> {

  constructor(http: HttpClient) {
    super(http, `${enviroment.HOST}/employee`);
  }

  searchByEmployeeId(employeeId: string) {

    return this.http.get<any>(`${enviroment.HOST}/employee/search-by-employee-id/${employeeId}`);
  }

  searchByName(name: string      ,pageIndex:number,pageSize:number  ) {
  



   return this.http.get<any>(`${enviroment.HOST}/employee/search-by-name/${name}?page=${pageIndex}&size=${pageSize}`);







  }
  
  
  
  
  
  getAllEmployees() {

  }

  searchEmployees(employeeId: string, pageIndex: number, pageSize: number) {
    return this.http.get<any>(`${enviroment.HOST}/employee/search-by-employee-id/${employeeId}?page=${pageIndex}&size=${pageSize}`);
  }

  importCsv(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<Employee[]>(
      `${enviroment.HOST}/employee/import-csv`,
      formData
    );
  }
}
