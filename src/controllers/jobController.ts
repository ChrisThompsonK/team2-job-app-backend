import type { Request, Response } from "express";
import type { Job } from "../types/Job.js";
import jobsJson from "../data/jobs.json" assert { type: "json" };

// Load jobs data from JSON file
const jobsData: Job[] = jobsJson.jobs as Job[];

/**
 * Get all jobs
 * GET /jobs
 */
export const getAllJobs = (_req: Request, res: Response): void => {
	try {
		res.json({
			success: true,
			data: jobsData,
			total: jobsData.length,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to retrieve jobs",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * Get a single job by ID
 * GET /jobs/:id
 */
export const getJobById = (req: Request, res: Response): void => {
	try {
		const jobId = req.params["id"];
		
		// Find job by ID (assuming ID is a string/number)
		const job = jobsData.find((job) => job.id.toString() === jobId);
		
		if (!job) {
			res.status(404).json({
				success: false,
				message: `Job with ID ${jobId} not found`,
			});
			return;
		}
		
		res.json({
			success: true,
			data: job,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to retrieve job",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};