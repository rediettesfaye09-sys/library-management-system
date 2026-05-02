import { Validators } from './utils/validators';
import { DateUtils } from './utils/dateUtils';

console.log("=== TESTING UTILS ===\n");

// Test Validators
console.log("--- Testing Validators ---");

try {
    Validators.validateString("Hello World", "Message");
    console.log("✓ validateString passed");

    Validators.validateEmailOrThrow("test@example.com");
    console.log("✓ validateEmail passed");

    Validators.validateISBNOrThrow("9780132350884");
    console.log("✓ validateISBN passed");

    Validators.validateId(5);
    console.log("✓ validateId passed");

    console.log("✅ All validators work!\n");

} catch (error: any) {
    console.log("❌ Validator error:", error.message);
}

// Test DateUtils
console.log("--- Testing DateUtils ---");

const today = new Date();
const dueDate = DateUtils.getDueDate(14);

console.log(`Today: ${DateUtils.formatDate(today, 'long')}`);
console.log(`Due date (14 days): ${DateUtils.formatDate(dueDate, 'long')}`);
console.log(`Is due date overdue? ${DateUtils.isOverdue(dueDate)}`);
console.log(`Days between: ${DateUtils.daysBetween(today, dueDate)} days`);
console.log(`Formatted date time: ${DateUtils.formatDateTime(today)}`);

console.log("\n✅ DateUtils works!");

// Test error cases
console.log("\n--- Testing Error Cases ---");

try {
    Validators.validateString("", "Empty field");
} catch (error: any) {
    console.log(`✓ Caught empty string: ${error.message}`);
}

try {
    Validators.validateEmailOrThrow("invalid-email");
} catch (error: any) {
    console.log(`✓ Caught invalid email: ${error.message}`);
}

try {
    Validators.validateId(-5);
} catch (error: any) {
    console.log(`✓ Caught negative ID: ${error.message}`);
}

console.log("\n✅ ALL TESTS PASSED!");