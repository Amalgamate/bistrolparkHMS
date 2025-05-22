import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types for maternity module
export type PregnancyStatus = 
  | 'prenatal'       // Prenatal care
  | 'labor'          // In labor
  | 'delivered'      // Delivered
  | 'postpartum'     // Postpartum care
  | 'discharged';    // Discharged from maternity care

export type DeliveryMethod = 
  | 'vaginal'        // Normal vaginal delivery
  | 'assisted'       // Assisted vaginal delivery (forceps, vacuum)
  | 'cesarean'       // Cesarean section
  | 'vbac';          // Vaginal birth after cesarean

export type DeliveryStatus = 
  | 'pending'        // Not yet delivered
  | 'in_progress'    // In active labor
  | 'completed'      // Delivery completed
  | 'complicated';   // Complicated delivery

export type NewbornStatus = 
  | 'healthy'        // Healthy newborn
  | 'observation'    // Under observation
  | 'nicu'           // In NICU
  | 'deceased';      // Deceased

export interface MaternityPatient {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  dateOfBirth: string;
  bloodType?: string;
  rhFactor?: '+' | '-';
  pregnancyStatus: PregnancyStatus;
  lmp?: string;                    // Last menstrual period
  edd?: string;                    // Estimated due date
  gravida: number;                 // Number of pregnancies
  para: number;                    // Number of births
  gestationalAge?: number;         // In weeks
  riskFactors?: string[];
  allergies?: string[];
  prenatalVisits?: {
    id: string;
    date: string;
    gestationalAge: number;
    weight: number;
    bloodPressure: string;
    fetalHeartRate?: number;
    notes?: string;
    nextAppointment?: string;
    provider: string;
  }[];
  admissionDate?: string;
  admissionTime?: string;
  admittedBy?: string;
  assignedRoom?: string;
  assignedBed?: string;
  attendingPhysician?: string;
  midwife?: string;
  notes?: string;
  lastUpdatedAt: string;
}

export interface Delivery {
  id: string;
  patientId: string;
  maternityPatientId: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryMethod: DeliveryMethod;
  status: DeliveryStatus;
  gestationalAge: number;
  attendingPhysician: string;
  midwife?: string;
  assistants?: string[];
  complications?: string[];
  bloodLoss?: number;
  anesthesia?: string;
  notes?: string;
  newborns: Newborn[];
  postpartumNotes?: string;
  lastUpdatedAt: string;
}

export interface Newborn {
  id: string;
  deliveryId: string;
  patientId?: string;
  motherPatientId: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth: string;
  timeOfBirth: string;
  gender: 'male' | 'female' | 'other';
  weight: number;           // in grams
  length: number;           // in cm
  headCircumference: number; // in cm
  apgarScores: {
    oneMinute: number;
    fiveMinutes: number;
    tenMinutes?: number;
  };
  status: NewbornStatus;
  bloodType?: string;
  rhFactor?: '+' | '-';
  complications?: string[];
  nicu?: boolean;
  nicuAdmissionReason?: string;
  nicuAdmissionDate?: string;
  nicuDischargeDate?: string;
  notes?: string;
  lastUpdatedAt: string;
}

export interface LaborProgress {
  id: string;
  patientId: string;
  maternityPatientId: string;
  startTime: string;
  stage: 'early' | 'active' | 'transition' | 'second' | 'third';
  cervicalDilation: number;  // in cm
  effacement: number;        // in percentage
  fetalPosition?: string;
  fetalHeartRate: number;    // in bpm
  maternalHeartRate: number; // in bpm
  bloodPressure: string;
  contractionFrequency: number; // in minutes
  contractionDuration: number;  // in seconds
  contractionIntensity: 'mild' | 'moderate' | 'strong';
  painLevel: number;         // 0-10 scale
  medication?: string;
  notes?: string;
  recordedBy: string;
  lastUpdatedAt: string;
}

export interface PostpartumCheckup {
  id: string;
  patientId: string;
  maternityPatientId: string;
  deliveryId: string;
  checkupDate: string;
  checkupTime: string;
  daysPostpartum: number;
  temperature: number;       // in Celsius
  bloodPressure: string;
  pulse: number;             // in bpm
  respiratoryRate: number;   // in breaths per minute
  lochia: 'rubra' | 'serosa' | 'alba' | 'none';
  uterusContraction: 'firm' | 'soft' | 'boggy';
  perinealStatus?: string;
  breastfeedingStatus?: string;
  painLevel: number;         // 0-10 scale
  emotionalStatus?: string;
  complications?: string[];
  medication?: string;
  notes?: string;
  followUpNeeded: boolean;
  followUpDate?: string;
  provider: string;
  lastUpdatedAt: string;
}

