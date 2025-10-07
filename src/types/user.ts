/**
 * User type definitions for authentication system
 */

// Database user model (includes password)
export interface User {
	id: number;
	email: string;
	password: string;
	isAdmin: boolean;
	createdAt: Date;
	updatedAt: Date;
}

// Public user data (excludes password)
export interface PublicUser {
	id: number;
	email: string;
	isAdmin: boolean;
}

// Login request payload
export interface LoginRequest {
	email: string;
	password: string;
}

// Authentication response
export interface AuthResponse {
	id: number;
	email: string;
	isAdmin: boolean;
}

// Error response
export interface ErrorResponse {
	success: false;
	message: string;
}

// Success response
export interface SuccessResponse {
	success: true;
	message: string;
}
