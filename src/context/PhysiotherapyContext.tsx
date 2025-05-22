import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types for physiotherapy module
export type PatientStatus = 
  | 'active'         // Currently receiving treatment
  | 'completed'      // Completed treatment plan
  | 'on_hold'        // Treatment temporarily on hold
  | 'discharged';    // Discharged from physiotherapy

export type SessionStatus = 
  | 'scheduled'      // Session is scheduled
  | 'in_progress'    // Session is in progress
  | 'completed'      // Session is completed
  | 'cancelled'      // Session is cancelled
  | 'no_show';       // Patient did not show up

export type TreatmentType = 
  | 'manual_therapy'       // Hands-on techniques
  | 'exercise_therapy'     // Therapeutic exercises
  | 'electrotherapy'       // Electrical stimulation
  | 'hydrotherapy'         // Water-based therapy
  | 'heat_therapy'         // Heat application
  | 'cold_therapy'         // Cold application
  | 'ultrasound'           // Ultrasound therapy
  | 'traction'             // Spinal traction
  | 'massage'              // Therapeutic massage
  | 'acupuncture'          // Acupuncture
  | 'dry_needling'         // Dry needling
  | 'laser_therapy'        // Laser therapy
  | 'shockwave_therapy';   // Shockwave therapy

export interface PhysiotherapyPatient {
  id: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  contactNumber?: string;
  email?: string;
  referringPhysician?: string;
  referralDate?: string;
  diagnosis: string;
  chiefComplaint: string;
  medicalHistory?: string[];
  medications?: string[];
  allergies?: string[];
  status: PatientStatus;
  treatmentPlan?: string;
  goals?: string[];
  notes?: string;
  lastUpdatedAt: string;
}

export interface PhysiotherapyAssessment {
  id: string;
  patientId: string;
  physiotherapyPatientId: string;
  assessmentDate: string;
  assessmentTime: string;
  therapistId: string;
  therapistName: string;
  subjective: string;
  objective: {
    rangeOfMotion?: {
      [joint: string]: {
        active?: string;
        passive?: string;
      };
    };
    strength?: {
      [muscleGroup: string]: string;
    };
    pain?: {
      location: string;
      intensity: number; // 0-10 scale
      quality: string;
      aggravatingFactors?: string[];
      relievingFactors?: string[];
    };
    specialTests?: {
      [testName: string]: 'positive' | 'negative' | 'inconclusive';
    };
    functionalAssessment?: string;
    gait?: string;
    posture?: string;
    balance?: string;
    coordination?: string;
    sensory?: string;
    edema?: string;
  };
  assessment: string;
  plan: {
    shortTermGoals?: string[];
    longTermGoals?: string[];
    treatmentPlan?: string;
    recommendedSessions?: number;
    frequency?: string;
    homeExercises?: string[];
    precautions?: string[];
  };
  notes?: string;
  lastUpdatedAt: string;
}

export interface PhysiotherapySession {
  id: string;
  patientId: string;
  physiotherapyPatientId: string;
  sessionNumber: number;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
  therapistId: string;
  therapistName: string;
  status: SessionStatus;
  treatmentsProvided?: {
    type: TreatmentType;
    details: string;
    duration?: number; // in minutes
  }[];
  exercisesPerformed?: {
    name: string;
    sets?: number;
    reps?: number;
    resistance?: string;
    notes?: string;
  }[];
  subjectiveReport?: string;
  objectiveFindings?: string;
  progress?: string;
  painLevel?: number; // 0-10 scale
  homeExercises?: string[];
  notes?: string;
  nextAppointment?: {
    date: string;
    time: string;
  };
  lastUpdatedAt: string;
}

export interface PhysiotherapyExercise {
  id: string;
  name: string;
  category: string;
  targetArea: string[];
  description: string;
  instructions: string[];
  precautions?: string[];
  contraindications?: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  imageUrls?: string[];
  videoUrl?: string;
  lastUpdatedAt: string;
}

