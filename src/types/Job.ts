// This file is deprecated - use types/api.ts instead
// Keeping for backward compatibility

/**
 * @deprecated Use Job interface from types/api.ts instead
 */
export interface Job {
	id: string | number;
	title: string;
	company: string;
	location?: string;
	description?: string;
	requirements?: string[];
	salary?: {
		min?: number;
		max?: number;
		currency?: string;
	};
	type?: "full-time" | "part-time" | "contract" | "internship";
	remote?: boolean;
	datePosted?: string;
	applicationUrl?: string;
}

/**
 * @deprecated Job roles functionality has been removed
 */
export interface JobRole {
	jobRoleId: number;
	roleName: string;
	description: string;
	responsibilities: string;
	jobSpecLink: string;
	location: string;
	capability: string;
	band: string;
	closingDate: string;
	status: string;
	numberOfOpenPositions: number;
}
