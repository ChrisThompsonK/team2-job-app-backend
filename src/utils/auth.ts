import { createHash } from "node:crypto";
import argon2 from "argon2";

// Secret salt for ID hashing - in production, this should be in environment variables
const ID_HASH_SECRET =
	process.env["ID_HASH_SECRET"] || "kainos-job-app-secret-2025";

/**
 * Hash a password using Argon2id
 * @param password - Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
	return await argon2.hash(password, {
		type: argon2.argon2id,
		memoryCost: 65536, // 64 MiB
		timeCost: 3, // Number of iterations
		parallelism: 4, // Number of threads
	});
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
		return await argon2.verify(hash, password);
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
 * Validate email format
 * @param email - Email address to validate
 * @returns True if email format is valid
 */
export function isValidEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
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
