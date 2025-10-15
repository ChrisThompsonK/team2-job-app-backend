import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { jobRoles } from "../db/schema";

// Job Role types
export type JobRole = InferSelectModel<typeof jobRoles>;
export type NewJobRole = InferInsertModel<typeof jobRoles>;

// Request/Response types for API
export interface CreateJobRoleRequest {
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

export interface UpdateJobRoleRequest {
	jobRoleName?: string;
	description?: string;
	responsibilities?: string;
	jobSpecLink?: string;
	location?: string;
	capability?: string;
	band?: string;
	closingDate?: string; // ISO date string
	status?: "open" | "active" | "closed" | "draft";
	numberOfOpenPositions?: number;
}

export interface JobRoleResponse
	extends Omit<JobRole, "createdAt" | "updatedAt" | "closingDate"> {
	createdAt: string; // ISO date string
	updatedAt: string; // ISO date string
	closingDate: string; // ISO date string
}

export interface CreateApplicationRequest {
	jobRoleId: number;
	applicantName: string;
	applicantEmail: string;
	coverLetter?: string;
	resumeUrl?: string;
	cvFileName?: string;
	cvMimeType?: string;
}

export interface UpdateApplicationRequest {
	status?:
		| "in progress"
		| "pending"
		| "under_review"
		| "shortlisted"
		| "rejected"
		| "hired";
	coverLetter?: string;
	resumeUrl?: string;
}

export interface JobApplicationResponse {
	id: number;
	jobRoleId: number;
	applicantName: string;
	applicantEmail: string;
	coverLetter?: string | undefined;
	resumeUrl?: string | undefined;
	cvFileName?: string | undefined;
	cvMimeType?: string | undefined;
	hasCv?: boolean; // Indicates if CV data exists (without sending the full data)
	status: string;
	submittedAt: string; // ISO date string
	updatedAt: string; // ISO date string
	jobRole?: JobRoleResponse | undefined; // Include job role details when needed
}

export interface ApplicationsQuery {
	status?:
		| "in progress"
		| "pending"
		| "under_review"
		| "shortlisted"
		| "rejected"
		| "hired";
	jobRoleId?: number;
	applicantEmail?: string;
}

export interface JobRolesQuery {
	status?: "open" | "active" | "closed" | "draft";
	capability?: string;
	location?: string;
	band?: string;
	page?: string;
	limit?: string;
}

export interface PaginationMetadata {
	currentPage: number;
	totalPages: number;
	totalCount: number;
	limit: number;
	hasNext: boolean;
	hasPrevious: boolean;
}

export interface PaginatedJobRolesResponse {
	jobRoles: JobRoleResponse[];
	pagination: PaginationMetadata;
}

export interface PaginationParams {
	page: number;
	limit: number;
	offset: number;
}

export interface JobRoleWithApplicationsResponse {
	jobRole: JobRoleResponse;
	applications: JobApplicationResponse[];
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	message?: string;
	error?: string;
}
