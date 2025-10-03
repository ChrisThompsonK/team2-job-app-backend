import { Router } from "express";
import jobApplicationRoutes from "./jobApplicationRoutes";

const router = Router();

// Job application routes
router.use("/jobs", jobApplicationRoutes);

// Health check route
router.get("/health", (_req, res) => {
	res.json({
		status: "OK",
		timestamp: new Date().toISOString(),
		service: "Job Application API",
	});
});

export default router;
