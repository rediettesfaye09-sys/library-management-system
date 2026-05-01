  import { Book } from "../models/Book";
  
  
  export class BookRepository{
    private books:  Book[] =[];
    private nextId = 1;


    public async add(partial: Omit<Book, "id" | "createdAt">): Promise<Book>{
        const now = new Date();
        const book: Book={
            ...partial,
            id: this.nextId++,
           createdAt: now,
            };
            this.books.push(book);
            return book;
    }

    public async update(id: number, updatedFields: Partial<Omit<Book, "id" | "createdAt">>): Promise<Book>{
        const idx = this.books.findIndex((b) => b.id===id);
        if (idx === -1){
            throw new Error(`Book not found ${id}`);
        }
        const updated: Book={...this.books[idx], ...updatedFields, id: this.books[idx].id};
         this.books[idx] = updated;
         return updated;
    }
    public async remove(id:number):Promise<void>{
        const idx =this.books.findIndex((b)=> b.id === id);
        if(idx === -1) return;  
        this.books.splice(idx, 1)
    
    }

    public async getById(id: number):Promise<Book | undefined>{
        return this.books.find((b)=> b.id === id);
    }

    public async getAll():Promise<Book[]>  {
        return [...this.books]
    }  

    public async findByTitle(query:string): Promise<Book[]>{
        const q = query.trim().toLowerCase();
        return this.books.filter((b)=> b.title.toLowerCase().includes(q));
    }

    public async findByAuthor(query: string):Promise<Book[]>{
        const q= query.trim().toLowerCase();
        return this.books.filter((b)=> b.author.toLowerCase().includes(q));
    }
     public async filterByAvailability(isAvailable: boolean):Promise<Book[]>{
        return this.books.filter((b)=> b.isAvailable === isAvailable)
     }

  }