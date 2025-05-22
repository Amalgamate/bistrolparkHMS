import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types for ambulance module
export type AmbulanceStatus = 
  | 'available'      // Available for dispatch
  | 'dispatched'     // Dispatched to a call
  | 'en_route'       // En route to pickup location
  | 'at_scene'       // At the scene
  | 'transporting'   // Transporting patient
  | 'at_hospital'    // At the hospital
  | 'returning'      // Returning to base
  | 'out_of_service' // Out of service (maintenance, etc.)
  | 'standby';       // On standby at an event

export type AmbulanceType = 
  | 'basic'          // Basic Life Support (BLS)
  | 'advanced'       // Advanced Life Support (ALS)
  | 'critical'       // Critical Care Transport
  | 'neonatal'       // Neonatal Transport
  | 'bariatric';     // Bariatric Transport

export type CallPriority = 
  | 'emergency'      // Life-threatening emergency
  | 'urgent'         // Urgent but not immediately life-threatening
  | 'non_urgent'     // Non-urgent transport
  | 'scheduled';     // Scheduled transport

export type CallStatus = 
  | 'pending'        // Call is pending dispatch
  | 'dispatched'     // Ambulance has been dispatched
  | 'en_route'       // Ambulance is en route to scene
  | 'at_scene'       // Ambulance is at the scene
  | 'transporting'   // Ambulance is transporting patient
  | 'at_hospital'    // Ambulance has arrived at hospital
  | 'completed'      // Call has been completed
  | 'cancelled';     // Call has been cancelled

export type CrewRole = 
  | 'driver'         // Ambulance driver
  | 'emt'            // Emergency Medical Technician
  | 'paramedic'      // Paramedic
  | 'nurse'          // Nurse
  | 'doctor';        // Doctor

export type MaintenanceType = 
  | 'routine'        // Routine maintenance
  | 'repair'         // Repair
  | 'inspection'     // Inspection
  | 'cleaning';      // Cleaning

export type MaintenanceStatus = 
  | 'scheduled'      // Maintenance is scheduled
  | 'in_progress'    // Maintenance is in progress
  | 'completed'      // Maintenance has been completed
  | 'cancelled';     // Maintenance has been cancelled

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  licensePlate: string;
  type: AmbulanceType;
  status: AmbulanceStatus;
  currentLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  baseLocation: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelLevel: number; // Percentage
  equipmentStatus: {
    oxygen: boolean;
    stretcher: boolean;
    defibrillator: boolean;
    firstAidKit: boolean;
    medications: boolean;
  };
  crew?: string[]; // Array of crew member IDs
  currentCall?: string; // Call ID
  lastMaintenance?: string; // Date of last maintenance
  notes?: string;
  lastUpdatedAt: string;
}

export interface CrewMember {
  id: string;
  staffId: string;
  name: string;
  role: CrewRole;
  qualification: string;
  contactNumber: string;
  email?: string;
  status: 'on_duty' | 'off_duty' | 'on_leave' | 'standby';
  currentAmbulance?: string; // Ambulance ID
  currentShift?: {
    start: string;
    end: string;
  };
  certifications: {
    name: string;
    issuedDate: string;
    expiryDate: string;
    isValid: boolean;
  }[];
  notes?: string;
  lastUpdatedAt: string;
}

export interface AmbulanceCall {
  id: string;
  callNumber: string;
  callTime: string;
  priority: CallPriority;
  status: CallStatus;
  caller: {
    name: string;
    contactNumber: string;
    relationship?: string;
  };
  patient?: {
    name: string;
    age?: number;
    gender?: 'male' | 'female' | 'other';
    chiefComplaint?: string;
    medicalHistory?: string[];
    patientId?: string; // Hospital patient ID if available
  };
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
  };
  destination?: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
    notes?: string;
  };
  dispatchedAmbulance?: string; // Ambulance ID
  dispatchedCrew?: string[]; // Array of crew member IDs
  dispatchTime?: string;
  arrivalTime?: string;
  departureTime?: string;
  hospitalArrivalTime?: string;
  completionTime?: string;
  vitalSigns?: {
    time: string;
    bloodPressure?: string;
    heartRate?: number;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    temperature?: number;
    glucoseLevel?: number;
    painScore?: number;
  }[];
  treatments?: {
    time: string;
    treatment: string;
    provider: string;
    notes?: string;
  }[];
  notes?: string;
  lastUpdatedAt: string;
}

