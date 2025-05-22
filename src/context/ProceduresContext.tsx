import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types for procedures module
export type ProcedureStatus = 
  | 'scheduled'      // Procedure is scheduled
  | 'in_progress'    // Procedure is in progress
  | 'completed'      // Procedure is completed
  | 'cancelled'      // Procedure is cancelled
  | 'postponed';     // Procedure is postponed

export type ProcedureType =
  | 'surgical'       // Surgical procedures
  | 'diagnostic'     // Diagnostic procedures
  | 'therapeutic'    // Therapeutic procedures
  | 'preventive'     // Preventive procedures
  | 'cosmetic';      // Cosmetic procedures

export type ProcedureCategory =
  | 'minor'          // Minor procedures
  | 'major'          // Major procedures
  | 'emergency';     // Emergency procedures

export type ProcedureLocation =
  | 'operating_room'     // Main operating room
  | 'procedure_room'     // Procedure room
  | 'bedside'            // Bedside procedure
  | 'outpatient'         // Outpatient procedure
  | 'emergency_room';    // Emergency room

export type ProcedureRiskLevel =
  | 'low'            // Low risk
  | 'moderate'       // Moderate risk
  | 'high';          // High risk

export type AnesthesiaType =
  | 'none'               // No anesthesia
  | 'local'              // Local anesthesia
  | 'regional'           // Regional anesthesia
  | 'general'            // General anesthesia
  | 'sedation';          // Conscious sedation

export interface Procedure {
  id: string;
  patientId: string;
  patientName: string;
  procedureName: string;
  procedureCode?: string;
  type: ProcedureType;
  category: ProcedureCategory;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  estimatedDuration: number; // in minutes
  location: ProcedureLocation;
  primaryPhysician: string;
  assistingStaff?: string[];
  anesthesiaType: AnesthesiaType;
  anesthesiologist?: string;
  specialEquipment?: string[];
  preOpInstructions?: string;
  postOpInstructions?: string;
  consentObtained: boolean;
  riskLevel: ProcedureRiskLevel;
  status: ProcedureStatus;
  notes?: string;
  lastUpdatedAt: string;
}

export interface ProcedureTemplate {
  id: string;
  name: string;
  code?: string;
  type: ProcedureType;
  category: ProcedureCategory;
  description: string;
  estimatedDuration: number; // in minutes
  defaultLocation: ProcedureLocation;
  defaultAnesthesiaType: AnesthesiaType;
  requiredEquipment?: string[];
  standardPreOpInstructions?: string;
  standardPostOpInstructions?: string;
  riskLevel: ProcedureRiskLevel;
  notes?: string;
  lastUpdatedAt: string;
}

export interface ProcedureRoom {
  id: string;
  name: string;
  type: 'operating_room' | 'procedure_room' | 'emergency_room';
  location: string;
  capacity: number;
  equipment?: string[];
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  notes?: string;
  lastUpdatedAt: string;
}

export interface ProcedureReport {
  id: string;
  procedureId: string;
  startTime: string;
  endTime: string;
  performedBy: string;
  assistedBy?: string[];
  anesthesiologist?: string;
  anesthesiaStart?: string;
  anesthesiaEnd?: string;
  complications?: string[];
  findings: string;
  outcome: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    temperature?: number;
    oxygenSaturation?: number;
  };
  medications?: {
    name: string;
    dosage: string;
    route: string;
    time: string;
  }[];
  specimens?: {
    type: string;
    sentToLab: boolean;
    labResults?: string;
  }[];
  postProcedureInstructions: string;
  followUpRecommendations?: string;
  notes?: string;
  lastUpdatedAt: string;
}

export interface ProcedureConsent {
  id: string;
  procedureId: string;
  patientId: string;
  patientName: string;
  consentDate: string;
  consentTime: string;
  procedureName: string;
  procedureDescription: string;
  risks: string[];
  benefits: string[];
  alternatives: string[];
  patientSignature: boolean;
  patientSignatureDate?: string;
  guardianName?: string;
  guardianSignature?: boolean;
  guardianSignatureDate?: string;
  physicianName: string;
  physicianSignature: boolean;
  physicianSignatureDate?: string;
  witnessName?: string;
  witnessSignature?: boolean;
  witnessSignatureDate?: string;
  notes?: string;
  lastUpdatedAt: string;
}

interface ProceduresContextType {
  // Procedure management
  procedures: Procedure[];
  addProcedure: (procedure: Omit<Procedure, 'id' | 'lastUpdatedAt'>) => Procedure;
  updateProcedure: (procedureId: string, updates: Partial<Omit<Procedure, 'id' | 'lastUpdatedAt'>>) => void;
  updateProcedureStatus: (procedureId: string, status: ProcedureStatus, notes?: string) => void;
  cancelProcedure: (procedureId: string, reason: string) => void;
  
