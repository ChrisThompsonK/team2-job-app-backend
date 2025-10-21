import { createHash } from "node:crypto";
import bcrypt from "bcrypt";

// Secret salt for ID hashing - in production, this should be in environment variables
const ID_HASH_SECRET =
	process.env["ID_HASH_SECRET"] || "kainos-job-app-secret-2025";

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
 * Hash a user ID to a 6-character string using SHA-256
 * This creates a one-way hash that cannot be reversed, protecting user IDs from exposure
 * @param id - Numeric user ID
 * @returns 6-character hashed ID
 */
export function encodeUserId(id: number): string {
	const hash = createHash("sha256");
	hash.update(`${ID_HASH_SECRET}-${id}`);
	const fullHash = hash.digest("hex");
	// Take first 6 characters of the hash
	return fullHash.substring(0, 6);
}

/**
 * Since IDs are now one-way hashed, we need to maintain a mapping
 * This function is kept for API compatibility but will need to be replaced
 * with a database lookup approach in production
 * @param encodedId - 6-character hashed ID
 * @returns Numeric user ID or null if invalid
 */
export function decodeUserId(_encodedId: string): number | null {
	// One-way hashes cannot be decoded
	// In production, you would:
	// 1. Store the hashed ID in the database alongside the real ID
	// 2. Look up the real ID by querying the database with the hashed ID
	// For now, return null to indicate this needs database lookup
	return null;
}

/**
 * Verify if a user ID matches a hashed ID
 * @param id - Numeric user ID to verify
 * @param hashedId - 6-character hashed ID to compare against
 * @returns True if the ID matches the hash
 */
export function verifyUserId(id: number, hashedId: string): boolean {
	return encodeUserId(id) === hashedId;
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
