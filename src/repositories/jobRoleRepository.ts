import { and, count, desc, eq, sql } from "drizzle-orm";
import { db } from "../db";
import { jobRoles } from "../db/schema";
import type { JobRole } from "../types/jobRole";

export class JobRoleRepository {
	/**
	 * Helper method to build where conditions for filtering
	 */
	private buildWhereConditions(options: {
		status?: string;
		capability?: string;
		band?: string;
		location?: string;
	}) {
		const conditions = [];

		// Handle status case-insensitively
		if (options.status) {
			conditions.push(
				sql`lower(${jobRoles.status}) = lower(${options.status})`
			);
		}

		const filterMap = {
			capability: jobRoles.capability,
			band: jobRoles.band,
			location: jobRoles.location,
		} as const;

		for (const [key, column] of Object.entries(filterMap)) {
			const value = options[key as keyof typeof options];
			if (value) {
				conditions.push(eq(column, value));
			}
		}

		return conditions.length > 0 ? and(...conditions) : undefined;
	}

	/**
	 * Helper method to build where conditions for search with filters
	 */
	private buildSearchWhereConditions(options: {
		search?: string;
		capability?: string;
		band?: string;
		location?: string;
		status?: string;
	}) {
		const conditions = [];

		// Add case-insensitive search on jobRoleName
		if (options.search?.trim()) {
			conditions.push(
				sql`lower(${jobRoles.jobRoleName}) LIKE lower(${`%${options.search.trim()}%`})`
			);
		}

		// Handle status case-insensitively
		if (options.status) {
			conditions.push(
				sql`lower(${jobRoles.status}) = lower(${options.status})`
			);
		}

		// Add exact match filters
		const filterMap = {
			capability: jobRoles.capability,
			band: jobRoles.band,
			location: jobRoles.location,
		} as const;

		for (const [key, column] of Object.entries(filterMap)) {
			const value = options[key as keyof typeof options];
			if (value) {
				conditions.push(eq(column, value));
			}
		}

		return conditions.length > 0 ? and(...conditions) : undefined;
	}

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
		const whereClause = this.buildWhereConditions(options);

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
		const whereClause = this.buildWhereConditions(options);

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

	/**
	 * Search job roles with optional filters and pagination
	 */
	async searchJobRoles(options: {
		search?: string;
		capability?: string;
		band?: string;
		location?: string;
		status?: string;
		limit?: number;
		offset?: number;
	}): Promise<JobRole[]> {
		const whereClause = this.buildSearchWhereConditions(options);

		// Build query with optional pagination, ordered by closing date ascending
		const baseQuery = db
			.select()
			.from(jobRoles)
			.where(whereClause)
			.orderBy(jobRoles.closingDate);

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
	 * Get total count of job roles matching search criteria
	 */
	async getSearchJobRolesCount(options: {
		search?: string;
		capability?: string;
		band?: string;
		location?: string;
		status?: string;
	}): Promise<number> {
		const whereClause = this.buildSearchWhereConditions(options);

		const result = await db
			.select({ count: count() })
			.from(jobRoles)
			.where(whereClause);

		return result[0]?.count || 0;
	}

	/**
	 * Get distinct capabilities from job roles
	 */
	async getDistinctCapabilities(): Promise<string[]> {
		const result = await db
			.selectDistinct({ capability: jobRoles.capability })
			.from(jobRoles)
			.orderBy(jobRoles.capability);

		return result.map((row) => row.capability).filter((cap) => cap !== null);
	}

	/**
	 * Get distinct locations from job roles
	 */
	async getDistinctLocations(): Promise<string[]> {
		const result = await db
			.selectDistinct({ location: jobRoles.location })
			.from(jobRoles)
			.orderBy(jobRoles.location);

		return result.map((row) => row.location).filter((loc) => loc !== null);
	}

	/**
	 * Get distinct bands from job roles
	 */
	async getDistinctBands(): Promise<string[]> {
		const result = await db
			.selectDistinct({ band: jobRoles.band })
			.from(jobRoles)
			.orderBy(jobRoles.band);

		return result.map((row) => row.band).filter((band) => band !== null);
	}
}

// Export a singleton instance
export const jobRoleRepository = new JobRoleRepository();
