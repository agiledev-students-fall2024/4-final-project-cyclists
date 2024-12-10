import Incident from '../models/Incident.js';

/**
 * Retrieves all reported incidents, sorted by most recent.
 * @function getIncidents
 * @param {Object} req - The request object.
 * @param {Object} res - The response object, containing incidents data.
 * @returns {void} Sends a JSON response with an array of incidents.
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
 * @function reportIncident
 * @param {Object} req - The request object, containing the incident data.
 * @param {Object} res - The response object, containing the created incident or error message.
 * @return {void} Sends a JSON response with the newly created incident or an error message.
 */
export const reportIncident = async (req, res) => {
  try {
    console.log('Received incident data:', req.body);

    const newIncident = new Incident({
      image: req.body.image || null, // Make image optional
      caption: req.body.caption,
      location: {
        type: 'Point',
        coordinates: [
          parseFloat(req.body.longitude),
          parseFloat(req.body.latitude),
        ],
      },
      duration: req.body.duration,
      timestamp: req.body.timestamp,
      date: new Date(),
    });

    const savedIncident = await newIncident.save();
    console.log('Incident saved successfully:', {
      ...savedIncident.toObject(),
      image: '[truncated]',
    });
    res.status(201).json(savedIncident);
  } catch (error) {
    console.error('Error saving incident:', error);
    res.status(500).json({ error: 'Failed to save incident' });
  }
};

/**
 * Deletes an incident by ID.
 * @function deleteIncident
 * @param {Object} req - The request object, containing the incident ID.
 * @param {Object} res - The response object, containing a success or error message.
 * @returns {void} Sends a JSON response indicating the result of the deletion.
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
 * @function getIncidentById
 * @param {Object} req - The request object with incident ID.
 * @param {Object} res - The response object, containing the incident data or an error message.
 * @returns {void} Sends a JSON response with the requested incident data.
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