export interface PhysiotherapyEquipment {
  id: string;
  name: string;
  category: string;
  location: string;
  status: 'available' | 'in_use' | 'maintenance' | 'out_of_order';
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  notes?: string;
  lastUpdatedAt: string;
}

export interface PhysiotherapyTherapist {
  id: string;
  name: string;
  specialization: string[];
  contactNumber?: string;
  email?: string;
  status: 'active' | 'inactive' | 'on_leave';
  schedule?: {
    [day: string]: {
      start: string;
      end: string;
    };
  };
  notes?: string;
  lastUpdatedAt: string;
}

interface PhysiotherapyContextType {
  // Patient management
  patients: PhysiotherapyPatient[];
  addPatient: (patient: Omit<PhysiotherapyPatient, 'id' | 'lastUpdatedAt'>) => PhysiotherapyPatient;
  updatePatient: (patientId: string, updates: Partial<Omit<PhysiotherapyPatient, 'id' | 'lastUpdatedAt'>>) => void;
  updatePatientStatus: (patientId: string, status: PatientStatus) => void;
  dischargePatient: (patientId: string, notes?: string) => void;
  
  // Assessment management
  assessments: PhysiotherapyAssessment[];
  addAssessment: (assessment: Omit<PhysiotherapyAssessment, 'id' | 'lastUpdatedAt'>) => PhysiotherapyAssessment;
  updateAssessment: (assessmentId: string, updates: Partial<Omit<PhysiotherapyAssessment, 'id' | 'lastUpdatedAt'>>) => void;
  
  // Session management
  sessions: PhysiotherapySession[];
  scheduleSession: (session: Omit<PhysiotherapySession, 'id' | 'lastUpdatedAt'>) => PhysiotherapySession;
  updateSessionStatus: (sessionId: string, status: SessionStatus) => void;
  completeSession: (sessionId: string, sessionData: {
    treatmentsProvided?: PhysiotherapySession['treatmentsProvided'];
    exercisesPerformed?: PhysiotherapySession['exercisesPerformed'];
    subjectiveReport?: string;
    objectiveFindings?: string;
    progress?: string;
    painLevel?: number;
    homeExercises?: string[];
    notes?: string;
    nextAppointment?: {
      date: string;
      time: string;
    };
  }) => void;
  cancelSession: (sessionId: string, reason: string) => void;
  
  // Exercise management
  exercises: PhysiotherapyExercise[];
  addExercise: (exercise: Omit<PhysiotherapyExercise, 'id' | 'lastUpdatedAt'>) => PhysiotherapyExercise;
  updateExercise: (exerciseId: string, updates: Partial<Omit<PhysiotherapyExercise, 'id' | 'lastUpdatedAt'>>) => void;
  
  // Equipment management
  equipment: PhysiotherapyEquipment[];
  addEquipment: (equipment: Omit<PhysiotherapyEquipment, 'id' | 'lastUpdatedAt'>) => PhysiotherapyEquipment;
  updateEquipmentStatus: (equipmentId: string, status: PhysiotherapyEquipment['status']) => void;
  
  // Therapist management
  therapists: PhysiotherapyTherapist[];
  addTherapist: (therapist: Omit<PhysiotherapyTherapist, 'id' | 'lastUpdatedAt'>) => PhysiotherapyTherapist;
  updateTherapistStatus: (therapistId: string, status: PhysiotherapyTherapist['status']) => void;
  
