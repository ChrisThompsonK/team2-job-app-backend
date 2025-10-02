/**
 * Job interface - update this based on your actual JSON data structure
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
 * JobRole interface for the job roles data
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