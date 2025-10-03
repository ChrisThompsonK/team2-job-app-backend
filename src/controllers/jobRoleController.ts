import { and, count, desc, eq, like } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../db/index";
import { jobRoles } from "../db/schema";
import type {
	ApiResponse,
	JobRoleResponse,
	JobRolesQuery,
	PaginatedResponse,
} from "../types/jobRole";

/**
 * Get all job roles with optional filtering and pagination
 */
export async function getAllJobRoles(
	req: Request<Record<string, never>, unknown, unknown, JobRolesQuery>,
	res: Response<ApiResponse<PaginatedResponse<JobRoleResponse>>>
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
			conditions.push(eq(jobRoles.status, status));
		}
		if (capability) {
			conditions.push(like(jobRoles.capability, `%${capability}%`));
		}
		if (location) {
			conditions.push(like(jobRoles.location, `%${location}%`));
		}
		if (band) {
			conditions.push(eq(jobRoles.band, band));
		}

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

		// Get total count for pagination
		const countResult = await db
			.select({ total: count() })
			.from(jobRoles)
			.where(whereClause);

		const total = countResult[0]?.total ?? 0;

		// Get paginated results
		const offset = (page - 1) * limit;
		const results = await db
			.select()
			.from(jobRoles)
			.where(whereClause)
			.orderBy(desc(jobRoles.createdAt))
			.limit(limit)
			.offset(offset);

		// Convert timestamps to ISO strings
		const formattedResults: JobRoleResponse[] = results.map((job) => ({
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
		console.error("Error getting job roles:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}

/**
 * Get a specific job role by ID
 */
export async function getJobRoleById(
	req: Request<{ id: string }>,
	res: Response<ApiResponse<JobRoleResponse>>
): Promise<void> {
	try {
		const { id } = req.params;
		const jobId = Number.parseInt(id, 10);

		if (Number.isNaN(jobId)) {
			res.status(400).json({
				success: false,
				error: "Invalid job role ID",
			});
			return;
		}

		const [job] = await db
			.select()
			.from(jobRoles)
			.where(eq(jobRoles.id, jobId))
			.limit(1);

		if (!job) {
			res.status(404).json({
				success: false,
				error: "Job role not found",
			});
			return;
		}

		const formattedJob: JobRoleResponse = {
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
		console.error("Error getting job role:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}

/**
 * Get active job roles (status = 'active' and closing date in future)
 */
export async function getActiveJobRoles(
	req: Request<Record<string, never>, unknown, unknown, JobRolesQuery>,
	res: Response<ApiResponse<PaginatedResponse<JobRoleResponse>>>
): Promise<void> {
	try {
		const { page = 1, limit = 10, capability, location, band } = req.query;

		// Build where conditions for active jobs
		const conditions = [eq(jobRoles.status, "active")];

		if (capability) {
			conditions.push(like(jobRoles.capability, `%${capability}%`));
		}
		if (location) {
			conditions.push(like(jobRoles.location, `%${location}%`));
		}
		if (band) {
			conditions.push(eq(jobRoles.band, band));
		}

		const whereClause = and(...conditions);

		// Get paginated results
		const offset = (page - 1) * limit;
		const results = await db
			.select()
			.from(jobRoles)
			.where(whereClause)
			.orderBy(desc(jobRoles.createdAt))
			.limit(limit)
			.offset(offset);

		// Filter out jobs that have passed closing date
		const now = new Date();
		const activeJobs = results.filter((job) => new Date(job.closingDate) > now);

		// Convert timestamps to ISO strings
		const formattedResults: JobRoleResponse[] = activeJobs.map((job) => ({
			...job,
			createdAt: new Date(job.createdAt).toISOString(),
			updatedAt: new Date(job.updatedAt).toISOString(),
			closingDate: new Date(job.closingDate).toISOString(),
		}));

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
