import { Router } from "express";
import {
	createJobApplication,
	deleteJobApplication,
	getActiveJobApplications,
	getAllJobApplications,
	getJobApplicationById,
	updateJobApplication,
} from "../controllers/jobApplicationController";

const router = Router();

// GET /api/jobs - Get all job applications with filtering and pagination
router.get("/", getAllJobApplications);

// GET /api/jobs/active - Get only active job applications
router.get("/active", getActiveJobApplications);

// GET /api/jobs/:id - Get a specific job application by ID
router.get("/:id", getJobApplicationById);

// POST /api/jobs - Create a new job application
router.post("/", createJobApplication);

// PUT /api/jobs/:id - Update a job application
router.put("/:id", updateJobApplication);

// DELETE /api/jobs/:id - Delete a job application
router.delete("/:id", deleteJobApplication);

export default router;
