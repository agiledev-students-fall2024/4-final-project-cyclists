import express from 'express';
import {
  getProfile,
  saveProfile,
  getSavedRoutes,
  addSavedRoute,
  deleteSavedRoute,
} from '../controllers/userController.js';

const router = express.Router();

/**
 * @route GET /api/users/:userId/profile
 * @description Retrieves the profile information for a specified user.
 */
router.get('/:userId/profile', getProfile);

/**
 * @route POST /api/users/:userId/profile
 * @description Saves the profile information for a specified user.
 */
router.post('/:userId/profile', saveProfile);

/**
 * @route GET /api/users/:userId/saved-routes
 * @description Fetches all saved routes for a specified user.
 */
router.get('/:userId/saved-routes', getSavedRoutes);

/**
 * @route POST /api/users/:userId/saved-routes
 * @description Adds a new saved route for a specified user.
 */
router.post('/:userId/saved-routes', addSavedRoute);

/**
 * @route DELETE /api/users/:userId/saved-routes/:routeId
 * @description Deletes a specified saved route for a user.
 */
router.delete('/:userId/saved-routes/:routeId', deleteSavedRoute);

export default router;
