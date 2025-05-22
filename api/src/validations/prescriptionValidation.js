import { body, param } from 'express-validator';

// Validation for creating a prescription
export const createPrescriptionValidation = [
  body('patient_id')
    .notEmpty().withMessage('Patient ID is required')
    .isInt().withMessage('Patient ID must be an integer'),
  
  body('doctor_id')
    .notEmpty().withMessage('Doctor ID is required')
    .isInt().withMessage('Doctor ID must be an integer'),
  
  body('prescription_date')
    .notEmpty().withMessage('Prescription date is required')
    .isISO8601().withMessage('Prescription date must be a valid date'),
  
  body('status')
    .notEmpty().withMessage('Status is required')
    .isString().withMessage('Status must be a string')
    .isIn(['pending', 'dispensed', 'cancelled'])
    .withMessage('Status must be pending, dispensed, or cancelled'),
  
  body('notes')
    .optional()
    .isString().withMessage('Notes must be a string'),
  
  body('items')
    .isArray().withMessage('Items must be an array')
    .notEmpty().withMessage('At least one item is required'),
  
  body('items.*.medication_id')
    .notEmpty().withMessage('Medication ID is required')
    .isInt().withMessage('Medication ID must be an integer'),
  
  body('items.*.dosage')
    .notEmpty().withMessage('Dosage is required')
    .isString().withMessage('Dosage must be a string'),
  
  body('items.*.frequency')
    .notEmpty().withMessage('Frequency is required')
    .isString().withMessage('Frequency must be a string'),
  
  body('items.*.duration')
    .notEmpty().withMessage('Duration is required')
    .isString().withMessage('Duration must be a string'),
  
  body('items.*.quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
  
  body('items.*.instructions')
    .optional()
    .isString().withMessage('Instructions must be a string'),
];

// Validation for updating prescription status
export const updatePrescriptionStatusValidation = [
  param('id')
    .isInt().withMessage('Prescription ID must be an integer'),
  
  body('status')
    .notEmpty().withMessage('Status is required')
    .isString().withMessage('Status must be a string')
    .isIn(['pending', 'dispensed', 'cancelled'])
    .withMessage('Status must be pending, dispensed, or cancelled'),
];

// Validation for getting a prescription by ID
export const getPrescriptionByIdValidation = [
  param('id')
    .isInt().withMessage('Prescription ID must be an integer'),
];

// Validation for getting prescriptions by patient ID
export const getPrescriptionsByPatientIdValidation = [
  param('patientId')
    .isInt().withMessage('Patient ID must be an integer'),
];

// Validation for deleting a prescription
export const deletePrescriptionValidation = [
  param('id')
    .isInt().withMessage('Prescription ID must be an integer'),
];
