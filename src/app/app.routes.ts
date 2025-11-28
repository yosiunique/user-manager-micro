import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { AuthGurd } from './auth/auth.gurd';
import { App } from './app';
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { Mainlayout } from './mainlayout/mainlayout/mainlayout';
import { CreteUpdateUser } from './admin/crete-update-user/crete-update-user';
import { Notfound } from './notfound/notfound/notfound';
import { SavingComponenet } from './saving/saving-componenet/saving-componenet';
import { LoanRepaymentsComponenets } from './loan/loan-repayments-componenets/loan-repayments-componenets';
import { WelcomComponent } from './welcome/welcom-component/welcom-component';
import { EmployeeComponent } from './employee/employee';

export const routes: Routes = [
  {path:'',
    redirectTo:'/login',
    pathMatch:'full'
  },
  { path: 'login', component: Login  },
  
  { path: 'home', children:[
  {
    path:'',component:Mainlayout,canActivate:[AuthGurd],
  },
  {
    path:'welcome',
    component:WelcomComponent
  },
  {
    path:'saving',
    children:[
      {
        path:'view',
        component:SavingComponenet,canActivate:[AuthGurd]
      }
    ]
  },
  {
    path:'loan-repayment',
    children:[
     {
      path:'view',
      component:LoanRepaymentsComponenets ,canActivate:[AuthGurd]
     }
    ]
  },
  {
    path:'admin',
    children:[
      { path: 'users', component: AdminDashboard ,canActivate: [AuthGurd] },
    ]
  },
  {
    path :'employee',
    children:[
      {
        path:'view',
        component:EmployeeComponent
      }
    ]
  }

  ],canActivate:[AuthGurd]
},
   
  { path: '**', component:Notfound  }
];
