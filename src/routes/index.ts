import { Router } from "express";
import authRoutes from "./authRoutes";
import jobRoleRoutes from "./jobRoleRoutes";

const router = Router();

// Authentication routes
router.use("/auth", authRoutes);

// Job roles routes
router.use("/job-roles", jobRoleRoutes);

export default router;
