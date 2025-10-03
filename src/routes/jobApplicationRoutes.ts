import { Router } from "express";
import {
	getActiveJobRoles,
	getAllJobRoles,
	getJobRoleById,
} from "../controllers/jobApplicationController";

const router = Router();

// GET /api/jobs - Get all job roles with filtering and pagination
router.get("/", getAllJobRoles);

// GET /api/jobs/active - Get only active job roles
router.get("/active", getActiveJobRoles);

// GET /api/jobs/:id - Get a specific job role by ID
router.get("/:id", getJobRoleById);

export default router;
