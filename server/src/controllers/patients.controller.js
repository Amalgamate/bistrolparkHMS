const Patient = require('../models/patient.model');

/**
 * Get all patients with pagination
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllPatients = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    const patients = await Patient.getAll(limit, offset);
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
};

/**
 * Get patient by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.getById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
};

/**
 * Get patient by MRN
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPatientByMRN = async (req, res) => {
  try {
    const patient = await Patient.getByMRN(req.params.mrn);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.status(200).json(patient);
  } catch (error) {
    console.error('Error fetching patient by MRN:', error);
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
};

/**
 * Create a new patient
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createPatient = async (req, res) => {
  try {
    // Check if MRN already exists
    if (req.body.mrn) {
      const existingPatient = await Patient.getByMRN(req.body.mrn);
      if (existingPatient) {
        return res.status(400).json({ message: 'Patient with this MRN already exists' });
      }
    }
    
    const newPatient = await Patient.create(req.body);
    res.status(201).json(newPatient);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ message: 'Error creating patient', error: error.message });
  }
};

/**
 * Update a patient
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updatePatient = async (req, res) => {
  try {
    const patient = await Patient.getById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const updatedPatient = await Patient.update(req.params.id, req.body);
    res.status(200).json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient:', error);
    res.status(500).json({ message: 'Error updating patient', error: error.message });
  }
};

/**
 * Delete a patient
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.getById(req.params.id);
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    const deleted = await Patient.delete(req.params.id);
    
    if (deleted) {
      res.status(200).json({ message: 'Patient deleted successfully' });
    } else {
      res.status(500).json({ message: 'Failed to delete patient' });
    }
  } catch (error) {
    console.error('Error deleting patient:', error);
    res.status(500).json({ message: 'Error deleting patient', error: error.message });
  }
};

/**
 * Search patients
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.searchPatients = async (req, res) => {
  try {
    const searchTerm = req.query.q;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    if (!searchTerm) {
      return res.status(400).json({ message: 'Search term is required' });
    }
    
    const patients = await Patient.search(searchTerm, limit, offset);
    res.status(200).json(patients);
  } catch (error) {
    console.error('Error searching patients:', error);
    res.status(500).json({ message: 'Error searching patients', error: error.message });
  }
};