  // Procedure template management
  procedureTemplates: ProcedureTemplate[];
  addProcedureTemplate: (template: Omit<ProcedureTemplate, 'id' | 'lastUpdatedAt'>) => ProcedureTemplate;
  updateProcedureTemplate: (templateId: string, updates: Partial<Omit<ProcedureTemplate, 'id' | 'lastUpdatedAt'>>) => void;
  deleteProcedureTemplate: (templateId: string) => void;
  
  // Procedure room management
  procedureRooms: ProcedureRoom[];
  addProcedureRoom: (room: Omit<ProcedureRoom, 'id' | 'lastUpdatedAt'>) => ProcedureRoom;
  updateProcedureRoomStatus: (roomId: string, status: ProcedureRoom['status'], notes?: string) => void;
  
  // Procedure report management
  procedureReports: ProcedureReport[];
  addProcedureReport: (report: Omit<ProcedureReport, 'id' | 'lastUpdatedAt'>) => ProcedureReport;
  updateProcedureReport: (reportId: string, updates: Partial<Omit<ProcedureReport, 'id' | 'lastUpdatedAt'>>) => void;
  
  // Procedure consent management
  procedureConsents: ProcedureConsent[];
  addProcedureConsent: (consent: Omit<ProcedureConsent, 'id' | 'lastUpdatedAt'>) => ProcedureConsent;
  updateProcedureConsent: (consentId: string, updates: Partial<Omit<ProcedureConsent, 'id' | 'lastUpdatedAt'>>) => void;
  
  // Utility functions
  getProcedureById: (procedureId: string) => Procedure | undefined;
  getProceduresByPatient: (patientId: string) => Procedure[];
  getProceduresByStatus: (status: ProcedureStatus) => Procedure[];
  getProceduresByDate: (date: string) => Procedure[];
  getProceduresByPhysician: (physicianName: string) => Procedure[];
  getProceduresByType: (type: ProcedureType) => Procedure[];
  getProceduresByCategory: (category: ProcedureCategory) => Procedure[];
  getProceduresByLocation: (location: ProcedureLocation) => Procedure[];
  getProcedureTemplateById: (templateId: string) => ProcedureTemplate | undefined;
  getProcedureTemplatesByType: (type: ProcedureType) => ProcedureTemplate[];
  getProcedureRoomById: (roomId: string) => ProcedureRoom | undefined;
  getProcedureRoomsByStatus: (status: ProcedureRoom['status']) => ProcedureRoom[];
  getProcedureRoomsByType: (type: ProcedureRoom['type']) => ProcedureRoom[];
  getProcedureReportByProcedure: (procedureId: string) => ProcedureReport | undefined;
  getProcedureConsentByProcedure: (procedureId: string) => ProcedureConsent | undefined;
  checkRoomAvailability: (roomId: string, date: string, startTime: string, duration: number) => boolean;
}

const ProceduresContext = createContext<ProceduresContextType | undefined>(undefined);

