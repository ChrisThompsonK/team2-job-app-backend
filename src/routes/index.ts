import { Router } from "express";
import jobRoleRoutes from "./jobRoleRoutes";

const router = Router();

// Job roles routes
router.use("/job-roles", jobRoleRoutes);

export default router;
