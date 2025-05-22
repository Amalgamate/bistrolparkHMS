import express from 'express';
const router = express.Router();
import * as patientController from '../controllers/patientController.js';

// GET all patients
router.get('/', patientController.getAllPatients);

// GET patient by ID
router.get('/:id', patientController.getPatientById);

// POST create new patient
router.post('/', patientController.createPatient);

// PUT update patient
router.put('/:id', patientController.updatePatient);

// DELETE patient
router.delete('/:id', patientController.deletePatient);

export default router;