export interface Maintenance {
  id: string;
  ambulanceId: string;
  type: MaintenanceType;
  status: MaintenanceStatus;
  description: string;
  scheduledDate: string;
  startDate?: string;
  completionDate?: string;
  performedBy?: string;
  cost?: number;
  notes?: string;
  lastUpdatedAt: string;
}

interface AmbulanceContextType {
  // Ambulance management
  ambulances: Ambulance[];
  addAmbulance: (ambulance: Omit<Ambulance, 'id' | 'lastUpdatedAt'>) => Ambulance;
  updateAmbulanceStatus: (ambulanceId: string, status: AmbulanceStatus, location?: Ambulance['currentLocation']) => void;
  updateAmbulanceEquipment: (ambulanceId: string, equipment: Partial<Ambulance['equipmentStatus']>) => void;
  assignCrewToAmbulance: (ambulanceId: string, crewIds: string[]) => void;
  
  // Crew management
  crewMembers: CrewMember[];
  addCrewMember: (crewMember: Omit<CrewMember, 'id' | 'lastUpdatedAt'>) => CrewMember;
  updateCrewStatus: (crewId: string, status: CrewMember['status']) => void;
  assignShiftToCrew: (crewId: string, shift: { start: string; end: string }) => void;
  
  // Call management
  calls: AmbulanceCall[];
  createCall: (call: Omit<AmbulanceCall, 'id' | 'callNumber' | 'lastUpdatedAt'>) => AmbulanceCall;
  updateCallStatus: (callId: string, status: CallStatus, options?: {
    dispatchedAmbulance?: string;
    dispatchedCrew?: string[];
    location?: Ambulance['currentLocation'];
  }) => void;
  recordVitalSigns: (callId: string, vitalSigns: Omit<AmbulanceCall['vitalSigns'][0], 'time'>) => void;
  recordTreatment: (callId: string, treatment: Omit<AmbulanceCall['treatments'][0], 'time'>) => void;
  
  // Maintenance management
  maintenanceRecords: Maintenance[];
  scheduleMaintenance: (maintenance: Omit<Maintenance, 'id' | 'lastUpdatedAt'>) => Maintenance;
  updateMaintenanceStatus: (maintenanceId: string, status: MaintenanceStatus, options?: {
    startDate?: string;
    completionDate?: string;
    performedBy?: string;
    cost?: number;
    notes?: string;
  }) => void;
  
  // Utility functions
  getAmbulanceById: (ambulanceId: string) => Ambulance | undefined;
  getAmbulancesByStatus: (status: AmbulanceStatus) => Ambulance[];
  getAmbulancesByType: (type: AmbulanceType) => Ambulance[];
  getAvailableAmbulances: () => Ambulance[];
  getCrewMemberById: (crewId: string) => CrewMember | undefined;
  getCrewMembersByStatus: (status: CrewMember['status']) => CrewMember[];
  getCrewMembersByRole: (role: CrewRole) => CrewMember[];
  getAvailableCrewMembers: () => CrewMember[];
  getCallById: (callId: string) => AmbulanceCall | undefined;
  getCallsByStatus: (status: CallStatus) => AmbulanceCall[];
  getCallsByPriority: (priority: CallPriority) => AmbulanceCall[];
  getActiveCallsCount: () => number;
  getMaintenanceById: (maintenanceId: string) => Maintenance | undefined;
  getMaintenanceByAmbulance: (ambulanceId: string) => Maintenance[];
  getMaintenanceByStatus: (status: MaintenanceStatus) => Maintenance[];
  getUpcomingMaintenance: () => Maintenance[];
}

const AmbulanceContext = createContext<AmbulanceContextType | undefined>(undefined);

