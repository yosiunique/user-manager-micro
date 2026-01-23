import { Injectable } from '@angular/core';
import { BaseService } from '../core/baseservice/base-service';
import { User } from '../admin/model/user';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../enviroment/enviroment';


@Injectable({
  providedIn: 'root'
})
export class Userservice extends BaseService<User> {

  constructor(http: HttpClient) {
    super(http, `${enviroment.HOST}/users`);
  }



  searchUsers(username: string, pageIndex: number, pageSize: number) {
    return this.http.get<any>(`${enviroment.HOST}/users/search-by-username/${username}?page=${pageIndex}&size=${pageSize}`);
  }

  getByUserName(userName: string) {
    return this.http.get<any>(`${enviroment.HOST}/users/find_by_username/${userName}`);
  }

  resetPassword(user: User) {
    return this.http.put(`${enviroment.HOST}/users/reset`, user, { responseType: 'text' });
  }

  getByUserNameToRestPasword(userName: string, token: string) {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.get<any>(`${enviroment.HOST}/users/find_by_username/${userName}`, { headers });
  }
  resetPasswordbeorlogin(user: User, password: string, token: string) {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    return this.http.put(`${enviroment.HOST}/users/reset`, user, { headers, responseType: 'text' });
  }

  countAllUser() {
    return this.http.get(`${enviroment.HOST}/users/count`);
  }



}
