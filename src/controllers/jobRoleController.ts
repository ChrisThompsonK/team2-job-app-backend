import type { Request, Response } from "express";
import { jobRoleRepository } from "../repositories/jobRoleRepository";
import type {
	ApiResponse,
	JobRoleResponse,
	JobRolesQuery,
} from "../types/jobRole";

/**
 * Get all job roles with optional filtering
 */
export async function getAllJobRoles(
	req: Request<Record<string, never>, unknown, unknown, JobRolesQuery>,
	res: Response<ApiResponse<JobRoleResponse[]>>
): Promise<void> {
	try {
		const { status, capability, location, band } = req.query;

		// Build filters
		const filters = {
			...(status && { status }),
			...(capability && { capability }),
			...(location && { location }),
			...(band && { band }),
		};

		// Get all results
		const results = await jobRoleRepository.getAllJobRoles(filters);

		// Convert timestamps to ISO strings
		const formattedResults: JobRoleResponse[] = results.map((job) => ({
			...job,
			createdAt: new Date(job.createdAt).toISOString(),
			updatedAt: new Date(job.updatedAt).toISOString(),
			closingDate: new Date(job.closingDate).toISOString(),
		}));

		res.json({
			success: true,
			data: formattedResults,
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

		const job = await jobRoleRepository.getJobRoleById(jobId);

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
	res: Response<ApiResponse<JobRoleResponse[]>>
): Promise<void> {
	try {
		const { capability, location, band } = req.query;

		// Build filters for active jobs
		const filters = {
			...(capability && { capability }),
			...(location && { location }),
			...(band && { band }),
		};

		// Get all active results
		const results = await jobRoleRepository.getActiveJobRoles(filters);

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
		res.json({
			success: true,
			data: formattedResults,
		});
	} catch (error) {
		console.error("Error getting active job applications:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}
