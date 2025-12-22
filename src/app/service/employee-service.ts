import { Injectable } from '@angular/core';
import { BaseService } from '../core/baseservice/base-service';
import { Employee } from '../saving/model/saving';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService extends BaseService<Employee> {

  constructor (http:HttpClient) {
    super(http,`${enviroment.HOST}/employee`);
  }
  
  getAllEmployees() {
   
  }

importCsv(file: File, forMonth: Date) {
    const formData = new FormData();
    formData.append("file", file);
    const token = localStorage.getItem('jwtToken');
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    
    return this.http.post<Employee[]>(`${enviroment.HOST}/employee/import-csv`, formData, { headers });
  }
}
