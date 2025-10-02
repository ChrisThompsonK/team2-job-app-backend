import express from "express";
import {
	getAllJobRoles,
	getJobRoleById,
	getJobRolesByCapability,
	getJobRolesByLocation,
	getJobRolesByStatus,
} from "../controllers/jobRolesController.js";

const router = express.Router();

// GET /job-roles - Get all job roles
router.get("/", getAllJobRoles);

// GET /job-roles/:id - Get a single job role by ID
router.get("/:id", getJobRoleById);

// GET /job-roles/capability/:capability - Get job roles by capability
router.get("/capability/:capability", getJobRolesByCapability);

// GET /job-roles/location/:location - Get job roles by location
router.get("/location/:location", getJobRolesByLocation);

// GET /job-roles/status/:status - Get job roles by status
router.get("/status/:status", getJobRolesByStatus);

export default router;