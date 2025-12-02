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
  
}
