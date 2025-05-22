import express from 'express';
const router = express.Router();
import * as userController from '../controllers/userController.js';
import { validate, asyncHandler } from '../middleware/validation.js';
import {
  registerUserValidation,
  loginUserValidation,
  updateUserValidation,
  changePasswordValidation,
  getUserByIdValidation,
  getUsersByRoleValidation,
  deleteUserValidation
} from '../validations/userValidation.js';
import { auth, adminAuth } from '../middleware/auth.js';

// Authentication routes
router.post('/register', registerUserValidation, validate, asyncHandler(userController.registerUser));
router.post('/login', loginUserValidation, validate, asyncHandler(userController.loginUser));

// User management routes - Note: Role route must be before /:id to avoid conflicts
router.get('/role/:role', auth, getUsersByRoleValidation, validate, asyncHandler(userController.getUsersByRole));

// Get all users - Admin only
router.get('/', adminAuth, asyncHandler(userController.getAllUsers));

// Get user by ID
router.get('/:id', auth, getUserByIdValidation, validate, asyncHandler(userController.getUserById));

// Update user - Admin only
router.put('/:id', adminAuth, updateUserValidation, validate, asyncHandler(userController.updateUser));

// Change password - User can change their own password
router.patch('/:id/password', auth, changePasswordValidation, validate, asyncHandler(userController.changePassword));

// Delete user - Admin only
router.delete('/:id', adminAuth, deleteUserValidation, validate, asyncHandler(userController.deleteUser));

export default router;
