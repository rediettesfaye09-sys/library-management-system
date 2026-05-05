import { BookRepository } from "./repositories/BookRepository";
import { MemberRepository } from "./repositories/MemberRepository";
import { LoanRepository } from "./repositories/LoanRepository";
import { BookService } from "./services/BookService";
import { MemberService } from "./services/MemberService";
import { LoanService } from "./services/LoanService";

// Initialize repositories and services
const bookRepo = new BookRepository();
const memberRepo = new MemberRepository();
const loanRepo = new LoanRepository();

const bookService = new BookService(bookRepo);
const memberService = new MemberService(memberRepo);
const loanService = new LoanService(loanRepo, bookRepo, memberRepo);

// Helper function to clear console (optional)
function clearConsole() {
    console.clear();
}

// Helper function to wait for user input
function waitForEnter(): Promise<void> {
    return new Promise((resolve) => {
        const readline = require("readline").createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readline.question("\nPress ENTER to continue...", () => {
            readline.close();
            resolve();
        });
    });
}

// ==================== DEMO 1: ADD BOOKS ====================
async function demoAddBooks() {
    console.log("\n" + "=".repeat(60));
    console.log("   DEMO 1: ADD BOOKS TO LIBRARY");
    console.log("=".repeat(60));
    
    console.log("\n Adding 3 books...\n");
    
    const book1 = await bookService.addBook({
        title: "Clean Code",
        author: "Robert Martin",
        isbn: "9780132350884",
        category: "Programming"
    });
    console.log(`    "${book1.title}" by ${book1.author}`);
    
    const book2 = await bookService.addBook({
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        isbn: "9780547928227",
        category: "Fantasy"
    });
    console.log(`    "${book2.title}" by ${book2.author}`);
    
    const book3 = await bookService.addBook({
        title: "1984",
        author: "George Orwell",
        isbn: "9780451524935",
        category: "Dystopian"
    });
    console.log(`    "${book3.title}" by ${book3.author}`);
    
    console.log("\n Current Books in Library:");
    const allBooks = await bookService.getAllBooks();
    allBooks.forEach(book => {
        console.log(`    ${book.id}. "${book.title}" - ${book.isAvailable ? 'Available ✅' : 'Borrowed ❌'}`);
    });
    
    console.log("\n Demo 1 Complete!");
    console.log("\n💡 Press ENTER to return to menu...");
    await waitForEnter();
}

// ==================== DEMO 2: VIEW ALL BOOKS ====================
async function demoViewBooks() {
    console.log("\n" + "=".repeat(60));
    console.log("    DEMO 2: VIEW ALL BOOKS");
    console.log("=".repeat(60));
    
    const allBooks = await bookService.getAllBooks();
    
    if (allBooks.length === 0) {
        console.log("\n No books found. Please run Demo 1 first!\n");
    } else {
        console.log(`\n Total Books: ${allBooks.length}\n`);
        allBooks.forEach(book => {
            console.log(`   ${book.id}. "${book.title}"`);
            console.log(`      Author: ${book.author}`);
            console.log(`      Category: ${book.category}`);
            console.log(`      ISBN: ${book.isbn}`);
            console.log(`      Status: ${book.isAvailable ? '✅ Available' : '❌ Borrowed'}`);
            console.log(`      Added: ${book.createdAt.toLocaleDateString()}`);
            console.log();
        });
    }
    
    console.log(" Demo 2 Complete!");
    console.log("\n Press ENTER to return to menu...");
    await waitForEnter();
}

// ==================== DEMO 3: REGISTER MEMBERS ====================
async function demoRegisterMembers() {
    console.log("\n" + "=".repeat(60));
    console.log("   👥 DEMO 3: REGISTER MEMBERS");
    console.log("=".repeat(60));
    
    console.log("\n Registering 2 members...\n");
    
    const member1 = await memberService.registerMember({
        name: "Rediet",
        email: "rediet@gmail.com"
    });
    console.log(`    "${member1.name}" (Email: ${member1.email})`);
    
    const member2 = await memberService.registerMember({
        name: "Abebe",
        email: "abebe@gmail.com"
    });
    console.log(`    "${member2.name}" (Email: ${member2.email})`);
    
    console.log("\n👥 All Registered Members:");
    const allMembers = await memberService.getAllMembers();
    allMembers.forEach(member => {
        console.log(`   👤 ${member.id}. ${member.name} (${member.email}) - ${member.isActive ? '🟢 Active' : '🔴 Inactive'}`);
    });
    
    console.log("\n Demo 3 Complete!");
    console.log("\n Press ENTER to return to menu...");
    await waitForEnter();
}

