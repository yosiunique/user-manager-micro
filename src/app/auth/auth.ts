import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { enviroment } from '../../enviroment/enviroment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl=enviroment.ISSUE_URL
    private jwtHelper = new JwtHelperService();
      constructor(private http:HttpClient, private router:Router) {

      }
       login(credentials: { userName: string; password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials);
  }

  saveToken(token: string) {
    localStorage.setItem('jwtToken', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  logout() {
    localStorage.removeItem('jwtToken');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    const decoded = this.jwtHelper.decodeToken(token);
    return decoded?.roles || [];
  }
  getUserName():string{

    const token=this.getToken();
    if(!token) return '';
    const decoded=this.jwtHelper.decodeToken(token);
    return decoded?.sub|| 'Re-Login'

  }

}
