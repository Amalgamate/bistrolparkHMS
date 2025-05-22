import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types for emergency module
export type TriageLevel = 
  | 'red'      // Immediate - life-threatening
  | 'orange'   // Very urgent - potentially life-threatening
  | 'yellow'   // Urgent - serious but not life-threatening
  | 'green'    // Standard - standard treatment required
  | 'blue';    // Non-urgent - minor injuries/illnesses

export type EmergencyPatientStatus =
  | 'waiting_triage'    // Waiting for triage assessment
  | 'triaged'           // Triage completed, waiting for treatment
  | 'in_treatment'      // Currently receiving treatment
  | 'awaiting_results'  // Waiting for test results
  | 'awaiting_decision' // Waiting for admission/discharge decision
  | 'admitted'          // Admitted to hospital
  | 'discharged'        // Discharged from emergency
  | 'transferred'       // Transferred to another facility
  | 'deceased'          // Patient deceased
  | 'left';             // Left without being seen

export interface VitalSigns {
  temperature?: number;
  heartRate?: number;
  respiratoryRate?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  oxygenSaturation?: number;
  painScore?: number;
  glucoseLevel?: number;
  gcs?: number; // Glasgow Coma Scale
  recordedAt: string;
}

export interface TriageAssessment {
  id: string;
  level: TriageLevel;
  chiefComplaint: string;
  vitalSigns: VitalSigns;
  notes?: string;
  assessedBy: string;
  assessedAt: string;
}

export interface EmergencyTest {
  id: string;
  name: string;
  status: 'ordered' | 'in_progress' | 'completed' | 'cancelled';
  orderedAt: string;
  completedAt?: string;
  results?: string;
  orderedBy: string;
}

export interface EmergencyTreatment {
  id: string;
  name: string;
  status: 'ordered' | 'in_progress' | 'completed' | 'cancelled';
  orderedAt: string;
  completedAt?: string;
  notes?: string;
  orderedBy: string;
  administeredBy?: string;
}

export interface EmergencyPatient {
  id: string;
  patientId: string;
  patientName: string;
  arrivalMethod: 'ambulance' | 'walk_in' | 'transfer';
  arrivalTime: string;
  status: EmergencyPatientStatus;
  triageAssessment?: TriageAssessment;
  assignedDoctor?: string;
  assignedNurse?: string;
  assignedBed?: string;
  tests: EmergencyTest[];
  treatments: EmergencyTreatment[];
  disposition?: {
    decision: 'discharge' | 'admit' | 'transfer' | 'deceased' | 'left';
    time: string;
    notes?: string;
    by: string;
  };
  lastUpdatedAt: string;
}

export interface EmergencyBed {
  id: string;
  name: string;
  type: 'regular' | 'trauma' | 'isolation' | 'pediatric' | 'resuscitation';
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance';
  patientId?: string;
  lastUpdatedAt: string;
}

interface EmergencyContextType {
  // Patient management
  patients: EmergencyPatient[];
  registerPatient: (patientId: string, patientName: string, arrivalMethod: EmergencyPatient['arrivalMethod']) => EmergencyPatient;
  updatePatientStatus: (emergencyId: string, status: EmergencyPatientStatus) => void;
  assignDoctor: (emergencyId: string, doctorId: string, doctorName: string) => void;
  assignNurse: (emergencyId: string, nurseId: string, nurseName: string) => void;
  assignBed: (emergencyId: string, bedId: string) => void;
  
  // Triage management
  performTriage: (emergencyId: string, assessment: Omit<TriageAssessment, 'id' | 'assessedAt'>) => void;
  
  // Test management
  orderTest: (emergencyId: string, testName: string, orderedBy: string) => void;
  updateTestStatus: (emergencyId: string, testId: string, status: EmergencyTest['status'], results?: string) => void;
  
  // Treatment management
  orderTreatment: (emergencyId: string, treatmentName: string, orderedBy: string) => void;
  updateTreatmentStatus: (emergencyId: string, treatmentId: string, status: EmergencyTreatment['status'], notes?: string, administeredBy?: string) => void;
  
  // Disposition management
  recordDisposition: (emergencyId: string, decision: EmergencyPatient['disposition']['decision'], by: string, notes?: string) => void;
  
