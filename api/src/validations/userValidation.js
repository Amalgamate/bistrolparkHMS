import { body, param } from 'express-validator';

// Validation for user registration
export const registerUserValidation = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isString().withMessage('Username must be a string')
    .isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isString().withMessage('Password must be a string')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid'),
  
  body('first_name')
    .notEmpty().withMessage('First name is required')
    .isString().withMessage('First name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  
  body('last_name')
    .notEmpty().withMessage('Last name is required')
    .isString().withMessage('Last name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  
  body('role')
    .notEmpty().withMessage('Role is required')
    .isString().withMessage('Role must be a string')
    .isIn(['admin', 'doctor', 'nurse', 'pharmacist', 'receptionist', 'lab_technician'])
    .withMessage('Role must be admin, doctor, nurse, pharmacist, receptionist, or lab_technician'),
];

// Validation for user login
export const loginUserValidation = [
  body('username')
    .notEmpty().withMessage('Username is required')
    .isString().withMessage('Username must be a string'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isString().withMessage('Password must be a string'),
];

// Validation for updating a user
export const updateUserValidation = [
  param('id')
    .isInt().withMessage('User ID must be an integer'),
  
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Email must be valid'),
  
  body('first_name')
    .notEmpty().withMessage('First name is required')
    .isString().withMessage('First name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  
  body('last_name')
    .notEmpty().withMessage('Last name is required')
    .isString().withMessage('Last name must be a string')
    .isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  
  body('role')
    .notEmpty().withMessage('Role is required')
    .isString().withMessage('Role must be a string')
    .isIn(['admin', 'doctor', 'nurse', 'pharmacist', 'receptionist', 'lab_technician'])
    .withMessage('Role must be admin, doctor, nurse, pharmacist, receptionist, or lab_technician'),
];

// Validation for changing password
export const changePasswordValidation = [
  param('id')
    .isInt().withMessage('User ID must be an integer'),
  
  body('current_password')
    .notEmpty().withMessage('Current password is required')
    .isString().withMessage('Current password must be a string'),
  
  body('new_password')
    .notEmpty().withMessage('New password is required')
    .isString().withMessage('New password must be a string')
    .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
];

// Validation for getting a user by ID
export const getUserByIdValidation = [
  param('id')
    .isInt().withMessage('User ID must be an integer'),
];

// Validation for getting users by role
export const getUsersByRoleValidation = [
  param('role')
    .isString().withMessage('Role must be a string')
    .isIn(['admin', 'doctor', 'nurse', 'pharmacist', 'receptionist', 'lab_technician'])
    .withMessage('Role must be admin, doctor, nurse, pharmacist, receptionist, or lab_technician'),
];

// Validation for deleting a user
export const deleteUserValidation = [
  param('id')
    .isInt().withMessage('User ID must be an integer'),
];