// ==================== DEMO 4: BORROW BOOK ====================
async function demoBorrowBook() {
    console.log("\n" + "=".repeat(60));
    console.log("    DEMO 4: BORROW A BOOK");
    console.log("=".repeat(60));
    
    const members = await memberService.getAllMembers();
    const books = await bookService.getAllBooks();
    
    if (members.length === 0 || books.length === 0) {
        console.log("\n Please add books and members first! (Run Demos 1 & 3)\n");
    } else {
        const member = members[0];
        const availableBooks = await bookService.getAvailableBooks();
        
        if (availableBooks.length === 0) {
            console.log("\n  No available books to borrow!\n");
        } else {
            const book = availableBooks[0];
            console.log(`\n ${member.name} wants to borrow "${book.title}"...\n`);
            
            const loan = await loanService.borrowBook(member.id, book.id);
            
            console.log(`    Book borrowed successfully!`);
            console.log(`    Due date: ${loan.dueDate.toLocaleDateString()}`);
            console.log(`    Loan Status: ${loan.status}`);
            
            // Show updated book status
            const updatedBook = await bookService.getBookById(book.id);
            console.log(`\n    "${book.title}" is now: ${updatedBook.isAvailable ? 'Available' : 'Borrowed ❌'}`);
        }
    }
    
    console.log("\n Demo 4 Complete!");
    console.log("\n💡 Press ENTER to return to menu...");
    await waitForEnter();
}

// ==================== DEMO 5: RETURN BOOK ====================
async function demoReturnBook() {
    console.log("\n" + "=".repeat(60));
    console.log("   ↩ DEMO 5: RETURN A BOOK");
    console.log("=".repeat(60));
    
    const activeLoans = await loanService.getActiveLoans();
    
    if (activeLoans.length === 0) {
        console.log("\n No active loans found. Please borrow a book first! (Run Demo 4)\n");
    } else {
        const loan = activeLoans[0];
        const book = await bookService.getBookById(loan.bookId);
        
        console.log(`\n Returning "${book?.title}"...\n`);
        
        const returnedLoan = await loanService.returnBook(book!.id);
        
        console.log(`    Book returned successfully!`);
        console.log(`    Loan Status: ${returnedLoan.status}`);
        console.log(`    Returned at: ${returnedLoan.returnedAt?.toLocaleString()}`);
        
        // Show updated book status
        const updatedBook = await bookService.getBookById(book!.id);
        console.log(`\n    "${book?.title}" is now: ${updatedBook.isAvailable ? 'Available ✅' : 'Borrowed ❌'}`);
    }
    
    console.log("\n Demo 5 Complete!");
    console.log("\n Press ENTER to return to menu...");
    await waitForEnter();
}

// ==================== DEMO 6: SEARCH BOOKS ====================
async function demoSearchBooks() {
    console.log("\n" + "=".repeat(60));
    console.log("    DEMO 6: SEARCH BOOKS");
    console.log("=".repeat(60));
    
    const books = await bookService.getAllBooks();
    
    if (books.length === 0) {
        console.log("\n No books found. Please run Demo 1 first!\n");
    } else {
        // Search by Title
        console.log("\n Search by Title (example: 'C'):");
        console.log("-".repeat(40));
        const titleSearch = await bookService.searchByTitle("C");
        if (titleSearch.length === 0) {
            console.log("   No books found starting with 'C'");
        } else {
            titleSearch.forEach(book => {
                console.log(`    "${book.title}" by ${book.author}`);
            });
        }
        
        // Search by Author
        console.log("\n Search by Author (example: 'Martin'):");
        console.log("-".repeat(40));
        const authorSearch = await bookService.searchByAuthor("Martin");
        if (authorSearch.length === 0) {
            console.log("   No books found by author 'Martin'");
        } else {
            authorSearch.forEach(book => {
                console.log(`    "${book.title}" by ${book.author}`);
            });
        }
        
        // Show available books
        console.log("\n Available Books (Filter by Availability):");
        console.log("-".repeat(40));
        const availableBooks = await bookService.getAvailableBooks();
        availableBooks.forEach(book => {
            console.log(`    "${book.title}" - Available ✅`);
        });
    }
    
    console.log("\n Demo 6 Complete!");
    console.log("\n💡 Press ENTER to return to menu...");
    await waitForEnter();
}

