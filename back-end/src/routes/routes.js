import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Define Route Schema
const RouteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Changed to optional for flexibility
    },
    name: { type: String, required: true },
    start_location: { type: String, required: true },
    end_location: { type: String, required: true },
    distance: { type: Number, required: true },
    duration: { type: Number, required: true },
    geometry: { type: Object, required: true },
    steps: [{ type: Object }],
    origin: {
      place_name: { type: String, required: true },
      geometry: { type: { type: String, enum: ['Point'] }, coordinates: [Number] },
    },
    destination: {
      place_name: { type: String, required: true },
      geometry: { type: { type: String, enum: ['Point'] }, coordinates: [Number] },
    },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Create Route model
const Route = mongoose.model('Route', RouteSchema);

// Middleware to ensure MongoDB is connected
router.use(async (req, res, next) => {
    if (!mongoose.connection.readyState) {
      console.error('MongoDB is not connected.');
      return res.status(500).json({ error: 'Database connection error. Please try again later.' });
    }
    next();
  });  

// Get all routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find().sort({ date: -1 });
    res.status(200).json(routes);
  } catch (error) {
    console.error('Error getting routes:', error);
    res.status(500).json({ error: 'Failed to retrieve routes' });
  }
});

// Save a new route
router.post('/', async (req, res) => {
  try {
    const { name, start_location, end_location, distance, duration, geometry, origin, destination } = req.body;

    if (!name || !start_location || !end_location || !distance || !duration || !geometry || !origin || !destination) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const newRoute = new Route({
      name,
      start_location,
      end_location,
      distance,
      duration,
      geometry,
      origin,
      destination,
    });

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
    const route = await Route.findByIdAndDelete(req.params.id);

    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    console.log('Route deleted successfully:', req.params.id);
    res.status(200).json({ message: 'Route deleted successfully' });
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
