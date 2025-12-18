import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-notfound',
  imports: [
    RouterModule,
    NzResultModule,

  ],
  templateUrl: './notfound.html',
  styleUrl: './notfound.css',
})
export class Notfound {

}
