import express from 'express';
import {
  createPatientVisit,
  processConsultationPayment,
  verifyInsuranceEligibility,
  getPatientFinancialSummary
} from '../controllers/enhancedFinancialController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Patient Registration → Cashier Workflow
router.post('/patient-visits', authenticateToken, createPatientVisit);
router.post('/process-payment', authenticateToken, processConsultationPayment);

// Insurance Verification
router.post('/verify-insurance', authenticateToken, verifyInsuranceEligibility);

// Enhanced Financial Data
router.get('/patients/:patientId/financial-summary', authenticateToken, getPatientFinancialSummary);

export default router;
