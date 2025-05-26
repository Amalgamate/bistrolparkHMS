import express from 'express';
const router = express.Router();
import * as financialController from '../controllers/financialController.js';
import { auth } from '../middleware/auth.js';

// Patient financial endpoints
router.get('/patients/:patientId/invoices', auth, financialController.getPatientInvoices);
router.get('/patients/:patientId/payments', auth, financialController.getPatientPayments);
router.get('/patients/:patientId/billing-summary', auth, financialController.getPatientBillingSummary);
router.get('/patients/:patientId/insurance-claims', auth, financialController.getPatientInsuranceClaims);

// Invoice management
router.post('/invoices', auth, financialController.createInvoice);
router.get('/invoices/:invoiceId', auth, financialController.getInvoiceById);
router.put('/invoices/:invoiceId', auth, financialController.updateInvoice);
router.delete('/invoices/:invoiceId', auth, financialController.deleteInvoice);

// Payment processing
router.post('/payments', auth, financialController.createPayment);
router.get('/payments/:paymentId', auth, financialController.getPaymentById);
router.put('/payments/:paymentId/status', auth, financialController.updatePaymentStatus);

// Insurance claims
router.post('/insurance-claims', auth, financialController.createInsuranceClaim);
router.get('/insurance-claims/:claimId', auth, financialController.getInsuranceClaimById);
router.put('/insurance-claims/:claimId/status', auth, financialController.updateInsuranceClaimStatus);

// M-Pesa integration endpoints
router.post('/payments/mpesa/initiate', auth, financialController.initiateMpesaPayment);
router.post('/payments/mpesa/callback', financialController.handleMpesaCallback);

export default router;
