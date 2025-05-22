import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types for mortuary module
export type BodyStatus = 
  | 'received'       // Body has been received
  | 'in_storage'     // Body is in storage
  | 'prepared'       // Body has been prepared
  | 'released'       // Body has been released
  | 'transferred';   // Body has been transferred

export type StorageType =
  | 'refrigerated'   // Refrigerated storage
  | 'frozen'         // Frozen storage
  | 'embalmed'       // Embalmed storage
  | 'temporary';     // Temporary storage

export type CauseOfDeath =
  | 'natural'        // Natural causes
  | 'accident'       // Accidental death
  | 'suicide'        // Suicide
  | 'homicide'       // Homicide
  | 'undetermined'   // Undetermined cause
  | 'pending';       // Pending investigation

export type ReleaseType =
  | 'family'         // Released to family
  | 'funeral_home'   // Released to funeral home
  | 'medical_school' // Released to medical school
  | 'coroner'        // Released to coroner
  | 'police'         // Released to police
  | 'other';         // Other release type

export interface DeceasedPerson {
  id: string;
  patientId?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  dateOfDeath: string;
  timeOfDeath: string;
  placeOfDeath: string;
  causeOfDeath: CauseOfDeath;
  causeOfDeathDetails?: string;
  attendingPhysician: string;
  physicianContact?: string;
  nextOfKin?: {
    name: string;
    relationship: string;
    contact: string;
    address?: string;
  };
  identificationMethod?: string;
  identifiedBy?: string;
  identificationDate?: string;
  personalBelongings?: string[];
  notes?: string;
  status: BodyStatus;
  lastUpdatedAt: string;
}

export interface StorageLocation {
  id: string;
  name: string;
  type: StorageType;
  capacity: number;
  currentOccupancy: number;
  temperature?: number; // in Celsius
  location: string;
  status: 'operational' | 'maintenance' | 'full' | 'offline';
  notes?: string;
  lastUpdatedAt: string;
}

export interface StorageAssignment {
  id: string;
  deceasedPersonId: string;
  storageLocationId: string;
  assignmentDate: string;
  assignmentTime: string;
  assignedBy: string;
  expectedDuration?: number; // in days
  notes?: string;
  status: 'active' | 'completed' | 'transferred';
  lastUpdatedAt: string;
}

export interface MortuaryService {
  id: string;
  deceasedPersonId: string;
  serviceType: 'embalming' | 'preparation' | 'restoration' | 'dressing' | 'viewing' | 'other';
  serviceDetails: string;
  scheduledDate?: string;
  scheduledTime?: string;
  completedDate?: string;
  completedTime?: string;
  performedBy: string;
  requestedBy?: string;
  cost?: number;
  paymentStatus?: 'pending' | 'paid' | 'waived';
  notes?: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  lastUpdatedAt: string;
}

export interface ReleaseRecord {
  id: string;
  deceasedPersonId: string;
  releaseDate: string;
  releaseTime: string;
  releaseType: ReleaseType;
  releasedTo: string;
  releasedToContact: string;
  releasedToIdentification: string;
  releasedBy: string;
  witnessName?: string;
  personalBelongingsReleased: boolean;
  personalBelongingsDetails?: string;
  documentationProvided: string[];
  notes?: string;
  lastUpdatedAt: string;
}

export interface DeathCertificate {
  id: string;
  deceasedPersonId: string;
  certificateNumber: string;
  issueDate: string;
  issuedBy: string;
  registrationNumber?: string;
  registrationDate?: string;
  certifiedBy: string;
  certifierTitle: string;
  certifierLicense?: string;
  causeOfDeath: string;
  mannerOfDeath: CauseOfDeath;
  autopsyPerformed: boolean;
  autopsyFindings?: string;
  notes?: string;
  status: 'draft' | 'issued' | 'registered';
  lastUpdatedAt: string;
}

interface MortuaryContextType {
  // Deceased person management
  deceasedPersons: DeceasedPerson[];
  addDeceasedPerson: (person: Omit<DeceasedPerson, 'id' | 'status' | 'lastUpdatedAt'>) => DeceasedPerson;
  updateDeceasedPerson: (personId: string, updates: Partial<Omit<DeceasedPerson, 'id' | 'lastUpdatedAt'>>) => void;
  updateDeceasedPersonStatus: (personId: string, status: BodyStatus) => void;
  
