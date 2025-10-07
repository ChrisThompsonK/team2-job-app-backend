/**
 * Authentication controller - handles login, logout, and session management
 */

import type { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import type {
	AuthResponse,
	ErrorResponse,
	LoginRequest,
	SuccessResponse,
} from "../types/user";

// Rate limiting storage (in production, use Redis or similar)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export class AuthController {
	/**
	 * Check rate limiting for login attempts
	 */
	private checkRateLimit(ip: string): boolean {
		const now = Date.now();
		const attempts = loginAttempts.get(ip);

		if (!attempts) {
			loginAttempts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
			return true;
		}

		if (now > attempts.resetTime) {
			// Reset counter if window has passed
			loginAttempts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
			return true;
		}

		if (attempts.count >= MAX_ATTEMPTS) {
			return false;
		}

		attempts.count++;
		return true;
	}

	/**
	 * POST /api/auth/login
	 * Authenticate user with email and password
	 */
	async login(req: Request, res: Response): Promise<void> {
		try {
			const ip = req.ip || req.socket.remoteAddress || "unknown";

			// Rate limiting
			if (!this.checkRateLimit(ip)) {
				res.status(429).json({
					success: false,
					message: "Too many login attempts. Please try again later.",
				} as ErrorResponse);
				return;
			}

			// Validate input
			const { email, password } = req.body as LoginRequest;

			if (!email || !password) {
				res.status(400).json({
					success: false,
					message: "Email and password are required",
				} as ErrorResponse);
				return;
			}

			// Verify credentials
			const user = await userRepository.verifyCredentials(email, password);

			if (!user) {
				res.status(401).json({
					success: false,
					message: "Invalid email or password",
				} as ErrorResponse);
				return;
			}

			// Store user in session
			req.session.user = user;

			// Return user data
			res.status(200).json({
				id: user.id,
				email: user.email,
				isAdmin: user.isAdmin,
			} as AuthResponse);
		} catch (error) {
			console.error("Login error:", error);
			res.status(500).json({
				success: false,
				message: "An error occurred during login",
			} as ErrorResponse);
		}
	}

	/**
	 * POST /api/auth/logout
	 * Clear user session
	 */
	async logout(req: Request, res: Response): Promise<void> {
		try {
			if (req.session) {
				req.session.destroy((err) => {
					if (err) {
						console.error("Logout error:", err);
						res.status(500).json({
							success: false,
							message: "An error occurred during logout",
						} as ErrorResponse);
						return;
					}

					res.status(200).json({
						success: true,
						message: "Logout successful",
					} as SuccessResponse);
				});
			} else {
				res.status(200).json({
					success: true,
					message: "Logout successful",
				} as SuccessResponse);
			}
		} catch (error) {
			console.error("Logout error:", error);
			res.status(500).json({
				success: false,
				message: "An error occurred during logout",
			} as ErrorResponse);
		}
	}

	/**
	 * GET /api/auth/me
	 * Get current authenticated user
	 */
	async getCurrentUser(req: Request, res: Response): Promise<void> {
		try {
			if (!req.session.user) {
				res.status(401).json({
					success: false,
					message: "Not authenticated",
				} as ErrorResponse);
				return;
			}

			res.status(200).json({
				id: req.session.user.id,
				email: req.session.user.email,
				isAdmin: req.session.user.isAdmin,
			} as AuthResponse);
		} catch (error) {
			console.error("Get current user error:", error);
			res.status(500).json({
				success: false,
				message: "An error occurred while fetching user data",
			} as ErrorResponse);
		}
	}
}

export const authController = new AuthController();
