const express = require('express');
const router = express.Router();
const {
  getIncidents,
  getIncidentById,
  reportIncident,
  deleteIncident,
} = require('../controllers/incidentController');

/**
 * @route GET /api/incidents
 * @description Retrieve all reported incidents.
 */
router.get('/', getIncidents);

/**
 * @route GET /api/incidents/:id
 * @description Retrieve a single incident by ID.
 */
router.get('/:id', getIncidentById);

/**
 * @route POST /api/incidents
 * @description Report a new incident.
 */
router.post('/', reportIncident);

/**
 * @route DELETE /api/incidents/:id
 * @description Delete an incident by ID.
 */
router.delete('/:id', deleteIncident);

module.exports = router;
