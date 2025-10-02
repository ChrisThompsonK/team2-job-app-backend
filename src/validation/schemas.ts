/**
 * Zod validation schemas for API requests
 */

import { z } from "zod";

// Query parameters for GET /jobs
export const getJobsQuerySchema = z
	.object({
		page: z
			.string()
			.optional()
			.transform((val) => (val ? parseInt(val, 10) : 1)),
		limit: z
			.string()
			.optional()
			.transform((val) => (val ? parseInt(val, 10) : 10)),
		type: z
			.enum(["full-time", "part-time", "contract", "internship"])
			.optional(),
		location: z.string().optional(),
		remote: z
			.string()
			.optional()
			.transform((val) => val === "true"),
		company: z.string().optional(),
	})
	.refine(
		(data) => {
			return data.page >= 1 && data.limit >= 1 && data.limit <= 100;
		},
		{
			message: "Page must be >= 1, limit must be between 1 and 100",
		}
	);

// Path parameters for GET /jobs/:id
export const getJobByIdParamsSchema = z.object({
	id: z
		.string()
		.transform((val) => parseInt(val, 10))
		.refine((val) => !Number.isNaN(val) && val > 0, {
			message: "ID must be a positive integer",
		}),
});
