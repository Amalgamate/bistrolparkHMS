import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types for blood bank module
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type BloodProductType = 
  | 'whole_blood'
  | 'packed_red_cells'
  | 'platelets'
  | 'plasma'
  | 'cryoprecipitate';

export type BloodUnitStatus = 
  | 'available'      // Available for use
  | 'reserved'       // Reserved for a specific patient
  | 'crossmatched'   // Crossmatched for a specific patient
  | 'issued'         // Issued to a department/patient
  | 'transfused'     // Transfused to a patient
  | 'expired'        // Expired and not usable
  | 'discarded';     // Discarded due to various reasons

export type DonorStatus = 
  | 'active'         // Eligible to donate
  | 'deferred'       // Temporarily deferred
  | 'permanent_deferral'; // Permanently deferred

export type RequestStatus = 
  | 'pending'        // Request is pending approval
  | 'approved'       // Request is approved
  | 'processing'     // Blood units are being prepared
  | 'ready'          // Blood units are ready for pickup
  | 'issued'         // Blood units have been issued
  | 'completed'      // Request has been completed
  | 'cancelled';     // Request has been cancelled

export interface BloodUnit {
  id: string;
  unitNumber: string;
  bloodType: BloodType;
  productType: BloodProductType;
  donationDate: string;
  expiryDate: string;
  volume: number; // in mL
  status: BloodUnitStatus;
  donorId?: string;
  location: string;
  crossmatchedFor?: string; // Patient ID
  reservedFor?: string; // Patient ID
  issuedTo?: string; // Department or Patient ID
  notes?: string;
  lastUpdatedAt: string;
}

export interface Donor {
  id: string;
  donorNumber: string;
  name: string;
  bloodType: BloodType;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  contactNumber: string;
  email?: string;
  address?: string;
  status: DonorStatus;
  lastDonationDate?: string;
  deferralReason?: string;
  deferralUntil?: string;
  medicalHistory?: string[];
  notes?: string;
  donations: {
    id: string;
    date: string;
    productType: BloodProductType;
    unitId: string;
    notes?: string;
  }[];
  lastUpdatedAt: string;
}

export interface BloodRequest {
  id: string;
  requestNumber: string;
  requestDate: string;
  requestedBy: string;
  department: string;
  patientId?: string;
  patientName?: string;
  patientBloodType?: BloodType;
  diagnosis?: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  status: RequestStatus;
  products: {
    productType: BloodProductType;
    bloodType: BloodType;
    quantity: number;
    unitsIssued: string[]; // Array of unit IDs
  }[];
  crossmatchResults?: {
    unitId: string;
    result: 'compatible' | 'incompatible';
    performedBy: string;
    performedAt: string;
    notes?: string;
  }[];
  approvedBy?: string;
  approvedAt?: string;
  issuedBy?: string;
  issuedAt?: string;
  notes?: string;
  lastUpdatedAt: string;
}

interface BloodBankContextType {
  // Blood unit management
  bloodUnits: BloodUnit[];
  addBloodUnit: (unit: Omit<BloodUnit, 'id' | 'lastUpdatedAt'>) => BloodUnit;
  updateBloodUnitStatus: (unitId: string, status: BloodUnitStatus, options?: { 
    patientId?: string, 
    departmentId?: string,
    notes?: string 
  }) => void;
  discardBloodUnit: (unitId: string, reason: string) => void;
  
  // Donor management
  donors: Donor[];
  addDonor: (donor: Omit<Donor, 'id' | 'donations' | 'lastUpdatedAt'>) => Donor;
  updateDonorStatus: (donorId: string, status: DonorStatus, options?: { 
    deferralReason?: string, 
    deferralUntil?: string 
  }) => void;
  recordDonation: (donorId: string, productType: BloodProductType, unitId: string, notes?: string) => void;
  
  // Blood request management
  bloodRequests: BloodRequest[];
  createBloodRequest: (request: Omit<BloodRequest, 'id' | 'lastUpdatedAt' | 'requestNumber'>) => BloodRequest;
  updateRequestStatus: (requestId: string, status: RequestStatus, options?: {
    approvedBy?: string,
    issuedBy?: string,
    notes?: string
  }) => void;
  assignUnitsToRequest: (requestId: string, productType: BloodProductType, unitIds: string[]) => void;
  recordCrossmatchResult: (requestId: string, unitId: string, result: 'compatible' | 'incompatible', performedBy: string, notes?: string) => void;
  
