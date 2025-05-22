import apiClient from './apiClient';

export interface PrescriptionItem {
  id: number;
  prescription_id: number;
  medication_id: number;
  medication_name: string;
  medication_dosage: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions?: string;
  created_at: string;
  updated_at: string;
}

export interface Prescription {
  id: number;
  patient_id: number;
  doctor_id: number;
  patient_first_name: string;
  patient_last_name: string;
  doctor_first_name: string;
  doctor_last_name: string;
  prescription_date: string;
  status: 'pending' | 'dispensed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: PrescriptionItem[];
}

export interface PrescriptionItemFormData {
  medication_id: number;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
  instructions?: string;
}

export interface PrescriptionFormData {
  patient_id: number;
  doctor_id: number;
  prescription_date: string;
  status: 'pending' | 'dispensed' | 'cancelled';
  notes?: string;
  items: PrescriptionItemFormData[];
}

class PrescriptionService {
  /**
   * Get all prescriptions
   */
  async getAllPrescriptions(): Promise<Prescription[]> {
    try {
      const response = await apiClient.getPrescriptions();
      return response.data;
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      throw error;
    }
  }

  /**
   * Get prescription by ID
   */
  async getPrescriptionById(id: number | string): Promise<Prescription> {
    try {
      const response = await apiClient.getPrescriptionById(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching prescription with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get prescriptions by patient ID
   */
  async getPrescriptionsByPatientId(patientId: number | string): Promise<Prescription[]> {
    try {
      const response = await apiClient.getPrescriptionsByPatientId(patientId);
      return response.data;
    } catch (error) {
      console.error(`Error fetching prescriptions for patient ID ${patientId}:`, error);
      throw error;
    }
  }

  /**
   * Create a new prescription
   */
  async createPrescription(prescriptionData: PrescriptionFormData): Promise<Prescription> {
    try {
      const response = await apiClient.createPrescription(prescriptionData);
      return response.data;
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }
  }

  /**
   * Update prescription status
   */
  async updatePrescriptionStatus(
    id: number | string, 
    status: 'pending' | 'dispensed' | 'cancelled'
  ): Promise<Prescription> {
    try {
      const response = await apiClient.updatePrescriptionStatus(id, { status });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for prescription with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a prescription
   */
  async deletePrescription(id: number | string): Promise<void> {
    try {
      await apiClient.deletePrescription(id);
    } catch (error) {
      console.error(`Error deleting prescription with ID ${id}:`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const prescriptionService = new PrescriptionService();
export default prescriptionService;
