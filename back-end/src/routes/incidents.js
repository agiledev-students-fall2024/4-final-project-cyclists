const express = require('express');
const router = express.Router();
const {
    getIncidents,
    reportIncident,
    deleteIncident,
    getIncidentById
} = require('../controllers/incidentController');

router.get('/', getIncidents);
router.post('/', reportIncident);
router.delete('/:id', deleteIncident);
router.get('/:id', getIncidentById);

module.exports = router;