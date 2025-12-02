import { Employee } from "../../saving/model/saving";

export interface  LoanRepayment{
    id: number;
    employee:Employee
    fullName: string;
    crassLoanRepayment:number;
    forMonth:Date;
     principal:number;
     interset:number;
}