import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { jobRoles } from "../db/schema";
import type { JobRole } from "../types/jobRole";

export class JobRoleRepository {
	/**
	 * Get all job roles with optional filtering and pagination
	 */
	async getAllJobRoles(options: {
		status?: string;
		capability?: string;
		band?: string;
		location?: string;
		limit?: number;
		offset?: number;
	}): Promise<JobRole[]> {
		// Build where conditions
		const conditions = [];
		if (options.status) {
			conditions.push(eq(jobRoles.status, options.status));
		}
		if (options.capability) {
			conditions.push(eq(jobRoles.capability, options.capability));
		}
		if (options.band) {
			conditions.push(eq(jobRoles.band, options.band));
		}
		if (options.location) {
			conditions.push(eq(jobRoles.location, options.location));
		}

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

		const query = db
			.select()
			.from(jobRoles)
			.where(whereClause)
			.orderBy(desc(jobRoles.createdAt))
			.limit(options.limit || 100)
			.offset(options.offset || 0);

		return await query;
	}

	/**
	 * Get total count of job roles matching the filters
	 */
	async getJobRoleCount(options: {
		status?: string;
		capability?: string;
		band?: string;
		location?: string;
	}): Promise<number> {
		// Build where conditions
		const conditions = [];
		if (options.status) {
			conditions.push(eq(jobRoles.status, options.status));
		}
		if (options.capability) {
			conditions.push(eq(jobRoles.capability, options.capability));
		}
		if (options.band) {
			conditions.push(eq(jobRoles.band, options.band));
		}
		if (options.location) {
			conditions.push(eq(jobRoles.location, options.location));
		}

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

		const countResult = await db
			.select({ total: count() })
			.from(jobRoles)
			.where(whereClause);

		return countResult[0]?.total || 0;
	}

	/**
	 * Get a job role by ID
	 */
	async getJobRoleById(id: number): Promise<JobRole | null> {
		const result = await db
			.select()
			.from(jobRoles)
			.where(eq(jobRoles.id, id))
			.limit(1);

		return result[0] || null;
	}

	/**
	 * Get only active job roles
	 */
	async getActiveJobRoles(options: {
		capability?: string;
		band?: string;
		location?: string;
		limit?: number;
		offset?: number;
	}): Promise<JobRole[]> {
		return this.getAllJobRoles({
			...options,
			status: "active",
		});
	}

	/**
	 * Get count of active job roles
	 */
	async getActiveJobRoleCount(options: {
		capability?: string;
		band?: string;
		location?: string;
	}): Promise<number> {
		return this.getJobRoleCount({
			...options,
			status: "active",
		});
	}
}

// Export a singleton instance
export const jobRoleRepository = new JobRoleRepository();
