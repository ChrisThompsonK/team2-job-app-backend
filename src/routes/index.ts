import { Router } from "express";
import jobApplicationRoutes from "./jobApplicationRoutes.js";
import jobRoleRoutes from "./jobRoleRoutes.js";
import userRoutes from "./userRoutes.js";

const router = Router();

// User authentication routes
router.use("/users", userRoutes);

// Job roles routes
router.use("/job-roles", jobRoleRoutes);

// Job applications routes
router.use("/applications", jobApplicationRoutes);

export default router;
