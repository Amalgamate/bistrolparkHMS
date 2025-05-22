const express = require('express');
const router = express.Router();
const patientsController = require('../controllers/patients.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Get all patients
router.get('/', patientsController.getAllPatients);

// Search patients
router.get('/search', patientsController.searchPatients);

// Get patient by MRN
router.get('/mrn/:mrn', patientsController.getPatientByMRN);

// Get patient by ID
router.get('/:id', patientsController.getPatientById);

// Create new patient
router.post('/', patientsController.createPatient);

// Update patient
router.put('/:id', patientsController.updatePatient);

// Delete patient
router.delete('/:id', patientsController.deletePatient);

module.exports = router;
