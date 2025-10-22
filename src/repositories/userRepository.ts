import { and, eq } from "drizzle-orm";
import { db } from "../db/index";
import { authUsers } from "../db/schema";
import { hashPassword, verifyPassword } from "../utils/password";
import { generateUserId } from "../utils/sqids";
import type { RegisterInput } from "../utils/validation";

/**
 * User object without sensitive data (no password)
 */
export interface User {
	userId: string;
	email: string;
	forename: string;
	surname: string;
	role: "Admin" | "Applicant";
	isActive: boolean;
	lastLogin: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

/**
 * Repository for user-related database operations
 */
export class UserRepository {
	/**
	 * Create a new user account
	 * @param input Registration data (email, password, names)
	 * @returns Created user (without password)
	 */
	async createUser(input: RegisterInput): Promise<User> {
		const userId = generateUserId();
		const hashedPassword = await hashPassword(input.password);
		const now = new Date();

		const [user] = await db
			.insert(authUsers)
			.values({
				userId,
				email: input.email.toLowerCase(), // Store emails in lowercase
				password: hashedPassword,
				forename: input.forename,
				surname: input.surname,
				role: "Applicant", // Default role
				isActive: true,
				createdAt: now,
				updatedAt: now,
			})
			.returning();

		if (!user) {
			throw new Error("Failed to create user");
		}

		return this.sanitizeUser(user);
	}

	/**
	 * Find user by email address
	 * @param email Email to search for
	 * @returns User or null if not found
	 */
	async findByEmail(email: string): Promise<User | null> {
		const [user] = await db
			.select()
			.from(authUsers)
			.where(eq(authUsers.email, email.toLowerCase()))
			.limit(1);

		return user ? this.sanitizeUser(user) : null;
	}

	/**
	 * Find user by user ID
	 * @param userId User ID to search for
	 * @returns User or null if not found
	 */
	async findById(userId: string): Promise<User | null> {
		const [user] = await db
			.select()
			.from(authUsers)
			.where(eq(authUsers.userId, userId))
			.limit(1);

		return user ? this.sanitizeUser(user) : null;
	}

	/**
	 * Verify user credentials (login)
	 * @param email Email address
	 * @param password Plain text password
	 * @returns User if credentials valid, null otherwise
	 */
	async verifyCredentials(
		email: string,
		password: string
	): Promise<User | null> {
		const [user] = await db
			.select()
			.from(authUsers)
			.where(
				and(
					eq(authUsers.email, email.toLowerCase()),
					eq(authUsers.isActive, true) // Only allow active users to login
				)
			)
			.limit(1);

		if (!user) return null;

		const isValid = await verifyPassword(password, user.password);
		if (!isValid) return null;

		return this.sanitizeUser(user);
	}

	/**
	 * Update user's last login timestamp
	 * @param userId User ID to update
	 */
	async updateLastLogin(userId: string): Promise<void> {
		await db
			.update(authUsers)
			.set({
				lastLogin: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(authUsers.userId, userId));
	}

	/**
	 * Update user profile data
	 * @param userId User ID to update
	 * @param data Partial user data to update
	 * @returns Updated user or null if not found
	 */
	async updateUser(userId: string, data: Partial<User>): Promise<User | null> {
		const [updated] = await db
			.update(authUsers)
			.set({
				...data,
				updatedAt: new Date(),
			})
			.where(eq(authUsers.userId, userId))
			.returning();

		return updated ? this.sanitizeUser(updated) : null;
	}

	/**
	 * Soft delete user by setting isActive to false
	 * @param userId User ID to deactivate
	 * @returns True if deactivated, false if not found
	 */
	async deactivateUser(userId: string): Promise<boolean> {
		const result = await db
			.update(authUsers)
			.set({
				isActive: false,
				updatedAt: new Date(),
			})
			.where(eq(authUsers.userId, userId));

		return result.changes > 0;
	}

	/**
	 * Hard delete user (permanent)
	 * @param userId User ID to delete
	 * @returns True if deleted, false if not found
	 */
	async deleteUser(userId: string): Promise<boolean> {
		const result = await db
			.delete(authUsers)
			.where(eq(authUsers.userId, userId));
		return result.changes > 0;
	}

	/**
	 * Remove password from user object before returning
	 * @param user Raw user from database
	 * @returns Sanitized user without password
	 */
	private sanitizeUser(user: typeof authUsers.$inferSelect): User {
		const { password: _password, ...sanitized } = user;
		return sanitized as User;
	}
}

// Export singleton instance
export const userRepository = new UserRepository();
