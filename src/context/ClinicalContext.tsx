import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types for our clinical module
export type PatientStatus =
  | 'registered'        // Just registered
  | 'waiting_vitals'    // Waiting for vitals to be taken
  | 'vitals_taken'      // Vitals taken, waiting for doctor
  | 'with_doctor'       // Currently with doctor
  | 'lab_ordered'       // Lab tests ordered, waiting for results
  | 'lab_completed'     // Lab tests completed
  | 'pharmacy'          // Sent to pharmacy
  | 'admission'         // Admitted to hospital
  | 'completed'         // Visit completed
  | 'cancelled';        // Visit cancelled

export type Priority = 'normal' | 'urgent' | 'emergency';

export interface Vitals {
  temperature: number;
  bloodPressureSystolic: number;
  bloodPressureDiastolic: number;
  pulseRate: number;
  respiratoryRate: number;
  oxygenSaturation: number;
  height?: number;
  weight?: number;
  bmi?: number;
  notes?: string;
  recordedBy: string;
  recordedAt: string;
}

export interface LabTest {
  id: string;
  name: string;
  status: 'ordered' | 'sample_collected' | 'processing' | 'completed' | 'cancelled';
  orderedBy: string;
  orderedAt: string;
  results?: string;
  resultUploadedBy?: string;
  resultUploadedAt?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Diagnosis {
  id: string;
  description: string;
  type: 'provisional' | 'final';
  icdCode?: string;
}

export interface QueueEntry {
  id: string;
  patientId: string;
  patientName: string;
  tokenNumber: number;
  status: PatientStatus;
  priority: Priority;
  doctor?: string;
  doctorId?: string;
  registeredAt: string;
  estimatedWaitTime?: number; // in minutes
  vitals?: Vitals;
  labTests?: LabTest[];
  medications?: Medication[];
  diagnosis?: Diagnosis[];
  chiefComplaints?: string;
  notes?: string;
  lastUpdatedAt: string;
}

interface ClinicalContextType {
  // Queue state
  queue: QueueEntry[];

  // Queue management functions
  registerPatient: (patientId: string, patientName: string, priority?: Priority) => QueueEntry;
  updatePatientStatus: (queueId: string, status: PatientStatus) => void;
  assignDoctor: (queueId: string, doctorId: string, doctorName: string) => void;
  updatePriority: (queueId: string, priority: Priority) => void;

  // Clinical functions
  recordVitals: (queueId: string, vitals: Vitals) => void;
  orderLabTests: (queueId: string, tests: Omit<LabTest, 'id' | 'status' | 'orderedAt'>[]) => void;
  updateLabTestStatus: (queueId: string, testId: string, status: LabTest['status'], results?: string) => void;
  recordDiagnosis: (queueId: string, diagnosis: Omit<Diagnosis, 'id'>) => void;
  prescribeMedications: (queueId: string, medications: Omit<Medication, 'id'>[]) => void;

  // Utility functions
  getPatientQueue: (patientId: string) => QueueEntry | undefined;
  getDoctorQueue: (doctorId: string) => QueueEntry[];
  getQueueByStatus: (status: PatientStatus) => QueueEntry[];
  getQueueEntry: (queueId: string) => QueueEntry | undefined;

