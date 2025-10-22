import { z } from "zod";

/**
 * Registration request validation schema
 */
export const registerSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
	forename: z.string().min(1, "First name is required").max(50),
	surname: z.string().min(1, "Last name is required").max(50),
});

/**
 * Login request validation schema
 */
export const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});

/**
 * Update user profile validation schema
 */
export const updateUserSchema = z.object({
	forename: z.string().min(1).max(50).optional(),
	surname: z.string().min(1).max(50).optional(),
	email: z.string().email().optional(),
});

// Export inferred types for use in controllers
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
