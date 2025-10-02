import { and, eq, like, sql } from "drizzle-orm";
import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { jobs } from "../db/schema.js";
import { logger, sendResponse } from "../middleware/index.js";
import type { DbJob, Job, PaginationMeta } from "../types/api.js";

/**
 * Transform database job to API job format
 */
const transformDbJobToJob = (dbJob: DbJob): Job => {
	return {
		id: dbJob.id,
		title: dbJob.title,
		company: dbJob.company,
		location: dbJob.location,
		description: dbJob.description,
		requirements: dbJob.requirements ? JSON.parse(dbJob.requirements) : null,
		type: dbJob.type,
		remote: dbJob.remote,
		datePosted: dbJob.datePosted,
		applicationUrl: dbJob.applicationUrl,
		status: dbJob.status,
		createdAt: dbJob.createdAt,
		updatedAt: dbJob.updatedAt,
	};
};

/**
 * Get all jobs with filtering and pagination
 * GET /jobs
 */
export const getAllJobs = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const query = req.query as {
			page?: string;
			limit?: string;
			type?: "full-time" | "part-time" | "contract" | "internship";
			location?: string;
			remote?: string;
			company?: string;
		};

		// Transform and set defaults like the validation schema does
		const page = query.page ? parseInt(query.page, 10) : 1;
		const limit = query.limit ? parseInt(query.limit, 10) : 10;
		const { type, location, company } = query;
		const remote = query.remote === "true";

		// Build where conditions
		const conditions = [];

		if (type) {
			conditions.push(eq(jobs.type, type));
		}

		if (location) {
			conditions.push(like(jobs.location, `%${location}%`));
		}

		if (query.remote !== undefined) {
			conditions.push(eq(jobs.remote, remote));
		}

		if (company) {
			conditions.push(like(jobs.company, `%${company}%`));
		}

		// Add default filter for active jobs
		conditions.push(eq(jobs.status, "open"));

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

		// Get total count for pagination
		const totalResult = await db
			.select({ count: sql<number>`count(*)` })
			.from(jobs)
			.where(whereClause);

		const total = totalResult[0]?.count || 0;
		const totalPages = Math.ceil(total / limit);

		// Get paginated results
		const offset = (page - 1) * limit;
		const dbJobs = await db
			.select()
			.from(jobs)
			.where(whereClause)
			.limit(limit)
			.offset(offset)
			.orderBy(jobs.createdAt);

		const transformedJobs = dbJobs.map(transformDbJobToJob);

		const pagination: PaginationMeta = {
			page,
			limit,
			total,
			totalPages,
			hasNext: page < totalPages,
			hasPrev: page > 1,
		};

		const response = {
			success: true,
			data: transformedJobs,
			pagination,
			timestamp: new Date().toISOString(),
		};

		res.json(response);

		logger.info("Retrieved jobs", {
			total: transformedJobs.length,
			page,
			filters: { type, location, remote, company },
		});
	} catch (error) {
		logger.error("Failed to retrieve jobs", { error });
		sendResponse(res, undefined, "Failed to retrieve jobs", 500);
	}
};

/**
 * Get a single job by ID
 * GET /jobs/:id
 */
export const getJobById = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { id: idString } = req.params as { id: string };
		const id = parseInt(idString, 10);

		const dbJob = await db.select().from(jobs).where(eq(jobs.id, id)).limit(1);

		if (dbJob.length === 0) {
			sendResponse(res, undefined, `Job with ID ${id} not found`, 404);
			return;
		}

		const job = transformDbJobToJob(dbJob[0] as DbJob);

		sendResponse(res, job, "Job retrieved successfully");

		logger.info("Retrieved job by ID", { jobId: id });
	} catch (error) {
		logger.error("Failed to retrieve job by ID", {
			error,
			jobId: req.params["id"],
		});
		sendResponse(res, undefined, "Failed to retrieve job", 500);
	}
};