// ==================== DEMO 7: DEACTIVATE MEMBER ====================
async function demoDeactivateMember() {
    console.log("\n" + "=".repeat(60));
    console.log("    DEMO 7: DEACTIVATE MEMBER (Business Rule)");
    console.log("=".repeat(60));
    
    const members = await memberService.getAllMembers();
    
    if (members.length === 0) {
        console.log("\n No members found. Please run Demo 3 first!\n");
    } else {
        const member = members[0];
        
        console.log(`\n Member: ${member.name} is currently ${member.isActive ? 'ACTIVE ✅' : 'INACTIVE ❌'}`);
        
        // Deactivate member
        console.log(`\n Deactivating ${member.name}...`);
        await memberService.deactivateMember(member.id);
        
        // Try to borrow (should fail)
        console.log(`\n Testing: ${member.name} tries to borrow a book...`);
        const books = await bookService.getAvailableBooks();
        
        if (books.length > 0) {
            try {
                await loanService.borrowBook(member.id, books[0].id);
                console.log("   ❌ ERROR: Inactive member was able to borrow!");
            } catch (error: any) {
                console.log(`    BUSINESS RULE WORKS: ${error.message}`);
            }
        }
        
        // Reactivate member
        console.log(`\n Reactivating ${member.name}...`);
        await memberService.activateMember(member.id);
        console.log(`    ${member.name} is now ACTIVE again`);
        
        // Verify can borrow now
        console.log(`\n Testing: ${member.name} tries to borrow again...`);
        if (books.length > 0) {
            const newLoan = await loanService.borrowBook(member.id, books[0].id);
            console.log(`    ${member.name} successfully borrowed "${books[0].title}"`);
          await loanService.returnBook(newLoan.id);
            console.log(`    Book returned`);
        }
    }
    
    console.log("\n Demo 7 Complete!");
    console.log("\n💡 Press ENTER to return to menu...");
    await waitForEnter();
}

// ==================== DEMO 8: UPDATE BOOK ====================
async function demoUpdateBook() {
    console.log("\n" + "=".repeat(60));
    console.log("    DEMO 8: UPDATE BOOK INFORMATION");
    console.log("=".repeat(60));
    
    const books = await bookService.getAllBooks();
    
    if (books.length === 0) {
        console.log("\n No books found. Please run Demo 1 first!\n");
    } else {
        const book = books[0];
        console.log(`\n Before Update:`);
        console.log(`   Title: "${book.title}"`);
        console.log(`   Category: ${book.category}`);
        
        console.log(`\n Updating category to "Software Engineering"...`);
        const updated = await bookService.updateBook(book.id, {
            category: "Software Engineering"
        });
        
        console.log(`\n After Update:`);
        console.log(`   Title: "${updated.title}"`);
        console.log(`   Category: ${updated.category} ✅`);
    }
    
    console.log("\n Demo 8 Complete!");
    console.log("\n💡 Press ENTER to return to menu...");
    await waitForEnter();
}

// ==================== DEMO 9: REMOVE BOOK ====================
async function demoRemoveBook() {
    console.log("\n" + "=".repeat(60));
    console.log("    DEMO 9: REMOVE BOOK");
    console.log("=".repeat(60));
    
    const books = await bookService.getAllBooks();
    
    if (books.length === 0) {
        console.log("\n No books found. Please run Demo 1 first!\n");
    } else {
        const book = books[books.length - 1];
        console.log(`\n Removing book: "${book.title}"...`);
        
        await bookService.removeBook(book.id);
        console.log(`    "${book.title}" removed from library`);
        
        const remaining = await bookService.getAllBooks();
        console.log(`\n Remaining books: ${remaining.length}`);
        remaining.forEach(b => {
            console.log(`    "${b.title}"`);
        });
    }
    
    console.log("\n Demo 9 Complete!");
    console.log("\n💡 Press ENTER to return to menu...");
    await waitForEnter();
}