  // Utility functions
  getPatientById: (patientId: string) => PhysiotherapyPatient | undefined;
  getPatientsByStatus: (status: PatientStatus) => PhysiotherapyPatient[];
  getAssessmentsByPatient: (patientId: string) => PhysiotherapyAssessment[];
  getSessionsByPatient: (patientId: string) => PhysiotherapySession[];
  getSessionsByDate: (date: string) => PhysiotherapySession[];
  getSessionsByTherapist: (therapistId: string) => PhysiotherapySession[];
  getSessionsByStatus: (status: SessionStatus) => PhysiotherapySession[];
  getExercisesByCategory: (category: string) => PhysiotherapyExercise[];
  getExercisesByTargetArea: (targetArea: string) => PhysiotherapyExercise[];
  getEquipmentByCategory: (category: string) => PhysiotherapyEquipment[];
  getEquipmentByStatus: (status: PhysiotherapyEquipment['status']) => PhysiotherapyEquipment[];
  getTherapistsBySpecialization: (specialization: string) => PhysiotherapyTherapist[];
  getTherapistsByStatus: (status: PhysiotherapyTherapist['status']) => PhysiotherapyTherapist[];
  checkTherapistAvailability: (therapistId: string, date: string, startTime: string, duration: number) => boolean;
}

const PhysiotherapyContext = createContext<PhysiotherapyContextType | undefined>(undefined);

