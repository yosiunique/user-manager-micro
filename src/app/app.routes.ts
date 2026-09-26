import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { AuthGurd } from './auth/auth.gurd';
import { App } from './app';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { Mainlayout } from './mainlayout/mainlayout/mainlayout';
import { CreteUpdateUser } from './admin/crete-update-user/crete-update-user';
import { Notfound } from './notfound/notfound/notfound';
import { WelcomComponent } from './welcome/welcom-component/welcom-component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  { path: 'login', component: Login },

  {
    path: 'home', children: [
      {
        path: '', component: Mainlayout, canActivate: [AuthGurd],
      },
      {
        path: 'welcome',
        component: WelcomComponent
      },

      {
        path: 'admin',
        children: [
          { path: 'users', component: AdminDashboard, canActivate: [AuthGurd] },
        ]
      },



    ], canActivate: [AuthGurd]
  },

  { path: '**', component: Notfound }
];
