import express from 'express';
import {
    getIncidents,
    reportIncident,
    deleteIncident,
    getIncidentById,
} from '../controllers/incidentController.js';

const router = express.Router();

router.get('/', getIncidents);
router.post('/', reportIncident);
router.delete('/:id', deleteIncident);
router.get('/:id', getIncidentById);

export default router;
