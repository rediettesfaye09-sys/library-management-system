import { Loan } from "../models/Loan";

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

  public async update(id: number, patch: Partial<Omit<Loan, "id">>): Promise<Loan> {
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
    return this.loans.filter((l) => !l.returnedAt);
  }

  public async getLoansByBookId(bookId: number): Promise<Loan[]> {
    return this.loans.filter((l) => l.bookId === bookId);
  }

  public async getLoansByMemberId(memberId: number): Promise<Loan[]> {
    return this.loans.filter((l) => l.memberId === memberId);
  }
}