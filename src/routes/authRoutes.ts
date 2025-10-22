import { Router } from "express";
import { authController } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Public routes (no authentication required)
router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));

// Protected routes (authentication required)
router.post("/logout", requireAuth, authController.logout.bind(authController));
router.get(
	"/me",
	requireAuth,
	authController.getCurrentUser.bind(authController)
);

export default router;
