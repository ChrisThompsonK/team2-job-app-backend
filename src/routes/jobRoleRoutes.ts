import { Router } from "express";
import { getAllJobRoles, getJobRoleById } from "../controllers/jobRoleController";

const router = Router();

// GET /api/job-roles - Get all job roles
router.get("/", getAllJobRoles);

// GET /api/job-roles/:id - Get a specific job role by ID
router.get("/:id", getJobRoleById);

export default router;
