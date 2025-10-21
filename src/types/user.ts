/**
 * User-related TypeScript types and interfaces
 */

// Database User model (matches schema)
export interface User {
	id: number;
	hashedId: string;
	username: string;
	password: string; // bcrypt hash
	userType: string;
	forename: string;
	surname: string;
	isActive: boolean;
	lastLogin: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

// User registration request
export interface RegisterRequest {
	username: string;
	password: string;
	passwordConfirm: string;
	forename: string;
	surname: string;
}

// User login request
export interface LoginRequest {
	username: string;
	password: string;
}

// User response (excluding sensitive fields)
export interface UserResponse {
	id: number;
	hashedId: string;
	username: string;
	userType: string;
	forename: string;
	surname: string;
	isActive: boolean;
	lastLogin: string | null;
	createdAt: string;
	updatedAt: string;
}

// API response wrapper
export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
}

// Auth response
export interface AuthResponse {
	success: boolean;
	user?: UserResponse;
	message?: string;
	error?: string;
}