  // Notification functions
  notifyPatient: (queueId: string, message: string) => void;
  notifyDoctor: (doctorId: string, message: string) => void;
}

// Create the context
const ClinicalContext = createContext<ClinicalContextType | undefined>(undefined);

// Mock data for initial queue
const initialQueue: QueueEntry[] = [
  {
    id: '1',
    patientId: 'P001',
    patientName: 'John Kamau',
    tokenNumber: 1,
    status: 'with_doctor',
    priority: 'normal',
    doctor: 'Dr. Sarah Williams',
    doctorId: 'D001',
    registeredAt: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
    lastUpdatedAt: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    chiefComplaints: 'Fever, headache for 2 days',
    vitals: {
      temperature: 38.5,
      bloodPressureSystolic: 120,
      bloodPressureDiastolic: 80,
      pulseRate: 88,
      respiratoryRate: 16,
      oxygenSaturation: 98,
      height: 175,
      weight: 70,
      bmi: 22.9,
      recordedBy: 'Nurse Jane',
      recordedAt: new Date(Date.now() - 20 * 60000).toISOString() // 20 minutes ago
    }
  },
  {
    id: '2',
    patientId: 'P002',
    patientName: 'Mary Wanjiku',
    tokenNumber: 2,
    status: 'waiting_vitals',
    priority: 'normal',
    registeredAt: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
    estimatedWaitTime: 15,
    lastUpdatedAt: new Date(Date.now() - 30 * 60000).toISOString() // 30 minutes ago
  },
  {
    id: '3',
    patientId: 'P003',
    patientName: 'James Omondi',
    tokenNumber: 3,
    status: 'vitals_taken',
    priority: 'urgent',
    registeredAt: new Date(Date.now() - 20 * 60000).toISOString(), // 20 minutes ago
    estimatedWaitTime: 5,
    lastUpdatedAt: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
    vitals: {
      temperature: 39.2,
      bloodPressureSystolic: 135,
      bloodPressureDiastolic: 90,
      pulseRate: 95,
      respiratoryRate: 18,
      oxygenSaturation: 96,
      recordedBy: 'Nurse David',
      recordedAt: new Date(Date.now() - 10 * 60000).toISOString() // 10 minutes ago
    },
    chiefComplaints: 'Severe abdominal pain, vomiting'
  },
  {
    id: '4',
    patientId: 'P004',
    patientName: 'Grace Akinyi',
    tokenNumber: 4,
    status: 'registered',
    priority: 'normal',
    registeredAt: new Date(Date.now() - 10 * 60000).toISOString(), // 10 minutes ago
    estimatedWaitTime: 25,
    lastUpdatedAt: new Date(Date.now() - 10 * 60000).toISOString() // 10 minutes ago
  },
  {
    id: '5',
    patientId: 'P005',
    patientName: 'Peter Njoroge',
    tokenNumber: 5,
    status: 'lab_ordered',
    priority: 'normal',
    doctor: 'Dr. Michael Chen',
    doctorId: 'D002',
    registeredAt: new Date(Date.now() - 60 * 60000).toISOString(), // 60 minutes ago
    lastUpdatedAt: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
    vitals: {
      temperature: 37.2,
      bloodPressureSystolic: 118,
      bloodPressureDiastolic: 75,
      pulseRate: 72,
      respiratoryRate: 14,
      oxygenSaturation: 99,
      height: 180,
      weight: 75,
      bmi: 23.1,
      recordedBy: 'Nurse Jane',
      recordedAt: new Date(Date.now() - 50 * 60000).toISOString() // 50 minutes ago
    },
    chiefComplaints: 'Joint pain, fatigue',
    labTests: [
      {
        id: 'L001',
        name: 'Complete Blood Count',
        status: 'sample_collected',
        orderedBy: 'Dr. Michael Chen',
        orderedAt: new Date(Date.now() - 25 * 60000).toISOString() // 25 minutes ago
      },
      {
        id: 'L002',
        name: 'Rheumatoid Factor',
        status: 'ordered',
        orderedBy: 'Dr. Michael Chen',
        orderedAt: new Date(Date.now() - 25 * 60000).toISOString() // 25 minutes ago
      }
    ],
    diagnosis: [
      {
        id: 'D001',
        description: 'Suspected Rheumatoid Arthritis',
        type: 'provisional'
      }
    ]
  }
];

// Provider component
export const ClinicalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [queue, setQueue] = useState<QueueEntry[]>(initialQueue);

