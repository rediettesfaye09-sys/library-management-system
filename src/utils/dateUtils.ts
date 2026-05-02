export class DateUtils {
    static getDueDate(daysFromNow: number = 14): Date {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date;
    }

    static isOverdue(date: Date): boolean {
        if (!date) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dueDate = new Date(date);
        dueDate.setHours(0, 0, 0, 0);

        return dueDate < today;
    }

    static daysBetween(date1: Date, date2: Date): number {
        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    static getDaysOverdue(dueDate: Date): number {
        if (!this.isOverdue(dueDate)) return 0;
        return this.daysBetween(dueDate, new Date());
    }

    static formatDate(
        date: Date,
        format: "short" | "long" | "iso" = "short"
    ): string {
        if (!date) return "N/A";

        switch (format) {
            case "short":
                return date.toLocaleDateString("en-US");

            case "long":
                return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });

            case "iso":
                return date.toISOString().split("T")[0];

            default:
                return date.toLocaleDateString();
        }
    }

    static formatTime(date: Date): string {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    static formatDateTime(date: Date): string {
        return `${this.formatDate(date, "short")} at ${this.formatTime(date)}`;
    }
}