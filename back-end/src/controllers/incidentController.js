import Incident from '../models/Incident.js';

/**
 * Retrieves all reported incidents, sorted by most recent.
 */
export const getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find().sort({ date: -1 });
        res.json(incidents);
    } catch (error) {
        console.error('Error getting incidents:', error);
        res.status(500).json({ error: 'Failed to get incidents' });
    }
};

/**
 * Reports a new incident with image, caption, and location.
 */
export const reportIncident = async (req, res) => {
    try {
        console.log('Received incident data:', req.body);

        if (
            typeof req.body.longitude !== 'number' ||
            typeof req.body.latitude !== 'number' ||
            !req.body.image ||
            !req.body.caption
        ) {
            return res.status(400).json({ error: 'All fields are required with valid data.' });
        }

        const newIncident = new Incident({
            image: req.body.image,
            caption: req.body.caption,
            location: {
                type: 'Point',
                coordinates: [
                    parseFloat(req.body.longitude),
                    parseFloat(req.body.latitude),
                ],
            },
            date: new Date(),
        });

        const savedIncident = await newIncident.save();
        console.log('Incident saved successfully:', {
            ...savedIncident.toObject(),
            image: '[truncated]',
        });
        res.status(201).json({ message: 'Incident reported successfully', incident: savedIncident });
    } catch (error) {
        console.error('Error saving incident:', error);
        res.status(500).json({ error: 'Failed to save incident' });
    }
};

/**
 * Deletes an incident by ID.
 */
export const deleteIncident = async (req, res) => {
    try {
        console.log('Attempting to delete incident:', req.params.id);

        const incident = await Incident.findByIdAndDelete(req.params.id);

        if (!incident) {
            console.log('Incident not found:', req.params.id);
            return res.status(404).json({ error: 'Incident not found' });
        }

        console.log('Incident deleted successfully:', req.params.id);
        res.json({ message: 'Incident deleted successfully' });
    } catch (error) {
        console.error('Error deleting incident:', error);
        res.status(500).json({ error: 'Failed to delete incident' });
    }
};

/**
 * Retrieves a single incident by ID.
 */
export const getIncidentById = async (req, res) => {
    try {
        const incident = await Incident.findById(req.params.id);

        if (!incident) {
            return res.status(404).json({ error: 'Incident not found' });
        }

        res.json(incident);
    } catch (error) {
        console.error('Error getting incident:', error);
        res.status(500).json({ error: 'Failed to get incident' });
    }
};
