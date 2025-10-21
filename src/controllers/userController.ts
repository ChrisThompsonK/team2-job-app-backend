import type { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository.js";
import type { CreateUserInput, LoginInput, SafeUser } from "../types/user.js";
import {
	hashPassword,
	isValidEmail,
	validatePasswordStrength,
	verifyPassword,
} from "../utils/auth.js";

/**
 * Convert a User object to SafeUser (without password)
 */
function toSafeUser(user: {
	id: number;
	hashedId: string;
	username: string;
	userType: string;
	forename: string;
	surname: string;
	isActive: boolean | number;
	lastLogin: Date | null;
	createdAt: Date;
	updatedAt: Date;
}): SafeUser {
	return {
		id: user.hashedId, // Use the stored hashedId instead of encoding
		username: user.username,
		userType: user.userType as "Applicant" | "Admin",
		forename: user.forename,
		surname: user.surname,
		isActive: Boolean(user.isActive),
		lastLogin: user.lastLogin,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	};
}

/**
 * Register a new user
 */
export async function register(req: Request, res: Response): Promise<void> {
	try {
		const { username, password, forename, surname, userType } =
			req.body as CreateUserInput;

		// Validate required fields
		if (!username || !password || !forename || !surname) {
			res.status(400).json({
				error: "Missing required fields: username, password, forename, surname",
			});
			return;
		}

		// Validate forename and surname length
		if (forename.length > 16) {
			res.status(400).json({
				error: "Forename must be 16 characters or less",
			});
			return;
		}

		if (surname.length > 32) {
			res.status(400).json({
				error: "Surname must be 32 characters or less",
			});
			return;
		}

		// Validate email format
		if (!isValidEmail(username)) {
			res.status(400).json({
				error: "Invalid email format",
			});
			return;
		}

		// Validate password strength
		const passwordValidation = validatePasswordStrength(password);
		if (!passwordValidation.isValid) {
			res.status(400).json({
				error: passwordValidation.message,
			});
			return;
		}

		// Check if user already exists
		const existingUser = await userRepository.findByUsername(username);
		if (existingUser) {
			res.status(409).json({
				error: "User with this email already exists",
			});
			return;
		}

		// Hash password
		const hashedPassword = await hashPassword(password);

		// Create user
		const newUser = await userRepository.create({
			username,
			password: hashedPassword,
			forename,
			surname,
			userType: userType || "Applicant",
		});

		// Return safe user data
		res.status(201).json({
			user: toSafeUser(newUser),
			message: "User registered successfully",
		});
	} catch (error) {
		console.error("Registration error:", error);
		res.status(500).json({
			error: "Internal server error during registration",
		});
	}
}

/**
 * Login user
 */
export async function login(req: Request, res: Response): Promise<void> {
	try {
		const { username, password } = req.body as LoginInput;

		// Validate required fields
		if (!username || !password) {
			res.status(400).json({
				error: "Missing required fields: username, password",
			});
			return;
		}

		// Find user
		const user = await userRepository.findByUsername(username);
		if (!user) {
			res.status(401).json({
				error: "Invalid credentials",
			});
			return;
		}

		// Check if user is active
		if (!user.isActive) {
			res.status(403).json({
				error: "Account is inactive. Please contact an administrator.",
			});
			return;
		}

		// Verify password
		const isPasswordValid = await verifyPassword(user.password, password);
		if (!isPasswordValid) {
			res.status(401).json({
				error: "Invalid credentials",
			});
			return;
		}

		// Update last login
		await userRepository.updateLastLogin(user.id);

		// Return safe user data
		res.status(200).json({
			user: toSafeUser({ ...user, lastLogin: new Date() }),
			message: "Login successful",
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({
			error: "Internal server error during login",
		});
	}
}

/**
 * Get all users (admin only - implement auth middleware before using this)
 */
export async function getAllUsers(_req: Request, res: Response): Promise<void> {
	try {
		const users = await userRepository.findAll();
		const safeUsers = users.map(toSafeUser);

		res.status(200).json({
			users: safeUsers,
			count: safeUsers.length,
		});
	} catch (error) {
		console.error("Get all users error:", error);
		res.status(500).json({
			error: "Internal server error",
		});
	}
}
