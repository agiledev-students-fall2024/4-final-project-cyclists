const Incident = require('../models/Incident');

// Get all incidents
const getIncidents = async (req, res) => {
    try {
        const incidents = await Incident.find()
            .sort({ date: -1 });
        res.json(incidents);
    } catch (error) {
        console.error('Error getting incidents:', error);
        res.status(500).json({ error: 'Failed to get incidents' });
    }
};

// Report new incident
const reportIncident = async (req, res) => {
    try {
        console.log('Received incident data:', req.body);

        const newIncident = new Incident({
            image: req.body.image,
            caption: req.body.caption,
            location: {
                type: 'Point',
                coordinates: [
                    parseFloat(req.body.longitude), 
                    parseFloat(req.body.latitude)
                ]
            },
            date: new Date()
        });

        const savedIncident = await newIncident.save();
        console.log('Incident saved successfully:', {
            ...savedIncident.toObject(),
            image: '[truncated]'
        });
        res.status(201).json(savedIncident);
    } catch (error) {
        console.error('Error saving incident:', error);
        res.status(500).json({ error: 'Failed to save incident' });
    }
};

// Delete incident
const deleteIncident = async (req, res) => {
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

// Get single incident
const getIncidentById = async (req, res) => {
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

module.exports = {
    getIncidents,
    reportIncident,
    deleteIncident,
    getIncidentById
};