import { Injectable } from '@angular/core';
import { Auth } from './auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGurd {
    constructor(private authService: Auth, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    }
    this.router.navigate(['/login']);
    return false;
  }
}