// ==================== DEMO 10: CHECK OVERDUE LOANS ====================
async function demoOverdueLoans() {
    console.log("\n" + "=".repeat(60));
    console.log("    DEMO 10: CHECK OVERDUE LOANS");
    console.log("=".repeat(60));
    
    const overdue = await loanService.getOverdueLoans();
    
    if (overdue.length === 0) {
        console.log("\n No overdue loans found!");
        console.log("   All borrowed books have been returned on time.");
    } else {
        console.log(`\n Found ${overdue.length} overdue loan(s):`);
        for (const loan of overdue) {
            const book = await bookService.getBookById(loan.bookId);
            const member = await memberService.getMemberById(loan.memberId);
            console.log(`    "${book?.title}" borrowed by ${member?.name}`);
            console.log(`    Due date: ${loan.dueDate.toLocaleDateString()}`);
        }
    }
    
    console.log("\n Demo 10 Complete!");
    console.log("\n💡 Press ENTER to return to menu...");
    await waitForEnter();
}

// ==================== DEMO 11: VALIDATION TEST ====================
async function demoValidation() {
    console.log("\n" + "=".repeat(60));
    console.log("    DEMO 11: VALIDATION TEST");
    console.log("=".repeat(60));
    
    console.log("\n Trying to add a book with empty title...\n");
    
    try {
        await bookService.addBook({
            title: "",
            author: "",
            isbn: "123",
            category: "Test"
        });
        console.log("   ❌ ERROR: Should have failed!");
    } catch (error: any) {
        console.log(`   ✅ VALIDATION WORKS: ${error.message}`);
    }
    
    console.log("\n📧 Trying to register member with invalid email...\n");
    
    try {
        await memberService.registerMember({
            name: "Test User",
            email: "invalid-email"
        });
        console.log("   ❌ ERROR: Should have failed!");
    } catch (error: any) {
        console.log(`   ✅ VALIDATION WORKS: ${error.message}`);
    }
    
    console.log("\n Demo 11 Complete!");
    console.log("\n💡 Press ENTER to return to menu...");
    await waitForEnter();
}

// ==================== MAIN MENU ====================
async function showMenu() {
    while (true) {
        console.clear();
        console.log("\n" + "=".repeat(60));
        console.log("   📚 LIBRARY MANAGEMENT SYSTEM");
        console.log("   Interactive Presentation Menu");
        console.log("=".repeat(60));
        console.log("\n   Select a feature to demonstrate:");
        console.log("-".repeat(50));
        console.log("   1.   Add Books");
        console.log("   2.   View All Books");
        console.log("   3.   Register Members");
        console.log("   4.   Borrow a Book");
        console.log("   5.   Return a Book");
        console.log("   6.   Search Books (Title/Author)");
        console.log("   7.   Deactivate Member (Business Rule)");
        console.log("   8.   Update Book Information");
        console.log("   9.   Remove a Book");
        console.log("   10.  Check Overdue Loans");
        console.log("   11.  Validation Test");
        console.log("   12.  Run ALL Demos");
        console.log("   0.   Exit");
        console.log("-".repeat(50));
        
        // Read user input
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        const answer = await new Promise<string>((resolve) => {
            readline.question("\n   Enter your choice: ", (input: string) => {
                readline.close();
                resolve(input);
            });
        });
        
        switch(answer) {
            case '1':
                await demoAddBooks();
                break;
            case '2':
                await demoViewBooks();
                break;
            case '3':
                await demoRegisterMembers();
                break;
            case '4':
                await demoBorrowBook();
                break;
            case '5':
                await demoReturnBook();
                break;
            case '6':
                await demoSearchBooks();
                break;
            case '7':
                await demoDeactivateMember();
                break;
            case '8':
                await demoUpdateBook();
                break;
            case '9':
                await demoRemoveBook();
                break;
            case '10':
                await demoOverdueLoans();
                break;
            case '11':
                await demoValidation();
                break;
            case '12':
                await demoAddBooks();
                await demoViewBooks();
                await demoRegisterMembers();
                await demoBorrowBook();
                await demoReturnBook();
                await demoSearchBooks();
                await demoDeactivateMember();
                await demoUpdateBook();
                await demoRemoveBook();
                await demoOverdueLoans();
                await demoValidation();
                break;
            case '0':
                console.log("\n Thank you for watching!");
                console.log(" Library Management System - Presentation Complete!\n");
                process.exit(0);
                break;
            default:
                console.log("\n❌ Invalid choice! Press ENTER to try again...");
                await waitForEnter();
        }
    }
}

// Start the presentation
showMenu();