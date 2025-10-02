/**
 * Standardized API response interfaces
 */

export interface PaginationMeta {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	hasNext: boolean;
	hasPrev: boolean;
}

export interface ApiResponse<T = any> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
	pagination?: PaginationMeta;
	timestamp: string;
}

export interface ErrorResponse {
	success: false;
	message: string;
	error?: string;
	timestamp: string;
	path?: string;
	statusCode?: number;
}

/**
 * Updated Job interface to match database schema
 */
export interface Job {
	id: number;
	title: string;
	company: string;
	location?: string | null;
	description?: string | null;
	requirements?: string[] | null; // Will be parsed from JSON string in DB
	type?: "full-time" | "part-time" | "contract" | "internship" | null;
	remote?: boolean | null;
	datePosted?: string | null;
	applicationUrl?: string | null;
	status?: string | null;
	createdAt?: string | null;
	updatedAt?: string | null;
}

/**
 * Database job row interface (matches schema exactly)
 */
export interface DbJob {
	id: number;
	title: string;
	company: string;
	location: string | null;
	description: string | null;
	requirements: string | null; // JSON string
	type: "full-time" | "part-time" | "contract" | "internship" | null;
	remote: boolean | null;
	datePosted: string | null;
	applicationUrl: string | null;
	status: string | null;
	createdAt: string | null;
	updatedAt: string | null;
}

/**
 * Request validation schemas
 */
export interface GetJobsQuery {
	page?: number;
	limit?: number;
	type?: string;
	location?: string;
	remote?: boolean;
	company?: string;
}

export interface GetJobByIdParams {
	id: string;
}
