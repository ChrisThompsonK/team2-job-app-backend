import crypto from "node:crypto";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { users } from "../db/schema";
import type { User } from "../types/user";

export class UserRepository {
	/**
	 * Get user by username
	 */
	async getUserByUsername(username: string): Promise<User | undefined> {
		const result = await db
			.select()
			.from(users)
			.where(eq(users.username, username))
			.limit(1);

		return result[0];
	}

	/**
	 * Get user by ID
	 */
	async getUserById(id: number): Promise<User | undefined> {
		const result = await db
			.select()
			.from(users)
			.where(eq(users.id, id))
			.limit(1);

		return result[0];
	}

	/**
	 * Create a new user
	 */
	async createUser(data: {
		username: string;
		passwordHash: string;
		forename: string;
		surname: string;
	}): Promise<User | undefined> {
		const now = new Date();

		// Generate a unique hashed ID
		const hashedId = crypto
			.createHash("sha256")
			.update(`${data.username}-${Date.now()}`)
			.digest("hex");

		const result = await db
			.insert(users)
			.values({
				hashedId,
				username: data.username,
				password: data.passwordHash,
				userType: "applicant", // Default to applicant
				forename: data.forename,
				surname: data.surname,
				isActive: true,
				lastLogin: null,
				createdAt: now,
				updatedAt: now,
			})
			.returning();

		return result[0];
	}

	/**
	 * Update user's last login timestamp
	 */
	async updateLastLogin(id: number): Promise<void> {
		await db
			.update(users)
			.set({
				lastLogin: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(users.id, id));
	}

	/**
	 * Get all users (admin feature)
	 */
	async getAllUsers(): Promise<User[]> {
		return await db.select().from(users);
	}

	/**
	 * Update user type/role (admin only)
	 */
	async updateUserRole(
		id: number,
		userType: string
	): Promise<User | undefined> {
		const result = await db
			.update(users)
			.set({
				userType,
				updatedAt: new Date(),
			})
			.where(eq(users.id, id))
			.returning();

		return result[0];
	}

	/**
	 * Check if username exists
	 */
	async usernameExists(username: string): Promise<boolean> {
		const result = await db
			.select({ id: users.id })
			.from(users)
			.where(eq(users.username, username))
			.limit(1);

		return result.length > 0;
	}
}

// Export singleton instance
export const userRepository = new UserRepository();