  // Bed management
  beds: EmergencyBed[];
  addBed: (name: string, type: EmergencyBed['type']) => void;
  updateBedStatus: (bedId: string, status: EmergencyBed['status'], patientId?: string) => void;
  
  // Utility functions
  getPatientById: (emergencyId: string) => EmergencyPatient | undefined;
  getPatientsByStatus: (status: EmergencyPatientStatus) => EmergencyPatient[];
  getPatientsByTriageLevel: (level: TriageLevel) => EmergencyPatient[];
  getAvailableBeds: () => EmergencyBed[];
  getBedsByType: (type: EmergencyBed['type']) => EmergencyBed[];
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<EmergencyPatient[]>([]);
  const [beds, setBeds] = useState<EmergencyBed[]>([]);

  // Patient management functions
  const registerPatient = useCallback((patientId: string, patientName: string, arrivalMethod: EmergencyPatient['arrivalMethod']) => {
    const newPatient: EmergencyPatient = {
      id: uuidv4(),
      patientId,
      patientName,
      arrivalMethod,
      arrivalTime: new Date().toISOString(),
      status: 'waiting_triage',
      tests: [],
      treatments: [],
      lastUpdatedAt: new Date().toISOString()
    };

    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  }, []);

  const updatePatientStatus = useCallback((emergencyId: string, status: EmergencyPatientStatus) => {
    setPatients(prev => prev.map(patient => 
      patient.id === emergencyId
        ? { ...patient, status, lastUpdatedAt: new Date().toISOString() }
        : patient
    ));
  }, []);

  const assignDoctor = useCallback((emergencyId: string, doctorId: string, doctorName: string) => {
    setPatients(prev => prev.map(patient => 
      patient.id === emergencyId
        ? { ...patient, assignedDoctor: doctorName, lastUpdatedAt: new Date().toISOString() }
        : patient
    ));
  }, []);

  const assignNurse = useCallback((emergencyId: string, nurseId: string, nurseName: string) => {
    setPatients(prev => prev.map(patient => 
      patient.id === emergencyId
        ? { ...patient, assignedNurse: nurseName, lastUpdatedAt: new Date().toISOString() }
        : patient
    ));
  }, []);

  const assignBed = useCallback((emergencyId: string, bedId: string) => {
    // Update patient with bed assignment
    setPatients(prev => prev.map(patient => 
      patient.id === emergencyId
        ? { ...patient, assignedBed: bedId, lastUpdatedAt: new Date().toISOString() }
        : patient
    ));
    
    // Update bed status to occupied
    const patient = patients.find(p => p.id === emergencyId);
    if (patient) {
      updateBedStatus(bedId, 'occupied', patient.patientId);
    }
  }, [patients]);

  // Triage management functions
  const performTriage = useCallback((emergencyId: string, assessment: Omit<TriageAssessment, 'id' | 'assessedAt'>) => {
    const triageAssessment: TriageAssessment = {
      ...assessment,
      id: uuidv4(),
      assessedAt: new Date().toISOString()
    };

    setPatients(prev => prev.map(patient => 
      patient.id === emergencyId
        ? { 
            ...patient, 
            triageAssessment, 
            status: 'triaged',
            lastUpdatedAt: new Date().toISOString() 
          }
        : patient
    ));
  }, []);

  // Test management functions
  const orderTest = useCallback((emergencyId: string, testName: string, orderedBy: string) => {
    const newTest: EmergencyTest = {
      id: uuidv4(),
      name: testName,
      status: 'ordered',
      orderedAt: new Date().toISOString(),
      orderedBy
    };

    setPatients(prev => prev.map(patient => 
      patient.id === emergencyId
        ? { 
            ...patient, 
            tests: [...patient.tests, newTest],
            lastUpdatedAt: new Date().toISOString() 
          }
        : patient
    ));
  }, []);

  const updateTestStatus = useCallback((emergencyId: string, testId: string, status: EmergencyTest['status'], results?: string) => {
    setPatients(prev => prev.map(patient => 
      patient.id === emergencyId
        ? { 
            ...patient, 
            tests: patient.tests.map(test => 
              test.id === testId
                ? { 
                    ...test, 
                    status, 
                    ...(status === 'completed' ? { completedAt: new Date().toISOString(), results } : {})
                  }
                : test
            ),
            lastUpdatedAt: new Date().toISOString() 
          }
        : patient
    ));
  }, []);

