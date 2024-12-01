import fs from 'fs';
import path from 'path';

const dataDir = path.join(path.resolve(), 'data');
const incidentsPath = path.join(dataDir, 'incidents.json');

// Ensure the incidents file exists
function ensureIncidentsFileExists() {
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
    if (!fs.existsSync(incidentsPath)) {
        fs.writeFileSync(incidentsPath, JSON.stringify([]), 'utf8');
        console.log("Initialized incidents.json with an empty array.");
    }
}

// Helper function to read incidents from the JSON file
function readIncidentsFromFile() {
    ensureIncidentsFileExists();
    const data = fs.readFileSync(incidentsPath, 'utf8');
    return JSON.parse(data);
}

// Helper function to write incidents to the JSON file
function writeIncidentsToFile(incidents) {
    fs.writeFileSync(incidentsPath, JSON.stringify(incidents, null, 2), 'utf8');
}

// Report a new incident
export const reportIncident = (req, res) => {
  const { image, caption, longitude, latitude, date } = req.body;

  if (!image || !caption || longitude === undefined || latitude === undefined || !date) {
      return res.status(400).json({ message: 'All fields are required.' });
  }

  const incidents = readIncidentsFromFile();
  const newIncident = {
      id: incidents.length ? incidents[incidents.length - 1].id + 1 : 1,
      image,
      caption,
      longitude,
      latitude,
      date,
  };

  incidents.push(newIncident);
  writeIncidentsToFile(incidents);

  res.status(201).json({
      message: 'Incident reported successfully',
      incident: newIncident,
  });
};


// Get all incidents
export const getIncidents = (req, res) => {
    const incidents = readIncidentsFromFile();
    res.status(200).json(incidents);
};

// Get an incident by ID
export const getIncidentById = (req, res) => {
    const incidents = readIncidentsFromFile();
    const incident = incidents.find(i => i.id === parseInt(req.params.id, 10));

    if (incident) {
        res.status(200).json(incident);
    } else {
        res.status(404).json({ message: 'Incident not found' });
    }
};

// Delete an incident by ID
export const deleteIncident = (req, res) => {
    const incidents = readIncidentsFromFile();
    const index = incidents.findIndex(i => i.id === parseInt(req.params.id, 10));

    if (index !== -1) {
        incidents.splice(index, 1);
        writeIncidentsToFile(incidents);
        res.status(200).json({ message: 'Incident deleted successfully' });
    } else {
        res.status(404).json({ message: 'Incident not found' });
    }
};