export const AmbulanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>([]);
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>([]);
  const [calls, setCalls] = useState<AmbulanceCall[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<Maintenance[]>([]);

  // Ambulance management functions
  const addAmbulance = useCallback((ambulance: Omit<Ambulance, 'id' | 'lastUpdatedAt'>) => {
    const newAmbulance: Ambulance = {
      ...ambulance,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setAmbulances(prev => [...prev, newAmbulance]);
    return newAmbulance;
  }, []);

  const updateAmbulanceStatus = useCallback((ambulanceId: string, status: AmbulanceStatus, location?: Ambulance['currentLocation']) => {
    setAmbulances(prev => prev.map(ambulance => 
      ambulance.id === ambulanceId
        ? { 
            ...ambulance, 
            status,
            ...(location ? { currentLocation: location } : {}),
            lastUpdatedAt: new Date().toISOString() 
          }
        : ambulance
    ));
  }, []);

  const updateAmbulanceEquipment = useCallback((ambulanceId: string, equipment: Partial<Ambulance['equipmentStatus']>) => {
    setAmbulances(prev => prev.map(ambulance => 
      ambulance.id === ambulanceId
        ? { 
            ...ambulance, 
            equipmentStatus: { ...ambulance.equipmentStatus, ...equipment },
            lastUpdatedAt: new Date().toISOString() 
          }
        : ambulance
    ));
  }, []);

  const assignCrewToAmbulance = useCallback((ambulanceId: string, crewIds: string[]) => {
    // Update ambulance with crew
    setAmbulances(prev => prev.map(ambulance => 
      ambulance.id === ambulanceId
        ? { 
            ...ambulance, 
            crew: crewIds,
            lastUpdatedAt: new Date().toISOString() 
          }
        : ambulance
    ));
    
    // Update crew members with ambulance assignment
    setCrewMembers(prev => prev.map(crewMember => 
      crewIds.includes(crewMember.id)
        ? { 
            ...crewMember, 
            currentAmbulance: ambulanceId,
            lastUpdatedAt: new Date().toISOString() 
          }
        : crewMember.currentAmbulance === ambulanceId
          ? {
              ...crewMember,
              currentAmbulance: undefined,
              lastUpdatedAt: new Date().toISOString()
            }
          : crewMember
    ));
  }, []);

  // Crew management functions
  const addCrewMember = useCallback((crewMember: Omit<CrewMember, 'id' | 'lastUpdatedAt'>) => {
    const newCrewMember: CrewMember = {
      ...crewMember,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setCrewMembers(prev => [...prev, newCrewMember]);
    return newCrewMember;
  }, []);

  const updateCrewStatus = useCallback((crewId: string, status: CrewMember['status']) => {
    setCrewMembers(prev => prev.map(crewMember => 
      crewMember.id === crewId
        ? { 
            ...crewMember, 
            status,
            lastUpdatedAt: new Date().toISOString() 
          }
        : crewMember
    ));
  }, []);

  const assignShiftToCrew = useCallback((crewId: string, shift: { start: string; end: string }) => {
    setCrewMembers(prev => prev.map(crewMember => 
      crewMember.id === crewId
        ? { 
            ...crewMember, 
            currentShift: shift,
            lastUpdatedAt: new Date().toISOString() 
          }
        : crewMember
    ));
  }, []);

  // Call management functions
  const createCall = useCallback((call: Omit<AmbulanceCall, 'id' | 'callNumber' | 'lastUpdatedAt'>) => {
    // Generate a call number with format AMB-YYYY-XXXXX
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const callNumber = `AMB-${year}-${randomNum}`;

    const newCall: AmbulanceCall = {
      ...call,
      id: uuidv4(),
      callNumber,
      lastUpdatedAt: new Date().toISOString()
    };

    setCalls(prev => [...prev, newCall]);
    return newCall;
  }, []);

  const updateCallStatus = useCallback((callId: string, status: CallStatus, options?: {
    dispatchedAmbulance?: string;
    dispatchedCrew?: string[];
    location?: Ambulance['currentLocation'];
  }) => {
    // Update call status
    setCalls(prev => prev.map(call => {
      if (call.id !== callId) return call;
      
      const updatedCall = { 
        ...call, 
        status,
        lastUpdatedAt: new Date().toISOString() 
      };
      
      // Add dispatch information if provided
      if (options?.dispatchedAmbulance) {
        updatedCall.dispatchedAmbulance = options.dispatchedAmbulance;
        updatedCall.dispatchTime = new Date().toISOString();
      }
      
      if (options?.dispatchedCrew) {
        updatedCall.dispatchedCrew = options.dispatchedCrew;
      }
      
      // Add timestamps based on status
      if (status === 'at_scene') {
        updatedCall.arrivalTime = new Date().toISOString();
      } else if (status === 'transporting') {
        updatedCall.departureTime = new Date().toISOString();
      } else if (status === 'at_hospital') {
        updatedCall.hospitalArrivalTime = new Date().toISOString();
      } else if (status === 'completed' || status === 'cancelled') {
        updatedCall.completionTime = new Date().toISOString();
      }
      
      return updatedCall;
    }));
    
    // If an ambulance is dispatched, update its status and location
    if (options?.dispatchedAmbulance) {
      const ambulanceStatus = 
        status === 'dispatched' ? 'dispatched' :
        status === 'en_route' ? 'en_route' :
        status === 'at_scene' ? 'at_scene' :
        status === 'transporting' ? 'transporting' :
        status === 'at_hospital' ? 'at_hospital' :
        status === 'completed' || status === 'cancelled' ? 'returning' :
        'dispatched';
      
      updateAmbulanceStatus(
        options.dispatchedAmbulance, 
        ambulanceStatus as AmbulanceStatus,
        options.location
      );
      
      // Update ambulance with current call
      if (status !== 'completed' && status !== 'cancelled') {
        setAmbulances(prev => prev.map(ambulance => 
          ambulance.id === options.dispatchedAmbulance
            ? { 
                ...ambulance, 
                currentCall: callId,
                lastUpdatedAt: new Date().toISOString() 
              }
            : ambulance
        ));
      } else {
        // Clear current call when completed or cancelled
        setAmbulances(prev => prev.map(ambulance => 
          ambulance.id === options.dispatchedAmbulance
            ? { 
                ...ambulance, 
                currentCall: undefined,
                lastUpdatedAt: new Date().toISOString() 
              }
            : ambulance
        ));
      }
    }
  }, [updateAmbulanceStatus]);

  const recordVitalSigns = useCallback((callId: string, vitalSigns: Omit<AmbulanceCall['vitalSigns'][0], 'time'>) => {
    setCalls(prev => prev.map(call => 
      call.id === callId
        ? { 
            ...call, 
            vitalSigns: [
              ...(call.vitalSigns || []),
              {
                ...vitalSigns,
                time: new Date().toISOString()
              }
            ],
            lastUpdatedAt: new Date().toISOString() 
          }
        : call
    ));
  }, []);

  const recordTreatment = useCallback((callId: string, treatment: Omit<AmbulanceCall['treatments'][0], 'time'>) => {
    setCalls(prev => prev.map(call => 
      call.id === callId
        ? { 
            ...call, 
            treatments: [
              ...(call.treatments || []),
              {
                ...treatment,
                time: new Date().toISOString()
              }
            ],
            lastUpdatedAt: new Date().toISOString() 
          }
        : call
    ));
  }, []);

  // Maintenance management functions
  const scheduleMaintenance = useCallback((maintenance: Omit<Maintenance, 'id' | 'lastUpdatedAt'>) => {
    const newMaintenance: Maintenance = {
      ...maintenance,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setMaintenanceRecords(prev => [...prev, newMaintenance]);
    
    // If ambulance is available, set it to out of service
    const ambulance = ambulances.find(a => a.id === maintenance.ambulanceId);
    if (ambulance && ambulance.status === 'available') {
      updateAmbulanceStatus(maintenance.ambulanceId, 'out_of_service');
    }
    
    return newMaintenance;
  }, [ambulances, updateAmbulanceStatus]);

  const updateMaintenanceStatus = useCallback((maintenanceId: string, status: MaintenanceStatus, options?: {
    startDate?: string;
    completionDate?: string;
    performedBy?: string;
    cost?: number;
    notes?: string;
  }) => {
    setMaintenanceRecords(prev => prev.map(maintenance => {
      if (maintenance.id !== maintenanceId) return maintenance;
      
      const updatedMaintenance = { 
        ...maintenance, 
        status,
        ...(options?.startDate ? { startDate: options.startDate } : {}),
        ...(options?.completionDate ? { completionDate: options.completionDate } : {}),
        ...(options?.performedBy ? { performedBy: options.performedBy } : {}),
        ...(options?.cost ? { cost: options.cost } : {}),
        ...(options?.notes ? { 
          notes: maintenance.notes 
            ? `${maintenance.notes}\n${options.notes}` 
            : options.notes 
        } : {}),
        lastUpdatedAt: new Date().toISOString() 
      };
      
      // If maintenance is completed, set ambulance back to available
      if (status === 'completed') {
        const ambulance = ambulances.find(a => a.id === maintenance.ambulanceId);
        if (ambulance && ambulance.status === 'out_of_service') {
          updateAmbulanceStatus(maintenance.ambulanceId, 'available');
        }
      }
      
      return updatedMaintenance;
    }));
  }, [ambulances, updateAmbulanceStatus]);

  // Utility functions
  const getAmbulanceById = useCallback((ambulanceId: string) => {
    return ambulances.find(ambulance => ambulance.id === ambulanceId);
  }, [ambulances]);

  const getAmbulancesByStatus = useCallback((status: AmbulanceStatus) => {
    return ambulances.filter(ambulance => ambulance.status === status);
  }, [ambulances]);

  const getAmbulancesByType = useCallback((type: AmbulanceType) => {
    return ambulances.filter(ambulance => ambulance.type === type);
  }, [ambulances]);

  const getAvailableAmbulances = useCallback(() => {
    return ambulances.filter(ambulance => ambulance.status === 'available');
  }, [ambulances]);

  const getCrewMemberById = useCallback((crewId: string) => {
    return crewMembers.find(crewMember => crewMember.id === crewId);
  }, [crewMembers]);

  const getCrewMembersByStatus = useCallback((status: CrewMember['status']) => {
    return crewMembers.filter(crewMember => crewMember.status === status);
  }, [crewMembers]);

  const getCrewMembersByRole = useCallback((role: CrewRole) => {
    return crewMembers.filter(crewMember => crewMember.role === role);
  }, [crewMembers]);

  const getAvailableCrewMembers = useCallback(() => {
    return crewMembers.filter(crewMember => 
      crewMember.status === 'on_duty' && !crewMember.currentAmbulance
    );
  }, [crewMembers]);

  const getCallById = useCallback((callId: string) => {
    return calls.find(call => call.id === callId);
  }, [calls]);

  const getCallsByStatus = useCallback((status: CallStatus) => {
    return calls.filter(call => call.status === status);
  }, [calls]);

  const getCallsByPriority = useCallback((priority: CallPriority) => {
    return calls.filter(call => call.priority === priority);
  }, [calls]);

  const getActiveCallsCount = useCallback(() => {
    return calls.filter(call => 
      ['pending', 'dispatched', 'en_route', 'at_scene', 'transporting', 'at_hospital'].includes(call.status)
    ).length;
  }, [calls]);

  const getMaintenanceById = useCallback((maintenanceId: string) => {
    return maintenanceRecords.find(maintenance => maintenance.id === maintenanceId);
  }, [maintenanceRecords]);

  const getMaintenanceByAmbulance = useCallback((ambulanceId: string) => {
    return maintenanceRecords.filter(maintenance => maintenance.ambulanceId === ambulanceId);
  }, [maintenanceRecords]);

  const getMaintenanceByStatus = useCallback((status: MaintenanceStatus) => {
    return maintenanceRecords.filter(maintenance => maintenance.status === status);
  }, [maintenanceRecords]);

  const getUpcomingMaintenance = useCallback(() => {
    const today = new Date();
    return maintenanceRecords.filter(maintenance => 
      maintenance.status === 'scheduled' && 
      new Date(maintenance.scheduledDate) > today
    );
  }, [maintenanceRecords]);

  return (
    <AmbulanceContext.Provider
      value={{
        ambulances,
        addAmbulance,
        updateAmbulanceStatus,
        updateAmbulanceEquipment,
        assignCrewToAmbulance,
        crewMembers,
        addCrewMember,
        updateCrewStatus,
        assignShiftToCrew,
        calls,
        createCall,
        updateCallStatus,
        recordVitalSigns,
        recordTreatment,
        maintenanceRecords,
        scheduleMaintenance,
        updateMaintenanceStatus,
        getAmbulanceById,
        getAmbulancesByStatus,
        getAmbulancesByType,
        getAvailableAmbulances,
        getCrewMemberById,
        getCrewMembersByStatus,
        getCrewMembersByRole,
        getAvailableCrewMembers,
        getCallById,
        getCallsByStatus,
        getCallsByPriority,
        getActiveCallsCount,
        getMaintenanceById,
        getMaintenanceByAmbulance,
        getMaintenanceByStatus,
        getUpcomingMaintenance
      }}
    >
      {children}
    </AmbulanceContext.Provider>
  );
};

// Hook for using the context
export const useAmbulance = () => {
  const context = useContext(AmbulanceContext);
  if (context === undefined) {
    throw new Error('useAmbulance must be used within an AmbulanceProvider');
  }
  return context;
};
