import { and, count, desc, eq, like } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../db/index";
import { jobApplications } from "../db/schema";
import type {
	ApiResponse,
	CreateJobApplicationRequest,
	JobApplicationResponse,
	JobApplicationsQuery,
	PaginatedResponse,
	UpdateJobApplicationRequest,
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
 * Create a new job application
 */
export async function createJobApplication(
	req: Request<Record<string, never>, unknown, CreateJobApplicationRequest>,
	res: Response<ApiResponse<JobApplicationResponse>>
): Promise<void> {
	try {
		const {
			jobRoleName,
			description,
			responsibilities,
			jobSpecLink,
			location,
			capability,
			band,
			closingDate,
			numberOfOpenPositions = 1,
		} = req.body;

		// Validate required fields
		if (
			!jobRoleName ||
			!description ||
			!responsibilities ||
			!jobSpecLink ||
			!location ||
			!capability ||
			!band ||
			!closingDate
		) {
			res.status(400).json({
				success: false,
				error: "All required fields must be provided",
			});
			return;
		}

		// Validate closing date
		const closingDateTime = new Date(closingDate);
		if (Number.isNaN(closingDateTime.getTime())) {
			res.status(400).json({
				success: false,
				error: "Invalid closing date format",
			});
			return;
		}

		const now = new Date();
		const [newJob] = await db
			.insert(jobApplications)
			.values({
				jobRoleName,
				description,
				responsibilities,
				jobSpecLink,
				location,
				capability,
				band,
				closingDate: closingDateTime,
				numberOfOpenPositions,
				createdAt: now,
				updatedAt: now,
			})
			.returning();

		if (!newJob) {
			res.status(500).json({
				success: false,
				error: "Failed to create job application",
			});
			return;
		}

		const formattedJob: JobApplicationResponse = {
			...newJob,
			createdAt: new Date(newJob.createdAt).toISOString(),
			updatedAt: new Date(newJob.updatedAt).toISOString(),
			closingDate: new Date(newJob.closingDate).toISOString(),
		};

		res.status(201).json({
			success: true,
			data: formattedJob,
			message: "Job application created successfully",
		});
	} catch (error) {
		console.error("Error creating job application:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}

/**
 * Update a job application
 */
export async function updateJobApplication(
	req: Request<{ id: string }, unknown, UpdateJobApplicationRequest>,
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

		const updateData: Record<string, unknown> = {
			updatedAt: new Date(),
		};

		// Add provided fields to update data
		for (const [key, value] of Object.entries(req.body)) {
			if (value !== undefined) {
				if (key === "closingDate") {
					const date = new Date(value as string);
					if (Number.isNaN(date.getTime())) {
						res.status(400).json({
							success: false,
							error: "Invalid closing date format",
						});
						return;
					}
					updateData[key] = date;
				} else {
					updateData[key] = value;
				}
			}
		}

		const [updatedJob] = await db
			.update(jobApplications)
			.set(updateData)
			.where(eq(jobApplications.id, jobId))
			.returning();

		if (!updatedJob) {
			res.status(404).json({
				success: false,
				error: "Job application not found",
			});
			return;
		}

		const formattedJob: JobApplicationResponse = {
			...updatedJob,
			createdAt: new Date(updatedJob.createdAt).toISOString(),
			updatedAt: new Date(updatedJob.updatedAt).toISOString(),
			closingDate: new Date(updatedJob.closingDate).toISOString(),
		};

		res.json({
			success: true,
			data: formattedJob,
			message: "Job application updated successfully",
		});
	} catch (error) {
		console.error("Error updating job application:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}

/**
 * Delete a job application
 */
export async function deleteJobApplication(
	req: Request<{ id: string }>,
	res: Response<ApiResponse<null>>
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

		const [deletedJob] = await db
			.delete(jobApplications)
			.where(eq(jobApplications.id, jobId))
			.returning();

		if (!deletedJob) {
			res.status(404).json({
				success: false,
				error: "Job application not found",
			});
			return;
		}

		res.json({
			success: true,
			message: "Job application deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting job application:", error);
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
