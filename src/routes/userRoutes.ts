import express from "express";
import { getAllUsers, login, register } from "../controllers/userController.js";

const router = express.Router();

/**
 * @route POST /api/users/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", register);

/**
 * @route POST /api/users/login
 * @desc Login user
 * @access Public
 */
router.post("/login", login);

/**
 * @route GET /api/users
 * @desc Get all users (admin only - TODO: add auth middleware)
 * @access Private/Admin
 */
router.get("/", getAllUsers);

export default router;