export const PhysiotherapyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<PhysiotherapyPatient[]>([]);
  const [assessments, setAssessments] = useState<PhysiotherapyAssessment[]>([]);
  const [sessions, setSessions] = useState<PhysiotherapySession[]>([]);
  const [exercises, setExercises] = useState<PhysiotherapyExercise[]>([]);
  const [equipment, setEquipment] = useState<PhysiotherapyEquipment[]>([]);
  const [therapists, setTherapists] = useState<PhysiotherapyTherapist[]>([]);

  // Patient management functions
  const addPatient = useCallback((patient: Omit<PhysiotherapyPatient, 'id' | 'lastUpdatedAt'>) => {
    const newPatient: PhysiotherapyPatient = {
      ...patient,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setPatients(prev => [...prev, newPatient]);
    return newPatient;
  }, []);

  const updatePatient = useCallback((patientId: string, updates: Partial<Omit<PhysiotherapyPatient, 'id' | 'lastUpdatedAt'>>) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId
        ? { 
            ...patient, 
            ...updates,
            lastUpdatedAt: new Date().toISOString() 
          }
        : patient
    ));
  }, []);

  const updatePatientStatus = useCallback((patientId: string, status: PatientStatus) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId
        ? { 
            ...patient, 
            status,
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
          status: 'discharged',
          notes: notes 
            ? (patient.notes ? `${patient.notes}\n\nDischarge notes: ${notes}` : `Discharge notes: ${notes}`)
            : patient.notes,
          lastUpdatedAt: new Date().toISOString() 
        };
      }
      return patient;
    }));
  }, []);

  // Assessment management functions
  const addAssessment = useCallback((assessment: Omit<PhysiotherapyAssessment, 'id' | 'lastUpdatedAt'>) => {
    const newAssessment: PhysiotherapyAssessment = {
      ...assessment,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setAssessments(prev => [...prev, newAssessment]);
    return newAssessment;
  }, []);

  const updateAssessment = useCallback((assessmentId: string, updates: Partial<Omit<PhysiotherapyAssessment, 'id' | 'lastUpdatedAt'>>) => {
    setAssessments(prev => prev.map(assessment => 
      assessment.id === assessmentId
        ? { 
            ...assessment, 
            ...updates,
            lastUpdatedAt: new Date().toISOString() 
          }
        : assessment
    ));
  }, []);

  // Session management functions
  const scheduleSession = useCallback((session: Omit<PhysiotherapySession, 'id' | 'lastUpdatedAt'>) => {
    const newSession: PhysiotherapySession = {
      ...session,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setSessions(prev => [...prev, newSession]);
    return newSession;
  }, []);

  const updateSessionStatus = useCallback((sessionId: string, status: SessionStatus) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId
        ? { 
            ...session, 
            status,
            lastUpdatedAt: new Date().toISOString() 
          }
        : session
    ));
  }, []);

  const completeSession = useCallback((sessionId: string, sessionData: {
    treatmentsProvided?: PhysiotherapySession['treatmentsProvided'];
    exercisesPerformed?: PhysiotherapySession['exercisesPerformed'];
    subjectiveReport?: string;
    objectiveFindings?: string;
    progress?: string;
    painLevel?: number;
    homeExercises?: string[];
    notes?: string;
    nextAppointment?: {
      date: string;
      time: string;
    };
  }) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId
        ? { 
            ...session, 
            ...sessionData,
            status: 'completed',
            lastUpdatedAt: new Date().toISOString() 
          }
        : session
    ));
  }, []);

  const cancelSession = useCallback((sessionId: string, reason: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId
        ? { 
            ...session, 
            status: 'cancelled',
            notes: session.notes ? `${session.notes}\n\nCancellation reason: ${reason}` : `Cancellation reason: ${reason}`,
            lastUpdatedAt: new Date().toISOString() 
          }
        : session
    ));
  }, []);

  // Exercise management functions
  const addExercise = useCallback((exercise: Omit<PhysiotherapyExercise, 'id' | 'lastUpdatedAt'>) => {
    const newExercise: PhysiotherapyExercise = {
      ...exercise,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setExercises(prev => [...prev, newExercise]);
    return newExercise;
  }, []);

  const updateExercise = useCallback((exerciseId: string, updates: Partial<Omit<PhysiotherapyExercise, 'id' | 'lastUpdatedAt'>>) => {
    setExercises(prev => prev.map(exercise => 
      exercise.id === exerciseId
        ? { 
            ...exercise, 
            ...updates,
            lastUpdatedAt: new Date().toISOString() 
          }
        : exercise
    ));
  }, []);

  // Equipment management functions
  const addEquipment = useCallback((equipment: Omit<PhysiotherapyEquipment, 'id' | 'lastUpdatedAt'>) => {
    const newEquipment: PhysiotherapyEquipment = {
      ...equipment,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setEquipment(prev => [...prev, newEquipment]);
    return newEquipment;
  }, []);

  const updateEquipmentStatus = useCallback((equipmentId: string, status: PhysiotherapyEquipment['status']) => {
    setEquipment(prev => prev.map(equipment => 
      equipment.id === equipmentId
        ? { 
            ...equipment, 
            status,
            lastUpdatedAt: new Date().toISOString() 
          }
        : equipment
    ));
  }, []);

  // Therapist management functions
  const addTherapist = useCallback((therapist: Omit<PhysiotherapyTherapist, 'id' | 'lastUpdatedAt'>) => {
    const newTherapist: PhysiotherapyTherapist = {
      ...therapist,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setTherapists(prev => [...prev, newTherapist]);
    return newTherapist;
  }, []);

  const updateTherapistStatus = useCallback((therapistId: string, status: PhysiotherapyTherapist['status']) => {
    setTherapists(prev => prev.map(therapist => 
      therapist.id === therapistId
        ? { 
            ...therapist, 
            status,
            lastUpdatedAt: new Date().toISOString() 
          }
        : therapist
    ));
  }, []);

  // Utility functions
  const getPatientById = useCallback((patientId: string) => {
    return patients.find(patient => patient.id === patientId);
  }, [patients]);

  const getPatientsByStatus = useCallback((status: PatientStatus) => {
    return patients.filter(patient => patient.status === status);
  }, [patients]);

  const getAssessmentsByPatient = useCallback((patientId: string) => {
    return assessments.filter(assessment => assessment.physiotherapyPatientId === patientId);
  }, [assessments]);

  const getSessionsByPatient = useCallback((patientId: string) => {
    return sessions.filter(session => session.physiotherapyPatientId === patientId);
  }, [sessions]);

  const getSessionsByDate = useCallback((date: string) => {
    return sessions.filter(session => session.scheduledDate === date);
  }, [sessions]);

  const getSessionsByTherapist = useCallback((therapistId: string) => {
    return sessions.filter(session => session.therapistId === therapistId);
  }, [sessions]);

  const getSessionsByStatus = useCallback((status: SessionStatus) => {
    return sessions.filter(session => session.status === status);
  }, [sessions]);

  const getExercisesByCategory = useCallback((category: string) => {
    return exercises.filter(exercise => exercise.category === category);
  }, [exercises]);

  const getExercisesByTargetArea = useCallback((targetArea: string) => {
    return exercises.filter(exercise => exercise.targetArea.includes(targetArea));
  }, [exercises]);

  const getEquipmentByCategory = useCallback((category: string) => {
    return equipment.filter(eq => eq.category === category);
  }, [equipment]);

  const getEquipmentByStatus = useCallback((status: PhysiotherapyEquipment['status']) => {
    return equipment.filter(eq => eq.status === status);
  }, [equipment]);

  const getTherapistsBySpecialization = useCallback((specialization: string) => {
    return therapists.filter(therapist => therapist.specialization.includes(specialization));
  }, [therapists]);

  const getTherapistsByStatus = useCallback((status: PhysiotherapyTherapist['status']) => {
    return therapists.filter(therapist => therapist.status === status);
  }, [therapists]);

  const checkTherapistAvailability = useCallback((therapistId: string, date: string, startTime: string, duration: number) => {
    // Get all sessions for the specified therapist and date
    const therapistSessions = sessions.filter(
      session => session.therapistId === therapistId && 
                 session.scheduledDate === date &&
                 ['scheduled', 'in_progress'].includes(session.status)
    );
    
    if (therapistSessions.length === 0) return true;
    
    // Convert start time to minutes since midnight
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startTimeMinutes = startHour * 60 + startMinute;
    const endTimeMinutes = startTimeMinutes + duration;
    
    // Check for overlaps with existing sessions
    for (const session of therapistSessions) {
      const [sessionHour, sessionMinute] = session.scheduledTime.split(':').map(Number);
      const sessionStartMinutes = sessionHour * 60 + sessionMinute;
      const sessionEndMinutes = sessionStartMinutes + session.duration;
      
      // Check if there's an overlap
      if (
        (startTimeMinutes >= sessionStartMinutes && startTimeMinutes < sessionEndMinutes) ||
        (endTimeMinutes > sessionStartMinutes && endTimeMinutes <= sessionEndMinutes) ||
        (startTimeMinutes <= sessionStartMinutes && endTimeMinutes >= sessionEndMinutes)
      ) {
        return false;
      }
    }
    
    return true;
  }, [sessions]);

  return (
    <PhysiotherapyContext.Provider
      value={{
        patients,
        addPatient,
        updatePatient,
        updatePatientStatus,
        dischargePatient,
        assessments,
        addAssessment,
        updateAssessment,
        sessions,
        scheduleSession,
        updateSessionStatus,
        completeSession,
        cancelSession,
        exercises,
        addExercise,
        updateExercise,
        equipment,
        addEquipment,
        updateEquipmentStatus,
        therapists,
        addTherapist,
        updateTherapistStatus,
        getPatientById,
        getPatientsByStatus,
        getAssessmentsByPatient,
        getSessionsByPatient,
        getSessionsByDate,
        getSessionsByTherapist,
        getSessionsByStatus,
        getExercisesByCategory,
        getExercisesByTargetArea,
        getEquipmentByCategory,
        getEquipmentByStatus,
        getTherapistsBySpecialization,
        getTherapistsByStatus,
        checkTherapistAvailability
      }}
    >
      {children}
    </PhysiotherapyContext.Provider>
  );
};

// Hook for using the context
export const usePhysiotherapy = () => {
  const context = useContext(PhysiotherapyContext);
  if (context === undefined) {
    throw new Error('usePhysiotherapy must be used within a PhysiotherapyProvider');
  }
  return context;
};
