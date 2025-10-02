import express from "express";
import { getAllJobs, getJobById } from "../controllers/jobController.js";
import { validateRequest } from "../middleware/index.js";
import {
	getJobByIdParamsSchema,
	getJobsQuerySchema,
} from "../validation/schemas.js";

const router = express.Router();

// GET /jobs - Get all job details with filtering and pagination
router.get("/", validateRequest({ query: getJobsQuerySchema }), getAllJobs);

// GET /jobs/:id - Get a single job by ID
router.get(
	"/:id",
	validateRequest({ params: getJobByIdParamsSchema }),
	getJobById
);

export default router;
