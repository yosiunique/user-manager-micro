import { Component, OnInit } from '@angular/core';
import { Auth } from '../auth';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Userservice } from '../../service/userservice';
import { SharedService } from '../../core/sharedService/shared-service';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon'; // Added for the eye icons

@Component({
  selector: 'app-login',
  standalone: true, // Ensure standalone if used in your project
  imports: [
    RouterModule,
    FormsModule,
    CommonModule,
    NzFormModule,
    NzButtonModule,
    NzInputModule,
    NzIconModule, // Added
    ReactiveFormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  userName: string = '';
  password: string = '';
  errorMessage: string = '';
  newRestFrom!: FormGroup;
  reset: boolean = false;
  token: string = '';
  enable: boolean = false;
  showPasswordToggle=true;
  userForm!:FormGroup ;
  // Password visibility states
  passwordVisible = false;
  resetPasswordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    protected authService: Auth,
    private fb: FormBuilder,
    private router: Router,
    private user: Userservice,
    private shared: SharedService
  ) {}

  ngOnInit(): void {
    this.authService.logout();
    this.newRestFrom = this.fb.group({
      id: '',
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
      ]],
      reenter: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
      ]],
      reset: true,
      userName: [{ value: '', disabled: true }],
      firstName: [],
      lastName: [],
      email: [],
      attribute: [],
      role: [],
      enable: []
    }, { validators: this.passwordMatchValidator });


    this.userForm=this.fb.group(
      {
        userName:['',Validators.required],
        password:['' ,Validators.required]

      }
    )
  }

  passwordMatchValidator(group: AbstractControl) {
    const password = group.get('password')?.value;
    const reenter = group.get('reenter')?.value;
    return password === reenter ? null : { passwordMismatch: true };
  }

  login() {
    if(this.userForm.invalid)
      return ;
    this.authService.login(this.userForm.value).subscribe({
      next: (response: any) => {
        this.reset = this.authService.getTokenofReset(response.token);
        const userName = this.authService.getUserNamebeforLogin(response.token);
        this.token = response.token;
        this.user.getByUserNameToRestPasword(userName, response.token).subscribe({
          next: (data) => {
            this.newRestFrom.patchValue({
              id: data.id,
              userName: data.userName,
              reset: false
            });
          },
          error: (err) => console.log('error...', err)
        });

        if (!this.reset) {
          if (this.authService.getTokenofEnable(response.token)) {
            this.authService.saveToken(response.token);
            this.router.navigate(['/home/welcome']);
          } else {
            this.errorMessage = 'This user is blocked please Contact Admin!';
          }
        }
      },
      error: (error) => {
        this.errorMessage = 'Invalid username or password';
        console.log('this is the root cause error:.....', error);
      }
    });
  }

  resetNow() {
    if (this.newRestFrom.invalid) return;
    this.user.resetPasswordbeorlogin(this.newRestFrom.value, this.newRestFrom.get('password')?.value, this.token).subscribe({
      next: (response) => {
        this.authService.saveToken(this.token);
      },
      error: (error) => {
        this.errorMessage = 'this is error message from ....' + error;
      }
    });
  }
}