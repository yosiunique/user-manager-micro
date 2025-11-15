import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from "ng-zorro-antd/form";
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

@Component({
  selector: 'app-welcom-component',
  imports: [
    RouterModule,
    NzFormModule,
    NzStatisticModule ,
    NzCardModule ,
    
],
  templateUrl: './welcom-component.html',
  styleUrl: './welcom-component.css',
})
export class WelcomComponent {


   // Statistics data
  totalSavings = 125000;
  activeLoans = 18;
  totalUsers = 156;
  pendingActions = 5;

  constructor(private router: Router) {}

  navigateToSavings(): void {
    this.router.navigate(['/savings']);
  }

  navigateToLoans(): void {
    this.router.navigate(['/loan-repayments']);
  }
}

