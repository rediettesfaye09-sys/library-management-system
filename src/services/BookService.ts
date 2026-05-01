import { Book } from "../models/Book";
import { BookRepository } from "../repositories/BookRepository";

export class BookService {
    constructor(private bookRepo: BookRepository) {}

    // ADD BOOK
    async addBook(
        bookData: Omit<Book, "id" | "createdAt" | "isAvailable">
    ): Promise<Book> {
        if (!bookData.title?.trim()) {
            throw new Error("Book title is required");
        }

        if (!bookData.author?.trim()) {
            throw new Error("Book author is required");
        }

        if (!bookData.isbn?.trim()) {
            throw new Error("Book ISBN is required");
        }

        return await this.bookRepo.add({
            ...bookData,
            isAvailable: true,
        });
    }

    // GET ALL BOOKS
    async getAllBooks(): Promise<Book[]> {
        return await this.bookRepo.getAll();
    }

    // GET BOOK BY ID
    async getBookById(id: number): Promise<Book> {
        const book = await this.bookRepo.getById(id);
        if (!book) {
            throw new Error(`Book not found: ${id}`);
        }
        return book;
    }

    // REMOVE BOOK
    async removeBook(id: number): Promise<void> {
        await this.getBookById(id);
        await this.bookRepo.remove(id);
    }

    // UPDATE BOOK
    async updateBook(
        id: number,
        updates: Partial<Omit<Book, "id" | "createdAt">>
    ): Promise<Book> {
        await this.getBookById(id);
        return await this.bookRepo.update(id, updates);
    }

    // SEARCH BY TITLE
    async searchByTitle(title: string): Promise<Book[]> {
        if (!title.trim()) {
            throw new Error("Search title is required");
        }
        return await this.bookRepo.findByTitle(title);
    }

    // SEARCH BY AUTHOR
    async searchByAuthor(author: string): Promise<Book[]> {
        if (!author.trim()) {
            throw new Error("Search author is required");
        }
        return await this.bookRepo.findByAuthor(author);
    }

    // GET AVAILABLE BOOKS
    async getAvailableBooks(): Promise<Book[]> {
        return await this.bookRepo.filterByAvailability(true);
    }

    // GET BORROWED BOOKS
    async getBorrowedBooks(): Promise<Book[]> {
        return await this.bookRepo.filterByAvailability(false);
    }
}