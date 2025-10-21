export type UserType = "Applicant" | "Admin";

export interface User {
	id: number;
	hashedId: string; // 6-character hashed ID
	username: string; // Email address
	password: string; // Hashed password
	userType: UserType;
	forename: string;
	surname: string;
	isActive: boolean;
	lastLogin: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

// User without sensitive data (for API responses)
export interface SafeUser {
	id: string; // 6-character hashed ID (not the real numeric ID)
	username: string;
	userType: UserType;
	forename: string;
	surname: string;
	isActive: boolean;
	lastLogin: Date | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface CreateUserInput {
	username: string;
	password: string;
	userType?: UserType;
	forename: string;
	surname: string;
}

export interface LoginInput {
	username: string;
	password: string;
}

export interface LoginResponse {
	user: SafeUser;
	message: string;
}