  // Queue management functions
  const registerPatient = useCallback((patientId: string, patientName: string, priority: Priority = 'normal') => {
    const lastToken = queue.length > 0
      ? Math.max(...queue.map(entry => entry.tokenNumber))
      : 0;

    const newEntry: QueueEntry = {
      id: uuidv4(),
      patientId,
      patientName,
      tokenNumber: lastToken + 1,
      status: 'registered',
      priority,
      registeredAt: new Date().toISOString(),
      estimatedWaitTime: priority === 'emergency' ? 0 : priority === 'urgent' ? 10 : 30,
      lastUpdatedAt: new Date().toISOString()
    };

    setQueue(prev => [...prev, newEntry]);
    return newEntry;
  }, [queue]);

  const updatePatientStatus = useCallback((queueId: string, status: PatientStatus) => {
    setQueue(prev => prev.map(entry =>
      entry.id === queueId
        ? {
            ...entry,
            status,
            lastUpdatedAt: new Date().toISOString(),
            // Update estimated wait time based on new status
            estimatedWaitTime:
              status === 'waiting_vitals' ? 10 :
              status === 'vitals_taken' ?
                entry.priority === 'emergency' ? 0 :
                entry.priority === 'urgent' ? 5 : 15 :
              undefined
          }
        : entry
    ));
  }, []);

  const assignDoctor = useCallback((queueId: string, doctorId: string, doctorName: string) => {
    setQueue(prev => prev.map(entry =>
      entry.id === queueId
        ? {
            ...entry,
            doctorId,
            doctor: doctorName,
            status: 'with_doctor',
            lastUpdatedAt: new Date().toISOString()
          }
        : entry
    ));
  }, []);

  const updatePriority = useCallback((queueId: string, priority: Priority) => {
    setQueue(prev => prev.map(entry =>
      entry.id === queueId
        ? {
            ...entry,
            priority,
            estimatedWaitTime:
              priority === 'emergency' ? 0 :
              priority === 'urgent' ?
                entry.status === 'vitals_taken' ? 5 : 10 :
                entry.status === 'vitals_taken' ? 15 : 30,
            lastUpdatedAt: new Date().toISOString()
          }
        : entry
    ));
  }, []);

  // Clinical functions
  const recordVitals = useCallback((queueId: string, vitals: Vitals) => {
    setQueue(prev => prev.map(entry =>
      entry.id === queueId
        ? {
            ...entry,
            vitals,
            status: 'vitals_taken',
            estimatedWaitTime:
              entry.priority === 'emergency' ? 0 :
              entry.priority === 'urgent' ? 5 : 15,
            lastUpdatedAt: new Date().toISOString()
          }
        : entry
    ));
  }, []);

  const orderLabTests = useCallback((queueId: string, tests: Omit<LabTest, 'id' | 'status' | 'orderedAt'>[]) => {
    setQueue(prev => prev.map(entry => {
      if (entry.id !== queueId) return entry;

      const newTests = tests.map(test => ({
        ...test,
        id: uuidv4(),
        status: 'ordered' as const,
        orderedAt: new Date().toISOString()
      }));

      return {
        ...entry,
        labTests: [...(entry.labTests || []), ...newTests],
        status: 'lab_ordered',
        lastUpdatedAt: new Date().toISOString()
      };
    }));
  }, []);

  const updateLabTestStatus = useCallback((queueId: string, testId: string, status: LabTest['status'], results?: string) => {
    setQueue(prev => prev.map(entry => {
      if (entry.id !== queueId || !entry.labTests) return entry;

      const updatedTests = entry.labTests.map(test =>
        test.id === testId
          ? {
              ...test,
              status,
              ...(results ? {
                results,
                resultUploadedBy: 'Lab Technician', // In a real app, this would be the current user
                resultUploadedAt: new Date().toISOString()
              } : {})
            }
          : test
      );

      // Check if all tests are completed
      const allCompleted = updatedTests.every(test =>
        test.status === 'completed' || test.status === 'cancelled'
      );

      return {
        ...entry,
        labTests: updatedTests,
        status: allCompleted ? 'lab_completed' : entry.status,
        lastUpdatedAt: new Date().toISOString()
      };
    }));
  }, []);

