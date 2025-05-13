import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types for our lab module
export type LabRequestStatus = 
  | 'pending'           // Request created, waiting for sample collection
  | 'sample_collected'  // Sample collected, waiting for processing
  | 'processing'        // Sample being processed
  | 'completed'         // Test completed, results available
  | 'cancelled';        // Test cancelled

export type PatientType = 'internal' | 'external';

export type LabTestCategory = 
  | 'hematology'        // Blood tests
  | 'biochemistry'      // Chemical tests
  | 'microbiology'      // Bacteria, virus tests
  | 'immunology'        // Immune system tests
  | 'urinalysis'        // Urine tests
  | 'imaging'           // X-rays, ultrasounds, etc.
  | 'pathology'         // Tissue samples
  | 'other';            // Other tests

export interface LabTest {
  id: string;
  name: string;
  category: LabTestCategory;
  price: number;
  turnaroundTime: number; // in hours
  requiresFasting: boolean;
  sampleType: string;
  active: boolean;
}

export interface LabTestResult {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag?: 'normal' | 'low' | 'high' | 'critical';
  notes?: string;
}

export interface LabRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientType: PatientType;
  doctorId?: string;
  doctorName?: string;
  tests: {
    id: string;
    testId: string;
    testName: string;
    status: LabRequestStatus;
    requestedAt: string;
    sampleCollectedAt?: string;
    sampleCollectedBy?: string;
    processingStartedAt?: string;
    completedAt?: string;
    results?: LabTestResult[];
    notes?: string;
  }[];
  priority: 'normal' | 'urgent' | 'stat';
  branch: string;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'complete';
  paymentMethod?: 'cash' | 'insurance' | 'mpesa' | 'card' | 'credit';
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceApprovalCode?: string;
}

export interface ExternalPatient {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  phone: string;
  email?: string;
  idNumber?: string;
  referredBy?: string;
  createdAt: string;
}

// Define the context shape
interface LabContextType {
  labTests: LabTest[];
  labRequests: LabRequest[];
  externalPatients: ExternalPatient[];
  
  // Lab test management
  addLabTest: (test: Omit<LabTest, 'id'>) => LabTest;
  updateLabTest: (id: string, test: Partial<LabTest>) => void;
  deleteLabTest: (id: string) => void;
  getLabTest: (id: string) => LabTest | undefined;
  getLabTestsByCategory: (category: LabTestCategory) => LabTest[];
  
  // Lab request management
  createLabRequest: (request: Omit<LabRequest, 'id' | 'createdAt' | 'updatedAt'>) => LabRequest;
  updateLabRequest: (id: string, request: Partial<LabRequest>) => void;
  cancelLabRequest: (id: string) => void;
  getLabRequest: (id: string) => LabRequest | undefined;
  getLabRequestsByPatient: (patientId: string) => LabRequest[];
  getLabRequestsByStatus: (status: LabRequestStatus) => LabRequest[];
  
  // Sample collection
  collectSample: (requestId: string, testId: string, collectedBy: string) => void;
  startProcessing: (requestId: string, testId: string) => void;
  
  // Results management
  addTestResults: (requestId: string, testId: string, results: LabTestResult[]) => void;
  
  // External patient management
  registerExternalPatient: (patient: Omit<ExternalPatient, 'id' | 'createdAt'>) => ExternalPatient;
  getExternalPatient: (id: string) => ExternalPatient | undefined;
}

