import { Router } from "express";
import jobApplicationRoutes from "./jobApplicationRoutes";
import jobRoleRoutes from "./jobRoleRoutes";

const router = Router();

// Job roles routes
router.use("/job-roles", jobRoleRoutes);

// Job applications routes
router.use("/applications", jobApplicationRoutes);

export default router;
