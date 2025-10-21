import * as bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import type {
	ApiResponse,
	AuthResponse,
	LoginRequest,
	RegisterRequest,
	UserResponse,
} from "../types/user";

const SALT_ROUNDS = 10;

/**
 * Helper function to format user response (exclude password)
 */
function formatUserResponse(user: {
	id: number;
	hashedId: string;
	username: string;
	userType: string;
	forename: string;
	surname: string;
	isActive: boolean;
	lastLogin: Date | null;
	createdAt: Date;
	updatedAt: Date;
}): UserResponse {
	return {
		id: user.id,
		hashedId: user.hashedId,
		username: user.username,
		userType: user.userType,
		forename: user.forename,
		surname: user.surname,
		isActive: user.isActive,
		lastLogin: user.lastLogin ? new Date(user.lastLogin).toISOString() : null,
		createdAt: new Date(user.createdAt).toISOString(),
		updatedAt: new Date(user.updatedAt).toISOString(),
	};
}

/**
 * Register a new user
 */
export async function registerUser(
	req: Request<Record<string, never>, unknown, RegisterRequest>,
	res: Response<AuthResponse>
): Promise<void> {
	try {
		const { username, password, passwordConfirm, forename, surname } = req.body;

		// Validate required fields
		if (!username || !password || !passwordConfirm || !forename || !surname) {
			res.status(400).json({
				success: false,
				error: "All fields are required",
			});
			return;
		}

		// Validate username length
		if (username.trim().length < 3) {
			res.status(400).json({
				success: false,
				error: "Username must be at least 3 characters long",
			});
			return;
		}

		// Validate password match
		if (password !== passwordConfirm) {
			res.status(400).json({
				success: false,
				error: "Passwords do not match",
			});
			return;
		}

		// Validate password strength
		if (password.length < 8) {
			res.status(400).json({
				success: false,
				error: "Password must be at least 8 characters long",
			});
			return;
		}

		// Validate names
		if (forename.trim().length === 0 || surname.trim().length === 0) {
			res.status(400).json({
				success: false,
				error: "Forename and surname cannot be empty",
			});
			return;
		}

		// Check if username already exists
		const existingUser = await userRepository.getUserByUsername(username);
		if (existingUser) {
			res.status(409).json({
				success: false,
				error: "Username already exists",
			});
			return;
		}

		// Hash password
		const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

		// Create user
		const newUser = await userRepository.createUser({
			username: username.trim(),
			passwordHash,
			forename: forename.trim(),
			surname: surname.trim(),
		});

		if (!newUser) {
			res.status(500).json({
				success: false,
				error: "Failed to create user",
			});
			return;
		}

		// Format response
		const userResponse = formatUserResponse(newUser);

		res.status(201).json({
			success: true,
			user: userResponse,
			message: "User registered successfully",
		});
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}

/**
 * Login user
 */
export async function loginUser(
	req: Request<Record<string, never>, unknown, LoginRequest>,
	res: Response<AuthResponse>
): Promise<void> {
	try {
		const { username, password } = req.body;

		// Validate required fields
		if (!username || !password) {
			res.status(400).json({
				success: false,
				error: "Username and password are required",
			});
			return;
		}

		// Find user
		const user = await userRepository.getUserByUsername(username);
		if (!user) {
			res.status(401).json({
				success: false,
				error: "Invalid username or password",
			});
			return;
		}

		// Check if user is active
		if (!user.isActive) {
			res.status(403).json({
				success: false,
				error: "Account is inactive. Please contact support.",
			});
			return;
		}

		// Verify password
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			res.status(401).json({
				success: false,
				error: "Invalid username or password",
			});
			return;
		}

		// Update last login
		await userRepository.updateLastLogin(user.id);

		// Refresh user data to get updated lastLogin
		const updatedUser = await userRepository.getUserById(user.id);
		if (!updatedUser) {
			res.status(500).json({
				success: false,
				error: "Failed to retrieve user data",
			});
			return;
		}

		// Format response
		const userResponse = formatUserResponse(updatedUser);

		res.status(200).json({
			success: true,
			user: userResponse,
			message: "Login successful",
		});
	} catch (error) {
		console.error("Error logging in user:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}

/**
 * Get all users (admin feature)
 */
export async function getAllUsers(
	_req: Request,
	res: Response<ApiResponse<UserResponse[]>>
): Promise<void> {
	try {
		const allUsers = await userRepository.getAllUsers();

		const formattedUsers = allUsers.map(formatUserResponse);

		res.status(200).json({
			success: true,
			data: formattedUsers,
		});
	} catch (error) {
		console.error("Error getting all users:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}
