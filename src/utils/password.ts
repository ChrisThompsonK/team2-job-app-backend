import bcrypt from "bcrypt";

const SALT_ROUNDS = 12; // Higher = more secure but slower

/**
 * Hash a plain text password using bcrypt
 * @param password Plain text password
 * @returns Hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a bcrypt hash
 * @param password Plain text password to verify
 * @param hash Stored bcrypt hash
 * @returns True if password matches, false otherwise
 */
export async function verifyPassword(
	password: string,
	hash: string
): Promise<boolean> {
	return bcrypt.compare(password, hash);
}

/**
 * Validate password strength requirements
 * @param password Password to validate
 * @returns Validation result with errors if any
 */
export function validatePasswordStrength(password: string): {
	valid: boolean;
	errors: string[];
} {
	const errors: string[] = [];

	if (password.length < 8) {
		errors.push("Password must be at least 8 characters long");
	}
	if (!/[A-Z]/.test(password)) {
		errors.push("Password must contain at least one uppercase letter");
	}
	if (!/[a-z]/.test(password)) {
		errors.push("Password must contain at least one lowercase letter");
	}
	if (!/[0-9]/.test(password)) {
		errors.push("Password must contain at least one number");
	}
	if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
		errors.push("Password must contain at least one special character");
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
