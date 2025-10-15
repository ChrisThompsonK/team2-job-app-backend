import { Router } from "express";
import { getApplicationsByJobRole } from "../controllers/jobApplicationController";
import {
	createJobRole,
	deleteJobRole,
	getAllJobRoles,
	getJobRoleById,
	updateJobRole,
} from "../controllers/jobRoleController";

const router = Router();

// GET /api/job-roles - Get all job roles
router.get("/", getAllJobRoles);

// GET /api/job-roles/:id/applicants - Get applicants for a specific job role
// Note: This must come before /:id to avoid route conflicts
router.get("/:id/applicants", getApplicationsByJobRole);

// GET /api/job-roles/:id - Get a specific job role by ID
router.get("/:id", getJobRoleById);

// POST /api/job-roles - Create a new job role
router.post("/", createJobRole);

// PUT /api/job-roles/:id - Update an existing job role
router.put("/:id", updateJobRole);

// DELETE /api/job-roles/:id - Delete a job role
router.delete("/:id", deleteJobRole);

export default router;
