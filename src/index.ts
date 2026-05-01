import { BookRepository } from "./repositories/BookRepository";
import { MemberRepository } from "./repositories/MemberRepository";
import { LoanRepository } from "./repositories/LoanRepository";

import { BookService } from "./services/BookService";
import { MemberService } from "./services/MemberService";
import { LoanService } from "./services/LoanService";

// -------------------- REPOSITORIES --------------------
const bookRepo = new BookRepository();
const memberRepo = new MemberRepository();
const loanRepo = new LoanRepository();

// -------------------- SERVICES --------------------
const bookService = new BookService(bookRepo);
const memberService = new MemberService(memberRepo);
const loanService = new LoanService(loanRepo, bookRepo, memberRepo);

// -------------------- TEST RUN --------------------
async function run() {
    console.log("\n===== LIBRARY SYSTEM STARTED =====\n");

    try {
        // 1. ADD BOOKS
        const book1 = await bookService.addBook({
            title: "future",
            author: "david",
            isbn: "1111",
            category: "Programming",
        });

        const book2 = await bookService.addBook({
            title: "TypeScript Handbook",
            author: "Microsoft",
            isbn: "2222",
            category: "Programming",
        });

        console.log("\n📚 Books Added:");
        console.log(await bookService.getAllBooks());

        // 2. REGISTER MEMBERS
        const member1 = await memberService.registerMember({
            name: "Rediet",
            email: "rediet@gmail.com",
        });

        const member2 = await memberService.registerMember({
            name: "Abebe",
            email: "abebe@gmail.com",
        });

        console.log("\n👤 Members Registered:");
        console.log(await memberService.getAllMembers());

        // 3. BORROW BOOK
        const loan1 = await loanService.borrowBook(member1.id, book1.id);

        console.log("\n📄 Loan Created:");
        console.log(loan1);

        // 4. CHECK AVAILABLE BOOKS
        console.log("\n📚 Available Books:");
        console.log(await bookService.getAvailableBooks());

        // 5. RETURN BOOK
        const returned = await loanService.returnBook(loan1.id);

        console.log("\n🔄 Book Returned:");
        console.log(returned);

        // 6. ACTIVE LOANS
        console.log("\n📄 Active Loans:");
        console.log(await loanService.getActiveLoans());

        // 7. SEARCH TEST
        console.log("\n🔎 Search Book by Title:");
        console.log(await bookService.searchByTitle("clean"));

        console.log("\n🔎 Search Member by Name:");
        console.log(await memberService.searchByName("red"));

        console.log("\n===== SYSTEM TEST COMPLETED SUCCESSFULLY =====\n");

    } catch (error) {
        console.error("\n❌ ERROR:", (error as Error).message);
    }
}

run();