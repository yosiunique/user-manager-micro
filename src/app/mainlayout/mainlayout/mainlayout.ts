import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NzIconModule, provideNzIcons } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { Auth } from '../../auth/auth';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { Userservice } from '../../service/userservice';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzCardModule } from "ng-zorro-antd/card";
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
@Component({
  selector: 'app-mainlayout',
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    NzDrawerModule,
    NzModalModule,
    NzIconModule,
    RouterModule,
    NzDropDownModule,
    NzCardModule,
    NzSpaceModule,
    NzButtonModule,
    NzBreadCrumbModule,
    NzIconModule,
    NzAvatarModule

  ],
  templateUrl: './mainlayout.html',
  styleUrl: './mainlayout.css',
  providers: [

  ]
})
export class Mainlayout implements OnInit {
  fullName: string = '';
  currentPage: any;
  userAttribute: string = '';

  ngOnInit(): void {
    this.userAttribute = this.auth.getUserAttribute();
    this.userservice.getByUserName(this.auth.getUserName()).subscribe({

      next: (data) => {
        this.fullName = data?.firstName + '  ' + data?.lastName;
        console.log("user data ....", data)
      },
      error: (error) => {
        console.log("root cause is ...", error)
      }
    });
  }
  constructor(protected auth: Auth, private userservice: Userservice, modal: NzModalService) {
  }
  isCollapsed = window.innerWidth < 992;
  widht = 80;

  // Method to toggle the sidebar collapse state
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logOut() {
    this.auth.logout();
  }









  haveRole(roleName: string) {

    const roles = this.auth.getUserRoles().map((role: any) => role.roleTypes.role);
    return roles.includes(roleName);
  }




}