  const recordDiagnosis = useCallback((queueId: string, diagnosisData: Omit<Diagnosis, 'id'>) => {
    setQueue(prev => prev.map(entry => {
      if (entry.id !== queueId) return entry;

      const newDiagnosis = {
        ...diagnosisData,
        id: uuidv4()
      };

      return {
        ...entry,
        diagnosis: [...(entry.diagnosis || []), newDiagnosis],
        lastUpdatedAt: new Date().toISOString()
      };
    }));
  }, []);

  const prescribeMedications = useCallback((queueId: string, medications: Omit<Medication, 'id'>[]) => {
    setQueue(prev => prev.map(entry => {
      if (entry.id !== queueId) return entry;

      const newMedications = medications.map(med => ({
        ...med,
        id: uuidv4()
      }));

      return {
        ...entry,
        medications: [...(entry.medications || []), ...newMedications],
        status: 'pharmacy',
        lastUpdatedAt: new Date().toISOString()
      };
    }));
  }, []);

  // Utility functions
  const getPatientQueue = useCallback((patientId: string) => {
    return queue.find(entry => entry.patientId === patientId);
  }, [queue]);

  const getDoctorQueue = useCallback((doctorId: string) => {
    return queue.filter(entry => entry.doctorId === doctorId);
  }, [queue]);

  const getQueueByStatus = useCallback((status: PatientStatus) => {
    return queue.filter(entry => entry.status === status);
  }, [queue]);

  const getQueueEntry = useCallback((queueId: string) => {
    return queue.find(entry => entry.id === queueId);
  }, [queue]);

  // Notification functions
  const notifyPatient = useCallback((queueId: string, message: string) => {
    console.log(`Notification to patient (Queue ID: ${queueId}): ${message}`);

    // Find the queue entry
    const entry = queue.find(e => e.id === queueId);
    if (!entry) {
      console.warn(`Queue entry not found: ${queueId}`);
      return;
    }

    // In a real app, this would send an SMS or push notification
    // For now, we'll just log it
    console.log(`SMS to patient ${entry.patientName}: ${message}`);

    // Dispatch an event for other components to listen to
    const event = new CustomEvent('patient-notification', {
      detail: {
        queueId,
        patientId: entry.patientId,
        patientName: entry.patientName,
        tokenNumber: entry.tokenNumber,
        message
      }
    });
    window.dispatchEvent(event);
  }, [queue]);

  const notifyDoctor = useCallback((doctorId: string, message: string) => {
    console.log(`Notification to doctor (ID: ${doctorId}): ${message}`);

    // Find all queue entries assigned to this doctor
    const doctorEntries = queue.filter(e => e.doctorId === doctorId);

    // In a real app, this would send a notification to the doctor's dashboard
    // For now, we'll just log it
    console.log(`Dashboard notification to doctor ${doctorId}: ${message}`);

    // Dispatch an event for other components to listen to
    const event = new CustomEvent('doctor-notification', {
      detail: {
        doctorId,
        message,
        patients: doctorEntries.map(e => ({
          patientId: e.patientId,
          patientName: e.patientName,
          tokenNumber: e.tokenNumber,
          queueId: e.id
        }))
      }
    });
    window.dispatchEvent(event);
  }, [queue]);

  return (
    <ClinicalContext.Provider
      value={{
        queue,
        registerPatient,
        updatePatientStatus,
        assignDoctor,
        updatePriority,
        recordVitals,
        orderLabTests,
        updateLabTestStatus,
        recordDiagnosis,
        prescribeMedications,
        getPatientQueue,
        getDoctorQueue,
        getQueueByStatus,
        getQueueEntry,
        notifyPatient,
        notifyDoctor
      }}
    >
      {children}
    </ClinicalContext.Provider>
  );
};

// Hook for using the context
export const useClinical = () => {
  const context = useContext(ClinicalContext);
  if (context === undefined) {
    throw new Error('useClinical must be used within a ClinicalProvider');
  }
  return context;
};
