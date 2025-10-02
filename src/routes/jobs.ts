import express from "express";
import { getAllJobs, getJobById } from "../controllers/jobController.js";

const router = express.Router();

// GET /jobs - Get all job details
router.get("/", getAllJobs);

// GET /jobs/:id - Get a single job by ID
router.get("/:id", getJobById);

export default router;