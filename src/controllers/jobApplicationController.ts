import type { Request, Response } from "express";
import { jobApplicationRepository } from "../repositories/jobApplicationRepository";
import { jobRoleRepository } from "../repositories/jobRoleRepository";
import type {
	ApiResponse,
	ApplicationsQuery,
	CreateApplicationRequest,
	JobApplicationResponse,
	UpdateApplicationRequest,
} from "../types/jobRole";

/**
 * Get all job applications with optional filtering
 */
export async function getAllApplications(
	req: Request<Record<string, never>, unknown, unknown, ApplicationsQuery>,
	res: Response<ApiResponse<JobApplicationResponse[]>>
): Promise<void> {
	try {
		const { status, jobRoleId, applicantEmail } = req.query;

		// Build filters
		const filters = {
			...(status && { status }),
			...(jobRoleId && { jobRoleId: Number(jobRoleId) }),
			...(applicantEmail && { applicantEmail }),
		};

		// Get all results
		const results = await jobApplicationRepository.getAllApplications(filters);

		res.json({
			success: true,
			data: results,
		});
	} catch (error) {
		console.error("Error getting applications:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}

/**
 * Get a specific job application by ID
 */
export async function getApplicationById(
	req: Request<{ id: string }>,
	res: Response<ApiResponse<JobApplicationResponse>>
): Promise<void> {
	try {
		const { id } = req.params;
		const applicationId = Number.parseInt(id, 10);

		if (Number.isNaN(applicationId)) {
			res.status(400).json({
				success: false,
				error: "Invalid application ID",
			});
			return;
		}

		const application =
			await jobApplicationRepository.getApplicationById(applicationId);

		if (!application) {
			res.status(404).json({
				success: false,
				error: "Application not found",
			});
			return;
		}

		res.json({
			success: true,
			data: application,
		});
	} catch (error) {
		console.error("Error getting application:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}

/**
 * Create a new job application
 */
export async function createApplication(
	req: Request<Record<string, never>, unknown, CreateApplicationRequest>,
	res: Response<ApiResponse<JobApplicationResponse>>
): Promise<void> {
	try {
		const { jobRoleId, applicantName, applicantEmail, coverLetter, resumeUrl } =
			req.body;

		// Get CV file if uploaded
		const cvFile = (req as Express.Request & { file?: Express.Multer.File })
			.file;

		// Validate required fields
		if (!jobRoleId || !applicantName || !applicantEmail) {
			res.status(400).json({
				success: false,
				error: "Job role ID, applicant name, and email are required",
			});
			return;
		}

		// Validate CV file is provided
		if (!cvFile) {
			res.status(400).json({
				success: false,
				error: "CV file is required",
			});
			return;
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(applicantEmail)) {
			res.status(400).json({
				success: false,
				error: "Invalid email format",
			});
			return;
		}

		// Check if job role exists
		const jobRole = await jobRoleRepository.getJobRoleById(jobRoleId);
		if (!jobRole) {
			res.status(404).json({
				success: false,
				error: "Job role not found",
			});
			return;
		}

		// Check if job role is eligible (accept both 'active' and legacy 'open')
		const eligibleStatuses = ["active", "open"];
		if (!eligibleStatuses.includes((jobRole.status || "").toLowerCase())) {
			res.status(400).json({
				success: false,
				error: "This job role is not currently accepting applications",
			});
			return;
		}

		if (jobRole.numberOfOpenPositions <= 0) {
			res.status(400).json({
				success: false,
				error: "There are no open positions available for this job role",
			});
			return;
		}

		// Check if closing date has passed
		const now = new Date();
		if (new Date(jobRole.closingDate) < now) {
			res.status(400).json({
				success: false,
				error: "The application deadline for this job role has passed",
			});
			return;
		}

		// Check if user has already applied
		const hasApplied = await jobApplicationRepository.hasUserApplied(
			jobRoleId,
			applicantEmail
		);
		if (hasApplied) {
			res.status(409).json({
				success: false,
				error: "You have already applied for this job role",
			});
			return;
		}

		// Convert CV buffer to base64 string for storage
		const cvBase64 = cvFile.buffer.toString("base64");

		// Create the application
		const applicationData: {
			jobRoleId: number;
			applicantName: string;
			applicantEmail: string;
			coverLetter?: string;
			resumeUrl?: string;
			cvData: string;
			cvFileName: string;
			cvMimeType: string;
		} = {
			jobRoleId,
			applicantName,
			applicantEmail,
			cvData: cvBase64,
			cvFileName: cvFile.originalname,
			cvMimeType: cvFile.mimetype,
		};

		if (coverLetter) {
			applicationData.coverLetter = coverLetter;
		}
		if (resumeUrl) {
			applicationData.resumeUrl = resumeUrl;
		}

		const application =
			await jobApplicationRepository.createApplication(applicationData);

		res.status(201).json({
			success: true,
			data: application,
			message: "Application submitted successfully",
		});
	} catch (error) {
		console.error("Error creating application:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}

/**
 * Update an existing job application
 */
export async function updateApplication(
	req: Request<{ id: string }, unknown, UpdateApplicationRequest>,
	res: Response<ApiResponse<JobApplicationResponse>>
): Promise<void> {
	try {
		const { id } = req.params;
		const applicationId = Number.parseInt(id, 10);

		if (Number.isNaN(applicationId)) {
			res.status(400).json({
				success: false,
				error: "Invalid application ID",
			});
			return;
		}

		const updates = req.body;

		// Validate status if provided
		if (updates.status) {
			const validStatuses = [
				"in progress",
				"pending",
				"under_review",
				"shortlisted",
				"rejected",
				"hired",
			];
			if (!validStatuses.includes(updates.status)) {
				res.status(400).json({
					success: false,
					error: "Invalid application status",
				});
				return;
			}
		}

		const updatedApplication = await jobApplicationRepository.updateApplication(
			applicationId,
			updates
		);

		if (!updatedApplication) {
			res.status(404).json({
				success: false,
				error: "Application not found",
			});
			return;
		}

		res.json({
			success: true,
			data: updatedApplication,
			message: "Application updated successfully",
		});
	} catch (error) {
		console.error("Error updating application:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}

/**
 * Delete a job application
 */
export async function deleteApplication(
	req: Request<{ id: string }>,
	res: Response<ApiResponse<void>>
): Promise<void> {
	try {
		const { id } = req.params;
		const applicationId = Number.parseInt(id, 10);

		if (Number.isNaN(applicationId)) {
			res.status(400).json({
				success: false,
				error: "Invalid application ID",
			});
			return;
		}

		const deleted =
			await jobApplicationRepository.deleteApplication(applicationId);

		if (!deleted) {
			res.status(404).json({
				success: false,
				error: "Application not found",
			});
			return;
		}

		res.json({
			success: true,
			message: "Application deleted successfully",
		});
	} catch (error) {
		console.error("Error deleting application:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}

/**
 * Get applications for a specific job role
 */
export async function getApplicationsByJobRole(
	req: Request<{ jobRoleId: string }>,
	res: Response<ApiResponse<JobApplicationResponse[]>>
): Promise<void> {
	try {
		const { jobRoleId } = req.params;
		const jobId = Number.parseInt(jobRoleId, 10);

		if (Number.isNaN(jobId)) {
			res.status(400).json({
				success: false,
				error: "Invalid job role ID",
			});
			return;
		}

		// Check if job role exists
		const jobRole = await jobRoleRepository.getJobRoleById(jobId);
		if (!jobRole) {
			res.status(404).json({
				success: false,
				error: "Job role not found",
			});
			return;
		}

		const applications =
			await jobApplicationRepository.getApplicationsByJobRole(jobId);

		res.json({
			success: true,
			data: applications,
		});
	} catch (error) {
		console.error("Error getting applications for job role:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}

/**
 * Download CV for a specific application
 */
export async function downloadCv(
	req: Request<{ id: string }>,
	res: Response
): Promise<void> {
	try {
		const { id } = req.params;
		const applicationId = Number.parseInt(id, 10);

		if (Number.isNaN(applicationId)) {
			res.status(400).json({
				success: false,
				error: "Invalid application ID",
			});
			return;
		}

		// Get CV data from repository
		const cvData = await jobApplicationRepository.getCvData(applicationId);

		if (!cvData) {
			res.status(404).json({
				success: false,
				error: "CV not found for this application",
			});
			return;
		}

		// Convert base64 back to buffer
		const cvBuffer = Buffer.from(cvData.cvData, "base64");

		// Set appropriate headers for file download
		res.setHeader("Content-Type", cvData.cvMimeType);
		res.setHeader(
			"Content-Disposition",
			`attachment; filename="${cvData.cvFileName}"`
		);
		res.setHeader("Content-Length", cvBuffer.length);

		// Send the file
		res.send(cvBuffer);
	} catch (error) {
		console.error("Error downloading CV:", error);
		res.status(500).json({
			success: false,
			error: "Internal server error",
		});
	}
}
