import express from 'express';
import {
  getIncidents,
  reportIncident,
  deleteIncident,
  getIncidentById,
} from '../controllers/incidentController.js';

const router = express.Router();

/**
 * @route GET /api/incidents
 * @description Get all reported incidents, sorted by date.
 * @returns {Object[]} An array of incidents.
 */
router.get('/', getIncidents);

/**
 * @route POST /api/incidents
 * @description Report a new incident with necessary details.
 * @body {Object} incident - Incident data to be reported.
 * @returns {Object} The newly created incident.
 */
router.post('/', reportIncident);

/**
 * @route DELETE /api/incidents/:id
 * @description Delete an incident by its ID.
 * @param {string} id - The ID of the incident to be deleted.
 * @returns {Object} Message indicating the result of the deletion.
 */
router.delete('/:id', deleteIncident);

/**
 * @route GET /api/incidents/:id
 * @description Get a specific incident by ID.
 * @param {string} id - The ID of the incident to be retrieved.
 * @returns {Object} The requested incident.
 */
router.get('/:id', getIncidentById);

export default router;
