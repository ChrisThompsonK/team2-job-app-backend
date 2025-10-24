import { Router } from "express";
import {
	createApplication,
	downloadCv,
	getAllApplications,
	getApplicationById,
	getApplicationsByJobRole,
	getApplicationsByUserEmail,
	updateApplication,
	withdrawApplication,
} from "../controllers/jobApplicationController";
import { upload } from "../middleware/upload";

const router = Router();

// GET /api/applications - Get all applications with optional filtering
router.get("/", getAllApplications);

// GET /api/applications/user/:email - Get applications for a specific user by email
// Note: This must come before /:id to avoid route conflicts
router.get("/user/:email", getApplicationsByUserEmail);

// GET /api/applications/job-role/:jobRoleId - Get applications for a specific job role
// Note: This must come before /:id to avoid route conflicts
router.get("/job-role/:jobRoleId", getApplicationsByJobRole);

// GET /api/applications/:id/cv - Download CV for a specific application
// Note: This must come before /:id to avoid route conflicts with dynamic id parameter
router.get("/:id/cv", downloadCv);

// GET /api/applications/:id - Get a specific application by ID
router.get("/:id", getApplicationById);

// POST /api/applications - Create a new application with CV upload
router.post("/", upload.single("cv"), createApplication);

// PUT /api/applications/:id - Update an application (with optional CV upload)
router.put("/:id", upload.single("cv"), updateApplication);

// DELETE /api/applications/:id - Withdraw an application (uses X-User-Email header for authentication)
router.delete("/:id", withdrawApplication);

export default router;
