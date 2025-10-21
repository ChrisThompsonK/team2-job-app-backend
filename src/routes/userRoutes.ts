import { Router } from "express";
import {
	getAllUsers,
	loginUser,
	registerUser,
} from "../controllers/userController";

const router = Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// User management routes
router.get("/users", getAllUsers);

export default router;
