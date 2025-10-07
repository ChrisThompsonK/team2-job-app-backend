/**
 * User repository for database operations related to authentication
 */

import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/index";
import { users } from "../db/schema";
import type { PublicUser, User } from "../types/user";

const SALT_ROUNDS = 10;

export class UserRepository {
	/**
	 * Find a user by email address
	 */
	async findByEmail(email: string): Promise<User | undefined> {
		const result = await db
			.select()
			.from(users)
			.where(eq(users.email, email.toLowerCase()))
			.limit(1);

		if (result.length === 0 || !result[0]) {
			return undefined;
		}

		const user = result[0];
		return {
			id: user.id,
			email: user.email,
			password: user.password,
			isAdmin: user.isAdmin,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}

	/**
	 * Find a user by ID
	 */
	async findById(id: number): Promise<User | undefined> {
		const result = await db
			.select()
			.from(users)
			.where(eq(users.id, id))
			.limit(1);

		if (result.length === 0 || !result[0]) {
			return undefined;
		}

		const user = result[0];
		return {
			id: user.id,
			email: user.email,
			password: user.password,
			isAdmin: user.isAdmin,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}

	/**
	 * Verify user credentials
	 */
	async verifyCredentials(
		email: string,
		password: string
	): Promise<PublicUser | null> {
		const user = await this.findByEmail(email);

		if (!user) {
			return null;
		}

		const isValid = await bcrypt.compare(password, user.password);

		if (!isValid) {
			return null;
		}

		// Return user without password
		return {
			id: user.id,
			email: user.email,
			isAdmin: user.isAdmin,
		};
	}

	/**
	 * Hash a password using bcrypt
	 */
	async hashPassword(password: string): Promise<string> {
		return bcrypt.hash(password, SALT_ROUNDS);
	}

	/**
	 * Create a new user
	 */
	async create(
		email: string,
		password: string,
		isAdmin = false
	): Promise<PublicUser> {
		const hashedPassword = await this.hashPassword(password);

		const result = await db
			.insert(users)
			.values({
				email: email.toLowerCase(),
				password: hashedPassword,
				isAdmin,
			})
			.returning();

		const user = result[0];
		if (!user) {
			throw new Error("Failed to create user");
		}

		return {
			id: user.id,
			email: user.email,
			isAdmin: user.isAdmin,
		};
	}

	/**
	 * Convert User to PublicUser (removes password)
	 */
	toPublicUser(user: User): PublicUser {
		return {
			id: user.id,
			email: user.email,
			isAdmin: user.isAdmin,
		};
	}
}

export const userRepository = new UserRepository();
