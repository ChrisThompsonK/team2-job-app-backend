import type { Request, Response } from "express";
import { db } from "../db/index.js";
import { jobRoles } from "../db/schema.js";
import { eq } from "drizzle-orm";

/**
 * Get all job roles
 * GET /job-roles
 */
export const getAllJobRoles = async (_req: Request, res: Response): Promise<void> => {
	try {
		const allJobRoles = await db.select().from(jobRoles);
		
		res.json({
			success: true,
			data: allJobRoles,
			total: allJobRoles.length,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to retrieve job roles",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * Get a single job role by ID
 * GET /job-roles/:id
 */
export const getJobRoleById = async (req: Request, res: Response): Promise<void> => {
	try {
		const { id } = req.params;
		
		if (!id) {
			res.status(400).json({
				success: false,
				message: "Job role ID is required",
			});
			return;
		}

		const jobRoleId = parseInt(id, 10);

		if (isNaN(jobRoleId)) {
			res.status(400).json({
				success: false,
				message: "Invalid job role ID",
			});
			return;
		}

		const jobRole = await db.select().from(jobRoles).where(eq(jobRoles.jobRoleId, jobRoleId));

		if (jobRole.length === 0) {
			res.status(404).json({
				success: false,
				message: "Job role not found",
			});
			return;
		}

		res.json({
			success: true,
			data: jobRole[0],
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to retrieve job role",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * Get job roles by capability
 * GET /job-roles/capability/:capability
 */
export const getJobRolesByCapability = async (req: Request, res: Response): Promise<void> => {
	try {
		const { capability } = req.params;
		
		if (!capability) {
			res.status(400).json({
				success: false,
				message: "Capability parameter is required",
			});
			return;
		}
		
		const rolesByCapability = await db.select().from(jobRoles).where(eq(jobRoles.capability, capability));

		res.json({
			success: true,
			data: rolesByCapability,
			total: rolesByCapability.length,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to retrieve job roles by capability",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * Get job roles by location
 * GET /job-roles/location/:location
 */
export const getJobRolesByLocation = async (req: Request, res: Response): Promise<void> => {
	try {
		const { location } = req.params;
		
		if (!location) {
			res.status(400).json({
				success: false,
				message: "Location parameter is required",
			});
			return;
		}
		
		const rolesByLocation = await db.select().from(jobRoles).where(eq(jobRoles.location, location));

		res.json({
			success: true,
			data: rolesByLocation,
			total: rolesByLocation.length,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to retrieve job roles by location",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};

/**
 * Get job roles by status
 * GET /job-roles/status/:status
 */
export const getJobRolesByStatus = async (req: Request, res: Response): Promise<void> => {
	try {
		const { status } = req.params;
		
		if (!status) {
			res.status(400).json({
				success: false,
				message: "Status parameter is required",
			});
			return;
		}
		
		const rolesByStatus = await db.select().from(jobRoles).where(eq(jobRoles.status, status));

		res.json({
			success: true,
			data: rolesByStatus,
			total: rolesByStatus.length,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: "Failed to retrieve job roles by status",
			error: error instanceof Error ? error.message : "Unknown error",
		});
	}
};