export interface NewbornCheckup {
  id: string;
  newbornId: string;
  patientId?: string;
  checkupDate: string;
  checkupTime: string;
  daysOld: number;
  weight: number;            // in grams
  length?: number;           // in cm
  headCircumference?: number; // in cm
  temperature: number;       // in Celsius
  heartRate: number;         // in bpm
  respiratoryRate: number;   // in breaths per minute
  feeding: 'breastfeeding' | 'formula' | 'mixed';
  feedingFrequency?: number; // in hours
  urine: number;             // number of wet diapers
  stool: number;             // number of bowel movements
  jaundice?: boolean;
  skinColor?: string;
  umbilicalCord?: string;
  reflexes?: string;
  complications?: string[];
  medication?: string;
  notes?: string;
  followUpNeeded: boolean;
  followUpDate?: string;
  provider: string;
  lastUpdatedAt: string;
}

interface MaternityContextType {
  // Patient management
  patients: MaternityPatient[];
  addPatient: (patient: Omit<MaternityPatient, 'id' | 'lastUpdatedAt'>) => MaternityPatient;
  updatePatientStatus: (patientId: string, status: PregnancyStatus) => void;
  addPrenatalVisit: (patientId: string, visit: Omit<MaternityPatient['prenatalVisits'][0], 'id'>) => void;
  admitPatient: (patientId: string, options: {
    admissionDate: string;
    admissionTime: string;
    admittedBy: string;
    assignedRoom?: string;
    assignedBed?: string;
    attendingPhysician: string;
    midwife?: string;
    notes?: string;
  }) => void;
  dischargePatient: (patientId: string, notes?: string) => void;
  
  // Delivery management
  deliveries: Delivery[];
  recordDelivery: (delivery: Omit<Delivery, 'id' | 'newborns' | 'lastUpdatedAt'>) => Delivery;
  updateDeliveryStatus: (deliveryId: string, status: DeliveryStatus) => void;
  addNewborn: (deliveryId: string, newborn: Omit<Newborn, 'id' | 'deliveryId' | 'lastUpdatedAt'>) => Newborn;
  
  // Labor progress tracking
  laborProgress: LaborProgress[];
  recordLaborProgress: (progress: Omit<LaborProgress, 'id' | 'lastUpdatedAt'>) => LaborProgress;
  
  // Postpartum care
  postpartumCheckups: PostpartumCheckup[];
  recordPostpartumCheckup: (checkup: Omit<PostpartumCheckup, 'id' | 'lastUpdatedAt'>) => PostpartumCheckup;
  
  // Newborn care
  newborns: Newborn[];
  newbornCheckups: NewbornCheckup[];
  recordNewbornCheckup: (checkup: Omit<NewbornCheckup, 'id' | 'lastUpdatedAt'>) => NewbornCheckup;
  updateNewbornStatus: (newbornId: string, status: NewbornStatus) => void;
  
  // Utility functions
  getPatientById: (patientId: string) => MaternityPatient | undefined;
  getPatientsByStatus: (status: PregnancyStatus) => MaternityPatient[];
  getDeliveryById: (deliveryId: string) => Delivery | undefined;
  getDeliveriesByPatient: (patientId: string) => Delivery[];
  getNewbornById: (newbornId: string) => Newborn | undefined;
  getNewbornsByMother: (motherPatientId: string) => Newborn[];
  getNewbornsByStatus: (status: NewbornStatus) => Newborn[];
  getLaborProgressByPatient: (patientId: string) => LaborProgress[];
  getPostpartumCheckupsByPatient: (patientId: string) => PostpartumCheckup[];
  getNewbornCheckupsByNewborn: (newbornId: string) => NewbornCheckup[];
}

const MaternityContext = createContext<MaternityContextType | undefined>(undefined);

