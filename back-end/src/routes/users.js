const express = require('express');
import { verifyToken } from '../controllers/authMiddleware.js';
const router = express.Router();
const {
  getProfile,
  saveProfile,
  getSavedRoutes,
  addSavedRoute,
  deleteSavedRoute,
} = require('../controllers/userController');

/**
 * @route GET /api/users/:userId/profile
 * @description Retrieves the profile information for a specified user.
 */
router.get('/:userId/profile', verifyToken, getProfile);

/**
 * @route POST /api/users/:userId/profile
 * @description Saves the profile information for a specified user.
 */
 router.post('/:userId/profile', verifyToken, saveProfile); 

/**
 * @route GET /api/users/:userId/saved-routes
 * @description Fetches all saved routes for a specified user.
 */
router.get('/:userId/saved-routes', verifyToken, getSavedRoutes);

/**
 * @route POST /api/users/:userId/saved-routes
 * @description Adds a new saved route for a specified user.
 */
router.post('/:userId/saved-routes', verifyToken, addSavedRoute);

/**
 * @route DELETE /api/users/:userId/saved-routes/:routeId
 * @description Deletes a specified saved route for a user.
 */
router.delete('/:userId/saved-routes/:routeId', verifyToken, deleteSavedRoute);

module.exports = router;
