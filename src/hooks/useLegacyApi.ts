/**
 * Hook for interacting with the legacy Java backend API
 */
import { useState, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import * as legacyApiService from '../services/legacyApiService';

export const useLegacyApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  /**
   * Login to the legacy system
   */
  const login = useCallback(async (username: string, password: string, branchId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await legacyApiService.legacyLogin(username, password, branchId);
      setIsLoading(false);
      return result;
    } catch (err: any) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.message || 'Failed to login to legacy system';
      setError(errorMessage);
      showToast('error', errorMessage);
      throw err;
    }
  }, [showToast]);

  /**
   * Get patients from the legacy system
   */
  const getPatients = useCallback(async (searchParams?: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const patients = await legacyApiService.getLegacyPatients(searchParams);
      setIsLoading(false);
      return patients;
    } catch (err: any) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.message || 'Failed to fetch patients from legacy system';
      setError(errorMessage);
      showToast('error', errorMessage);
      throw err;
    }
  }, [showToast]);

  /**
   * Get a patient by ID from the legacy system
   */
  const getPatientById = useCallback(async (patientId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const patient = await legacyApiService.getLegacyPatientById(patientId);
      setIsLoading(false);
      return patient;
    } catch (err: any) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.message || `Failed to fetch patient with ID ${patientId} from legacy system`;
      setError(errorMessage);
      showToast('error', errorMessage);
      throw err;
    }
  }, [showToast]);

  /**
   * Create a new patient in the legacy system
   */
  const createPatient = useCallback(async (patientData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const createdPatient = await legacyApiService.createLegacyPatient(patientData);
      setIsLoading(false);
      showToast('success', 'Patient created successfully in legacy system');
      return createdPatient;
    } catch (err: any) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.message || 'Failed to create patient in legacy system';
      setError(errorMessage);
      showToast('error', errorMessage);
      throw err;
    }
  }, [showToast]);

  /**
   * Update a patient in the legacy system
   */
  const updatePatient = useCallback(async (patientId: string, patientData: any) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedPatient = await legacyApiService.updateLegacyPatient(patientId, patientData);
      setIsLoading(false);
      showToast('success', 'Patient updated successfully in legacy system');
      return updatedPatient;
    } catch (err: any) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.message || `Failed to update patient with ID ${patientId} in legacy system`;
      setError(errorMessage);
      showToast('error', errorMessage);
      throw err;
    }
  }, [showToast]);

  /**
   * Delete a patient in the legacy system
   */
  const deletePatient = useCallback(async (patientId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await legacyApiService.deleteLegacyPatient(patientId);
      setIsLoading(false);
      showToast('success', 'Patient deleted successfully from legacy system');
      return result;
    } catch (err: any) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.message || `Failed to delete patient with ID ${patientId} from legacy system`;
      setError(errorMessage);
      showToast('error', errorMessage);
      throw err;
    }
  }, [showToast]);

  /**
   * Search for patients in the legacy system
   */
  const searchPatients = useCallback(async (searchTerm: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const patients = await legacyApiService.searchLegacyPatients(searchTerm);
      setIsLoading(false);
      return patients;
    } catch (err: any) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.message || `Failed to search patients with term "${searchTerm}" in legacy system`;
      setError(errorMessage);
      showToast('error', errorMessage);
      throw err;
    }
  }, [showToast]);

  /**
   * Verify SHA (formerly NHIF) number in the legacy system
   */
  const verifySHA = useCallback(async (shaNumber: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await legacyApiService.verifyLegacySHA(shaNumber);
      setIsLoading(false);
      return result;
    } catch (err: any) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.message || `Failed to verify SHA number ${shaNumber} in legacy system`;
      setError(errorMessage);
      showToast('error', errorMessage);
      throw err;
    }
  }, [showToast]);

  /**
   * Get patient payment history from the legacy system
   */
  const getPaymentHistory = useCallback(async (patientId: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const paymentHistory = await legacyApiService.getLegacyPaymentHistory(patientId);
      setIsLoading(false);
      return paymentHistory;
    } catch (err: any) {
      setIsLoading(false);
      const errorMessage = err.response?.data?.message || `Failed to fetch payment history for patient ${patientId} from legacy system`;
      setError(errorMessage);
      showToast('error', errorMessage);
      throw err;
    }
  }, [showToast]);

  return {
    isLoading,
    error,
    login,
    getPatients,
    getPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    searchPatients,
    verifySHA,
    getPaymentHistory,
  };
};

export default useLegacyApi;
