/**
 * Authentication routes
 */

import { Router } from "express";
import { authController } from "../controllers/authController";

const router = Router();

// POST /api/auth/login - Authenticate user
router.post("/login", (req, res) => authController.login(req, res));

// POST /api/auth/logout - Clear user session
router.post("/logout", (req, res) => authController.logout(req, res));

// GET /api/auth/me - Get current authenticated user
router.get("/me", (req, res) => authController.getCurrentUser(req, res));

export default router;
