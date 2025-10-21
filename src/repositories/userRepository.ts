import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import type { CreateUserInput, User } from "../types/user.js";
import { encodeUserId } from "../utils/auth.js";

export class UserRepository {
	/**
	 * Create a new user
	 */
	async create(userData: CreateUserInput): Promise<User> {
		const now = new Date();

		// First insert without hashedId to get the auto-generated ID
		const result = db
			.insert(users)
			.values({
				hashedId: "temp", // Temporary value, will be updated
				username: userData.username.toLowerCase(),
				password: userData.password,
				userType: userData.userType || "Applicant",
				forename: userData.forename,
				surname: userData.surname,
				isActive: true,
				createdAt: now,
				updatedAt: now,
			})
			.returning()
			.get();

		// Generate hashedId based on the real ID and update the record
		const hashedId = encodeUserId(result.id);
		const updatedResult = db
			.update(users)
			.set({ hashedId })
			.where(eq(users.id, result.id))
			.returning()
			.get();

		return updatedResult as User;
	}

	/**
	 * Find user by username (email)
	 */
	async findByUsername(username: string): Promise<User | undefined> {
		const result = db
			.select()
			.from(users)
			.where(eq(users.username, username.toLowerCase()))
			.get();

		return result as User | undefined;
	}

	/**
	 * Find user by ID
	 */
	async findById(id: number): Promise<User | undefined> {
		const result = db.select().from(users).where(eq(users.id, id)).get();

		return result as User | undefined;
	}

	/**
	 * Find user by hashed ID
	 */
	async findByHashedId(hashedId: string): Promise<User | undefined> {
		const result = db
			.select()
			.from(users)
			.where(eq(users.hashedId, hashedId))
			.get();

		return result as User | undefined;
	}

	/**
	 * Update user's last login timestamp
	 */
	async updateLastLogin(id: number): Promise<void> {
		db.update(users)
			.set({
				lastLogin: new Date(),
				updatedAt: new Date(),
			})
			.where(eq(users.id, id))
			.run();
	}

	/**
	 * Update user active status
	 */
	async updateActiveStatus(id: number, isActive: boolean): Promise<void> {
		db.update(users)
			.set({
				isActive,
				updatedAt: new Date(),
			})
			.where(eq(users.id, id))
			.run();
	}

	/**
	 * Get all users (admin only)
	 */
	async findAll(): Promise<User[]> {
		const result = db.select().from(users).all();
		return result as User[];
	}
}

export const userRepository = new UserRepository();
