import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of a patient
export interface Patient {
  id: number;
  // File Numbers
  outPatientFileNumber?: string;
  oldReferenceNumber?: string;
  inPatientFileNumber?: string;

  // Personal Information
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  birthDay?: string;
  birthMonth?: string;
  birthYear?: string;
  gender: string;
  nationalId?: string; // National ID or Passport
  maritalStatus?: string;

  // Contact Information
  email: string;
  phone: string;
  residence: string; // Primary residence (required)
  address?: string; // Additional address (optional)
  city?: string;
  state?: string;
  zipCode?: string;

  // Medical Information
  bloodGroup?: string;
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;
  shaNumber?: string; // SHA (formerly NHIF) number
  paymentType?: string;

  // Next of Kin (required)
  nextOfKinName: string;
  nextOfKinPhone: string;

  // Emergency Contact (optional, can be different from Next of Kin)
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    holderName: string;
    coverageType?: string;
    coverageLimit?: number;
    expiryDate?: string;
  };

  // Payment history
  payments?: Array<{
    id: number;
    date: string;
    amount: number;
    paymentMethod: 'Cash' | 'Card' | 'Mobile Money' | 'Insurance' | 'Corporate';
    paymentType: 'Consultation' | 'Medication' | 'Lab Test' | 'Procedure' | 'Admission' | 'Other';
    reference: string;
    status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
    insuranceProvider?: string;
    insuranceCoverage?: number;
    patientResponsibility?: number;
    description?: string;
  }>;
  // Referral information
  referral?: {
    isReferred: boolean;
    referringHospital?: string;
    referringDoctor?: string;
    referralReason?: string;
    referralDate?: string;
  };
  // Vitals history
  vitals?: Array<{
    id: number;
    date: string;
    temperature?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    weight?: number;
    height?: number;
    pulseRate?: number;
    notes?: string;
  }>;
  lastVisit?: string;
  status: 'Active' | 'Inactive';
  isAdmitted?: boolean;
  isCleared?: boolean;
}

// Define the context shape
interface PatientContextType {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  addPatient: (patient: Omit<Patient, 'id'>) => Promise<any>;
  updatePatient: (id: number, patient: Partial<Patient>) => Promise<void>;
  deletePatient: (id: number) => Promise<void>;
  getPatient: (id: number) => Promise<Patient | undefined>;
}

// Create the context
const PatientContext = createContext<PatientContextType | undefined>(undefined);

// Empty array for initial patients - no hardcoded data
const INITIAL_PATIENTS: Patient[] = [];

// Import the patient service
import patientService from '../services/patientService';

