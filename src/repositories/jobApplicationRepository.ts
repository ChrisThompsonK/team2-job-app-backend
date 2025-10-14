import { and, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { jobApplications, jobRoles } from "../db/schema";
import type { JobApplicationResponse } from "../types/jobRole";

export class JobApplicationRepository {
	/**
	 * Get all job applications with optional filtering
	 */
	async getAllApplications(options: {
		status?: string;
		jobRoleId?: number;
		applicantEmail?: string;
	}): Promise<JobApplicationResponse[]> {
		// Build where conditions
		const conditions = [];
		if (options.status) {
			conditions.push(eq(jobApplications.status, options.status));
		}
		if (options.jobRoleId) {
			conditions.push(eq(jobApplications.jobRoleId, options.jobRoleId));
		}
		if (options.applicantEmail) {
			conditions.push(
				eq(jobApplications.applicantEmail, options.applicantEmail)
			);
		}

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

		const results = await db
			.select({
				application: jobApplications,
				jobRole: jobRoles,
			})
			.from(jobApplications)
			.leftJoin(jobRoles, eq(jobApplications.jobRoleId, jobRoles.id))
			.where(whereClause)
			.orderBy(desc(jobApplications.submittedAt));

		return results.map((result) => ({
			id: result.application.id,
			jobRoleId: result.application.jobRoleId,
			applicantName: result.application.applicantName,
			applicantEmail: result.application.applicantEmail,
			coverLetter: result.application.coverLetter || undefined,
			resumeUrl: result.application.resumeUrl || undefined,
			cvFileName: result.application.cvFileName || undefined,
			cvMimeType: result.application.cvMimeType || undefined,
			hasCv: !!result.application.cvData,
			status: result.application.status,
			submittedAt: new Date(result.application.submittedAt).toISOString(),
			updatedAt: new Date(result.application.updatedAt).toISOString(),
			jobRole: result.jobRole
				? {
						id: result.jobRole.id,
						jobRoleName: result.jobRole.jobRoleName,
						description: result.jobRole.description,
						responsibilities: result.jobRole.responsibilities,
						jobSpecLink: result.jobRole.jobSpecLink,
						location: result.jobRole.location,
						capability: result.jobRole.capability,
						band: result.jobRole.band,
						closingDate: new Date(result.jobRole.closingDate).toISOString(),
						status: result.jobRole.status,
						numberOfOpenPositions: result.jobRole.numberOfOpenPositions,
						createdAt: new Date(result.jobRole.createdAt).toISOString(),
						updatedAt: new Date(result.jobRole.updatedAt).toISOString(),
					}
				: undefined,
		}));
	}

	/**
	 * Get a job application by ID
	 */
	async getApplicationById(id: number): Promise<JobApplicationResponse | null> {
		const result = await db
			.select({
				application: jobApplications,
				jobRole: jobRoles,
			})
			.from(jobApplications)
			.leftJoin(jobRoles, eq(jobApplications.jobRoleId, jobRoles.id))
			.where(eq(jobApplications.id, id))
			.limit(1);

		if (!result[0]) return null;

		const { application, jobRole } = result[0];

		return {
			id: application.id,
			jobRoleId: application.jobRoleId,
			applicantName: application.applicantName,
			applicantEmail: application.applicantEmail,
			coverLetter: application.coverLetter || undefined,
			resumeUrl: application.resumeUrl || undefined,
			cvFileName: application.cvFileName || undefined,
			cvMimeType: application.cvMimeType || undefined,
			hasCv: !!application.cvData,
			status: application.status,
			submittedAt: new Date(application.submittedAt).toISOString(),
			updatedAt: new Date(application.updatedAt).toISOString(),
			jobRole: jobRole
				? {
						id: jobRole.id,
						jobRoleName: jobRole.jobRoleName,
						description: jobRole.description,
						responsibilities: jobRole.responsibilities,
						jobSpecLink: jobRole.jobSpecLink,
						location: jobRole.location,
						capability: jobRole.capability,
						band: jobRole.band,
						closingDate: new Date(jobRole.closingDate).toISOString(),
						status: jobRole.status,
						numberOfOpenPositions: jobRole.numberOfOpenPositions,
						createdAt: new Date(jobRole.createdAt).toISOString(),
						updatedAt: new Date(jobRole.updatedAt).toISOString(),
					}
				: undefined,
		};
	}

	/**
	 * Create a new job application
	 */
	async createApplication(applicationData: {
		jobRoleId: number;
		applicantName: string;
		applicantEmail: string;
		coverLetter?: string;
		resumeUrl?: string;
		cvData?: string;
		cvFileName?: string;
		cvMimeType?: string;
	}): Promise<JobApplicationResponse> {
		const now = new Date();

		const result = await db
			.insert(jobApplications)
			.values({
				jobRoleId: applicationData.jobRoleId,
				applicantName: applicationData.applicantName,
				applicantEmail: applicationData.applicantEmail,
				coverLetter: applicationData.coverLetter,
				resumeUrl: applicationData.resumeUrl,
				cvData: applicationData.cvData,
				cvFileName: applicationData.cvFileName,
				cvMimeType: applicationData.cvMimeType,
				status: "in progress",
				submittedAt: now,
				updatedAt: now,
			})
			.returning();

		const application = result[0];
		if (!application) {
			throw new Error("Failed to create application");
		}

		// Return the created application with job role details
		const createdApplication = await this.getApplicationById(application.id);
		if (!createdApplication) {
			throw new Error("Failed to retrieve created application");
		}

		return createdApplication;
	}

	/**
	 * Get CV data for a specific application
	 */
	async getCvData(id: number): Promise<{
		cvData: string;
		cvFileName: string;
		cvMimeType: string;
	} | null> {
		const result = await db
			.select({
				cvData: jobApplications.cvData,
				cvFileName: jobApplications.cvFileName,
				cvMimeType: jobApplications.cvMimeType,
			})
			.from(jobApplications)
			.where(eq(jobApplications.id, id))
			.limit(1);

		if (!result[0] || !result[0].cvData) return null;

		return {
			cvData: result[0].cvData,
			cvFileName: result[0].cvFileName || "cv.pdf",
			cvMimeType: result[0].cvMimeType || "application/pdf",
		};
	}

	/**
	 * Update a job application
	 */
	async updateApplication(
		id: number,
		updates: {
			status?: string;
			coverLetter?: string;
			resumeUrl?: string;
		}
	): Promise<JobApplicationResponse | null> {
		const updateData: Partial<typeof jobApplications.$inferInsert> = {
			updatedAt: new Date(),
		};

		if (updates.status !== undefined) updateData.status = updates.status;
		if (updates.coverLetter !== undefined)
			updateData.coverLetter = updates.coverLetter;
		if (updates.resumeUrl !== undefined)
			updateData.resumeUrl = updates.resumeUrl;

		const result = await db
			.update(jobApplications)
			.set(updateData)
			.where(eq(jobApplications.id, id))
			.returning();

		if (!result[0]) return null;

		return await this.getApplicationById(id);
	}

	/**
	 * Delete a job application
	 */
	async deleteApplication(id: number): Promise<boolean> {
		const result = await db
			.delete(jobApplications)
			.where(eq(jobApplications.id, id))
			.returning();

		return result.length > 0;
	}

	/**
	 * Get applications for a specific job role
	 */
	async getApplicationsByJobRole(
		jobRoleId: number
	): Promise<JobApplicationResponse[]> {
		return this.getAllApplications({ jobRoleId });
	}

	/**
	 * Check if user has already applied for a job role
	 */
	async hasUserApplied(jobRoleId: number, email: string): Promise<boolean> {
		const result = await db
			.select({ id: jobApplications.id })
			.from(jobApplications)
			.where(
				and(
					eq(jobApplications.jobRoleId, jobRoleId),
					eq(jobApplications.applicantEmail, email)
				)
			)
			.limit(1);

		return result.length > 0;
	}
}

// Export a singleton instance
export const jobApplicationRepository = new JobApplicationRepository();
