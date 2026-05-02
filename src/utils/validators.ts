export class Validators {
    static validateString(value: string, fieldName: string): void {
        if (!value || value.trim().length === 0) {
            throw new Error(`${fieldName} is required and cannot be empty`);
        }
    }

    static validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validateEmailOrThrow(email: string): void {
        if (!this.validateEmail(email)) {
            throw new Error(`Invalid email format: ${email}`);
        }
    }

    static validateId(id: number): void {
        if (typeof id !== "number" || id <= 0) {
            throw new Error(`Invalid ID: ${id}. ID must be a positive number`);
        }
    }

    static validateISBN(isbn: string): boolean {
        if (!isbn) return false;

        const cleanISBN = isbn.replace(/-/g, "");
        return cleanISBN.length === 10 || cleanISBN.length === 13;
    }

    static validateISBNOrThrow(isbn: string): void {
        if (!this.validateISBN(isbn)) {
            throw new Error(
                `Invalid ISBN format: ${isbn}. Must be 10 or 13 digits`
            );
        }
    }

    static validateFutureDate(date: Date, fieldName: string): void {
        if (date.getTime() <= Date.now()) {
            throw new Error(`${fieldName} must be in the future`);
        }
    }

    static validateDate(date: Date, fieldName: string): void {
        if (!date || isNaN(date.getTime())) {
            throw new Error(`${fieldName} is invalid`);
        }
    }

    static validatePositiveNumber(value: number, fieldName: string): void {
        if (typeof value !== "number" || value <= 0) {
            throw new Error(`${fieldName} must be a positive number`);
        }
    }
}