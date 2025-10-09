import { Router } from "express";
import {
	createJobRole,
	getAllJobRoles,
	getJobRoleById,
	updateJobRole,
} from "../controllers/jobRoleController";

const router = Router();

// GET /api/job-roles - Get all job roles
router.get("/", getAllJobRoles);

// GET /api/job-roles/:id - Get a specific job role by ID
router.get("/:id", getJobRoleById);

// POST /api/job-roles - Create a new job role
router.post("/", createJobRole);

// PUT /api/job-roles/:id - Update an existing job role
router.put("/:id", updateJobRole);

export default router;
