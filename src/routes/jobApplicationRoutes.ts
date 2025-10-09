import { Router } from "express";
import {
	createApplication,
	deleteApplication,
	getAllApplications,
	getApplicationById,
	getApplicationsByJobRole,
	updateApplication,
} from "../controllers/jobApplicationController";

const router = Router();

// GET /api/applications - Get all applications with optional filtering
router.get("/", getAllApplications);

// GET /api/applications/:id - Get a specific application by ID
router.get("/:id", getApplicationById);

// POST /api/applications - Create a new application
router.post("/", createApplication);

// PUT /api/applications/:id - Update an application
router.put("/:id", updateApplication);

// DELETE /api/applications/:id - Delete an application
router.delete("/:id", deleteApplication);

// GET /api/applications/job-role/:jobRoleId - Get applications for a specific job role
router.get("/job-role/:jobRoleId", getApplicationsByJobRole);

export default router;
