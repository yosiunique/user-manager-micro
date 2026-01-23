import { Employee, Loan } from "../../saving/model/saving";


export interface LoanRepayment {
    id: number;
    loan: Loan;
    fullName: string;
    crassLoanRepayment: number;
    forMonth: Date;
    principal: number;
    interset: number;
}