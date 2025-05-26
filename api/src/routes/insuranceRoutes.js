import express from 'express';
const router = express.Router();
import * as insuranceController from '../controllers/insuranceController.js';

// GET all insurances
router.get('/:search?', insuranceController.getAllInsurances);

// GET insurance by ID
// router.get('/:id', insuranceController.getInsuranceById);

export default router;
