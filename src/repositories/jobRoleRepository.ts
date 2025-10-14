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

		// Build query with optional pagination
		const baseQuery = db
			.select()
			.from(jobRoles)
			.where(whereClause)
			.orderBy(desc(jobRoles.createdAt));

		// Apply pagination if both limit and offset are provided
		if (options.limit !== undefined && options.offset !== undefined) {
			return await baseQuery.limit(options.limit).offset(options.offset);
		}
		// Apply only limit if provided
		if (options.limit !== undefined) {
			return await baseQuery.limit(options.limit);
		}

		return await baseQuery;
	}

	/**
	 * Get total count of job roles with optional filtering
	 */
	async getJobRolesCount(options: {
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

		const result = await db
			.select({ count: count() })
			.from(jobRoles)
			.where(whereClause);

		return result[0]?.count || 0;
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
	}): Promise<JobRole[]> {
		return this.getAllJobRoles({
			...options,
			status: "active",
		});
	}

	/**
	 * Create a new job role
	 */
	async createJobRole(
		data: Omit<JobRole, "id" | "createdAt" | "updatedAt">
	): Promise<JobRole> {
		const now = new Date();
		const result = await db
			.insert(jobRoles)
			.values({
				...data,
				createdAt: now,
				updatedAt: now,
			})
			.returning();

		if (!result[0]) {
			throw new Error("Failed to create job role");
		}

		return result[0];
	}

	/**
	 * Update an existing job role
	 */
	async updateJobRole(
		id: number,
		data: Partial<Omit<JobRole, "id" | "createdAt" | "updatedAt">>
	): Promise<JobRole | null> {
		const now = new Date();
		const result = await db
			.update(jobRoles)
			.set({
				...data,
				updatedAt: now,
			})
			.where(eq(jobRoles.id, id))
			.returning();

		return result[0] || null;
	}

	/**
	 * Delete a job role
	 */
	async deleteJobRole(id: number): Promise<boolean> {
		const result = await db
			.delete(jobRoles)
			.where(eq(jobRoles.id, id))
			.returning();

		return result.length > 0;
	}
}

// Export a singleton instance
export const jobRoleRepository = new JobRoleRepository();