// Mock data for lab tests
const initialLabTests: LabTest[] = [
  {
    id: 'LT001',
    name: 'Complete Blood Count (CBC)',
    category: 'hematology',
    price: 1200,
    turnaroundTime: 2,
    requiresFasting: false,
    sampleType: 'Blood',
    active: true
  },
  {
    id: 'LT002',
    name: 'Lipid Profile',
    category: 'biochemistry',
    price: 1500,
    turnaroundTime: 4,
    requiresFasting: true,
    sampleType: 'Blood',
    active: true
  },
  {
    id: 'LT003',
    name: 'Liver Function Test',
    category: 'biochemistry',
    price: 1800,
    turnaroundTime: 4,
    requiresFasting: true,
    sampleType: 'Blood',
    active: true
  },
  {
    id: 'LT004',
    name: 'Urinalysis',
    category: 'urinalysis',
    price: 800,
    turnaroundTime: 1,
    requiresFasting: false,
    sampleType: 'Urine',
    active: true
  },
  {
    id: 'LT005',
    name: 'Blood Glucose',
    category: 'biochemistry',
    price: 500,
    turnaroundTime: 1,
    requiresFasting: true,
    sampleType: 'Blood',
    active: true
  },
  {
    id: 'LT006',
    name: 'Thyroid Function Test',
    category: 'immunology',
    price: 2500,
    turnaroundTime: 24,
    requiresFasting: false,
    sampleType: 'Blood',
    active: true
  },
  {
    id: 'LT007',
    name: 'HbA1c',
    category: 'biochemistry',
    price: 1800,
    turnaroundTime: 4,
    requiresFasting: false,
    sampleType: 'Blood',
    active: true
  },
  {
    id: 'LT008',
    name: 'Chest X-Ray',
    category: 'imaging',
    price: 2000,
    turnaroundTime: 1,
    requiresFasting: false,
    sampleType: 'N/A',
    active: true
  },
  {
    id: 'LT009',
    name: 'Urine Culture',
    category: 'microbiology',
    price: 1500,
    turnaroundTime: 72,
    requiresFasting: false,
    sampleType: 'Urine',
    active: true
  },
  {
    id: 'LT010',
    name: 'Stool Analysis',
    category: 'microbiology',
    price: 1200,
    turnaroundTime: 24,
    requiresFasting: false,
    sampleType: 'Stool',
    active: true
  }
];

// Mock data for lab requests
const initialLabRequests: LabRequest[] = [
  {
    id: 'LR001',
    patientId: 'P001',
    patientName: 'John Kamau',
    patientType: 'internal',
    doctorId: 'D001',
    doctorName: 'Dr. Sarah Williams',
    tests: [
      {
        id: 'T001',
        testId: 'LT001',
        testName: 'Complete Blood Count (CBC)',
        status: 'completed',
        requestedAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(), // 3 hours ago
        sampleCollectedAt: new Date(Date.now() - 2.5 * 60 * 60000).toISOString(),
        sampleCollectedBy: 'Lab Tech Jane',
        processingStartedAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
        completedAt: new Date(Date.now() - 1 * 60 * 60000).toISOString(),
        results: [
          {
            parameter: 'WBC',
            value: '7.2',
            unit: 'x10^9/L',
            referenceRange: '4.0-11.0',
            flag: 'normal'
          },
          {
            parameter: 'RBC',
            value: '4.8',
            unit: 'x10^12/L',
            referenceRange: '4.5-5.5',
            flag: 'normal'
          },
          {
            parameter: 'Hemoglobin',
            value: '14.2',
            unit: 'g/dL',
            referenceRange: '13.5-17.5',
            flag: 'normal'
          },
          {
            parameter: 'Hematocrit',
            value: '42',
            unit: '%',
            referenceRange: '41-50',
            flag: 'normal'
          },
          {
            parameter: 'Platelets',
            value: '250',
            unit: 'x10^9/L',
            referenceRange: '150-450',
            flag: 'normal'
          }
        ]
      },
      {
        id: 'T002',
        testId: 'LT005',
        testName: 'Blood Glucose',
        status: 'completed',
        requestedAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
        sampleCollectedAt: new Date(Date.now() - 2.5 * 60 * 60000).toISOString(),
        sampleCollectedBy: 'Lab Tech Jane',
        processingStartedAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
        completedAt: new Date(Date.now() - 1 * 60 * 60000).toISOString(),
        results: [
          {
            parameter: 'Fasting Glucose',
            value: '95',
            unit: 'mg/dL',
            referenceRange: '70-100',
            flag: 'normal'
          }
        ]
      }
    ],
    priority: 'normal',
    branch: 'Fedha',
    createdAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60000).toISOString(),
    totalAmount: 1700,
    paymentStatus: 'complete',
    paymentMethod: 'insurance',
    insuranceProvider: 'SHA',
    insurancePolicyNumber: 'SHA12345678'
  },
  {
    id: 'LR002',
    patientId: 'P005',
    patientName: 'Peter Njoroge',
    patientType: 'internal',
    doctorId: 'D002',
    doctorName: 'Dr. Michael Chen',
    tests: [
      {
        id: 'T003',
        testId: 'LT002',
        testName: 'Lipid Profile',
        status: 'sample_collected',
        requestedAt: new Date(Date.now() - 1 * 60 * 60000).toISOString(), // 1 hour ago
        sampleCollectedAt: new Date(Date.now() - 0.5 * 60 * 60000).toISOString(), // 30 minutes ago
        sampleCollectedBy: 'Lab Tech David'
      },
      {
        id: 'T004',
        testId: 'LT003',
        testName: 'Liver Function Test',
        status: 'sample_collected',
        requestedAt: new Date(Date.now() - 1 * 60 * 60000).toISOString(),
        sampleCollectedAt: new Date(Date.now() - 0.5 * 60 * 60000).toISOString(),
        sampleCollectedBy: 'Lab Tech David'
      }
    ],
    priority: 'normal',
    branch: 'Fedha',
    createdAt: new Date(Date.now() - 1 * 60 * 60000).toISOString(),
    updatedAt: new Date(Date.now() - 0.5 * 60 * 60000).toISOString(),
    totalAmount: 3300,
    paymentStatus: 'pending'
  }
];

