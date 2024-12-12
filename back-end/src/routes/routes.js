import express from 'express';
import Route from '../models/Route.js';
import { verifyToken } from '../controllers/authMiddleware.js';

const router = express.Router();

// Add authentication middleware to protect routes
router.use(verifyToken);

// Get all routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(routes);
  } catch (error) {
    console.error('Error getting routes:', error);
    res.status(500).json({ error: 'Failed to retrieve routes' });
  }
});

// Save a new route
router.post('/', async (req, res) => {
  try {
    console.log('Received route data:', req.body);
    
    const fields = {
      user: req.user.id,
      name: req.body.name,
      start_location: req.body.start_location,
      end_location: req.body.end_location,
      distance: req.body.distance,
      duration: req.body.duration,
      geometry: req.body.geometry,
      origin: req.body.origin,
      destination: req.body.destination,
    };

    if (Object.values(fields).some(value => !value)) {
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

// Delete a route by ID
router.delete('/:id', async (req, res) => {
  try {
    console.log('Attempting to delete route:', req.params.id);

    const route = await Route.findByIdAndDelete(req.params.id);

    if (!route) {
      console.log('Route not found:', req.params.id);
      return res.status(404).json({ error: 'Route not found' });
    }

    console.log('Route deleted successfully:', req.params.id);
    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({ error: 'Failed to delete route' });
  }
});

// Get a single route by ID
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.status(200).json(route);
  } catch (error) {
    console.error('Error retrieving route:', error);
    res.status(500).json({ error: 'Failed to retrieve route' });
  }
});

export default router;
