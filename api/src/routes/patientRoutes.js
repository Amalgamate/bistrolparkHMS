import express from 'express';
const router = express.Router();
import * as patientController from '../controllers/patientController.js';
import { validate, asyncHandler } from '../middleware/validation.js';
import {
  createPatientValidation,
  updatePatientValidation,
  getPatientByIdValidation,
  deletePatientValidation
} from '../validations/patientValidation.js';
import { auth } from '../middleware/auth.js';

// GET all patients
router.get('/', asyncHandler(patientController.getAllPatients));

// GET patient by ID
router.get('/:id', getPatientByIdValidation, validate, asyncHandler(patientController.getPatientById));

// POST create new patient
router.post('/', createPatientValidation, validate, asyncHandler(patientController.createPatient));

// PUT update patient
router.put('/:id', auth, updatePatientValidation, validate, asyncHandler(patientController.updatePatient));

// DELETE patient
router.delete('/:id', auth, deletePatientValidation, validate, asyncHandler(patientController.deletePatient));

export default router;
