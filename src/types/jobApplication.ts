import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { jobApplications } from "../db/schema";

// Job Application types
export type JobApplication = InferSelectModel<typeof jobApplications>;
export type NewJobApplication = InferInsertModel<typeof jobApplications>;

// Request/Response types for API
export interface CreateJobApplicationRequest {
	jobRoleName: string;
	description: string;
	responsibilities: string;
	jobSpecLink: string;
	location: string;
	capability: string;
	band: string;
	closingDate: string; // ISO date string
	numberOfOpenPositions?: number;
}

export interface UpdateJobApplicationRequest {
	jobRoleName?: string;
	description?: string;
	responsibilities?: string;
	jobSpecLink?: string;
	location?: string;
	capability?: string;
	band?: string;
	closingDate?: string; // ISO date string
	status?: "active" | "closed" | "draft";
	numberOfOpenPositions?: number;
}

export interface JobApplicationResponse
	extends Omit<JobApplication, "createdAt" | "updatedAt" | "closingDate"> {
	createdAt: string; // ISO date string
	updatedAt: string; // ISO date string
	closingDate: string; // ISO date string
}

export interface CreateApplicationSubmissionRequest {
	jobApplicationId: number;
	coverLetter?: string;
	resumeUrl?: string;
}

export interface PaginationQuery {
	page?: number;
	limit?: number;
}

export interface JobApplicationsQuery extends PaginationQuery {
	status?: "active" | "closed" | "draft";
	capability?: string;
	location?: string;
	band?: string;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
}

export interface PaginatedResponse<T> {
	data: T[];
	pagination: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}