// Create the provider component
export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch patients on component mount
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchPatients = async () => {
      try {
        if (isMounted) setLoading(true);

        // We're not requiring authentication for now
        console.log('Proceeding without authentication check for development');

        // Try to fetch patients from API with abort signal
        try {
          // Log that we're about to fetch patients
          console.log('Preparing to fetch patients from API');

          // Pass the abort signal to the service
          console.log('Calling patientService.getAllPatients()');
          const data = await patientService.getAllPatients();

          if (isMounted) {
            console.log('Patients fetched from API:', data);

            if (Array.isArray(data)) {
              console.log('Setting', data.length, 'patients from API response');
              setPatients(data);
            } else {
              console.warn('Unexpected API response format:', data);
              setPatients([]);
            }

            setError(null);
          }
        } catch (apiErr: any) {
          // Don't process if the request was aborted or component unmounted
          if (apiErr.name === 'AbortError' || !isMounted) {
            console.log('Patient fetch aborted or component unmounted');
            return;
          }

          console.error('Error fetching patients from API:', apiErr);

          if (isMounted) {
            // Check if it's an authentication error
            if (apiErr.response && apiErr.response.status === 401) {
              setError('Your session has expired. Please log in again.');
              // Clear token to force re-login
              localStorage.removeItem('token');
            } else {
              // If API fails for other reasons, check for locally stored patients
              try {
                const localPatients = JSON.parse(localStorage.getItem('localPatients') || '[]');
                if (localPatients.length > 0) {
                  console.log('Using locally stored patients:', localPatients);
                  setPatients(localPatients);
                  setError('Could not connect to API. Using locally stored patients.');
                } else {
                  console.log('No locally stored patients found');
                  setPatients([]);
                  setError('Failed to load patients from API. Starting with empty patient list.');
                }
              } catch (storageErr) {
                console.error('Error reading from localStorage:', storageErr);
                setPatients([]);
                setError('Failed to load patients from API and localStorage. Starting with empty patient list.');
              }
            }
          }
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPatients();

    // Cleanup function to run when component unmounts
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  // Add a new patient
  const addPatient = async (patient: Omit<Patient, 'id'>) => {
    try {
      // We're not requiring authentication for now
      console.log('Proceeding without authentication check for development');

      // Try to create the patient via API
      const newPatient = await patientService.createPatient(patient);
      console.log('Patient created successfully via API:', newPatient);

      // Update local state
      setPatients(prevPatients => [...prevPatients, newPatient as Patient]);

      // Also update local storage for offline access
      try {
        const localPatients = JSON.parse(localStorage.getItem('localPatients') || '[]');
        localStorage.setItem('localPatients', JSON.stringify([...localPatients, newPatient]));
      } catch (storageErr) {
        console.error('Error updating localStorage with new patient:', storageErr);
      }

      return newPatient;
    } catch (err: any) {
      console.error('Error creating patient via API:', err);

      // Check if it's an authentication error
      if (err.response && err.response.status === 401) {
        setError('Your session has expired. Please log in again.');
        // Clear token to force re-login
        localStorage.removeItem('token');
        throw new Error('Authentication required. Please log in again.');
      }

      // Fallback to local creation if API fails for other reasons
      const localNewPatient = {
        ...patient,
        id: patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1,
        status: 'Active' as const
      };

      console.log('Creating patient locally as fallback (API error):', localNewPatient);
      setPatients(prevPatients => [...prevPatients, localNewPatient as Patient]);

      // Store in localStorage for persistence across refreshes
      try {
        const localPatients = JSON.parse(localStorage.getItem('localPatients') || '[]');
        localStorage.setItem('localPatients', JSON.stringify([...localPatients, localNewPatient]));
        console.log('Patient saved to localStorage for persistence');
      } catch (storageErr) {
        console.error('Error saving patient to localStorage:', storageErr);
      }

      return localNewPatient;
    }
  };

  // Update an existing patient
  const updatePatient = async (id: number, updatedPatient: Partial<Patient>) => {
    try {
      // Check for token
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No authentication token found. User may need to log in.');
        setError('Authentication required. Please log in to update patients.');

        // Update locally anyway
        setPatients(
          patients.map(patient =>
            patient.id === id ? { ...patient, ...updatedPatient } : patient
          )
        );

        // Update localStorage
        try {
          const localPatients = JSON.parse(localStorage.getItem('localPatients') || '[]');
          const updatedLocalPatients = localPatients.map((patient: Patient) =>
            patient.id === id ? { ...patient, ...updatedPatient } : patient
          );
          localStorage.setItem('localPatients', JSON.stringify(updatedLocalPatients));
        } catch (storageErr) {
          console.error('Error updating patient in localStorage:', storageErr);
        }

        return;
      }

      // Try API update
      await patientService.updatePatient(id, updatedPatient);

      // Update local state
      setPatients(
        patients.map(patient =>
          patient.id === id ? { ...patient, ...updatedPatient } : patient
        )
      );

      // Update localStorage
      try {
        const localPatients = JSON.parse(localStorage.getItem('localPatients') || '[]');
        const updatedLocalPatients = localPatients.map((patient: Patient) =>
          patient.id === id ? { ...patient, ...updatedPatient } : patient
        );
        localStorage.setItem('localPatients', JSON.stringify(updatedLocalPatients));
      } catch (storageErr) {
        console.error('Error updating patient in localStorage:', storageErr);
      }
    } catch (err: any) {
      console.error('Error updating patient:', err);

      // Check if it's an authentication error
      if (err.response && err.response.status === 401) {
        setError('Your session has expired. Please log in again.');
        // Clear token to force re-login
        localStorage.removeItem('token');
      } else {
        // Fallback to local update if API fails for other reasons
        setPatients(
          patients.map(patient =>
            patient.id === id ? { ...patient, ...updatedPatient } : patient
          )
        );

        // Update localStorage
        try {
          const localPatients = JSON.parse(localStorage.getItem('localPatients') || '[]');
          const updatedLocalPatients = localPatients.map((patient: Patient) =>
            patient.id === id ? { ...patient, ...updatedPatient } : patient
          );
          localStorage.setItem('localPatients', JSON.stringify(updatedLocalPatients));
        } catch (storageErr) {
          console.error('Error updating patient in localStorage:', storageErr);
        }
      }
    }
  };

  // Delete a patient
  const deletePatient = async (id: number) => {
    try {
      // Check for token
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No authentication token found. User may need to log in.');
        setError('Authentication required. Please log in to delete patients.');

        // Delete locally anyway
        setPatients(patients.filter(patient => patient.id !== id));

        // Update localStorage
        try {
          const localPatients = JSON.parse(localStorage.getItem('localPatients') || '[]');
          const updatedLocalPatients = localPatients.filter((patient: Patient) => patient.id !== id);
          localStorage.setItem('localPatients', JSON.stringify(updatedLocalPatients));
        } catch (storageErr) {
          console.error('Error removing patient from localStorage:', storageErr);
        }

        return;
      }

      // Try API deletion
      await patientService.deletePatient(id);

      // Update local state
      setPatients(patients.filter(patient => patient.id !== id));

      // Update localStorage
      try {
        const localPatients = JSON.parse(localStorage.getItem('localPatients') || '[]');
        const updatedLocalPatients = localPatients.filter((patient: Patient) => patient.id !== id);
        localStorage.setItem('localPatients', JSON.stringify(updatedLocalPatients));
      } catch (storageErr) {
        console.error('Error removing patient from localStorage:', storageErr);
      }
    } catch (err: any) {
      console.error('Error deleting patient:', err);

      // Check if it's an authentication error
      if (err.response && err.response.status === 401) {
        setError('Your session has expired. Please log in again.');
        // Clear token to force re-login
        localStorage.removeItem('token');
      } else {
        // Fallback to local deletion if API fails for other reasons
        setPatients(patients.filter(patient => patient.id !== id));

        // Update localStorage
        try {
          const localPatients = JSON.parse(localStorage.getItem('localPatients') || '[]');
          const updatedLocalPatients = localPatients.filter((patient: Patient) => patient.id !== id);
          localStorage.setItem('localPatients', JSON.stringify(updatedLocalPatients));
        } catch (storageErr) {
          console.error('Error removing patient from localStorage:', storageErr);
        }
      }
    }
  };

  // Get a patient by ID
  const getPatient = async (id: number) => {
    try {
      // Check for token
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No authentication token found. User may need to log in.');
        setError('Authentication required. Please log in to access patient details.');

        // Try to find patient in local state
        const localPatient = patients.find(patient => patient.id === id);
        if (localPatient) {
          return localPatient;
        }

        // If not in state, try localStorage
        try {
          const localPatients = JSON.parse(localStorage.getItem('localPatients') || '[]');
          return localPatients.find((patient: Patient) => patient.id === id);
        } catch (storageErr) {
          console.error('Error reading from localStorage:', storageErr);
          return undefined;
        }
      }

      // Try API fetch
      return await patientService.getPatientById(id);
    } catch (err: any) {
      console.error(`Error fetching patient with ID ${id}:`, err);

      // Check if it's an authentication error
      if (err.response && err.response.status === 401) {
        setError('Your session has expired. Please log in again.');
        // Clear token to force re-login
        localStorage.removeItem('token');
      }

      // Fallback to local lookup if API fails
      const localPatient = patients.find(patient => patient.id === id);
      if (localPatient) {
        return localPatient;
      }

      // If not in state, try localStorage
      try {
        const localPatients = JSON.parse(localStorage.getItem('localPatients') || '[]');
        return localPatients.find((patient: Patient) => patient.id === id);
      } catch (storageErr) {
        console.error('Error reading from localStorage:', storageErr);
        return undefined;
      }
    }
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        loading,
        error,
        addPatient,
        updatePatient,
        deletePatient,
        getPatient
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

// Create a hook to use the patient context
export const usePatient = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};
