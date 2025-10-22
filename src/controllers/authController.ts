import type { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import { validatePasswordStrength } from "../utils/password";
import { loginSchema, registerSchema } from "../utils/validation";

/**
 * Controller for authentication operations
 */
export class AuthController {
	/**
	 * Register a new user account
	 * POST /api/auth/register
	 */
	async register(req: Request, res: Response): Promise<void> {
		try {
			// Validate request body
			const validation = registerSchema.safeParse(req.body);
			if (!validation.success) {
				res.status(400).json({
					error: "Validation failed",
					details: validation.error.issues,
				});
				return;
			}

			const { email, password, forename, surname } = validation.data;

			// Check password strength
			const passwordCheck = validatePasswordStrength(password);
			if (!passwordCheck.valid) {
				res.status(400).json({
					error: "Password does not meet requirements",
					details: passwordCheck.errors,
				});
				return;
			}

			// Check if user already exists
			const existingUser = await userRepository.findByEmail(email);
			if (existingUser) {
				res.status(409).json({
					error: "User already exists",
					message: "An account with this email already exists",
				});
				return;
			}

			// Create new user
			const user = await userRepository.createUser({
				email,
				password,
				forename,
				surname,
			});

			// Create session
			req.session.userId = user.userId;
			req.session.email = user.email;
			req.session.role = user.role;

			res.status(201).json({
				message: "User registered successfully",
				user: {
					userId: user.userId,
					email: user.email,
					forename: user.forename,
					surname: user.surname,
					role: user.role,
				},
			});
		} catch (error) {
			console.error("Registration error:", error);
			res.status(500).json({
				error: "Internal server error",
				message: "Failed to register user",
			});
		}
	}

	/**
	 * Login with email and password
	 * POST /api/auth/login
	 */
	async login(req: Request, res: Response): Promise<void> {
		try {
			// Validate request body
			const validation = loginSchema.safeParse(req.body);
			if (!validation.success) {
				res.status(400).json({
					error: "Validation failed",
					details: validation.error.issues,
				});
				return;
			}

			const { email, password } = validation.data;

			// Verify credentials
			const user = await userRepository.verifyCredentials(email, password);
			if (!user) {
				res.status(401).json({
					error: "Invalid credentials",
					message: "Email or password is incorrect",
				});
				return;
			}

			// Update last login timestamp
			await userRepository.updateLastLogin(user.userId);

			// Create session
			req.session.userId = user.userId;
			req.session.email = user.email;
			req.session.role = user.role;

			res.status(200).json({
				message: "Login successful",
				user: {
					userId: user.userId,
					email: user.email,
					forename: user.forename,
					surname: user.surname,
					role: user.role,
				},
			});
		} catch (error) {
			console.error("Login error:", error);
			res.status(500).json({
				error: "Internal server error",
				message: "Failed to login",
			});
		}
	}

	/**
	 * Logout and destroy session
	 * POST /api/auth/logout
	 */
	async logout(req: Request, res: Response): Promise<void> {
		try {
			req.session.destroy((err) => {
				if (err) {
					console.error("Logout error:", err);
					res.status(500).json({
						error: "Failed to logout",
						message: "Could not destroy session",
					});
					return;
				}

				res.clearCookie("job_app_session");
				res.status(200).json({
					message: "Logout successful",
				});
			});
		} catch (error) {
			console.error("Logout error:", error);
			res.status(500).json({
				error: "Internal server error",
				message: "Failed to logout",
			});
		}
	}

	/**
	 * Get currently authenticated user
	 * GET /api/auth/me
	 */
	async getCurrentUser(req: Request, res: Response): Promise<void> {
		try {
			if (!req.session.userId) {
				res.status(401).json({
					error: "Not authenticated",
				});
				return;
			}

			const user = await userRepository.findById(req.session.userId);
			if (!user) {
				res.status(404).json({
					error: "User not found",
				});
				return;
			}

			res.status(200).json({
				user: {
					userId: user.userId,
					email: user.email,
					forename: user.forename,
					surname: user.surname,
					role: user.role,
					lastLogin: user.lastLogin,
				},
			});
		} catch (error) {
			console.error("Get current user error:", error);
			res.status(500).json({
				error: "Internal server error",
			});
		}
	}
}

// Export singleton instance
export const authController = new AuthController();
