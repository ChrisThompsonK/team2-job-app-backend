import { Router } from "express";
import jobApplicationRoutes from "./jobApplicationRoutes";
import jobRoleRoutes from "./jobRoleRoutes";
import userRoutes from "./userRoutes";

const router = Router();

// Job roles routes
router.use("/job-roles", jobRoleRoutes);

// Job applications routes
router.use("/applications", jobApplicationRoutes);

// User/Auth routes
router.use("/auth", userRoutes);

export default router;
