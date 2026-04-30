import { LoanStatus } from "../enums/LoanStatus";

export interface Loan{
id:number;
bookId: number;
memberId: number;
borrowedAt: Date;
dueDate: Date;
returnedAt?:Date;
status:LoanStatus

}