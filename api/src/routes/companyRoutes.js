import express from 'express';
const router = express.Router();
import * as companyController from '../controllers/companyController.js';

// GET all companies
router.get('/:search?', companyController.getAllCompanies);

// router.get('/', companyController.getAllCompanies);

// GET company by ID
// router.get('/:id', companyController.getCompanyById);

export default router;
