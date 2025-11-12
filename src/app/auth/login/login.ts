import { Component, OnInit } from '@angular/core';
import { Auth } from '../auth';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [
    RouterModule ,
    FormsModule ,
    CommonModule ,
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
userName = '';
  password = '';
  errorMessage = '';

  constructor(protected  authService:Auth, private router: Router) {}
  ngOnInit(): void {
    this.authService.logout();
  }

  login() {
    this.authService.login({ userName: this.userName, password: this.password }).subscribe({
      next: (response:any) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/home/admin/dashboard']);
        console.log("token:...",response.token)
      },
      error: (error) => {
        this.errorMessage = 'Invalid username or password';
        console.log("this is the root cause error:.....",error)
      }
    });
  }


  
}

