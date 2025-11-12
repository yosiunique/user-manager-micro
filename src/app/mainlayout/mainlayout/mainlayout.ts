import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { Auth } from '../../auth/auth';
import { HttpClient } from '@angular/common/http';
import { enviroment } from '../../../enviroment/enviroment';
import { User } from '../../admin/model/user';
import { BaseService } from '../../core/baseservice/base-service';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { BaseComponent } from '../../core/basecomponenet/basecomponenet';
import { Userservice } from '../../service/userservice';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzCardModule } from "ng-zorro-antd/card";

@Component({
  selector: 'app-mainlayout',
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    NzSliderModule,
    NzModalModule,
    NzIconModule,
    RouterModule,
    NzDropDownModule,
    NzCardModule
],
  templateUrl: './mainlayout.html',
  styleUrl: './mainlayout.css',
})
export class Mainlayout  implements OnInit  {
  fullName:string='';

  ngOnInit(): void {
  this.userservice.getByUserName(this.auth.getUserName()).subscribe({

    next:(data)=>{
     this.fullName=data?.firstName+'  '+data?.lastName;
     console.log("user data ....",data)
    },
    error:(error)=>{
      console.log("root cause is ...",error)
    }
  });
  }
  constructor(protected auth:Auth, private userservice:Userservice ,modal:NzModalService ) {
  }
isCollapsed = false ;
widht=80;
  
  // Method to toggle the sidebar collapse state
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logOut(){
    this.auth.logout();
  }
}
