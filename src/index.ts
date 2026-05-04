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

// -------------------- DEMO --------------------
async function run() {
    console.log("\n" + "=".repeat(60));
    console.log("   📚 LIBRARY MANAGEMENT SYSTEM - COMPLETE DEMO");
    console.log("=".repeat(60));

    try {
        // ================== LOAD EXISTING DATA (JSON PERSISTENCE) ==================
        console.log("\n📂 0. LOADING EXISTING DATA FROM JSON...");
        console.log("-".repeat(40));
        
        await bookRepo.loadFromFile();
        await memberRepo.loadFromFile();
        await loanRepo.loadFromFile();
        
        console.log("✅ Data loaded successfully");

        // ================== 1. ADD BOOKS ==================
        console.log("\n📚 1. ADDING BOOKS");
        console.log("-".repeat(40));

        const book1 = await bookService.addBook({
            title: "The Future",
            author: "David",
            isbn: "9780132350884",
            category: "Programming",
        });
        console.log(`   ✅ "${book1.title}" (ID: ${book1.id})`);

        const book2 = await bookService.addBook({
            title: "TypeScript Handbook",
            author: "Microsoft",
            isbn: "9780132350880",
            category: "Programming",
        });
        console.log(`   ✅ "${book2.title}" (ID: ${book2.id})`);

        const book3 = await bookService.addBook({
            title: "C Programming",
            author: "Dennis Ritchie",
            isbn: "9780132350888",
            category: "Programming",
        });
        console.log(`   ✅ "${book3.title}" (ID: ${book3.id})`);

        // ================== 2. VIEW ALL BOOKS ==================
        console.log("\n📖 2. VIEW ALL BOOKS");
        console.log("-".repeat(40));
        
        const allBooks = await bookService.getAllBooks();
        console.log(`   Total: ${allBooks.length} books`);
        allBooks.forEach(book => {
            console.log(`   - "${book.title}" by ${book.author} [${book.category}] - ${book.isAvailable ? '✅ Available' : '❌ Borrowed'}`);
        });

        // ================== 3. REGISTER MEMBERS ==================
        console.log("\n👥 3. REGISTERING MEMBERS");
        console.log("-".repeat(40));

        const member1 = await memberService.registerMember({
            name: "Rediet",
            email: "rediet@gmail.com",
        });
        console.log(`   ✅ "${member1.name}" (ID: ${member1.id})`);

        const member2 = await memberService.registerMember({
            name: "Abebe",
            email: "abebe@gmail.com",
        });
        console.log(`   ✅ "${member2.name}" (ID: ${member2.id})`);

        // ================== 4. VIEW ALL MEMBERS ==================
        console.log("\n👥 4. VIEW ALL MEMBERS");
        console.log("-".repeat(40));
        
        const allMembers = await memberService.getAllMembers();
        console.log(`   Total: ${allMembers.length} members`);
        allMembers.forEach(member => {
            console.log(`   - ${member.name} (${member.email}) - ${member.isActive ? '🟢 Active' : '🔴 Inactive'}`);
        });

        // ================== 5. SEARCH BOOKS ==================
        console.log("\n🔍 5. SEARCH BOOKS");
        console.log("-".repeat(40));
        
        console.log("   Search by title 'C':");
        const titleSearch = await bookService.searchByTitle("C");
        titleSearch.forEach(book => {
            console.log(`   - "${book.title}" by ${book.author}`);
        });
        
        console.log("\n   Search by author 'David':");
        const authorSearch = await bookService.searchByAuthor("David");
        authorSearch.forEach(book => {
            console.log(`   - "${book.title}" by ${book.author}`);
        });

        // ================== 6. FILTER AVAILABLE BOOKS ==================
        console.log("\n📊 6. FILTER AVAILABLE BOOKS");
        console.log("-".repeat(40));
        
        const available = await bookService.getAvailableBooks();
        console.log(`   Books available to borrow: ${available.length}`);
        available.forEach(book => {
            console.log(`   - "${book.title}" ✅`);
        });

        // ================== 7. BORROW BOOK ==================
        console.log("\n🔄 7. BORROWING A BOOK");
        console.log("-".repeat(40));
        
        console.log(`   ${member1.name} borrows "${book1.title}"...`);
        const loan1 = await loanService.borrowBook(member1.id, book1.id);
        console.log(`   ✅ Borrowed successfully!`);
        console.log(`   Due date: ${loan1.dueDate.toLocaleDateString()}`);

        // ================== 8. BUSINESS RULE: CAN'T BORROW SAME BOOK ==================
        console.log("\n❌ 8. BUSINESS RULE: Cannot borrow already borrowed book");
        console.log("-".repeat(40));
        
        try {
            await loanService.borrowBook(member2.id, book1.id);
        } catch (error: any) {
            console.log(`   ✅ Correct: ${error.message}`);
        }

        // ================== 9. VIEW ACTIVE LOANS ==================
        console.log("\n📋 9. VIEW ACTIVE LOANS");
        console.log("-".repeat(40));
        
        const activeLoans = await loanService.getActiveLoans();
        console.log(`   Active loans: ${activeLoans.length}`);
        for (const loan of activeLoans) {
            const book = await bookService.getBookById(loan.bookId);
            const member = await memberService.getMemberById(loan.memberId);
            console.log(`   - "${book.title}" borrowed by ${member.name}`);
            console.log(`     Due: ${loan.dueDate.toLocaleDateString()}`);
        }

        // ================== 10. VERIFY BOOK IS BORROWED ==================
        console.log("\n✅ 10. VERIFY BOOK STATUS AFTER BORROWING");
        console.log("-".repeat(40));
        
        const borrowedBook = await bookService.getBookById(book1.id);
        console.log(`   "${borrowedBook.title}" is now: ${borrowedBook.isAvailable ? 'Available' : 'Borrowed ❌'}`);

        // ================== 11. RETURN BOOK ==================
        console.log("\n ↩️ 11. RETURNING A BOOK");
        console.log("-".repeat(40));
        
        const returnedLoan = await loanService.returnBook(loan1.id);
        console.log(`   ✅ "${book1.title}" returned!`);
        console.log(`   Status: ${returnedLoan.status}`);

        // ================== 12. VERIFY BOOK AVAILABLE AGAIN ==================
        console.log("\n✅ 12. VERIFY BOOK STATUS AFTER RETURN");
        console.log("-".repeat(40));
        
        const returnedBook = await bookService.getBookById(book1.id);
        console.log(`   "${returnedBook.title}" is now: ${returnedBook.isAvailable ? 'Available ✅' : 'Borrowed ❌'}`);

        // ================== 13. UPDATE BOOK ==================
        console.log("\n✏️ 13. UPDATE BOOK INFORMATION");
        console.log("-".repeat(40));
        
        const updatedBook = await bookService.updateBook(book1.id, {
            category: "Software Engineering",
        });
        console.log(`   ✅ "${updatedBook.title}" category updated to: ${updatedBook.category}`);

        // ================== 14. DEACTIVATE MEMBER (BUSINESS RULE TEST) ==================
        console.log("\n🔴 14. DEACTIVATE MEMBER - BUSINESS RULE TEST");
        console.log("-".repeat(40));
        
        // Show current status
        const activeMember = await memberService.getMemberById(member1.id);
        console.log(`   ${activeMember.name} is currently ${activeMember.isActive ? 'ACTIVE ✅' : 'INACTIVE ❌'}`);
        
        // Deactivate member
        await memberService.deactivateMember(member1.id);
        console.log(`   ✅ ${member1.name} DEACTIVATED`);
        
        // Try to borrow with inactive member (SHOULD FAIL)
        console.log(`\n   Testing: ${member1.name} tries to borrow "${book3.title}"...`);
        try {
            await loanService.borrowBook(member1.id, book3.id);
            console.log(`   ❌ ERROR: Inactive member was able to borrow!`);
        } catch (error: any) {
            console.log(`   ✅ BUSINESS RULE WORKS: ${error.message}`);
        }
        
        // Reactivate member
        await memberService.activateMember(member1.id);
        console.log(`\n   ✅ ${member1.name} REACTIVATED`);
        
        // Verify can borrow after reactivation
        console.log(`\n   Testing: ${member1.name} tries to borrow "${book3.title}" after reactivation...`);
        const newLoan = await loanService.borrowBook(member1.id, book3.id);
        console.log(`   ✅ ${member1.name} successfully borrowed "${book3.title}"`);
        
        // Return the book to clean up (FIXED: use newLoan.id)
        await loanService.returnBook(newLoan.id);
        console.log(`   ✅ "${book3.title}" returned`);

        // ================== 15. REMOVE BOOK ==================
        console.log("\n🗑️ 15. REMOVE BOOK FROM SYSTEM");
        console.log("-".repeat(40));
        
        await bookService.removeBook(book2.id);
        console.log(`   ✅ "${book2.title}" removed from library`);
        
        const remainingBooks = await bookService.getAllBooks();
        console.log(`   Remaining books: ${remainingBooks.length}`);

        // ================== 16. SEARCH MEMBERS ==================
        console.log("\n🔍 16. SEARCH MEMBERS");
        console.log("-".repeat(40));
        
        const memberSearch = await memberService.searchByName("Red");
        console.log(`   Search 'Red': ${memberSearch.length} result(s)`);
        memberSearch.forEach(member => {
            console.log(`   - ${member.name} (${member.email})`);
        });

        // ================== 17. CHECK OVERDUE LOANS ==================
        console.log("\n⏰ 17. CHECK OVERDUE LOANS");
        console.log("-".repeat(40));
        
        const overdue = await loanService.getOverdueLoans();
        console.log(`   Overdue loans: ${overdue.length}`);
        if (overdue.length === 0) {
            console.log(`   ✅ No overdue loans found`);
        }

        // ================== 18. VALIDATION TEST ==================
        console.log("\n⚠️ 18. VALIDATION TEST (Should fail)");
        console.log("-".repeat(40));
        
        try {
            await bookService.addBook({
                title: "",
                author: "",
                isbn: "123",
                category: "Test",
            });
        } catch (error: any) {
            console.log(`   ✅ Validation working: ${error.message}`);
        }

        // ================== 19. SAVE TO JSON (PERSISTENCE) ==================
        console.log("\n💾 19. SAVING DATA TO JSON FILES");
        console.log("-".repeat(40));
        
        await bookRepo.saveToFile();
        await memberRepo.saveToFile();
        await loanRepo.saveToFile();
        console.log(`   ✅ All data saved to src/data/ folder`);

        // ================== FINAL STATE SUMMARY ==================
        console.log("\n" + "=".repeat(60));
        console.log("   📊 FINAL SYSTEM STATE SUMMARY");
        console.log("=".repeat(60));
        
        const finalBooks = await bookService.getAllBooks();
        const finalMembers = await memberService.getAllMembers();
        const finalLoans = await loanService.getAllLoans();
        const finalActive = await loanService.getActiveLoans();
        
        console.log(`\n   📚 Books in library: ${finalBooks.length}`);
        finalBooks.forEach(book => {
            console.log(`      - "${book.title}" [${book.category}] - ${book.isAvailable ? '✅ Available' : '❌ Borrowed'}`);
        });
        
        console.log(`\n   👥 Registered members: ${finalMembers.length}`);
        finalMembers.forEach(member => {
            console.log(`      - ${member.name} (${member.email}) - ${member.isActive ? '🟢 Active' : '🔴 Inactive'}`);
        });
        
        console.log(`\n   📖 Total loans: ${finalLoans.length}`);
        console.log(`   📖 Active loans: ${finalActive.length}`);
        
        console.log("\n" + "=".repeat(60));
        console.log("   ✅ ALL FEATURES DEMONSTRATED SUCCESSFULLY!");
        console.log("   🎉 LIBRARY MANAGEMENT SYSTEM IS READY FOR PRESENTATION!");
        console.log("=".repeat(60) + "\n");

    } catch (error: any) {
        console.error("\n❌ ERROR:", error.message);
        console.error(error.stack);
    }
}

// Run the demo
run();