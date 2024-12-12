import express from 'express';
import Route from '../models/Route.js';
import { verifyToken } from '../controllers/authMiddleware.js'; // Import the verifyToken middleware

const router = express.Router();

/**
 * @route GET /routes
 * @desc Get all routes for the authenticated user
 * @access Private (requires authentication)
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Extract the user ID from the JWT token
    const routes = await Route.find({ user: userId })
      .sort({ date: -1 })
      .populate('user', 'username email'); // Populate user details if needed
    res.status(200).json(routes);
  } catch (error) {
    console.error('Error getting routes:', error);
    res.status(500).json({ error: 'Failed to retrieve routes' });
  }
});

/**
 * @route POST /routes
 * @desc Save a new route for the authenticated user
 * @access Private (requires authentication)
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Extract the user ID from the JWT token
    const username = req.user.username; // Extract the username from the JWT token
    console.log('Received route data:', req.body);
    
    const fields = {
      user: userId, // Attach the user ID as an ObjectId
      username, // Attach the username from the JWT token
      name: req.body.name,
      start_location: req.body.start_location,
      end_location: req.body.end_location,
      distance: req.body.distance,
      duration: req.body.duration,
      geometry: req.body.geometry,
      steps: req.body.steps,
      origin: req.body.origin,
      destination: req.body.destination,
    };

    // Check if any of the required fields are missing
    if (Object.values(fields).some(value => value == null)) {
      console.warn('Missing required fields for route:', fields);
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newRoute = new Route(fields);
    const savedRoute = await newRoute.save();
    console.log('Route saved successfully:', savedRoute);
    res.status(201).json(savedRoute);
  } catch (error) {
    console.error('Error saving route:', error);
    res.status(500).json({ error: 'Failed to save route' });
  }
});

/**
 * @route DELETE /routes/:id
 * @desc Delete a specific route (only the route owner can delete)
 * @access Private (requires authentication)
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Extract the user ID from the JWT token
    const routeId = req.params.id;

    console.log('Attempting to delete route:', routeId);

    const route = await Route.findOne({ _id: routeId, user: userId });

    if (!route) {
      console.warn('Route not found or does not belong to user:', routeId);
      return res.status(404).json({ error: 'Route not found or does not belong to you' });
    }

    await Route.findByIdAndDelete(routeId);
    console.log('Route deleted successfully:', routeId);
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({ error: 'Failed to delete route' });
  }
});

/**
 * @route GET /routes/:id
 * @desc Get a single route by its ID (only the owner can view it)
 * @access Private (requires authentication)
 */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // Extract the user ID from the JWT token
    const routeId = req.params.id;

    const route = await Route.findOne({ _id: routeId, user: userId });

    if (!route) {
      return res.status(404).json({ error: 'Route not found or does not belong to you' });
    }

    res.status(200).json(route);
  } catch (error) {
    console.error('Error retrieving route:', error);
    res.status(500).json({ error: 'Failed to retrieve route' });
  }
});

/**
 * @route GET /routes/profile-routes
 * @desc Get the 3 most recent routes for the authenticated user
 * @access Private (requires authentication)
 */
router.get('/profile-routes', verifyToken, async (req, res) => {
  try {
    const routes = await Route.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(3);
    res.status(200).json(routes);
  } catch (error) {
    console.error('Error getting profile routes:', error);
    res.status(500).json({ error: 'Failed to retrieve routes' });
  }
});

export default router;