export const ProceduresProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [procedureTemplates, setProcedureTemplates] = useState<ProcedureTemplate[]>([]);
  const [procedureRooms, setProcedureRooms] = useState<ProcedureRoom[]>([]);
  const [procedureReports, setProcedureReports] = useState<ProcedureReport[]>([]);
  const [procedureConsents, setProcedureConsents] = useState<ProcedureConsent[]>([]);

  // Procedure management functions
  const addProcedure = useCallback((procedure: Omit<Procedure, 'id' | 'lastUpdatedAt'>) => {
    const newProcedure: Procedure = {
      ...procedure,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setProcedures(prev => [...prev, newProcedure]);
    return newProcedure;
  }, []);

  const updateProcedure = useCallback((procedureId: string, updates: Partial<Omit<Procedure, 'id' | 'lastUpdatedAt'>>) => {
    setProcedures(prev => prev.map(procedure => 
      procedure.id === procedureId
        ? { 
            ...procedure, 
            ...updates,
            lastUpdatedAt: new Date().toISOString() 
          }
        : procedure
    ));
  }, []);

  const updateProcedureStatus = useCallback((procedureId: string, status: ProcedureStatus, notes?: string) => {
    setProcedures(prev => prev.map(procedure => {
      if (procedure.id === procedureId) {
        return { 
          ...procedure, 
          status,
          notes: notes 
            ? (procedure.notes ? `${procedure.notes}\n\nStatus update to ${status}: ${notes}` : `Status update to ${status}: ${notes}`)
            : procedure.notes,
          lastUpdatedAt: new Date().toISOString() 
        };
      }
      return procedure;
    }));
  }, []);

  const cancelProcedure = useCallback((procedureId: string, reason: string) => {
    setProcedures(prev => prev.map(procedure => {
      if (procedure.id === procedureId) {
        return { 
          ...procedure, 
          status: 'cancelled',
          notes: procedure.notes 
            ? `${procedure.notes}\n\nCancellation reason: ${reason}` 
            : `Cancellation reason: ${reason}`,
          lastUpdatedAt: new Date().toISOString() 
        };
      }
      return procedure;
    }));
  }, []);

  // Procedure template management functions
  const addProcedureTemplate = useCallback((template: Omit<ProcedureTemplate, 'id' | 'lastUpdatedAt'>) => {
    const newTemplate: ProcedureTemplate = {
      ...template,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setProcedureTemplates(prev => [...prev, newTemplate]);
    return newTemplate;
  }, []);

  const updateProcedureTemplate = useCallback((templateId: string, updates: Partial<Omit<ProcedureTemplate, 'id' | 'lastUpdatedAt'>>) => {
    setProcedureTemplates(prev => prev.map(template => 
      template.id === templateId
        ? { 
            ...template, 
            ...updates,
            lastUpdatedAt: new Date().toISOString() 
          }
        : template
    ));
  }, []);

  const deleteProcedureTemplate = useCallback((templateId: string) => {
    setProcedureTemplates(prev => prev.filter(template => template.id !== templateId));
  }, []);

  // Procedure room management functions
  const addProcedureRoom = useCallback((room: Omit<ProcedureRoom, 'id' | 'lastUpdatedAt'>) => {
    const newRoom: ProcedureRoom = {
      ...room,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setProcedureRooms(prev => [...prev, newRoom]);
    return newRoom;
  }, []);

  const updateProcedureRoomStatus = useCallback((roomId: string, status: ProcedureRoom['status'], notes?: string) => {
    setProcedureRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return { 
          ...room, 
          status,
          notes: notes 
            ? (room.notes ? `${room.notes}\n\nStatus update to ${status}: ${notes}` : `Status update to ${status}: ${notes}`)
            : room.notes,
          lastUpdatedAt: new Date().toISOString() 
        };
      }
      return room;
    }));
  }, []);

  // Procedure report management functions
  const addProcedureReport = useCallback((report: Omit<ProcedureReport, 'id' | 'lastUpdatedAt'>) => {
    const newReport: ProcedureReport = {
      ...report,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setProcedureReports(prev => [...prev, newReport]);
    
    // Update procedure status to completed
    updateProcedureStatus(report.procedureId, 'completed', 'Procedure report submitted');
    
    return newReport;
  }, [updateProcedureStatus]);

  const updateProcedureReport = useCallback((reportId: string, updates: Partial<Omit<ProcedureReport, 'id' | 'lastUpdatedAt'>>) => {
    setProcedureReports(prev => prev.map(report => 
      report.id === reportId
        ? { 
            ...report, 
            ...updates,
            lastUpdatedAt: new Date().toISOString() 
          }
        : report
    ));
  }, []);

  // Procedure consent management functions
  const addProcedureConsent = useCallback((consent: Omit<ProcedureConsent, 'id' | 'lastUpdatedAt'>) => {
    const newConsent: ProcedureConsent = {
      ...consent,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setProcedureConsents(prev => [...prev, newConsent]);
    
    // Update procedure consent status
    const procedure = procedures.find(p => p.id === consent.procedureId);
    if (procedure) {
      updateProcedure(procedure.id, { consentObtained: true });
    }
    
    return newConsent;
  }, [procedures, updateProcedure]);

  const updateProcedureConsent = useCallback((consentId: string, updates: Partial<Omit<ProcedureConsent, 'id' | 'lastUpdatedAt'>>) => {
    setProcedureConsents(prev => prev.map(consent => 
      consent.id === consentId
        ? { 
            ...consent, 
            ...updates,
            lastUpdatedAt: new Date().toISOString() 
          }
        : consent
    ));
  }, []);

  // Utility functions
  const getProcedureById = useCallback((procedureId: string) => {
    return procedures.find(procedure => procedure.id === procedureId);
  }, [procedures]);

  const getProceduresByPatient = useCallback((patientId: string) => {
    return procedures.filter(procedure => procedure.patientId === patientId);
  }, [procedures]);

  const getProceduresByStatus = useCallback((status: ProcedureStatus) => {
    return procedures.filter(procedure => procedure.status === status);
  }, [procedures]);

  const getProceduresByDate = useCallback((date: string) => {
    return procedures.filter(procedure => procedure.scheduledDate === date);
  }, [procedures]);

  const getProceduresByPhysician = useCallback((physicianName: string) => {
    return procedures.filter(procedure => procedure.primaryPhysician === physicianName);
  }, [procedures]);

  const getProceduresByType = useCallback((type: ProcedureType) => {
    return procedures.filter(procedure => procedure.type === type);
  }, [procedures]);

  const getProceduresByCategory = useCallback((category: ProcedureCategory) => {
    return procedures.filter(procedure => procedure.category === category);
  }, [procedures]);

  const getProceduresByLocation = useCallback((location: ProcedureLocation) => {
    return procedures.filter(procedure => procedure.location === location);
  }, [procedures]);

  const getProcedureTemplateById = useCallback((templateId: string) => {
    return procedureTemplates.find(template => template.id === templateId);
  }, [procedureTemplates]);

  const getProcedureTemplatesByType = useCallback((type: ProcedureType) => {
    return procedureTemplates.filter(template => template.type === type);
  }, [procedureTemplates]);

  const getProcedureRoomById = useCallback((roomId: string) => {
    return procedureRooms.find(room => room.id === roomId);
  }, [procedureRooms]);

  const getProcedureRoomsByStatus = useCallback((status: ProcedureRoom['status']) => {
    return procedureRooms.filter(room => room.status === status);
  }, [procedureRooms]);

  const getProcedureRoomsByType = useCallback((type: ProcedureRoom['type']) => {
    return procedureRooms.filter(room => room.type === type);
  }, [procedureRooms]);

  const getProcedureReportByProcedure = useCallback((procedureId: string) => {
    return procedureReports.find(report => report.procedureId === procedureId);
  }, [procedureReports]);

  const getProcedureConsentByProcedure = useCallback((procedureId: string) => {
    return procedureConsents.find(consent => consent.procedureId === procedureId);
  }, [procedureConsents]);

  const checkRoomAvailability = useCallback((roomId: string, date: string, startTime: string, duration: number) => {
    // Get all procedures scheduled for the specified room and date
    const roomProcedures = procedures.filter(
      procedure => procedure.location === roomId && 
                   procedure.scheduledDate === date &&
                   ['scheduled', 'in_progress'].includes(procedure.status)
    );
    
    if (roomProcedures.length === 0) return true;
    
    // Convert start time to minutes since midnight
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const startTimeMinutes = startHour * 60 + startMinute;
    const endTimeMinutes = startTimeMinutes + duration;
    
    // Check for overlaps with existing procedures
    for (const procedure of roomProcedures) {
      const [procedureHour, procedureMinute] = procedure.scheduledTime.split(':').map(Number);
      const procedureStartMinutes = procedureHour * 60 + procedureMinute;
      const procedureEndMinutes = procedureStartMinutes + procedure.estimatedDuration;
      
      // Check if there's an overlap
      if (
        (startTimeMinutes >= procedureStartMinutes && startTimeMinutes < procedureEndMinutes) ||
        (endTimeMinutes > procedureStartMinutes && endTimeMinutes <= procedureEndMinutes) ||
        (startTimeMinutes <= procedureStartMinutes && endTimeMinutes >= procedureEndMinutes)
      ) {
        return false;
      }
    }
    
    return true;
  }, [procedures]);

  return (
    <ProceduresContext.Provider
      value={{
        procedures,
        addProcedure,
        updateProcedure,
        updateProcedureStatus,
        cancelProcedure,
        procedureTemplates,
        addProcedureTemplate,
        updateProcedureTemplate,
        deleteProcedureTemplate,
        procedureRooms,
        addProcedureRoom,
        updateProcedureRoomStatus,
        procedureReports,
        addProcedureReport,
        updateProcedureReport,
        procedureConsents,
        addProcedureConsent,
        updateProcedureConsent,
        getProcedureById,
        getProceduresByPatient,
        getProceduresByStatus,
        getProceduresByDate,
        getProceduresByPhysician,
        getProceduresByType,
        getProceduresByCategory,
        getProceduresByLocation,
        getProcedureTemplateById,
        getProcedureTemplatesByType,
        getProcedureRoomById,
        getProcedureRoomsByStatus,
        getProcedureRoomsByType,
        getProcedureReportByProcedure,
        getProcedureConsentByProcedure,
        checkRoomAvailability
      }}
    >
      {children}
    </ProceduresContext.Provider>
  );
};

// Hook for using the context
export const useProcedures = () => {
  const context = useContext(ProceduresContext);
  if (context === undefined) {
    throw new Error('useProcedures must be used within a ProceduresProvider');
  }
  return context;
};
