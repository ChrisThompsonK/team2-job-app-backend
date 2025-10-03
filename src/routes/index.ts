import { Router } from "express";
import jobRoleRoutes from "./jobRoleRoutes";

const router = Router();

// Job application routes
router.use("/jobs", jobRoleRoutes);

// Health check route
router.get("/health", (_req, res) => {
	res.json({
		status: "OK",
		timestamp: new Date().toISOString(),
		service: "Job Application API",
	});
});

export default router;
