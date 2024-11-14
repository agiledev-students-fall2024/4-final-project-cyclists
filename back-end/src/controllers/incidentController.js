const fs = require('fs');
const path = require('path');

const incidentsPath = path.join(__dirname, '../data/incidents.json');

/**
 * Reads incidents from the JSON file.
 * @returns {Array} Array of incidents.
 */
const readIncidentsFromFile = () => {
  const data = fs.readFileSync(incidentsPath, 'utf8');
  return JSON.parse(data);
};

/**
 * Writes incidents to the JSON file.
 * @param {Array} incidents - Array of incidents to write to the file.
 */
const writeIncidentsToFile = (incidents) => {
  fs.writeFileSync(incidentsPath, JSON.stringify(incidents, null, 2), 'utf8');
};

/**
 * Reports a new incident.
 * @function reportIncident
 * @param {Object} req - Request object with incident data.
 * @param {Object} res - Response object for sending confirmation.
 */
const reportIncident = (req, res) => {
  try {
    // Retrieve incident data from the request body
    const { image, caption, longitude, latitude, date } = req.body;

    // Check for empty fields
    if (!image || !caption || !longitude || !latitude || !date) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Read current incidents from the JSON file
    const incidents = readIncidentsFromFile();

    // Create a new incident with a unique ID
    const newIncident = {
      id: incidents.length ? incidents[incidents.length - 1].id + 1 : 1,
      image,
      caption,
      longitude,
      latitude,
      date,
    };

    // Add the new incident to the array and write back to the file
    incidents.push(newIncident);
    writeIncidentsToFile(incidents);

    // Send a success response with the created incident
    res.status(201).json({
      message: 'Incident reported successfully',
      incident: newIncident,
    });
  } catch (error) {
    // Handle errors and send a 500 status code with an error message
    console.error(error);
    res.status(500).json({ message: 'Failed to report incident', error });
  }
};

/**
 * Retrieves all reported incidents.
 * @function getIncidents
 * @param {Object} req - Request object.
 * @param {Object} res - Response object for sending incidents.
 */
const getIncidents = async (req, res) => {
  try {
    // Read incidents from the JSON file
    const incidents = readIncidentsFromFile();

    // Send the list of incidents as a response
    res.status(200).json(incidents);
  } catch (error) {
    // Handle errors and send a 500 status code with an error message
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve incidents', error });
  }
};

/**
 * Retrieves a single incident by ID.
 * @function getIncidentById
 * @param {Object} req - Request object with incident ID.
 * @param {Object} res - Response object for sending the incident.
 */
const getIncidentById = async (req, res) => {
  try {
    // Read incidents from the JSON file
    const incidents = readIncidentsFromFile();

    // Find the incident with the matching ID
    const incident = incidents.find((i) => i.id === parseInt(req.params.id, 10));

    // Send the incident as a response
    if (incident) {
      res.status(200).json(incident);
    } else {
      res.status(404).json({ message: 'Incident not found' });
    }
  } catch (error) {
    // Handle errors and send a 500 status code with an error message
    console.error(error);
    res.status(500).json({ message: 'Failed to retrieve incident', error });
  }
}

/**
 * Deletes an incident by ID.
 * @function deleteIncident
 * @param {Object} req - Request object with incident ID.
 * @param {Object} res - Response object for sending confirmation.
 */
const deleteIncident = async (req, res) => {
  try {
    // Read incidents from the JSON file
    const incidents = readIncidentsFromFile();

    // Find the index of the incident with the matching ID
    const index = incidents.findIndex((i) => i.id === parseInt(req.params.id, 10));

    // Remove the incident from the array if found
    if (index !== -1) {
      incidents.splice(index, 1);
      writeIncidentsToFile(incidents);
      res.status(200).json({ message: 'Incident deleted successfully' });
    } else {
      res.status(404).json({ message: 'Incident not found' });
    }
  } catch (error) {
    // Handle errors and send a 500 status code with an error message
    console.error(error);
    res.status(500).json({ message: 'Failed to delete incident', error });
  }
}

module.exports = {
  reportIncident,
  getIncidents,
  getIncidentById,
  deleteIncident,
};
