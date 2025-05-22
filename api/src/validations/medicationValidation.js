import { body, param, query } from 'express-validator';

// Validation for creating a medication
export const createMedicationValidation = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  
  body('generic_name')
    .optional()
    .isString().withMessage('Generic name must be a string'),
  
  body('category')
    .optional()
    .isString().withMessage('Category must be a string'),
  
  body('form')
    .optional()
    .isString().withMessage('Form must be a string'),
  
  body('strength')
    .optional()
    .isString().withMessage('Strength must be a string'),
  
  body('manufacturer')
    .optional()
    .isString().withMessage('Manufacturer must be a string'),
  
  body('stock_quantity')
    .notEmpty().withMessage('Stock quantity is required')
    .isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
  
  body('reorder_level')
    .optional()
    .isInt({ min: 0 }).withMessage('Reorder level must be a non-negative integer'),
  
  body('unit_price')
    .notEmpty().withMessage('Unit price is required')
    .isFloat({ min: 0 }).withMessage('Unit price must be a non-negative number'),
];

// Validation for updating a medication
export const updateMedicationValidation = [
  param('id')
    .isInt().withMessage('Medication ID must be an integer'),
  
  ...createMedicationValidation
];

// Validation for updating medication stock
export const updateMedicationStockValidation = [
  param('id')
    .isInt().withMessage('Medication ID must be an integer'),
  
  body('stock_quantity')
    .notEmpty().withMessage('Stock quantity is required')
    .isInt({ min: 0 }).withMessage('Stock quantity must be a non-negative integer'),
];

// Validation for getting a medication by ID
export const getMedicationByIdValidation = [
  param('id')
    .isInt().withMessage('Medication ID must be an integer'),
];

// Validation for searching medications
export const searchMedicationsValidation = [
  query('query')
    .notEmpty().withMessage('Search query is required')
    .isString().withMessage('Search query must be a string'),
];

// Validation for deleting a medication
export const deleteMedicationValidation = [
  param('id')
    .isInt().withMessage('Medication ID must be an integer'),
];
