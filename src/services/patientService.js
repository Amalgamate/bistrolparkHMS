import apiClient from './apiClient';

// In Vite, environment variables are accessed via import.meta.env instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const patientService = {
  /**
   * Get all patients with optional pagination
   * @param {number} limit - Number of patients to return
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Array>} - Array of patients
   */
  getAllPatients: async (limit = 10, offset = 0) => {
    try {
      const response = await apiClient.get(`/patients?limit=${limit}&offset=${offset}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  /**
   * Get a patient by ID
   * @param {string} id - Patient ID
   * @returns {Promise<Object>} - Patient object
   */
  getPatientById: async (id) => {
    try {
      const response = await apiClient.get(`/patients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patient with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Create a new patient
   * @param {Object} patientData - Patient data
   * @returns {Promise<Object>} - Created patient object
   */
  createPatient: async (patientData) => {
    try {
      const response = await apiClient.post(`/patients`, patientData);
      return response.data;
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },

  /**
   * Update an existing patient
   * @param {string} id - Patient ID
   * @param {Object} patientData - Updated patient data
   * @returns {Promise<Object>} - Updated patient object
   */
  updatePatient: async (id, patientData) => {
    try {
      const response = await apiClient.put(`/patients/${id}`, patientData);
      return response.data;
    } catch (error) {
      console.error(`Error updating patient with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Delete a patient
   * @param {string} id - Patient ID
   * @returns {Promise<Object>} - Response object
   */
  deletePatient: async (id) => {
    try {
      const response = await apiClient.delete(`/patients/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting patient with ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Search for patients
   * @param {string} query - Search query
   * @param {number} limit - Number of patients to return
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Array>} - Array of patients matching the search query
   */
  searchPatients: async (query, limit = 10, offset = 0) => {
    try {
      const response = await apiClient.get(`/patients/search?q=${query}&limit=${limit}&offset=${offset}`);
      return response.data;
    } catch (error) {
      console.error('Error searching patients:', error);
      throw error;
    }
  }
};

export default patientService;
