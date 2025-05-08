/**
 * Service for interacting with the legacy Java backend API
 */
import axios from 'axios';
import { convertLegacyPatient, convertPatientToLegacy } from '../utils/legacySystemUtils';

// Base URL for the legacy API
const LEGACY_API_BASE_URL = process.env.REACT_APP_LEGACY_API_URL || 'http://localhost:8080/api';

// Create an axios instance for the legacy API
const legacyApiClient = axios.create({
  baseURL: LEGACY_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to handle authentication
legacyApiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('legacy_token');
    
    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add branch context to the request
    const branch = localStorage.getItem('current_branch');
    if (branch) {
      config.headers['X-Branch-Id'] = branch;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Authenticate with the legacy system
 * @param username Username
 * @param password Password
 * @param branchId Branch ID
 * @returns Authentication response with token
 */
export const legacyLogin = async (username: string, password: string, branchId: string) => {
  try {
    const response = await legacyApiClient.post('/auth/login', {
      username,
      password,
      branchId,
    });
    
    // Store the token in localStorage
    if (response.data.token) {
      localStorage.setItem('legacy_token', response.data.token);
      localStorage.setItem('current_branch', branchId);
    }
    
    return response.data;
  } catch (error) {
    console.error('Legacy login error:', error);
    throw error;
  }
};

/**
 * Get patients from the legacy system
 * @param searchParams Search parameters
 * @returns List of patients
 */
export const getLegacyPatients = async (searchParams: any = {}) => {
  try {
    const response = await legacyApiClient.get('/patients', {
      params: searchParams,
    });
    
    // Convert legacy patients to our format
    const patients = response.data.map((patient: any) => convertLegacyPatient(patient));
    
    return patients;
  } catch (error) {
    console.error('Error fetching legacy patients:', error);
    throw error;
  }
};

/**
 * Get a patient by ID from the legacy system
 * @param patientId Patient ID
 * @returns Patient data
 */
export const getLegacyPatientById = async (patientId: string) => {
  try {
    const response = await legacyApiClient.get(`/patients/${patientId}`);
    
    // Convert legacy patient to our format
    const patient = convertLegacyPatient(response.data);
    
    return patient;
  } catch (error) {
    console.error(`Error fetching legacy patient with ID ${patientId}:`, error);
    throw error;
  }
};

/**
 * Create a new patient in the legacy system
 * @param patientData Patient data
 * @returns Created patient data
 */
export const createLegacyPatient = async (patientData: any) => {
  try {
    // Convert our patient format to legacy format
    const legacyPatientData = convertPatientToLegacy(patientData);
    
    const response = await legacyApiClient.post('/patients', legacyPatientData);
    
    // Convert the response back to our format
    const createdPatient = convertLegacyPatient(response.data);
    
    return createdPatient;
  } catch (error) {
    console.error('Error creating legacy patient:', error);
    throw error;
  }
};

/**
 * Update a patient in the legacy system
 * @param patientId Patient ID
 * @param patientData Patient data
 * @returns Updated patient data
 */
export const updateLegacyPatient = async (patientId: string, patientData: any) => {
  try {
    // Convert our patient format to legacy format
    const legacyPatientData = convertPatientToLegacy(patientData);
    
    const response = await legacyApiClient.put(`/patients/${patientId}`, legacyPatientData);
    
    // Convert the response back to our format
    const updatedPatient = convertLegacyPatient(response.data);
    
    return updatedPatient;
  } catch (error) {
    console.error(`Error updating legacy patient with ID ${patientId}:`, error);
    throw error;
  }
};

/**
 * Delete a patient in the legacy system
 * @param patientId Patient ID
 * @returns Success status
 */
export const deleteLegacyPatient = async (patientId: string) => {
  try {
    const response = await legacyApiClient.delete(`/patients/${patientId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting legacy patient with ID ${patientId}:`, error);
    throw error;
  }
};

/**
 * Search for patients in the legacy system
 * @param searchTerm Search term
 * @returns List of matching patients
 */
export const searchLegacyPatients = async (searchTerm: string) => {
  try {
    const response = await legacyApiClient.get('/patients/search', {
      params: { q: searchTerm },
    });
    
    // Convert legacy patients to our format
    const patients = response.data.map((patient: any) => convertLegacyPatient(patient));
    
    return patients;
  } catch (error) {
    console.error(`Error searching legacy patients with term "${searchTerm}":`, error);
    throw error;
  }
};

/**
 * Verify SHA (formerly NHIF) number in the legacy system
 * @param shaNumber SHA number
 * @returns Verification result
 */
export const verifyLegacySHA = async (shaNumber: string) => {
  try {
    const response = await legacyApiClient.get(`/insurance/verify/${shaNumber}`);
    return response.data;
  } catch (error) {
    console.error(`Error verifying legacy SHA number ${shaNumber}:`, error);
    throw error;
  }
};

/**
 * Get patient payment history from the legacy system
 * @param patientId Patient ID
 * @returns Payment history
 */
export const getLegacyPaymentHistory = async (patientId: string) => {
  try {
    const response = await legacyApiClient.get(`/patients/${patientId}/payments`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching legacy payment history for patient ${patientId}:`, error);
    throw error;
  }
};
