import { Router } from "express";
import {
	createApplication,
	deleteApplication,
	downloadCv,
	getAllApplications,
	getApplicationById,
	getApplicationsByJobRole,
	updateApplication,
} from "../controllers/jobApplicationController";
import { upload } from "../middleware/upload";

const router = Router();

// GET /api/applications - Get all applications with optional filtering
router.get("/", getAllApplications);

// GET /api/applications/job-role/:jobRoleId - Get applications for a specific job role
// Note: This must come before /:id to avoid route conflicts
router.get("/job-role/:jobRoleId", getApplicationsByJobRole);

// GET /api/applications/:id - Get a specific application by ID
router.get("/:id", getApplicationById);

// GET /api/applications/:id/cv - Download CV for a specific application
router.get("/:id/cv", downloadCv);

// POST /api/applications - Create a new application with CV upload
router.post("/", upload.single("cv"), createApplication);

// PUT /api/applications/:id - Update an application
router.put("/:id", updateApplication);

// DELETE /api/applications/:id - Delete an application
router.delete("/:id", deleteApplication);

export default router;
