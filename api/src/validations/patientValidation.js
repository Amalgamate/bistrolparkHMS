import { body, param } from 'express-validator';

// Validation for creating a patient
export const createPatientValidation = [
  body('first_name')
    .notEmpty().withMessage('First name is required')
    .isString().withMessage('First name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  
  body('last_name')
    .notEmpty().withMessage('Last name is required')
    .isString().withMessage('Last name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  
  body('date_of_birth')
    .notEmpty().withMessage('Date of birth is required')
    .isDate().withMessage('Date of birth must be a valid date'),
  
  body('gender')
    .notEmpty().withMessage('Gender is required')
    .isString().withMessage('Gender must be a string')
    .isIn(['male', 'female', 'other']).withMessage('Gender must be male, female, or other'),
  
  body('email')
    .optional()
    .isEmail().withMessage('Email must be valid'),
  
  body('phone')
    .optional()
    .isString().withMessage('Phone must be a string')
    .matches(/^[0-9+\-\s()]*$/).withMessage('Phone number format is invalid'),
  
  body('address')
    .optional()
    .isString().withMessage('Address must be a string'),
  
  body('emergency_contact')
    .optional()
    .isString().withMessage('Emergency contact must be a string'),
  
  body('emergency_phone')
    .optional()
    .isString().withMessage('Emergency phone must be a string')
    .matches(/^[0-9+\-\s()]*$/).withMessage('Emergency phone number format is invalid'),
  
  body('blood_type')
    .optional()
    .isString().withMessage('Blood type must be a string')
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood type'),
  
  body('allergies')
    .optional()
    .isString().withMessage('Allergies must be a string'),
];

// Validation for updating a patient
export const updatePatientValidation = [
  param('id')
    .isInt().withMessage('Patient ID must be an integer'),
  
  ...createPatientValidation
];

// Validation for getting a patient by ID
export const getPatientByIdValidation = [
  param('id')
    .isInt().withMessage('Patient ID must be an integer'),
];

// Validation for deleting a patient
export const deletePatientValidation = [
  param('id')
    .isInt().withMessage('Patient ID must be an integer'),
];