  // Utility functions
  getBloodUnitById: (unitId: string) => BloodUnit | undefined;
  getBloodUnitsByType: (bloodType: BloodType, productType?: BloodProductType) => BloodUnit[];
  getBloodUnitsByStatus: (status: BloodUnitStatus) => BloodUnit[];
  getAvailableBloodUnits: (bloodType?: BloodType, productType?: BloodProductType) => BloodUnit[];
  getDonorById: (donorId: string) => Donor | undefined;
  getDonorsByBloodType: (bloodType: BloodType) => Donor[];
  getDonorsByStatus: (status: DonorStatus) => Donor[];
  getBloodRequestById: (requestId: string) => BloodRequest | undefined;
  getBloodRequestsByStatus: (status: RequestStatus) => BloodRequest[];
  getBloodRequestsByDepartment: (department: string) => BloodRequest[];
  getBloodRequestsByPatient: (patientId: string) => BloodRequest[];
  getBloodInventorySummary: () => Record<BloodType, Record<BloodProductType, number>>;
  checkCompatibility: (donorBloodType: BloodType, recipientBloodType: BloodType) => boolean;
}

const BloodBankContext = createContext<BloodBankContextType | undefined>(undefined);

export const BloodBankProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bloodUnits, setBloodUnits] = useState<BloodUnit[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [bloodRequests, setBloodRequests] = useState<BloodRequest[]>([]);

  // Blood unit management functions
  const addBloodUnit = useCallback((unit: Omit<BloodUnit, 'id' | 'lastUpdatedAt'>) => {
    const newUnit: BloodUnit = {
      ...unit,
      id: uuidv4(),
      lastUpdatedAt: new Date().toISOString()
    };

    setBloodUnits(prev => [...prev, newUnit]);
    return newUnit;
  }, []);

  const updateBloodUnitStatus = useCallback((unitId: string, status: BloodUnitStatus, options?: { 
    patientId?: string, 
    departmentId?: string,
    notes?: string 
  }) => {
    setBloodUnits(prev => prev.map(unit => 
      unit.id === unitId
        ? { 
            ...unit, 
            status,
            ...(status === 'crossmatched' && options?.patientId ? { crossmatchedFor: options.patientId } : {}),
            ...(status === 'reserved' && options?.patientId ? { reservedFor: options.patientId } : {}),
            ...(status === 'issued' && (options?.patientId || options?.departmentId) ? { issuedTo: options.patientId || options.departmentId } : {}),
            ...(options?.notes ? { notes: options.notes } : {}),
            lastUpdatedAt: new Date().toISOString() 
          }
        : unit
    ));
  }, []);

  const discardBloodUnit = useCallback((unitId: string, reason: string) => {
    setBloodUnits(prev => prev.map(unit => 
      unit.id === unitId
        ? { 
            ...unit, 
            status: 'discarded',
            notes: unit.notes ? `${unit.notes}\nDiscarded: ${reason}` : `Discarded: ${reason}`,
            lastUpdatedAt: new Date().toISOString() 
          }
        : unit
    ));
  }, []);

  // Donor management functions
  const addDonor = useCallback((donor: Omit<Donor, 'id' | 'donations' | 'lastUpdatedAt'>) => {
    const newDonor: Donor = {
      ...donor,
      id: uuidv4(),
      donations: [],
      lastUpdatedAt: new Date().toISOString()
    };

    setDonors(prev => [...prev, newDonor]);
    return newDonor;
  }, []);

  const updateDonorStatus = useCallback((donorId: string, status: DonorStatus, options?: { 
    deferralReason?: string, 
    deferralUntil?: string 
  }) => {
    setDonors(prev => prev.map(donor => 
      donor.id === donorId
        ? { 
            ...donor, 
            status,
            ...(status !== 'active' && options?.deferralReason ? { deferralReason: options.deferralReason } : {}),
            ...(status !== 'active' && options?.deferralUntil ? { deferralUntil: options.deferralUntil } : {}),
            lastUpdatedAt: new Date().toISOString() 
          }
        : donor
    ));
  }, []);

  const recordDonation = useCallback((donorId: string, productType: BloodProductType, unitId: string, notes?: string) => {
    const donation = {
      id: uuidv4(),
      date: new Date().toISOString(),
      productType,
      unitId,
      notes
    };

    setDonors(prev => prev.map(donor => 
      donor.id === donorId
        ? { 
            ...donor, 
            donations: [...donor.donations, donation],
            lastDonationDate: new Date().toISOString(),
            lastUpdatedAt: new Date().toISOString() 
          }
        : donor
    ));
  }, []);

  // Blood request management functions
  const createBloodRequest = useCallback((request: Omit<BloodRequest, 'id' | 'lastUpdatedAt' | 'requestNumber'>) => {
    // Generate a request number with format BB-YYYY-XXXXX
    const year = new Date().getFullYear();
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const requestNumber = `BB-${year}-${randomNum}`;

    const newRequest: BloodRequest = {
      ...request,
      id: uuidv4(),
      requestNumber,
      lastUpdatedAt: new Date().toISOString()
    };

    setBloodRequests(prev => [...prev, newRequest]);
    return newRequest;
  }, []);

  const updateRequestStatus = useCallback((requestId: string, status: RequestStatus, options?: {
    approvedBy?: string,
    issuedBy?: string,
    notes?: string
  }) => {
    setBloodRequests(prev => prev.map(request => 
      request.id === requestId
        ? { 
            ...request, 
            status,
            ...(status === 'approved' && options?.approvedBy ? { 
              approvedBy: options.approvedBy,
              approvedAt: new Date().toISOString() 
            } : {}),
            ...(status === 'issued' && options?.issuedBy ? { 
              issuedBy: options.issuedBy,
              issuedAt: new Date().toISOString() 
            } : {}),
            ...(options?.notes ? { 
              notes: request.notes ? `${request.notes}\n${options.notes}` : options.notes 
            } : {}),
            lastUpdatedAt: new Date().toISOString() 
          }
        : request
    ));
  }, []);

  const assignUnitsToRequest = useCallback((requestId: string, productType: BloodProductType, unitIds: string[]) => {
    setBloodRequests(prev => prev.map(request => {
      if (request.id !== requestId) return request;
      
      // Find the product in the request
      const updatedProducts = request.products.map(product => {
        if (product.productType !== productType) return product;
        
        return {
          ...product,
          unitsIssued: [...product.unitsIssued, ...unitIds]
        };
      });
      
      return {
        ...request,
        products: updatedProducts,
        lastUpdatedAt: new Date().toISOString()
      };
    }));
    
    // Update the status of the assigned units
    unitIds.forEach(unitId => {
      updateBloodUnitStatus(unitId, 'reserved', { 
        patientId: bloodRequests.find(r => r.id === requestId)?.patientId 
      });
    });
  }, [bloodRequests, updateBloodUnitStatus]);

  const recordCrossmatchResult = useCallback((requestId: string, unitId: string, result: 'compatible' | 'incompatible', performedBy: string, notes?: string) => {
    const crossmatchResult = {
      unitId,
      result,
      performedBy,
      performedAt: new Date().toISOString(),
      notes
    };

    setBloodRequests(prev => prev.map(request => 
      request.id === requestId
        ? { 
            ...request, 
            crossmatchResults: request.crossmatchResults 
              ? [...request.crossmatchResults, crossmatchResult]
              : [crossmatchResult],
            lastUpdatedAt: new Date().toISOString() 
          }
        : request
    ));
    
    // Update the unit status based on crossmatch result
    if (result === 'compatible') {
      const request = bloodRequests.find(r => r.id === requestId);
      updateBloodUnitStatus(unitId, 'crossmatched', { 
        patientId: request?.patientId,
        notes: `Crossmatched for request ${request?.requestNumber}`
      });
    }
  }, [bloodRequests, updateBloodUnitStatus]);

  // Utility functions
  const getBloodUnitById = useCallback((unitId: string) => {
    return bloodUnits.find(unit => unit.id === unitId);
  }, [bloodUnits]);

  const getBloodUnitsByType = useCallback((bloodType: BloodType, productType?: BloodProductType) => {
    return bloodUnits.filter(unit => 
      unit.bloodType === bloodType && 
      (productType ? unit.productType === productType : true)
    );
  }, [bloodUnits]);

  const getBloodUnitsByStatus = useCallback((status: BloodUnitStatus) => {
    return bloodUnits.filter(unit => unit.status === status);
  }, [bloodUnits]);

  const getAvailableBloodUnits = useCallback((bloodType?: BloodType, productType?: BloodProductType) => {
    return bloodUnits.filter(unit => 
      unit.status === 'available' &&
      (bloodType ? unit.bloodType === bloodType : true) &&
      (productType ? unit.productType === productType : true)
    );
  }, [bloodUnits]);

  const getDonorById = useCallback((donorId: string) => {
    return donors.find(donor => donor.id === donorId);
  }, [donors]);

  const getDonorsByBloodType = useCallback((bloodType: BloodType) => {
    return donors.filter(donor => donor.bloodType === bloodType);
  }, [donors]);

  const getDonorsByStatus = useCallback((status: DonorStatus) => {
    return donors.filter(donor => donor.status === status);
  }, [donors]);

  const getBloodRequestById = useCallback((requestId: string) => {
    return bloodRequests.find(request => request.id === requestId);
  }, [bloodRequests]);

  const getBloodRequestsByStatus = useCallback((status: RequestStatus) => {
    return bloodRequests.filter(request => request.status === status);
  }, [bloodRequests]);

  const getBloodRequestsByDepartment = useCallback((department: string) => {
    return bloodRequests.filter(request => request.department === department);
  }, [bloodRequests]);

  const getBloodRequestsByPatient = useCallback((patientId: string) => {
    return bloodRequests.filter(request => request.patientId === patientId);
  }, [bloodRequests]);

  const getBloodInventorySummary = useCallback(() => {
    const bloodTypes: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const productTypes: BloodProductType[] = ['whole_blood', 'packed_red_cells', 'platelets', 'plasma', 'cryoprecipitate'];
    
    // Initialize the summary object
    const summary: Record<BloodType, Record<BloodProductType, number>> = {} as any;
    
    bloodTypes.forEach(bloodType => {
      summary[bloodType] = {} as Record<BloodProductType, number>;
      productTypes.forEach(productType => {
        summary[bloodType][productType] = 0;
      });
    });
    
    // Count available units
    bloodUnits
      .filter(unit => unit.status === 'available')
      .forEach(unit => {
        summary[unit.bloodType][unit.productType]++;
      });
    
    return summary;
  }, [bloodUnits]);

  const checkCompatibility = useCallback((donorBloodType: BloodType, recipientBloodType: BloodType): boolean => {
    // Blood type compatibility chart
    const compatibilityChart: Record<BloodType, BloodType[]> = {
      'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'A-': ['A-', 'A+', 'AB-', 'AB+'],
      'A+': ['A+', 'AB+'],
      'B-': ['B-', 'B+', 'AB-', 'AB+'],
      'B+': ['B+', 'AB+'],
      'AB-': ['AB-', 'AB+'],
      'AB+': ['AB+']
    };
    
    return compatibilityChart[donorBloodType].includes(recipientBloodType);
  }, []);

  return (
    <BloodBankContext.Provider
      value={{
        bloodUnits,
        addBloodUnit,
        updateBloodUnitStatus,
        discardBloodUnit,
        donors,
        addDonor,
        updateDonorStatus,
        recordDonation,
        bloodRequests,
        createBloodRequest,
        updateRequestStatus,
        assignUnitsToRequest,
        recordCrossmatchResult,
        getBloodUnitById,
        getBloodUnitsByType,
        getBloodUnitsByStatus,
        getAvailableBloodUnits,
        getDonorById,
        getDonorsByBloodType,
        getDonorsByStatus,
        getBloodRequestById,
        getBloodRequestsByStatus,
        getBloodRequestsByDepartment,
        getBloodRequestsByPatient,
        getBloodInventorySummary,
        checkCompatibility
      }}
    >
      {children}
    </BloodBankContext.Provider>
  );
};

// Hook for using the context
export const useBloodBank = () => {
  const context = useContext(BloodBankContext);
  if (context === undefined) {
    throw new Error('useBloodBank must be used within a BloodBankProvider');
  }
  return context;
};
