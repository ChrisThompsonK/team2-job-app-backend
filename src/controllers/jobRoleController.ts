import type { Request, Response } from "express";
import { jobRoleRepository } from "../repositories/jobRoleRepository";
import type {
	ApiResponse,
	CreateJobRoleRequest,
	JobRole,
	JobRoleResponse,
	JobRolesQuery,
	PaginatedJobRolesResponse,
	SearchJobRolesQuery,
	UpdateJobRoleRequest,
} from "../types/jobRole";
import {
	calculatePaginationMetadata,
	validatePaginationParams,
} from "../utils/pagination";

// Constants
const MAX_SEARCH_TERM_LENGTH = 200;

/**
 * Get all job roles with optional filtering and pagination
 */
export async function getAllJobRoles(
	req: Request<Record<string, never>, unknown, unknown, JobRolesQuery>,
	res: Response<ApiResponse<PaginatedJobRolesResponse>>
): Promise<void> {
	try {
		const { status, capability, location, band, page, limit } = req.query;

		// Validate pagination parameters
		const paginationValidation = validatePaginationParams(page, limit);
		if (!paginationValidation.valid) {
			res.status(400).json({
				success: false,
				error: (paginationValidation as { valid: false; error: string }).error,
			});
			return;
		}

		const { params } = paginationValidation;

		// Build filters
		const filters = {
			...(status && { status }),
			...(capability && { capability }),
			...(location && { location }),
			...(band && { band }),
		};

		// Get total count for pagination metadata
		const totalCount = await jobRoleRepository.getJobRolesCount(filters);

		// Get paginated results
		const results = await jobRoleRepository.getAllJobRoles({
			...filters,
			limit: params.limit,
			offset: params.offset,
		});

		// Convert timestamps to ISO strings
		const formattedResults: JobRoleResponse[] = results.map((job: JobRole) => ({
			...job,
			createdAt: new Date(job.createdAt).toISOString(),
			updatedAt: new Date(job.updatedAt).toISOString(),
			closingDate: new Date(job.closingDate).toISOString(),
		}));

		// Calculate pagination metadata
		const pagination = calculatePaginationMetadata(
			totalCount,
			params.page,
			params.limit
		);

		res.json({
			success: true,
			data: {
				jobRoles: formattedResults,
				pagination,
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
		const activeJobs = results.filter(
			(job: JobRole) => new Date(job.closingDate) > now
		);

		// Convert timestamps to ISO strings
		const formattedResults: JobRoleResponse[] = activeJobs.map(
			(job: JobRole) => ({
				...job,
				createdAt: new Date(job.createdAt).toISOString(),
				updatedAt: new Date(job.updatedAt).toISOString(),
				closingDate: new Date(job.closingDate).toISOString(),
			})
		);
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

/**
 * Delete a job role
 */
export async function deleteJobRole(
	req: Request<{ id: string }>,
	res: Response<ApiResponse<{ id: number }>>
): Promise<void> {
	try {
		const { id } = req.params;
		const jobId = Number.parseInt(id, 10);

		if (Number.isNaN(jobId) || jobId <= 0) {
			res.status(400).json({
				success: false,
				message: "Invalid job role ID provided",
			});
			return;
		}

		const existingJob = await jobRoleRepository.getJobRoleById(jobId);
		if (!existingJob) {
			res.status(404).json({
				success: false,
				message: "Job role not found",
			});
			return;
		}

		const deleted = await jobRoleRepository.deleteJobRole(jobId);
		if (!deleted) {
			res.status(500).json({
				success: false,
				message: "An error occurred while deleting the job role",
			});
			return;
		}

		res.status(200).json({
			success: true,
			message: "Job role deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting job role:", error);
		res.status(500).json({
			success: false,
			message: "An error occurred while deleting the job role",
		});
	}
}

/**
 * Search job roles with optional filters and pagination
 */
export async function searchJobRoles(
	req: Request<Record<string, never>, unknown, unknown, SearchJobRolesQuery>,
	res: Response<ApiResponse<PaginatedJobRolesResponse>>
): Promise<void> {
	try {
		const { search, capability, location, band, status, page, limit } =
			req.query;

		// Validate search parameter length
		if (search && search.trim().length > MAX_SEARCH_TERM_LENGTH) {
			res.status(400).json({
				success: false,
				error: `Search term must be ${MAX_SEARCH_TERM_LENGTH} characters or less`,
			});
			return;
		}

		// Validate pagination parameters
		const paginationValidation = validatePaginationParams(page, limit);
		if (!paginationValidation.valid) {
			res.status(400).json({
				success: false,
				error: (paginationValidation as { valid: false; error: string }).error,
			});
			return;
		}

		const { params } = paginationValidation;

		// Build search filters
		const searchFilters = {
			...(search?.trim() && { search: search.trim() }),
			...(capability && { capability }),
			...(location && { location }),
			...(band && { band }),
			...(status && { status }),
		};

		// Get total count for pagination metadata
		const totalCount =
			await jobRoleRepository.getSearchJobRolesCount(searchFilters);

		// Get paginated results
		const results = await jobRoleRepository.searchJobRoles({
			...searchFilters,
			limit: params.limit,
			offset: params.offset,
		});

		// Convert timestamps to ISO strings
		const formattedResults: JobRoleResponse[] = results.map((job: JobRole) => ({
			...job,
			createdAt: new Date(job.createdAt).toISOString(),
			updatedAt: new Date(job.updatedAt).toISOString(),
			closingDate: new Date(job.closingDate).toISOString(),
		}));

		// Calculate pagination metadata
		const pagination = calculatePaginationMetadata(
			totalCount,
			params.page,
			params.limit
		);

		res.json({
			success: true,
			data: {
				jobRoles: formattedResults,
				pagination,
			},
		});
	} catch (error) {
		console.error("Error searching job roles:", error);
		res.status(500).json({
			success: false,
			error: "An error occurred while searching job roles.",
		});
	}
}

/**
 * Get distinct capabilities from job roles
 */
export async function getCapabilities(
	_req: Request,
	res: Response<ApiResponse<string[]>>
): Promise<void> {
	try {
		const capabilities = await jobRoleRepository.getDistinctCapabilities();

		res.json({
			success: true,
			data: capabilities,
		});
	} catch (error) {
		console.error("Error getting capabilities:", error);
		res.status(500).json({
			success: false,
			error: "An error occurred while retrieving capabilities.",
		});
	}
}

/**
 * Get distinct locations from job roles
 */
export async function getLocations(
	_req: Request,
	res: Response<ApiResponse<string[]>>
): Promise<void> {
	try {
		const locations = await jobRoleRepository.getDistinctLocations();

		res.json({
			success: true,
			data: locations,
		});
	} catch (error) {
		console.error("Error getting locations:", error);
		res.status(500).json({
			success: false,
			error: "An error occurred while retrieving locations.",
		});
	}
}

/**
 * Get distinct bands from job roles
 */
export async function getBands(
	_req: Request,
	res: Response<ApiResponse<string[]>>
): Promise<void> {
	try {
		const bands = await jobRoleRepository.getDistinctBands();

		res.json({
			success: true,
			data: bands,
		});
	} catch (error) {
		console.error("Error getting bands:", error);
		res.status(500).json({
			success: false,
			error: "An error occurred while retrieving bands.",
		});
	}
}