  // Treatment management functions
  const orderTreatment = useCallback((emergencyId: string, treatmentName: string, orderedBy: string) => {
    const newTreatment: EmergencyTreatment = {
      id: uuidv4(),
      name: treatmentName,
      status: 'ordered',
      orderedAt: new Date().toISOString(),
      orderedBy
    };

    setPatients(prev => prev.map(patient => 
      patient.id === emergencyId
        ? { 
            ...patient, 
            treatments: [...patient.treatments, newTreatment],
            lastUpdatedAt: new Date().toISOString() 
          }
        : patient
    ));
  }, []);

  const updateTreatmentStatus = useCallback((emergencyId: string, treatmentId: string, status: EmergencyTreatment['status'], notes?: string, administeredBy?: string) => {
    setPatients(prev => prev.map(patient => 
      patient.id === emergencyId
        ? { 
            ...patient, 
            treatments: patient.treatments.map(treatment => 
              treatment.id === treatmentId
                ? { 
                    ...treatment, 
                    status, 
                    ...(status === 'completed' ? { completedAt: new Date().toISOString(), notes, administeredBy } : {})
                  }
                : treatment
            ),
            lastUpdatedAt: new Date().toISOString() 
          }
        : patient
    ));
  }, []);

  // Disposition management functions
  const recordDisposition = useCallback((emergencyId: string, decision: EmergencyPatient['disposition']['decision'], by: string, notes?: string) => {
    setPatients(prev => prev.map(patient => 
      patient.id === emergencyId
        ? { 
            ...patient, 
            disposition: {
              decision,
              time: new Date().toISOString(),
              notes,
              by
            },
            status: decision === 'discharge' ? 'discharged' : 
                   decision === 'admit' ? 'admitted' : 
                   decision === 'transfer' ? 'transferred' : 
                   decision === 'deceased' ? 'deceased' : 'left',
            lastUpdatedAt: new Date().toISOString() 
          }
        : patient
    ));

    // If patient had a bed assigned, free it up
    const patient = patients.find(p => p.id === emergencyId);
    if (patient && patient.assignedBed) {
      updateBedStatus(patient.assignedBed, 'cleaning');
    }
  }, [patients]);

  // Bed management functions
  const addBed = useCallback((name: string, type: EmergencyBed['type']) => {
    const newBed: EmergencyBed = {
      id: uuidv4(),
      name,
      type,
      status: 'available',
      lastUpdatedAt: new Date().toISOString()
    };

    setBeds(prev => [...prev, newBed]);
  }, []);

  const updateBedStatus = useCallback((bedId: string, status: EmergencyBed['status'], patientId?: string) => {
    setBeds(prev => prev.map(bed => 
      bed.id === bedId
        ? { 
            ...bed, 
            status, 
            patientId: status === 'occupied' ? patientId : undefined,
            lastUpdatedAt: new Date().toISOString() 
          }
        : bed
    ));
  }, []);

  // Utility functions
  const getPatientById = useCallback((emergencyId: string) => {
    return patients.find(patient => patient.id === emergencyId);
  }, [patients]);

  const getPatientsByStatus = useCallback((status: EmergencyPatientStatus) => {
    return patients.filter(patient => patient.status === status);
  }, [patients]);

  const getPatientsByTriageLevel = useCallback((level: TriageLevel) => {
    return patients.filter(patient => patient.triageAssessment?.level === level);
  }, [patients]);

  const getAvailableBeds = useCallback(() => {
    return beds.filter(bed => bed.status === 'available');
  }, [beds]);

  const getBedsByType = useCallback((type: EmergencyBed['type']) => {
    return beds.filter(bed => bed.type === type);
  }, [beds]);

  return (
    <EmergencyContext.Provider
      value={{
        patients,
        registerPatient,
        updatePatientStatus,
        assignDoctor,
        assignNurse,
        assignBed,
        performTriage,
        orderTest,
        updateTestStatus,
        orderTreatment,
        updateTreatmentStatus,
        recordDisposition,
        beds,
        addBed,
        updateBedStatus,
        getPatientById,
        getPatientsByStatus,
        getPatientsByTriageLevel,
        getAvailableBeds,
        getBedsByType
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

// Hook for using the context
export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (context === undefined) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
