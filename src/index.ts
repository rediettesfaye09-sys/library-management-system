import { LoanStatus } from './enums/LoanStatus';
import { Book } from './models/Book';
import { Member } from './models/Member';
import { Loan } from './models/Loan';

console.log("=== Testing All Models ===\n");

// Test Book - Change these values to books YOU like
const testBook: Book = {
    id: 1,
    title: "The Hobbit",  // Change to your favorite book
    author: "J.R.R. Tolkien",  // Change to the author
    isbn: "9780547928227",
    category: "Fantasy",  // Change to the genre you like
    isAvailable: true,
    createdAt: new Date()
};
console.log("✓ Book model works:", testBook.title);

// Test Member - Use YOUR name
const testMember: Member = {
    id: 1,
    name: "Your Name Here",  // Put YOUR name here
    email: "yourname@example.com",  // Put YOUR email here
    joinedAt: new Date(),
    isActive: true
};
console.log("✓ Member model works:", testMember.name);

// Test Loan - This is just a test
const testLoan: Loan = {
    id: 1,
    bookId: 1,
    memberId: 1,
    borrowedAt: new Date(),
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    status: LoanStatus.ACTIVE
};
console.log("✓ Loan model works: Status =", testLoan.status);

console.log("\n✅ All models created successfully!");