  // Storage location management
  storageLocations: StorageLocation[];
  addStorageLocation: (location: Omit<StorageLocation, 'id' | 'currentOccupancy' | 'lastUpdatedAt'>) => StorageLocation;
  updateStorageLocation: (locationId: string, updates: Partial<Omit<StorageLocation, 'id' | 'currentOccupancy' | 'lastUpdatedAt'>>) => void;
  updateStorageLocationStatus: (locationId: string, status: StorageLocation['status']) => void;
  
  // Storage assignment management
  storageAssignments: StorageAssignment[];
  assignStorage: (assignment: Omit<StorageAssignment, 'id' | 'status' | 'lastUpdatedAt'>) => StorageAssignment;
  completeStorageAssignment: (assignmentId: string) => void;
  transferStorageAssignment: (assignmentId: string, newStorageLocationId: string, notes?: string) => void;
  
  // Mortuary service management
  mortuaryServices: MortuaryService[];
  addMortuaryService: (service: Omit<MortuaryService, 'id' | 'lastUpdatedAt'>) => MortuaryService;
  updateMortuaryServiceStatus: (serviceId: string, status: MortuaryService['status']) => void;
  completeMortuaryService: (serviceId: string, completedDate: string, completedTime: string, notes?: string) => void;
  
  // Release record management
  releaseRecords: ReleaseRecord[];
  addReleaseRecord: (record: Omit<ReleaseRecord, 'id' | 'lastUpdatedAt'>) => ReleaseRecord;
  
  // Death certificate management
  deathCertificates: DeathCertificate[];
  addDeathCertificate: (certificate: Omit<DeathCertificate, 'id' | 'lastUpdatedAt'>) => DeathCertificate;
  updateDeathCertificateStatus: (certificateId: string, status: DeathCertificate['status']) => void;
  
  // Utility functions
  getDeceasedPersonById: (personId: string) => DeceasedPerson | undefined;
  getDeceasedPersonsByStatus: (status: BodyStatus) => DeceasedPerson[];
  getStorageLocationById: (locationId: string) => StorageLocation | undefined;
  getStorageLocationsByType: (type: StorageType) => StorageLocation[];
  getStorageLocationsByStatus: (status: StorageLocation['status']) => StorageLocation[];
  getAvailableStorageLocations: () => StorageLocation[];
  getStorageAssignmentsByDeceasedPerson: (personId: string) => StorageAssignment[];
  getActiveStorageAssignment: (personId: string) => StorageAssignment | undefined;
  getMortuaryServicesByDeceasedPerson: (personId: string) => MortuaryService[];
  getReleaseRecordByDeceasedPerson: (personId: string) => ReleaseRecord | undefined;
  getDeathCertificateByDeceasedPerson: (personId: string) => DeathCertificate | undefined;
  checkStorageAvailability: (storageLocationId: string) => boolean;
}

const MortuaryContext = createContext<MortuaryContextType | undefined>(undefined);

