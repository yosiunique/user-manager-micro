import { Injectable } from '@angular/core';
import { BaseService } from '../core/baseservice/base-service';
import { Role, Roles } from '../admin/model/user';
import { enviroment } from '../../enviroment/enviroment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService extends BaseService<Roles> {
  constructor(protected override http:HttpClient ){ 
   super(http,`${enviroment.HOST}/roles` );
  }
  
}
