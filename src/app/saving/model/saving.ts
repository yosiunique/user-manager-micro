export interface Employee {
   id: number;
   employeeId: number;
   employeeFullName: string;
   membershipId: string;
   totalSaving ?: number; 
   totalShare?:number;    
   totalRepayments ?: number;  
}

export interface Loan {
   id: number;
   loanId: string;
   employee: Employee;
   effectiveDate: Date;
   outStanding: number;
   status: any;
   emi: number;
   annualInterest: number;
   period: number;
   firstOutStanding: number;
}

export interface SavingAndLoanRepayment {
   id: number;
   employee: Employee;
   craSaving: number;
   forMonth?: Date;
}

export interface Share {
   id: number;
   employee: Employee;
   totalSaving: number;
   noOfShare: number;
   remark:string;
}
