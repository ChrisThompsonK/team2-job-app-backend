import { Router } from "express";
import authRoutes from "./authRoutes";
import jobApplicationRoutes from "./jobApplicationRoutes";
import jobRoleRoutes from "./jobRoleRoutes";

const router = Router();

// Authentication routes
router.use("/auth", authRoutes);

// Job roles routes
router.use("/job-roles", jobRoleRoutes);

// Job applications routes
router.use("/applications", jobApplicationRoutes);

export default router;
