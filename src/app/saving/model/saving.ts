   
   export interface SavingAndLoanRepayment {
 
    id: number;
    employee:Employee;
    fullName: string;
    craSaving:number;
   }

   export interface Employee{
    
    id:number;
employeeId:number;
     employeeFullName:string;
  effectiveDate:Date;
 outStanding:number;
efectiveDate:Date;
status:any;

 loanId:number;
 annualInterest:number;
 emi:number;
 period:number;
firstOutStanding: 0;


      
   }