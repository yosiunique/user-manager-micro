import { ChangeDetectorRef, Component, signal } from '@angular/core';;
import { CommonModule } from '@angular/common';
import { Mainlayout } from './mainlayout/mainlayout/mainlayout';
import { Auth } from './auth/auth';
import { Login } from "./auth/login/login";
@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    Mainlayout,
    Login
],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App  {
  constructor(protected login:Auth){

  }
  
}
