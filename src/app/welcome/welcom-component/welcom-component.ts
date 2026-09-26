import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { Userservice } from '../../service/userservice';
import { Auth } from '../../auth/auth';

@Component({
  selector: 'app-welcom-component',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    NzFormModule,
    NzStatisticModule,
    NzCardModule,
    NzButtonModule,
    NzGridModule,
    NzIconModule
  ],
  templateUrl: './welcom-component.html',
  styleUrl: './welcom-component.css',
})
export class WelcomComponent implements OnInit {

  private usersService = inject(Userservice);
  private auth = inject(Auth);

  constructor(private router: Router) {}

// Current authenticated user
  currentUser: any = null;

// User management statistics
  totalUsers = 0;

// Current user's roles
  userRoles: string[] = [];

// Current account status
  accountStatus = 'Active';

  ngOnInit(): void {


this.loadCurrentUser();

if (this.haveRole('Admin')) {
  this.countAllUsers();
}


  }

  /**

   * Load currently authenticated user
   */
  loadCurrentUser(): void {


const user = this.usersService.getByUserName(this.auth.getUserName());



if (user) {
  this.currentUser = user;
}

this.loadUserRoles();


  }

  /**

   * Load current user's roles
   */
  loadUserRoles(): void {


const roles = this.auth.getUserRoles();


if (!roles) {
  this.userRoles = [];
  return;
}

this.userRoles = roles
  .map((role: any) => role?.roleTypes?.role)
  .filter((role: string) => !!role);


  }

  /**

   * Count all users.
   * Only Admin should access this information.
   */
  countAllUsers(): void {


this.usersService.countAllUser().subscribe({

  next: (data: any) => {

    this.totalUsers = Number(data) || 0;

    console.log('Total users:', this.totalUsers);
  },

  error: (error) => {

    console.error('Failed to load total users:', error);

    this.totalUsers = 0;
  }
});


  }

  /**

   * Check whether current user has a specific role
   */
  haveRole(roleName: string): boolean {


const roles = this.auth.getUserRoles();



if (!roles) {
  return false;
}

return roles
  .map((role: any) => role?.roleTypes?.role)
  .includes(roleName);

  }

  /**

   * Generate initials for current user avatar
   */
  getInitials(): string {


if (!this.currentUser) {


  return 'U';
}

const firstName =
  this.currentUser.firstName?.trim()?.charAt(0) || '';

const lastName =
  this.currentUser.lastName?.trim()?.charAt(0) || '';

const username =
  this.currentUser.username?.trim()?.charAt(0) || '';

const initials = `${firstName}${lastName}`;

return (initials || username || 'U').toUpperCase();

  }

}
