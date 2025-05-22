import apiClient from './apiClient';

export interface Patient {
  id: number;
  patient_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  address?: string;
  phone?: string;
  email?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  blood_type?: string;
  allergies?: string;
  created_at: string;
  updated_at: string;
}

export interface PatientFormData {
  patient_id?: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  address?: string;
  phone?: string;
  email?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  blood_type?: string;
  allergies?: string;
}

class PatientService {
  /**
   * Get all patients
   */
  async getAllPatients(): Promise<Patient[]> {
    try {
      console.log('Attempting to fetch patients from API');

      // Use apiClient to make the request
      console.log('Using apiClient to fetch patients');
      const response = await apiClient.getPatients();
      console.log('API response for patient fetch:', response);

      // Process the response data
      let patientsData;

      if (response.data && Array.isArray(response.data)) {
        // Standard array response
        patientsData = response.data;
        console.log('API returned array with', patientsData.length, 'patients');
      } else if (response.data && response.data.rows && Array.isArray(response.data.rows)) {
        // Handle case where API returns { rows: [...] }
        patientsData = response.data.rows;
        console.log('API returned rows array with', patientsData.length, 'patients');
      } else if (response.data && response.data.value && Array.isArray(response.data.value)) {
        // Handle case where API returns { value: [...] }
        patientsData = response.data.value;
        console.log('API returned value array with', patientsData.length, 'patients');
      } else {
        // Unknown format
        console.warn('Unexpected API response format:', response.data);
        patientsData = [];
      }

      // Adapt the data format to match the frontend expectations
      const adaptedPatients = patientsData.map((patient: any) => ({
        id: patient.id,
        firstName: patient.first_name,
        lastName: patient.last_name,
        dateOfBirth: patient.date_of_birth,
        gender: patient.gender,
        address: patient.address,
        phone: patient.phone,
        email: patient.email,
        bloodGroup: patient.blood_type,
        allergies: patient.allergies,
        status: 'Active',
        mrn: patient.mrn
      }));

      // Store patients in localStorage for offline access
      if (adaptedPatients.length > 0) {
        localStorage.setItem('localPatients', JSON.stringify(adaptedPatients));
        console.log('Stored', adaptedPatients.length, 'patients in localStorage');
      }

      return adaptedPatients;
    } catch (error: any) {
      console.error('Error fetching patients:', error);
      console.error('Error details:', error.response?.data || 'No response data');
      console.error('Error status:', error.response?.status || 'No status code');

      // Try to get locally stored patients as fallback
      try {
        const localPatients = localStorage.getItem('localPatients');
        if (localPatients) {
          console.log('Falling back to locally stored patients');
          return JSON.parse(localPatients);
        }
      } catch (storageErr) {
        console.error('Error reading from localStorage:', storageErr);
      }

      throw error;
    }
  }

  /**
   * Get patient by ID
   */
  async getPatientById(id: number | string): Promise<Patient> {
    try {
      const response = await apiClient.getPatientById(id);
      return response.data;
    } catch (error) {
      console.error(`Error fetching patient with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new patient
   */
  async createPatient(patientData: PatientFormData): Promise<Patient> {
    try {
      // Adapt the data format to match the database schema
      const adaptedData = {
        first_name: patientData.first_name || patientData.firstName,
        last_name: patientData.last_name || patientData.lastName,
        date_of_birth: patientData.date_of_birth || patientData.dateOfBirth,
        gender: patientData.gender,
        address: patientData.address || '',
        phone: patientData.phone || '',
        email: patientData.email || '',
        blood_type: patientData.blood_type || patientData.bloodGroup || '',
        allergies: patientData.allergies || ''
      };

      // Generate an MRN if not provided
      const mrn = `BP${Math.floor(10000 + Math.random() * 90000)}`;

      console.log('Attempting to create patient via API:', {...adaptedData, mrn});
      const response = await apiClient.createPatient({...adaptedData, mrn});
      console.log('API response for patient creation:', response);
      return response.data;
    } catch (error: any) {
      console.error('Error creating patient:', error);
      console.error('Error details:', error.response?.data || 'No response data');
      console.error('Error status:', error.response?.status || 'No status code');
      throw error;
    }
  }

  /**
   * Update an existing patient
   */
  async updatePatient(id: number | string, patientData: PatientFormData): Promise<Patient> {
    try {
      const response = await apiClient.updatePatient(id, patientData);
      return response.data;
    } catch (error) {
      console.error(`Error updating patient with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a patient
   */
  async deletePatient(id: number | string): Promise<void> {
    try {
      await apiClient.deletePatient(id);
    } catch (error) {
      console.error(`Error deleting patient with ID ${id}:`, error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const patientService = new PatientService();
export default patientService;
