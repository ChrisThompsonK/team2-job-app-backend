import type { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import { validatePasswordStrength } from "../utils/password";
import { loginSchema, registerSchema } from "../utils/validation";

export class AuthController {
	async register(req: Request, res: Response): Promise<void> {
		try {
			const validation = registerSchema.safeParse(req.body);
			if (!validation.success) {
				res.status(400).json({
					error: "Validation failed",
					details: validation.error.issues,
				});
				return;
			}

			const { email, password, forename, surname } = validation.data;

			const passwordCheck = validatePasswordStrength(password);
			if (!passwordCheck.valid) {
				res.status(400).json({
					error: "Password does not meet requirements",
					details: passwordCheck.errors,
				});
				return;
			}

			const existingUser = await userRepository.findByEmail(email);
			if (existingUser) {
				res.status(409).json({
					error: "User already exists",
					message: "An account with this email already exists",
				});
				return;
			}

			const user = await userRepository.createUser({
				email,
				password,
				forename,
				surname,
			});

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

	async login(req: Request, res: Response): Promise<void> {
		try {
			const validation = loginSchema.safeParse(req.body);
			if (!validation.success) {
				res.status(400).json({
					error: "Validation failed",
					details: validation.error.issues,
				});
				return;
			}

			const { email, password } = validation.data;

			const user = await userRepository.verifyCredentials(email, password);
			if (!user) {
				res.status(401).json({
					error: "Invalid credentials",
					message: "Email or password is incorrect",
				});
				return;
			}

			await userRepository.updateLastLogin(user.userId);

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

	async me(req: Request, res: Response): Promise<void> {
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

export const authController = new AuthController();
