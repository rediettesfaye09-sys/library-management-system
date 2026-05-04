import { Loan } from "../models/Loan";
import { LoanStatus } from "../enums/LoanStatus";

export class LoanRepository {
    private loans: Loan[] = [];
    private nextId = 1;

    public async add(partial: Omit<Loan, "id">): Promise<Loan> {
        const loan: Loan = {
            ...partial,
            id: this.nextId++,
        };
        this.loans.push(loan);
        return loan;
    }

    public async update(
        id: number,
        patch: Partial<Omit<Loan, "id">>
    ): Promise<Loan> {
        const idx = this.loans.findIndex((l) => l.id === id);
        if (idx === -1) {
            throw new Error(`Loan not found: ${id}`);
        }

        const updated: Loan = { ...this.loans[idx], ...patch, id: this.loans[idx].id };
        this.loans[idx] = updated;
        return updated;
    }

    public async remove(id: number): Promise<void> {
        const idx = this.loans.findIndex((l) => l.id === id);
        if (idx === -1) return;
        this.loans.splice(idx, 1);
    }

    public async getById(id: number): Promise<Loan | undefined> {
        return this.loans.find((l) => l.id === id);
    }

    public async getAll(): Promise<Loan[]> {
        return [...this.loans];
    }

    public async getActiveLoans(): Promise<Loan[]> {
        return this.loans.filter((l) => l.status === LoanStatus.ACTIVE);
    }

    public async getLoansByBookId(bookId: number): Promise<Loan[]> {
        return this.loans.filter((l) => l.bookId === bookId);
    }

    public async getLoansByMemberId(memberId: number): Promise<Loan[]> {
        return this.loans.filter((l) => l.memberId === memberId);
    }

    public async getOverdueLoans(): Promise<Loan[]> {
        const now = new Date();
        return this.loans.filter((l) => 
            l.status === LoanStatus.ACTIVE && l.dueDate < now
        );
    }

    // SAVE TO JSON FILE
    public async saveToFile(): Promise<void> {
        const fs = require('fs').promises;
        const path = require('path');
        const filePath = path.join(__dirname, '../data/loans.json');
        await fs.writeFile(filePath, JSON.stringify(this.loans, null, 2));
        console.log(`💾 Saved ${this.loans.length} loans`);
    }

    // LOAD FROM JSON FILE
    public async loadFromFile(): Promise<void> {
        const fs = require('fs').promises;
        const path = require('path');
        const filePath = path.join(__dirname, '../data/loans.json');
        
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            const loaded = JSON.parse(data);
            this.loans = loaded;
            this.loans.forEach(loan => {
                loan.borrowedAt = new Date(loan.borrowedAt);
                loan.dueDate = new Date(loan.dueDate);
                if (loan.returnedAt) {
                    loan.returnedAt = new Date(loan.returnedAt);
                }
                if (loan.id >= this.nextId) {
                    this.nextId = loan.id + 1;
                }
            });
            console.log(`📂 Loaded ${this.loans.length} loans`);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                console.log('📄 No loans file found, starting fresh');
            }
        }
    }
}