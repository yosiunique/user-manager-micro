import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from "ng-zorro-antd/form";
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { Userservice } from '../../service/userservice';
import { LoanRepaymentService } from '../../service/loan-repayment-service';
import { SavingService } from '../../service/saving-service';

@Component({
  selector: 'app-welcom-component',
  imports: [
    RouterModule,
    NzFormModule,
    NzStatisticModule ,
    NzCardModule ,
  
    NzButtonModule 

    
],
  templateUrl: './welcom-component.html',
  styleUrl: './welcom-component.css',
})
export class WelcomComponent implements OnInit {


   // Statistics data
  totalSavings = 0;
  activeLoans = 0;
  totalUsers = 0;
  pendingActions = 0;

  private usersService=inject(Userservice);
  private loanService=inject(LoanRepaymentService);
  private savingService=inject(SavingService);
  constructor(private router: Router) {}

ngOnInit(): void {
  
this.countAllUsers();
this.countAllSaving();
this.countAllLoanRepayments();


}

async countAllUsers(){
  
  this.usersService.countAllUser().subscribe({
    next:(data:any)=>{
      this.totalUsers=data;
      console.log("Total users :" , this.totalUsers)
    }
  })
  
}   
  async countAllSaving(){
this.savingService.countAllSaving().subscribe({
  next:(data :any )=>{
    this.totalSavings=data;
  }
})
}
async   countAllLoanRepayments(){
this.loanService.countAllLoanRepayments().subscribe({
  next:(data:any)=>{
    this.activeLoans=data;
  }
})
}

  navigateToSavings(): void {
    this.router.navigate(['home/saving/view']);
  }

  navigateToLoans(): void {
    this.router.navigate(['home/loan-repayment/view']);
  }
}