// Mock data for external patients
const initialExternalPatients: ExternalPatient[] = [
  {
    id: 'EP001',
    firstName: 'Grace',
    lastName: 'Muthoni',
    gender: 'female',
    age: 35,
    phone: '0712 345 678',
    email: 'grace.muthoni@example.com',
    idNumber: '12345678',
    referredBy: 'Dr. James Mwangi',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString() // 2 days ago
  },
  {
    id: 'EP002',
    firstName: 'Samuel',
    lastName: 'Otieno',
    gender: 'male',
    age: 42,
    phone: '0723 456 789',
    idNumber: '23456789',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60000).toISOString() // 1 day ago
  }
];

// Create the context
const LabContext = createContext<LabContextType | undefined>(undefined);

// Create the provider component
export const LabProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [labTests, setLabTests] = useState<LabTest[]>(initialLabTests);
  const [labRequests, setLabRequests] = useState<LabRequest[]>(initialLabRequests);
  const [externalPatients, setExternalPatients] = useState<ExternalPatient[]>(initialExternalPatients);

  // Lab test management functions
  const addLabTest = useCallback((test: Omit<LabTest, 'id'>) => {
    const newTest = {
      ...test,
      id: `LT${String(labTests.length + 1).padStart(3, '0')}`
    };
    setLabTests(prev => [...prev, newTest]);
    return newTest;
  }, [labTests]);

  const updateLabTest = useCallback((id: string, test: Partial<LabTest>) => {
    setLabTests(prev => prev.map(t => t.id === id ? { ...t, ...test } : t));
  }, []);

  const deleteLabTest = useCallback((id: string) => {
    setLabTests(prev => prev.filter(t => t.id !== id));
  }, []);

  const getLabTest = useCallback((id: string) => {
    return labTests.find(t => t.id === id);
  }, [labTests]);

  const getLabTestsByCategory = useCallback((category: LabTestCategory) => {
    return labTests.filter(t => t.category === category);
  }, [labTests]);

  // Lab request management functions
  const createLabRequest = useCallback((request: Omit<LabRequest, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newRequest = {
      ...request,
      id: `LR${String(labRequests.length + 1).padStart(3, '0')}`,
      createdAt: now,
      updatedAt: now
    };
    setLabRequests(prev => [...prev, newRequest]);
    return newRequest;
  }, [labRequests]);

  const updateLabRequest = useCallback((id: string, request: Partial<LabRequest>) => {
    setLabRequests(prev => prev.map(r => {
      if (r.id === id) {
        return { 
          ...r, 
          ...request, 
          updatedAt: new Date().toISOString() 
        };
      }
      return r;
    }));
  }, []);

  const cancelLabRequest = useCallback((id: string) => {
    setLabRequests(prev => prev.map(r => {
      if (r.id === id) {
        return {
          ...r,
          tests: r.tests.map(t => ({ ...t, status: 'cancelled' as const })),
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));
  }, []);

  const getLabRequest = useCallback((id: string) => {
    return labRequests.find(r => r.id === id);
  }, [labRequests]);

  const getLabRequestsByPatient = useCallback((patientId: string) => {
    return labRequests.filter(r => r.patientId === patientId);
  }, [labRequests]);

  const getLabRequestsByStatus = useCallback((status: LabRequestStatus) => {
    return labRequests.filter(r => r.tests.some(t => t.status === status));
  }, [labRequests]);

  // Sample collection functions
  const collectSample = useCallback((requestId: string, testId: string, collectedBy: string) => {
    setLabRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          tests: r.tests.map(t => {
            if (t.id === testId) {
              return {
                ...t,
                status: 'sample_collected' as const,
                sampleCollectedAt: new Date().toISOString(),
                sampleCollectedBy: collectedBy
              };
            }
            return t;
          }),
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));
  }, []);

  const startProcessing = useCallback((requestId: string, testId: string) => {
    setLabRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          tests: r.tests.map(t => {
            if (t.id === testId) {
              return {
                ...t,
                status: 'processing' as const,
                processingStartedAt: new Date().toISOString()
              };
            }
            return t;
          }),
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));
  }, []);

  // Results management functions
  const addTestResults = useCallback((requestId: string, testId: string, results: LabTestResult[]) => {
    setLabRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return {
          ...r,
          tests: r.tests.map(t => {
            if (t.id === testId) {
              return {
                ...t,
                status: 'completed' as const,
                completedAt: new Date().toISOString(),
                results
              };
            }
            return t;
          }),
          updatedAt: new Date().toISOString()
        };
      }
      return r;
    }));
  }, []);

  // External patient management functions
  const registerExternalPatient = useCallback((patient: Omit<ExternalPatient, 'id' | 'createdAt'>) => {
    const newPatient = {
      ...patient,
      id: `EP${String(externalPatients.length + 1).padStart(3, '0')}`,
      createdAt: new Date().toISOString()
    };
    setExternalPatients(prev => [...prev, newPatient]);
    return newPatient;
  }, [externalPatients]);

  const getExternalPatient = useCallback((id: string) => {
    return externalPatients.find(p => p.id === id);
  }, [externalPatients]);

  return (
    <LabContext.Provider
      value={{
        labTests,
        labRequests,
        externalPatients,
        addLabTest,
        updateLabTest,
        deleteLabTest,
        getLabTest,
        getLabTestsByCategory,
        createLabRequest,
        updateLabRequest,
        cancelLabRequest,
        getLabRequest,
        getLabRequestsByPatient,
        getLabRequestsByStatus,
        collectSample,
        startProcessing,
        addTestResults,
        registerExternalPatient,
        getExternalPatient
      }}
    >
      {children}
    </LabContext.Provider>
  );
};

// Create a hook for using the context
export const useLab = () => {
  const context = useContext(LabContext);
  if (context === undefined) {
    throw new Error('useLab must be used within a LabProvider');
  }
  return context;
};
