import { Book } from "../models/Book";

export class BookRepository{
    private books: Book[]=[];


    add(book:Book): void {
    this.books.push(book);
    }
    getAll(): Book[]{
        return this.books;
    }
    findById(id: number): Book | undefined{
        return this.books.find(book=> book.id===id)

    }
    delete(id:number): void{
        this.books = this.books.filter(book=> book.id !==id)
    }

    update(id:number): void{
        this.books =this.books.change(book=> book.values===values)
    }
}


