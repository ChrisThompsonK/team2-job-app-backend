import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Simplified users table for authentication
 * Based on the login system plan focusing on core requirements
 */
export const users = sqliteTable("users", {
	id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),

	// Authentication fields
	email: text("email", { length: 255 }).notNull().unique(),
	passwordHash: text("password_hash", { length: 255 }).notNull(),

	// Profile information
	firstName: text("first_name", { length: 100 }).notNull(),
	lastName: text("last_name", { length: 100 }).notNull(),

	// Access control - simple admin/standard roles
	role: text("role", { enum: ["admin", "standard"] })
		.notNull()
		.default("standard"),

	// Audit trail
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`)
		.$onUpdate(() => sql`(unixepoch())`),
});

/**
 * Type inference for users table
 */
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

/**
 * User data without sensitive fields (for API responses)
 */
export type PublicUser = Omit<User, "passwordHash">;

/**
 * User creation payload (for registration)
 */
export type CreateUserPayload = {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	role?: "admin" | "standard";
};

/**
 * User login payload
 */
export type LoginPayload = {
	email: string;
	password: string;
};

/**
 * JWT token payload
 */
export type TokenPayload = {
	userId: number;
	email: string;
	role: "admin" | "standard";
	iat?: number;
	exp?: number;
};
