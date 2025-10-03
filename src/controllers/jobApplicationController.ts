import { and, count, desc, eq, like } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../db/index";
import { jobApplications } from "../db/schema";
import type {
	ApiResponse,
	JobApplicationResponse,
	JobApplicationsQuery,
	PaginatedResponse,
} from "../types/jobApplication";

/**
 * Get all job applications with optional filtering and pagination
 */
export async function getAllJobApplications(
	req: Request<Record<string, never>, unknown, unknown, JobApplicationsQuery>,
	res: Response<ApiResponse<PaginatedResponse<JobApplicationResponse>>>
): Promise<void> {
	try {
		const {
			page = 1,
			limit = 10,
			status,
			capability,
			location,
			band,
		} = req.query;

		// Build where conditions
		const conditions = [];
		if (status) {
			conditions.push(eq(jobApplications.status, status));
		}
		if (capability) {
			conditions.push(like(jobApplications.capability, `%${capability}%`));
		}
		if (location) {
			conditions.push(like(jobApplications.location, `%${location}%`));
		}
		if (band) {
			conditions.push(eq(jobApplications.band, band));
		}

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

		// Get total count for pagination
		const countResult = await db
			.select({ total: count() })
			.from(jobApplications)
			.where(whereClause);

		const total = countResult[0]?.total ?? 0;

		// Get paginated results
		const offset = (page - 1) * limit;
		const results = await db
			.select()
			.from(jobApplications)
			.where(whereClause)
			.orderBy(desc(jobApplications.createdAt))
			.limit(limit)
			.offset(offset);

		// Convert timestamps to ISO strings
		const formattedResults: JobApplicationResponse[] = results.map((job) => ({
			...job,
			createdAt: new Date(job.createdAt).toISOString(),
			updatedAt: new Date(job.updatedAt).toISOString(),
			closingDate: new Date(job.closingDate).toISOString(),
		}));

		const totalPages = Math.ceil(total / limit);

		res.json({
			success: true,
			data: {
				data: formattedResults,
				pagination: {
					page,
					limit,
					total,
					totalPages,
				},
			},
		});
	} catch (error) {
		console.error("Error getting job applications:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}

/**
 * Get a specific job application by ID
 */
export async function getJobApplicationById(
	req: Request<{ id: string }>,
	res: Response<ApiResponse<JobApplicationResponse>>
): Promise<void> {
	try {
		const { id } = req.params;
		const jobId = Number.parseInt(id, 10);

		if (Number.isNaN(jobId)) {
			res.status(400).json({
				success: false,
				error: "Invalid job application ID",
			});
			return;
		}

		const [job] = await db
			.select()
			.from(jobApplications)
			.where(eq(jobApplications.id, jobId))
			.limit(1);

		if (!job) {
			res.status(404).json({
				success: false,
				error: "Job application not found",
			});
			return;
		}

		const formattedJob: JobApplicationResponse = {
			...job,
			createdAt: new Date(job.createdAt).toISOString(),
			updatedAt: new Date(job.updatedAt).toISOString(),
			closingDate: new Date(job.closingDate).toISOString(),
		};

		res.json({
			success: true,
			data: formattedJob,
		});
	} catch (error) {
		console.error("Error getting job application:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}

/**
 * Get active job applications (status = 'active' and closing date in future)
 */
export async function getActiveJobApplications(
	req: Request<Record<string, never>, unknown, unknown, JobApplicationsQuery>,
	res: Response<ApiResponse<PaginatedResponse<JobApplicationResponse>>>
): Promise<void> {
	try {
		const { page = 1, limit = 10, capability, location, band } = req.query;

		// Build where conditions for active jobs
		const conditions = [eq(jobApplications.status, "active")];

		if (capability) {
			conditions.push(like(jobApplications.capability, `%${capability}%`));
		}
		if (location) {
			conditions.push(like(jobApplications.location, `%${location}%`));
		}
		if (band) {
			conditions.push(eq(jobApplications.band, band));
		}

		const whereClause = and(...conditions);

		// Get paginated results
		const offset = (page - 1) * limit;
		const results = await db
			.select()
			.from(jobApplications)
			.where(whereClause)
			.orderBy(desc(jobApplications.createdAt))
			.limit(limit)
			.offset(offset);

		// Filter out jobs that have passed closing date
		const now = new Date();
		const activeJobs = results.filter((job) => new Date(job.closingDate) > now);

		// Convert timestamps to ISO strings
		const formattedResults: JobApplicationResponse[] = activeJobs.map(
			(job) => ({
				...job,
				createdAt: new Date(job.createdAt).toISOString(),
				updatedAt: new Date(job.updatedAt).toISOString(),
				closingDate: new Date(job.closingDate).toISOString(),
			})
		);

		const totalPages = Math.ceil(activeJobs.length / limit);

		res.json({
			success: true,
			data: {
				data: formattedResults,
				pagination: {
					page,
					limit,
					total: activeJobs.length,
					totalPages,
				},
			},
		});
	} catch (error) {
		console.error("Error getting active job applications:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}
