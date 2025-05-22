import express from 'express';
const router = express.Router();
import * as medicationController from '../controllers/medicationController.js';

// GET all medications
router.get('/', medicationController.getAllMedications);

// GET search medications
router.get('/search', medicationController.searchMedications);

// GET medication by ID
router.get('/:id', medicationController.getMedicationById);

// POST create new medication
router.post('/', medicationController.createMedication);

// PUT update medication
router.put('/:id', medicationController.updateMedication);

// PATCH update medication stock
router.patch('/:id/stock', medicationController.updateMedicationStock);

// DELETE medication
router.delete('/:id', medicationController.deleteMedication);

export default router;
