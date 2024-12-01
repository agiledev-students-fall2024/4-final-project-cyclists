import express from 'express';
import { login, signup } from '../controllers/authController.js';

const router = express.Router();

/**
 * @route POST /api/auth/login
 * @description Handles user login by verifying credentials.
 */
router.post('/login', login);

/**
 * @route POST /api/auth/signup
 * @description Registers a new user account.
 */
router.post('/signup', signup);

export default router;
