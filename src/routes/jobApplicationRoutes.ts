import { Router } from "express";
import {
	getActiveJobApplications,
	getAllJobApplications,
	getJobApplicationById,
} from "../controllers/jobApplicationController";

const router = Router();

// GET /api/jobs - Get all job applications with filtering and pagination
router.get("/", getAllJobApplications);

// GET /api/jobs/active - Get only active job applications
router.get("/active", getActiveJobApplications);

// GET /api/jobs/:id - Get a specific job application by ID
router.get("/:id", getJobApplicationById);

export default router;
