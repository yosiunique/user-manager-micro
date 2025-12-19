import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SavingAndLoanRepayment } from '../../saving/model/saving';
import { LoanRepayment } from '../../loan/model/loan-repaymenet';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private token = new BehaviorSubject<any>(null);
  tokenData$ = this.token.asObservable();
  private savingByEmployeeId = new BehaviorSubject<SavingAndLoanRepayment[]>([]);
  savingByEmployeeId$ = this.savingByEmployeeId.asObservable();
  private loanRepayById = new BehaviorSubject<LoanRepayment[]>([]);
  loanRepayById$ = this.loanRepayById.asObservable();


  setLoanRepayById(loanRepayById: LoanRepayment[]) {
    this.loanRepayById.next(loanRepayById);
  }
  setSavingByEmployeeId(savingByEmployeeId: SavingAndLoanRepayment[]) {
    this.savingByEmployeeId.next(savingByEmployeeId);
  }
  setToken(token: any) {
    this.token.next(token);
  }
}
