import bcrypt from "bcrypt";
import Sqids from "sqids";

// Initialize Sqids with a minimum length for better uniqueness
// In production, you can customize the alphabet via environment variables
const sqidsOptions: { minLength: number; alphabet?: string } = {
	minLength: 8, // Ensures IDs are at least 8 characters long
};

// Only add custom alphabet if provided
if (process.env["SQIDS_ALPHABET"]) {
	sqidsOptions.alphabet = process.env["SQIDS_ALPHABET"];
}

const sqids = new Sqids(sqidsOptions);

// Number of salt rounds for bcrypt (10 is a good balance of security and performance)
const BCRYPT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
	return await bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Verify a password against a hash
 * @param hash - Hashed password from database
 * @param password - Plain text password to verify
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(
	hash: string,
	password: string
): Promise<boolean> {
	try {
		return await bcrypt.compare(password, hash);
	} catch (_error) {
		return false;
	}
}

/**
 * Encode a user ID to a unique string using Sqids
 * This creates a reversible, URL-safe ID that protects the actual numeric ID
 * @param id - Numeric user ID
 * @returns Encoded user ID (minimum 8 characters)
 */
export function encodeUserId(id: number): string {
	return sqids.encode([id]);
}

/**
 * Decode a Sqids-encoded ID back to the original numeric user ID
 * @param encodedId - Sqids-encoded user ID
 * @returns Numeric user ID or null if invalid
 */
export function decodeUserId(encodedId: string): number | null {
	try {
		const numbers = sqids.decode(encodedId);
		return numbers.length > 0 && numbers[0] !== undefined ? numbers[0] : null;
	} catch (_error) {
		return null;
	}
}

/**
 * Verify if a user ID matches an encoded ID
 * @param id - Numeric user ID to verify
 * @param encodedId - Sqids-encoded ID to compare against
 * @returns True if the ID matches the encoded ID
 */
export function verifyUserId(id: number, encodedId: string): boolean {
	return encodeUserId(id) === encodedId;
}

/**
 * Validate email format using a more comprehensive regex
 * This validates:
 * - Local part: alphanumeric, dots, hyphens, underscores, plus signs
 * - Cannot start or end with a dot
 * - Cannot have consecutive dots
 * - Domain: alphanumeric and hyphens
 * - TLD: 2-63 characters, letters only
 * @param email - Email address to validate
 * @returns True if email format is valid
 */
export function isValidEmail(email: string): boolean {
	// Comprehensive email regex following RFC 5322 simplified version
	// Local part: allows letters, numbers, dots, hyphens, underscores, plus
	// Domain part: standard domain format with valid TLD
	const emailRegex =
		/^[a-zA-Z0-9](?:[a-zA-Z0-9._+-]{0,61}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,63}$/;

	if (!emailRegex.test(email)) {
		return false;
	}

	// Additional validation checks
	const [localPart, domainPart] = email.split("@");

	// Check local part (before @)
	if (!localPart || localPart.length > 64) {
		return false; // Local part too long
	}

	// Check for consecutive dots
	if (localPart.includes("..")) {
		return false;
	}

	// Check domain part (after @)
	if (!domainPart || domainPart.length > 253) {
		return false; // Domain too long
	}

	// Check each domain label length (between dots)
	const domainLabels = domainPart.split(".");
	for (const label of domainLabels) {
		if (label.length === 0 || label.length > 63) {
			return false; // Label too long or empty
		}
	}

	return true;
}

/**
 * Validate password strength
 * Requirements: At least 8 characters, contains uppercase, lowercase, number, and special character
 * @param password - Password to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export function validatePasswordStrength(password: string): {
	isValid: boolean;
	message?: string;
} {
	if (password.length < 8) {
		return {
			isValid: false,
			message: "Password must be at least 8 characters long",
		};
	}

	if (!/[A-Z]/.test(password)) {
		return {
			isValid: false,
			message: "Password must contain at least one uppercase letter",
		};
	}

	if (!/[a-z]/.test(password)) {
		return {
			isValid: false,
			message: "Password must contain at least one lowercase letter",
		};
	}

	if (!/[0-9]/.test(password)) {
		return {
			isValid: false,
			message: "Password must contain at least one number",
		};
	}

	if (!/[^A-Za-z0-9]/.test(password)) {
		return {
			isValid: false,
			message: "Password must contain at least one special character",
		};
	}

	return { isValid: true };
}
