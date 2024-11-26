const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Define Route Schema
const RouteSchema = new mongoose.Schema({
    // need to update implementation after user implementation
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Changed from true to false for now for the above reason
    },
    name: {
        type: String,
        required: true
    },
    start_location: {
        type: String,
        required: true
    },
    end_location: {
        type: String,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    geometry: {
        type: Object,
        required: true
    },
    steps: [{
        type: Object
    }],
    origin: {
        place_name: String,
        geometry: {
            type: { type: String },
            coordinates: [Number]
        }
    },
    destination: {
        place_name: String,
        geometry: {
            type: { type: String },
            coordinates: [Number]
        }
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create Route model
const Route = mongoose.model('Route', RouteSchema);

// Get all routes
router.get('/', async (req, res) => {
    try {
        const routes = await Route.find()
            .sort({ date: -1 });
        res.json(routes);
    } catch (error) {
        console.error('Error getting routes:', error);
        res.status(500).json({ error: 'Failed to get routes' });
    }
});

// Save new route
router.post('/', async (req, res) => {
    try {
        console.log('Received route data:', req.body);

        // Create new route without requiring user field; Update when user auth is implemented
        const newRoute = new Route({
            name: req.body.name,
            start_location: req.body.start_location,
            end_location: req.body.end_location,
            distance: req.body.distance,
            duration: req.body.duration,
            geometry: req.body.geometry,
            steps: req.body.steps,
            origin: req.body.origin,
            destination: req.body.destination
        });

        const savedRoute = await newRoute.save();
        console.log('Route saved successfully:', savedRoute);
        res.status(201).json(savedRoute);
    } catch (error) {
        console.error('Error saving route:', error);
        res.status(500).json({ error: 'Failed to save route' });
    }
});

// Delete route
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

// Get single route
router.get('/:id', async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);
        
        if (!route) {
            return res.status(404).json({ error: 'Route not found' });
        }
        
        res.json(route);
    } catch (error) {
        console.error('Error getting route:', error);
        res.status(500).json({ error: 'Failed to get route' });
    }
});

module.exports = router;