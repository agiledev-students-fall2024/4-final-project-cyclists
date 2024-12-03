import express from 'express';
import { login, signup, forgotPassword, resetPassword } from '../controllers/authController.js';

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

/**
 * @route POST /api/auth/forgot-password
 * @description Verifies if the email exists in the system for password recovery.
 */
router.post('/forgot-password', forgotPassword);

/**
 * @route POST /api/auth/reset-password
 * @description Resets the user's password after verifying the email.
 */
router.post('/reset-password', resetPassword);

export default router;
