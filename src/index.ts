import { BookRepository } from "./repositories/BookRepository";
import { MemberRepository } from "./repositories/MemberRepository";
import { LoanRepository } from "./repositories/LoanRepository";
import { LoanStatus } from "./enums/LoanStatus";

async function main() {
  const bookRepo = new BookRepository();
  const memberRepo = new MemberRepository();
  const loanRepo = new LoanRepository();

  const book = await bookRepo.add({
    title: "future",
    author: "Robert C. Martin",
    isbn: "1223456",
    category: "Programming",
    isAvailable: true,
  });

  const member = await memberRepo.add({
    name: "kebede",
    email: "kebede@example.com",
    isActive: true,
  });

  await loanRepo.add({
    bookId: book.id,
    memberId: member.id,
    borrowedAt: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: LoanStatus.ACTIVE,
  });

  console.log("All books:", await bookRepo.getAll());
  console.log("All members:", await memberRepo.getAll());
  console.log("Active loans:", await loanRepo.getActiveLoans());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});