export const MortuaryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [deceasedPersons, setDeceasedPersons] = useState<DeceasedPerson[]>([]);
  const [storageLocations, setStorageLocations] = useState<StorageLocation[]>([]);
  const [storageAssignments, setStorageAssignments] = useState<StorageAssignment[]>([]);
  const [mortuaryServices, setMortuaryServices] = useState<MortuaryService[]>([]);
  const [releaseRecords, setReleaseRecords] = useState<ReleaseRecord[]>([]);
  const [deathCertificates, setDeathCertificates] = useState<DeathCertificate[]>([]);

  // Deceased person management functions
  const addDeceasedPerson = useCallback((person: Omit<DeceasedPerson, 'id' | 'status' | 'lastUpdatedAt'>) => {
    const newPerson: DeceasedPerson = {
      ...person,
      id: uuidv4(),
      status: 'received',
      lastUpdatedAt: new Date().toISOString()
    };

    setDeceasedPersons(prev => [...prev, newPerson]);
    return newPerson;
  }, []);

  const updateDeceasedPerson = useCallback((personId: string, updates: Partial<Omit<DeceasedPerson, 'id' | 'lastUpdatedAt'>>) => {
    setDeceasedPersons(prev => prev.map(person => 
      person.id === personId
        ? { 
            ...person, 
            ...updates,
            lastUpdatedAt: new Date().toISOString() 
          }
        : person
    ));
  }, []);

  const updateDeceasedPersonStatus = useCallback((personId: string, status: BodyStatus) => {
    setDeceasedPersons(prev => prev.map(person => 
      person.id === personId
        ? { 
            ...person, 
            status,
            lastUpdatedAt: new Date().toISOString() 
          }
        : person
    ));
  }, []);

  // Storage location management functions
  const addStorageLocation = useCallback((location: Omit<StorageLocation, 'id' | 'currentOccupancy' | 'lastUpdatedAt'>) => {
    const newLocation: StorageLocation = {
      ...location,
      id: uuidv4(),
      currentOccupancy: 0,
      lastUpdatedAt: new Date().toISOString()
    };

    setStorageLocations(prev => [...prev, newLocation]);
    return newLocation;
  }, []);

  const updateStorageLocation = useCallback((locationId: string, updates: Partial<Omit<StorageLocation, 'id' | 'currentOccupancy' | 'lastUpdatedAt'>>) => {
    setStorageLocations(prev => prev.map(location => 
      location.id === locationId
        ? { 
            ...location, 
            ...updates,
            lastUpdatedAt: new Date().toISOString() 
          }
        : location
    ));
  }, []);

  const updateStorageLocationStatus = useCallback((locationId: string, status: StorageLocation['status']) => {
    setStorageLocations(prev => prev.map(location => 
      location.id === locationId
        ? { 
            ...location, 
            status,
            lastUpdatedAt: new Date().toISOString() 
          }
        : location
    ));
  }, []);

  // Storage assignment management functions
  const assignStorage = useCallback((assignment: Omit<StorageAssignment, 'id' | 'status' | 'lastUpdatedAt'>) => {
    // Check if there's an active assignment for this deceased person
    const existingAssignment = storageAssignments.find(
      a => a.deceasedPersonId === assignment.deceasedPersonId && a.status === 'active'
    );

    if (existingAssignment) {
      // Complete the existing assignment
      completeStorageAssignment(existingAssignment.id);
    }

    const newAssignment: StorageAssignment = {
      ...assignment,
      id: uuidv4(),
      status: 'active',
      lastUpdatedAt: new Date().toISOString()
    };

    setStorageAssignments(prev => [...prev, newAssignment]);

    // Update storage location occupancy
    setStorageLocations(prev => prev.map(location => 
      location.id === assignment.storageLocationId
        ? { 
            ...location, 
            currentOccupancy: location.currentOccupancy + 1,
            status: location.currentOccupancy + 1 >= location.capacity ? 'full' : location.status,
            lastUpdatedAt: new Date().toISOString() 
          }
        : location
    ));

    // Update deceased person status
    updateDeceasedPersonStatus(assignment.deceasedPersonId, 'in_storage');

    return newAssignment;
  }, [storageAssignments, updateDeceasedPersonStatus]);

  const completeStorageAssignment = useCallback((assignmentId: string) => {
    // Get the assignment
    const assignment = storageAssignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    // Update the assignment
    setStorageAssignments(prev => prev.map(a => 
      a.id === assignmentId
        ? { 
            ...a, 
            status: 'completed',
            lastUpdatedAt: new Date().toISOString() 
          }
        : a
    ));

    // Update storage location occupancy
    setStorageLocations(prev => prev.map(location => 
      location.id === assignment.storageLocationId
        ? { 
            ...location, 
            currentOccupancy: Math.max(0, location.currentOccupancy - 1),
            status: location.status === 'full' ? 'operational' : location.status,
            lastUpdatedAt: new Date().toISOString() 
          }
        : location
    ));
  }, [storageAssignments]);

  const transferStorageAssignment = useCallback((assignmentId: string, newStorageLocationId: string, notes?: string) => {
    // Get the assignment
    const assignment = storageAssignments.find(a => a.id === assignmentId);
    if (!assignment) return;

    // Complete the current assignment
    completeStorageAssignment(assignmentId);

    // Create a new assignment
    const newAssignment: StorageAssignment = {
      id: uuidv4(),
      deceasedPersonId: assignment.deceasedPersonId,
      storageLocationId: newStorageLocationId,
      assignmentDate: new Date().toISOString().split('T')[0],
      assignmentTime: new Date().toISOString().split('T')[1].substring(0, 5),
      assignedBy: assignment.assignedBy,
      expectedDuration: assignment.expectedDuration,
      notes: notes ? (assignment.notes ? `${assignment.notes}\n\nTransferred: ${notes}` : `Transferred: ${notes}`) : assignment.notes,
      status: 'active',
      lastUpdatedAt: new Date().toISOString()
    };

    setStorageAssignments(prev => [...prev, newAssignment]);

    // Update storage location occupancy
    setStorageLocations(prev => prev.map(location => 
      location.id === newStorageLocationId
        ? { 
            ...location, 
            currentOccupancy: location.currentOccupancy + 1,
            status: location.currentOccupancy + 1 >= location.capacity ? 'full' : location.status,
            lastUpdatedAt: new Date().toISOString() 
          }
        : location
    ));

    // Update the old assignment
    setStorageAssignments(prev => prev.map(a => 
      a.id === assignmentId
        ? { 
            ...a, 
            status: 'transferred',
            notes: notes ? (a.notes ? `${a.notes}\n\nTransferred: ${notes}` : `Transferred: ${notes}`) : a.notes,
            lastUpdatedAt: new Date().toISOString() 
          }
        : a
    ));
  }, [storageAssignments, completeStorageAssignment]);

  // Mortuary service management functions
  const addMortuaryService = useCallback((service: Omit<MortuaryService, 'id' | 'lastUpdatedAt'>) => {
    const newService: MortuaryService = {
      ...service,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setMortuaryServices(prev => [...prev, newService]);
    return newService;
  }, []);

  const updateMortuaryServiceStatus = useCallback((serviceId: string, status: MortuaryService['status']) => {
    setMortuaryServices(prev => prev.map(service => 
      service.id === serviceId
        ? { 
            ...service, 
            status,
            lastUpdatedAt: new Date().toISOString() 
          }
        : service
    ));
  }, []);

  const completeMortuaryService = useCallback((serviceId: string, completedDate: string, completedTime: string, notes?: string) => {
    setMortuaryServices(prev => prev.map(service => {
      if (service.id === serviceId) {
        const updatedService = { 
          ...service, 
          status: 'completed' as const,
          completedDate,
          completedTime,
          notes: notes ? (service.notes ? `${service.notes}\n\nCompletion notes: ${notes}` : `Completion notes: ${notes}`) : service.notes,
          lastUpdatedAt: new Date().toISOString() 
        };

        // If this is a preparation service, update the deceased person status
        if (service.serviceType === 'preparation' || service.serviceType === 'embalming') {
          updateDeceasedPersonStatus(service.deceasedPersonId, 'prepared');
        }

        return updatedService;
      }
      return service;
    }));
  }, [updateDeceasedPersonStatus]);

  // Release record management functions
  const addReleaseRecord = useCallback((record: Omit<ReleaseRecord, 'id' | 'lastUpdatedAt'>) => {
    const newRecord: ReleaseRecord = {
      ...record,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setReleaseRecords(prev => [...prev, newRecord]);

    // Update deceased person status
    updateDeceasedPersonStatus(record.deceasedPersonId, 'released');

    // Complete any active storage assignments
    const activeAssignment = storageAssignments.find(
      a => a.deceasedPersonId === record.deceasedPersonId && a.status === 'active'
    );
    if (activeAssignment) {
      completeStorageAssignment(activeAssignment.id);
    }

    return newRecord;
  }, [storageAssignments, updateDeceasedPersonStatus, completeStorageAssignment]);

  // Death certificate management functions
  const addDeathCertificate = useCallback((certificate: Omit<DeathCertificate, 'id' | 'lastUpdatedAt'>) => {
    const newCertificate: DeathCertificate = {
      ...certificate,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setDeathCertificates(prev => [...prev, newCertificate]);
    return newCertificate;
  }, []);

  const updateDeathCertificateStatus = useCallback((certificateId: string, status: DeathCertificate['status']) => {
    setDeathCertificates(prev => prev.map(certificate => 
      certificate.id === certificateId
        ? { 
            ...certificate, 
            status,
            lastUpdatedAt: new Date().toISOString() 
          }
        : certificate
    ));
  }, []);

  // Utility functions
  const getDeceasedPersonById = useCallback((personId: string) => {
    return deceasedPersons.find(person => person.id === personId);
  }, [deceasedPersons]);

  const getDeceasedPersonsByStatus = useCallback((status: BodyStatus) => {
    return deceasedPersons.filter(person => person.status === status);
  }, [deceasedPersons]);

  const getStorageLocationById = useCallback((locationId: string) => {
    return storageLocations.find(location => location.id === locationId);
  }, [storageLocations]);

  const getStorageLocationsByType = useCallback((type: StorageType) => {
    return storageLocations.filter(location => location.type === type);
  }, [storageLocations]);

  const getStorageLocationsByStatus = useCallback((status: StorageLocation['status']) => {
    return storageLocations.filter(location => location.status === status);
  }, [storageLocations]);

  const getAvailableStorageLocations = useCallback(() => {
    return storageLocations.filter(location => 
      location.status === 'operational' && location.currentOccupancy < location.capacity
    );
  }, [storageLocations]);

  const getStorageAssignmentsByDeceasedPerson = useCallback((personId: string) => {
    return storageAssignments.filter(assignment => assignment.deceasedPersonId === personId);
  }, [storageAssignments]);

  const getActiveStorageAssignment = useCallback((personId: string) => {
    return storageAssignments.find(
      assignment => assignment.deceasedPersonId === personId && assignment.status === 'active'
    );
  }, [storageAssignments]);

  const getMortuaryServicesByDeceasedPerson = useCallback((personId: string) => {
    return mortuaryServices.filter(service => service.deceasedPersonId === personId);
  }, [mortuaryServices]);

  const getReleaseRecordByDeceasedPerson = useCallback((personId: string) => {
    return releaseRecords.find(record => record.deceasedPersonId === personId);
  }, [releaseRecords]);

  const getDeathCertificateByDeceasedPerson = useCallback((personId: string) => {
    return deathCertificates.find(certificate => certificate.deceasedPersonId === personId);
  }, [deathCertificates]);

  const checkStorageAvailability = useCallback((storageLocationId: string) => {
    const location = storageLocations.find(loc => loc.id === storageLocationId);
    if (!location) return false;
    return location.status === 'operational' && location.currentOccupancy < location.capacity;
  }, [storageLocations]);

  return (
    <MortuaryContext.Provider
      value={{
        deceasedPersons,
        addDeceasedPerson,
        updateDeceasedPerson,
        updateDeceasedPersonStatus,
        storageLocations,
        addStorageLocation,
        updateStorageLocation,
        updateStorageLocationStatus,
        storageAssignments,
        assignStorage,
        completeStorageAssignment,
        transferStorageAssignment,
        mortuaryServices,
        addMortuaryService,
        updateMortuaryServiceStatus,
        completeMortuaryService,
        releaseRecords,
        addReleaseRecord,
        deathCertificates,
        addDeathCertificate,
        updateDeathCertificateStatus,
        getDeceasedPersonById,
        getDeceasedPersonsByStatus,
        getStorageLocationById,
        getStorageLocationsByType,
        getStorageLocationsByStatus,
        getAvailableStorageLocations,
        getStorageAssignmentsByDeceasedPerson,
        getActiveStorageAssignment,
        getMortuaryServicesByDeceasedPerson,
        getReleaseRecordByDeceasedPerson,
        getDeathCertificateByDeceasedPerson,
        checkStorageAvailability
      }}
    >
      {children}
    </MortuaryContext.Provider>
  );
};

// Hook for using the context
export const useMortuary = () => {
  const context = useContext(MortuaryContext);
  if (context === undefined) {
    throw new Error('useMortuary must be used within a MortuaryProvider');
  }
  return context;
};
