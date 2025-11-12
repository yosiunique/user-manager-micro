import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { enviroment } from '../../enviroment/enviroment';
import { BaseService } from '../core/baseservice/base-service';
import { RoleTypes } from '../admin/model/user';


@Injectable({  
  providedIn: 'root'
})

export class RoleService  extends BaseService <RoleTypes>{
  
  constructor( http:HttpClient ){
    super(http,`${enviroment.HOST}/role_types`);
  }
}