export const MaternityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<MaternityPatient[]>([]);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [newborns, setNewborns] = useState<Newborn[]>([]);
  const [laborProgress, setLaborProgress] = useState<LaborProgress[]>([]);
  const [postpartumCheckups, setPostpartumCheckups] = useState<PostpartumCheckup[]>([]);
  const [newbornCheckups, setNewbornCheckups] = useState<NewbornCheckup[]>([]);

  // Patient management functions
  const addPatient = useCallback((patient: Omit<MaternityPatient, 'id' | 'lastUpdatedAt'>) => {
    const newPatient: MaternityPatient = {
      ...patient,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  }, []);

  const updatePatientStatus = useCallback((patientId: string, status: PregnancyStatus) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId
        ? { 
            ...patient, 
            pregnancyStatus: status,
            lastUpdatedAt: new Date().toISOString() 
          }
        : patient
    ));
  }, []);

  const addPrenatalVisit = useCallback((patientId: string, visit: Omit<MaternityPatient['prenatalVisits'][0], 'id'>) => {
    setPatients(prev => prev.map(patient => {
      if (patient.id === patientId) {
        const newVisit = {
          ...visit,
          id: uuidv4()
        };
        
        return { 
          ...patient, 
          prenatalVisits: [...(patient.prenatalVisits || []), newVisit],
          lastUpdatedAt: new Date().toISOString() 
        };
      }
      return patient;
    }));
  }, []);

  const admitPatient = useCallback((patientId: string, options: {
    admissionDate: string;
    admissionTime: string;
    admittedBy: string;
    assignedRoom?: string;
    assignedBed?: string;
    attendingPhysician: string;
    midwife?: string;
    notes?: string;
  }) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId
        ? { 
            ...patient, 
            pregnancyStatus: 'labor',
            ...options,
            lastUpdatedAt: new Date().toISOString() 
          }
        : patient
    ));
  }, []);

  const dischargePatient = useCallback((patientId: string, notes?: string) => {
    setPatients(prev => prev.map(patient => {
      if (patient.id === patientId) {
        return { 
          ...patient, 
          pregnancyStatus: 'discharged',
          notes: notes 
            ? (patient.notes ? `${patient.notes}\n\nDischarge notes: ${notes}` : `Discharge notes: ${notes}`)
            : patient.notes,
          lastUpdatedAt: new Date().toISOString() 
        };
      }
      return patient;
    }));
  }, []);

  // Delivery management functions
  const recordDelivery = useCallback((delivery: Omit<Delivery, 'id' | 'newborns' | 'lastUpdatedAt'>) => {
    const newDelivery: Delivery = {
      ...delivery,
      id: uuidv4(),
      newborns: [],
      lastUpdatedAt: new Date().toISOString()
    };

    setDeliveries(prev => [...prev, newDelivery]);
    
    // Update patient status to delivered
    updatePatientStatus(delivery.maternityPatientId, 'delivered');
    
    return newDelivery;
  }, [updatePatientStatus]);

  const updateDeliveryStatus = useCallback((deliveryId: string, status: DeliveryStatus) => {
    setDeliveries(prev => prev.map(delivery => 
      delivery.id === deliveryId
        ? { 
            ...delivery, 
            status,
            lastUpdatedAt: new Date().toISOString() 
          }
        : delivery
    ));
  }, []);

  const addNewborn = useCallback((deliveryId: string, newborn: Omit<Newborn, 'id' | 'deliveryId' | 'lastUpdatedAt'>) => {
    const newNewborn: Newborn = {
      ...newborn,
      id: uuidv4(),
      deliveryId,
      lastUpdatedAt: new Date().toISOString()
    };

    setNewborns(prev => [...prev, newNewborn]);
    
    // Add newborn to delivery
    setDeliveries(prev => prev.map(delivery => 
      delivery.id === deliveryId
        ? { 
            ...delivery, 
            newborns: [...delivery.newborns, newNewborn],
            lastUpdatedAt: new Date().toISOString() 
          }
        : delivery
    ));
    
    return newNewborn;
  }, []);

  // Labor progress tracking functions
  const recordLaborProgress = useCallback((progress: Omit<LaborProgress, 'id' | 'lastUpdatedAt'>) => {
    const newProgress: LaborProgress = {
      ...progress,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setLaborProgress(prev => [...prev, newProgress]);
    return newProgress;
  }, []);

  // Postpartum care functions
  const recordPostpartumCheckup = useCallback((checkup: Omit<PostpartumCheckup, 'id' | 'lastUpdatedAt'>) => {
    const newCheckup: PostpartumCheckup = {
      ...checkup,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setPostpartumCheckups(prev => [...prev, newCheckup]);
    
    // Update patient status to postpartum if not already
    const patient = patients.find(p => p.id === checkup.maternityPatientId);
    if (patient && patient.pregnancyStatus === 'delivered') {
      updatePatientStatus(checkup.maternityPatientId, 'postpartum');
    }
    
    return newCheckup;
  }, [patients, updatePatientStatus]);

  // Newborn care functions
  const recordNewbornCheckup = useCallback((checkup: Omit<NewbornCheckup, 'id' | 'lastUpdatedAt'>) => {
    const newCheckup: NewbornCheckup = {
      ...checkup,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setNewbornCheckups(prev => [...prev, newCheckup]);
    return newCheckup;
  }, []);

  const updateNewbornStatus = useCallback((newbornId: string, status: NewbornStatus) => {
    setNewborns(prev => prev.map(newborn => 
      newborn.id === newbornId
        ? { 
            ...newborn, 
            status,
            lastUpdatedAt: new Date().toISOString() 
          }
        : newborn
    ));
    
    // Also update the newborn in the delivery
    setDeliveries(prev => prev.map(delivery => {
      const updatedNewborns = delivery.newborns.map(nb => 
        nb.id === newbornId
          ? { 
              ...nb, 
              status,
              lastUpdatedAt: new Date().toISOString() 
            }
          : nb
      );
      
      return delivery.newborns.some(nb => nb.id === newbornId)
        ? { ...delivery, newborns: updatedNewborns, lastUpdatedAt: new Date().toISOString() }
        : delivery;
    }));
  }, []);

  // Utility functions
  const getPatientById = useCallback((patientId: string) => {
    return patients.find(patient => patient.id === patientId);
  }, [patients]);

  const getPatientsByStatus = useCallback((status: PregnancyStatus) => {
    return patients.filter(patient => patient.pregnancyStatus === status);
  }, [patients]);

  const getDeliveryById = useCallback((deliveryId: string) => {
    return deliveries.find(delivery => delivery.id === deliveryId);
  }, [deliveries]);

  const getDeliveriesByPatient = useCallback((patientId: string) => {
    return deliveries.filter(delivery => delivery.maternityPatientId === patientId);
  }, [deliveries]);

  const getNewbornById = useCallback((newbornId: string) => {
    return newborns.find(newborn => newborn.id === newbornId);
  }, [newborns]);

  const getNewbornsByMother = useCallback((motherPatientId: string) => {
    return newborns.filter(newborn => newborn.motherPatientId === motherPatientId);
  }, [newborns]);

  const getNewbornsByStatus = useCallback((status: NewbornStatus) => {
    return newborns.filter(newborn => newborn.status === status);
  }, [newborns]);

  const getLaborProgressByPatient = useCallback((patientId: string) => {
    return laborProgress.filter(progress => progress.maternityPatientId === patientId);
  }, [laborProgress]);

  const getPostpartumCheckupsByPatient = useCallback((patientId: string) => {
    return postpartumCheckups.filter(checkup => checkup.maternityPatientId === patientId);
  }, [postpartumCheckups]);

  const getNewbornCheckupsByNewborn = useCallback((newbornId: string) => {
    return newbornCheckups.filter(checkup => checkup.newbornId === newbornId);
  }, [newbornCheckups]);

  return (
    <MaternityContext.Provider
      value={{
        patients,
        addPatient,
        updatePatientStatus,
        addPrenatalVisit,
        admitPatient,
        dischargePatient,
        deliveries,
        recordDelivery,
        updateDeliveryStatus,
        addNewborn,
        laborProgress,
        recordLaborProgress,
        postpartumCheckups,
        recordPostpartumCheckup,
        newborns,
        newbornCheckups,
        recordNewbornCheckup,
        updateNewbornStatus,
        getPatientById,
        getPatientsByStatus,
        getDeliveryById,
        getDeliveriesByPatient,
        getNewbornById,
        getNewbornsByMother,
        getNewbornsByStatus,
        getLaborProgressByPatient,
        getPostpartumCheckupsByPatient,
        getNewbornCheckupsByNewborn
      }}
    >
      {children}
    </MaternityContext.Provider>
  );
};

// Hook for using the context
export const useMaternity = () => {
  const context = useContext(MaternityContext);
  if (context === undefined) {
    throw new Error('useMaternity must be used within a MaternityProvider');
  }
  return context;
};
