const express = require('express');
const { login, signup, resetPassword } = require('../controllers/authController.js');

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
 * @route POST /api/auth/reset-password
 * @description Resets the user's password.
 */
router.post('/reset-password', resetPassword);

module.exports = router;
