import express from 'express';
const router = express.Router();
import * as prescriptionController from '../controllers/prescriptionController.js';
import { validate, asyncHandler } from '../middleware/validation.js';
import {
  createPrescriptionValidation,
  updatePrescriptionStatusValidation,
  getPrescriptionByIdValidation,
  getPrescriptionsByPatientIdValidation,
  deletePrescriptionValidation
} from '../validations/prescriptionValidation.js';
import { auth, doctorAuth } from '../middleware/auth.js';

// GET all prescriptions
router.get('/', auth, asyncHandler(prescriptionController.getAllPrescriptions));

// GET prescriptions by patient ID - Note: This route must be before /:id to avoid conflicts
router.get('/patient/:patientId', auth, getPrescriptionsByPatientIdValidation, validate,
  asyncHandler(prescriptionController.getPrescriptionsByPatientId));

// GET prescription by ID
router.get('/:id', auth, getPrescriptionByIdValidation, validate,
  asyncHandler(prescriptionController.getPrescriptionById));

// POST create new prescription - Only doctors can create prescriptions
router.post('/', doctorAuth, createPrescriptionValidation, validate,
  asyncHandler(prescriptionController.createPrescription));

// PATCH update prescription status
router.patch('/:id/status', auth, updatePrescriptionStatusValidation, validate,
  asyncHandler(prescriptionController.updatePrescriptionStatus));

// DELETE prescription - Only doctors can delete prescriptions
router.delete('/:id', doctorAuth, deletePrescriptionValidation, validate,
  asyncHandler(prescriptionController.deletePrescription));

export default router;
