import { Loan } from "../models/Loan";
import { LoanRepository } from "../repositories/LoanRepository";
import { BookRepository } from "../repositories/BookRepository";
import { MemberRepository } from "../repositories/MemberRepository";
import { LoanStatus } from "../enums/LoanStatus";

export class LoanService {
    constructor(
        private loanRepo: LoanRepository,
        private bookRepo: BookRepository,
        private memberRepo: MemberRepository
    ) {}

    // BORROW BOOK
    async borrowBook(memberId: number, bookId: number): Promise<Loan> {
        const member = await this.memberRepo.getById(memberId);
        if (!member) throw new Error("Member not found");
        if (!member.isActive) throw new Error("Member is not active");

        const book = await this.bookRepo.getById(bookId);
        if (!book) throw new Error("Book not found");
        if (!book.isAvailable) throw new Error("Book is not available");

        // mark book unavailable
        await this.bookRepo.update(bookId, { isAvailable: false });

        const loan: Loan = {
            id: Date.now(),
            bookId,
            memberId,
            borrowedAt: new Date(),
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: LoanStatus.ACTIVE,
        };

        return await this.loanRepo.add(loan);
    }

    // RETURN BOOK
    async returnBook(loanId: number): Promise<Loan> {
        const loan = await this.loanRepo.getById(loanId);
        if (!loan) throw new Error("Loan not found");

        if (loan.returnedAt) throw new Error("Book already returned");

        const updatedLoan = await this.loanRepo.update(loanId, {
            returnedAt: new Date(),
            status: LoanStatus.RETURNED,
        });

        await this.bookRepo.update(loan.bookId, {
            isAvailable: true,
        });

        return updatedLoan;
    }

    // GET ACTIVE LOANS
    async getActiveLoans(): Promise<Loan[]> {
        return this.loanRepo.getActiveLoans();
    }

    // GET ALL LOANS
    async getAllLoans(): Promise<Loan[]> {
        return this.loanRepo.getAll();
    }

    // OVERDUE LOANS CHECK
    async getOverdueLoans(): Promise<Loan[]> {
        const activeLoans = await this.loanRepo.getActiveLoans();
        const now = new Date();

        return activeLoans.filter((loan) => loan.dueDate < now);
    }

    // GET BY MEMBER
    async getLoansByMember(memberId: number): Promise<Loan[]> {
        return this.loanRepo.getLoansByMemberId(memberId);
    }

    // GET BY BOOK
    async getLoansByBook(bookId: number): Promise<Loan[]> {
        return this.loanRepo.getLoansByBookId(bookId);
    }
}