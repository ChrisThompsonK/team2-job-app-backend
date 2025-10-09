import type { Request, Response } from "express";
import { jobRoleRepository } from "../repositories/jobRoleRepository";
import type {
	ApiResponse,
	CreateJobRoleRequest,
	JobRoleResponse,
	JobRolesQuery,
	UpdateJobRoleRequest,
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

/**
 * Create a new job role
 */
export async function createJobRole(
	req: Request<Record<string, never>, unknown, CreateJobRoleRequest>,
	res: Response<ApiResponse<JobRoleResponse>>
): Promise<void> {
	try {
		const requestData = req.body;

		// Convert ISO date string to Date object
		const closingDateObj = new Date(requestData.closingDate);

		// Create the job role
		const newJobRole = await jobRoleRepository.createJobRole({
			jobRoleName: requestData.jobRoleName,
			description: requestData.description,
			responsibilities: requestData.responsibilities,
			jobSpecLink: requestData.jobSpecLink,
			location: requestData.location,
			capability: requestData.capability,
			band: requestData.band,
			closingDate: closingDateObj,
			status: "active",
			numberOfOpenPositions: requestData.numberOfOpenPositions ?? 1,
		});

		// Format response
		const formattedJobRole: JobRoleResponse = {
			...newJobRole,
			createdAt: new Date(newJobRole.createdAt).toISOString(),
			updatedAt: new Date(newJobRole.updatedAt).toISOString(),
			closingDate: new Date(newJobRole.closingDate).toISOString(),
		};

		res.status(201).json({
			success: true,
			data: formattedJobRole,
			message: "Job role created successfully",
		});
	} catch (error) {
		console.error("Error creating job role:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}

/**
 * Update an existing job role
 */
export async function updateJobRole(
	req: Request<{ id: string }, unknown, UpdateJobRoleRequest>,
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

		const requestData = req.body;

		// Build update data
		const updateData: Partial<
			Omit<
				JobRoleResponse,
				"id" | "createdAt" | "updatedAt" | "closingDate"
			> & { closingDate: Date }
		> = {};

		if (requestData.jobRoleName)
			updateData.jobRoleName = requestData.jobRoleName;
		if (requestData.description)
			updateData.description = requestData.description;
		if (requestData.responsibilities)
			updateData.responsibilities = requestData.responsibilities;
		if (requestData.jobSpecLink)
			updateData.jobSpecLink = requestData.jobSpecLink;
		if (requestData.location) updateData.location = requestData.location;
		if (requestData.capability) updateData.capability = requestData.capability;
		if (requestData.band) updateData.band = requestData.band;
		if (requestData.status) updateData.status = requestData.status;
		if (requestData.numberOfOpenPositions !== undefined)
			updateData.numberOfOpenPositions = requestData.numberOfOpenPositions;
		if (requestData.closingDate)
			updateData.closingDate = new Date(requestData.closingDate);

		const updatedJobRole = await jobRoleRepository.updateJobRole(
			jobId,
			updateData
		);

		if (!updatedJobRole) {
			res.status(404).json({
				success: false,
				error: "Job role not found",
			});
			return;
		}

		// Format response
		const formattedJobRole: JobRoleResponse = {
			...updatedJobRole,
			createdAt: new Date(updatedJobRole.createdAt).toISOString(),
			updatedAt: new Date(updatedJobRole.updatedAt).toISOString(),
			closingDate: new Date(updatedJobRole.closingDate).toISOString(),
		};

		res.json({
			success: true,
			data: formattedJobRole,
			message: "Job role updated successfully",
		});
	} catch (error) {
		console.error("Error updating job role:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}
