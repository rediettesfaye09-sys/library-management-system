import { Book } from "../models/Book";

export class BookRepository {
    private books: Book[] = [];
    private nextId = 1;

    // ADD BOOK
    public async add(
        partial: Omit<Book, "id" | "createdAt">
    ): Promise<Book> {
        const now = new Date();

        const book: Book = {
            ...partial,
            id: this.nextId++,
            createdAt: now,
        };

        this.books.push(book);
        return book;
    }

    // UPDATE BOOK
    public async update(
        id: number,
        updatedFields: Partial<Omit<Book, "id" | "createdAt">>
    ): Promise<Book> {
        const idx = this.books.findIndex((b) => b.id === id);

        if (idx === -1) {
            throw new Error(`Book not found: ${id}`);
        }

        const updated: Book = {
            ...this.books[idx],
            ...updatedFields,
            id: this.books[idx].id,
        };

        this.books[idx] = updated;
        return updated;
    }

    // REMOVE BOOK
    public async remove(id: number): Promise<void> {
        const idx = this.books.findIndex((b) => b.id === id);

        if (idx === -1) {
            throw new Error(`Book not found: ${id}`);
        }
        this.books.splice(idx, 1);
    }

    // GET BY ID
    public async getById(id: number): Promise<Book | undefined> {
        return this.books.find((b) => b.id === id);
    }

    // GET ALL
    public async getAll(): Promise<Book[]> {
        return [...this.books];
    }

    // SEARCH BY TITLE
    public async findByTitle(query: string): Promise<Book[]> {
    const q = query.trim().toLowerCase();
    return this.books.filter((b) =>
        b.title.toLowerCase().startsWith(q)  // ← STARTS WITH
    );
}

    // SEARCH BY AUTHOR
    public async findByAuthor(query: string): Promise<Book[]> {
        const q = query.trim().toLowerCase();
        return this.books.filter((b) =>
            b.author.toLowerCase().includes(q)
        );
    }

    // FILTER BY AVAILABILITY
    public async filterByAvailability(
        isAvailable: boolean
    ): Promise<Book[]> {
        return this.books.filter((b) => b.isAvailable === isAvailable);
    }

    // GET AVAILABLE BOOKS
    public async getAvailableBooks(): Promise<Book[]> {
        return this.filterByAvailability(true);
    }

    // SAVE TO JSON FILE
    public async saveToFile(): Promise<void> {
        const fs = require('fs').promises;
        const path = require('path');
        const filePath = path.join(__dirname, '../data/books.json');
        await fs.writeFile(filePath, JSON.stringify(this.books, null, 2));
        console.log(`💾 Saved ${this.books.length} books`);
    }

    // LOAD FROM JSON FILE
    public async loadFromFile(): Promise<void> {
        const fs = require('fs').promises;
        const path = require('path');
        const filePath = path.join(__dirname, '../data/books.json');
        
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            const loaded = JSON.parse(data);
            this.books = loaded;
            this.books.forEach(book => {
                book.createdAt = new Date(book.createdAt);
                if (book.id >= this.nextId) {
                    this.nextId = book.id + 1;
                }
            });
            console.log(`📂 Loaded ${this.books.length} books`);
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                console.log('📄 No books file found, starting fresh');
            }
        }
    }
}