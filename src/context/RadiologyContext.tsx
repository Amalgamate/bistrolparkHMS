import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define types
export type RadiologyStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type PatientType = 'outpatient' | 'inpatient' | 'walkin';

// Define interfaces
export interface RadiologyTest {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  preparationInstructions?: string;
  duration?: number; // in minutes
  active: boolean;
}

export interface RadiologyRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientType: PatientType;
  doctorId: string;
  doctorName: string;
  requestDate: string;
  requestTime: string;
  status: RadiologyStatus;
  priority: 'normal' | 'urgent' | 'emergency';
  tests: {
    id: string;
    testId: string;
    testName: string;
    status: RadiologyStatus;
    notes?: string;
    reportText?: string;
    reportImages?: string[];
    completedBy?: string;
    completedAt?: string;
  }[];
  clinicalNotes?: string;
  paymentStatus: 'pending' | 'paid' | 'insurance';
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  scheduledDate?: string;
  scheduledTime?: string;
}

export interface ExternalPatient {
  id: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  phone: string;
  email?: string;
  idNumber?: string;
  referredBy?: string;
  referralFacility?: string;
  registrationDate: string;
}

// Mock data for radiology tests
const initialRadiologyTests: RadiologyTest[] = [
  {
    id: '1',
    name: 'Chest X-Ray',
    category: 'X-Ray',
    description: 'Standard chest X-ray, PA and lateral views',
    price: 2500,
    preparationInstructions: 'Remove all metal objects from chest area',
    duration: 15,
    active: true
  },
  {
    id: '2',
    name: 'Abdominal Ultrasound',
    category: 'Ultrasound',
    description: 'Complete abdominal ultrasound',
    price: 3500,
    preparationInstructions: 'Fast for 8 hours before the procedure',
    duration: 30,
    active: true
  },
  {
    id: '3',
    name: 'Brain CT Scan',
    category: 'CT Scan',
    description: 'CT scan of the brain without contrast',
    price: 8000,
    preparationInstructions: 'No special preparation required',
    duration: 20,
    active: true
  },
  {
    id: '4',
    name: 'Brain CT Scan with Contrast',
    category: 'CT Scan',
    description: 'CT scan of the brain with contrast',
    price: 12000,
    preparationInstructions: 'Fast for 4 hours before the procedure',
    duration: 30,
    active: true
  },
  {
    id: '5',
    name: 'Knee MRI',
    category: 'MRI',
    description: 'MRI of the knee joint',
    price: 15000,
    preparationInstructions: 'Remove all metal objects',
    duration: 45,
    active: true
  }
];

// Mock data for radiology requests
const initialRadiologyRequests: RadiologyRequest[] = [
  {
    id: '1',
    patientId: '101',
    patientName: 'John Doe',
    patientType: 'inpatient',
    doctorId: 'D1',
    doctorName: 'Dr. Sarah Smith',
    requestDate: '2023-06-15',
    requestTime: '09:30',
    status: 'pending',
    priority: 'normal',
    tests: [
      {
        id: 'T1',
        testId: '1',
        testName: 'Chest X-Ray',
        status: 'pending'
      }
    ],
    clinicalNotes: 'Patient complains of chest pain and shortness of breath',
    paymentStatus: 'insurance',
    insuranceProvider: 'SHA Insurance',
    insurancePolicyNumber: 'SHA12345',
    scheduledDate: '2023-06-16',
    scheduledTime: '10:00'
  },
  {
    id: '2',
    patientId: '102',
    patientName: 'Jane Smith',
    patientType: 'outpatient',
    doctorId: 'D2',
    doctorName: 'Dr. Michael Johnson',
    requestDate: '2023-06-15',
    requestTime: '11:45',
    status: 'in_progress',
    priority: 'urgent',
    tests: [
      {
        id: 'T2',
        testId: '3',
        testName: 'Brain CT Scan',
        status: 'in_progress'
      }
    ],
    clinicalNotes: 'Patient with severe headache and dizziness',
    paymentStatus: 'paid',
    scheduledDate: '2023-06-15',
    scheduledTime: '14:30'
  },
  {
    id: '3',
    patientId: '103',
    patientName: 'Robert Johnson',
    patientType: 'walkin',
    doctorId: 'D3',
    doctorName: 'Dr. Emily Chen',
    requestDate: '2023-06-14',
    requestTime: '15:20',
    status: 'completed',
    priority: 'normal',
    tests: [
      {
        id: 'T3',
        testId: '2',
        testName: 'Abdominal Ultrasound',
        status: 'completed',
        reportText: 'Normal abdominal ultrasound. No abnormalities detected.',
        completedBy: 'Dr. James Wilson',
        completedAt: '2023-06-14T16:30:00'
      }
    ],
    clinicalNotes: 'Patient with abdominal pain',
    paymentStatus: 'paid'
  }
];

// Mock data for external patients
const initialExternalPatients: ExternalPatient[] = [
  {
    id: '1',
    name: 'Alice Brown',
    gender: 'Female',
    age: 45,
    phone: '0712345678',
    email: 'alice.brown@example.com',
    idNumber: 'ID12345678',
    referredBy: 'Dr. James Wilson',
    referralFacility: 'City Medical Center',
    registrationDate: '2023-06-10'
  },
  {
    id: '2',
    name: 'David Miller',
    gender: 'Male',
    age: 62,
    phone: '0723456789',
    idNumber: 'ID23456789',
    referredBy: 'Dr. Lisa Thompson',
    referralFacility: 'County Hospital',
    registrationDate: '2023-06-12'
  }
];

// Define the context shape
interface RadiologyContextType {
  radiologyTests: RadiologyTest[];
  radiologyRequests: RadiologyRequest[];
  externalPatients: ExternalPatient[];
  
  // Test management
  addRadiologyTest: (test: Omit<RadiologyTest, 'id'>) => void;
  updateRadiologyTest: (id: string, test: Partial<RadiologyTest>) => void;
  deleteRadiologyTest: (id: string) => void;
  getRadiologyTest: (id: string) => RadiologyTest | undefined;
  getRadiologyTestsByCategory: (category: string) => RadiologyTest[];
  
  // Request management
  createRadiologyRequest: (request: Omit<RadiologyRequest, 'id'>) => string;
  updateRadiologyRequest: (id: string, request: Partial<RadiologyRequest>) => void;
  cancelRadiologyRequest: (id: string) => void;
  getRadiologyRequest: (id: string) => RadiologyRequest | undefined;
  getRadiologyRequestsByPatient: (patientId: string) => RadiologyRequest[];
  getRadiologyRequestsByStatus: (status: RadiologyStatus) => RadiologyRequest[];
  
  // Test processing
  startProcessing: (requestId: string, testId: string) => void;
  addTestResults: (requestId: string, testId: string, reportText: string, reportImages?: string[]) => void;
  
  // External patient management
  registerExternalPatient: (patient: Omit<ExternalPatient, 'id' | 'registrationDate'>) => string;
  getExternalPatient: (id: string) => ExternalPatient | undefined;
}

// Create the context
const RadiologyContext = createContext<RadiologyContextType | undefined>(undefined);

// Create the provider component
export const RadiologyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [radiologyTests, setRadiologyTests] = useState<RadiologyTest[]>(initialRadiologyTests);
  const [radiologyRequests, setRadiologyRequests] = useState<RadiologyRequest[]>(initialRadiologyRequests);
  const [externalPatients, setExternalPatients] = useState<ExternalPatient[]>(initialExternalPatients);

  // Test management functions
  const addRadiologyTest = (test: Omit<RadiologyTest, 'id'>) => {
    const newTest = { ...test, id: uuidv4() };
    setRadiologyTests([...radiologyTests, newTest]);
  };

  const updateRadiologyTest = (id: string, updatedTest: Partial<RadiologyTest>) => {
    setRadiologyTests(
      radiologyTests.map(test => 
        test.id === id ? { ...test, ...updatedTest } : test
      )
    );
  };

  const deleteRadiologyTest = (id: string) => {
    setRadiologyTests(radiologyTests.filter(test => test.id !== id));
  };

  const getRadiologyTest = (id: string) => {
    return radiologyTests.find(test => test.id === id);
  };

  const getRadiologyTestsByCategory = (category: string) => {
    return radiologyTests.filter(test => test.category === category);
  };

  // Request management functions
  const createRadiologyRequest = (request: Omit<RadiologyRequest, 'id'>) => {
    const id = uuidv4();
    const newRequest = { ...request, id };
    setRadiologyRequests([...radiologyRequests, newRequest]);
    return id;
  };

  const updateRadiologyRequest = (id: string, updatedRequest: Partial<RadiologyRequest>) => {
    setRadiologyRequests(
      radiologyRequests.map(request => 
        request.id === id ? { ...request, ...updatedRequest } : request
      )
    );
  };

  const cancelRadiologyRequest = (id: string) => {
    setRadiologyRequests(
      radiologyRequests.map(request => 
        request.id === id ? { ...request, status: 'cancelled' } : request
      )
    );
  };

  const getRadiologyRequest = (id: string) => {
    return radiologyRequests.find(request => request.id === id);
  };

  const getRadiologyRequestsByPatient = (patientId: string) => {
    return radiologyRequests.filter(request => request.patientId === patientId);
  };

  const getRadiologyRequestsByStatus = (status: RadiologyStatus) => {
    return radiologyRequests.filter(request => request.status === status);
  };

  // Test processing functions
  const startProcessing = (requestId: string, testId: string) => {
    setRadiologyRequests(
      radiologyRequests.map(request => {
        if (request.id === requestId) {
          const updatedTests = request.tests.map(test => 
            test.id === testId ? { ...test, status: 'in_progress' as RadiologyStatus } : test
          );
          
          // If all tests are in progress or completed, update the request status
          const allTestsInProgressOrCompleted = updatedTests.every(
            test => test.status === 'in_progress' || test.status === 'completed'
          );
          
          return { 
            ...request, 
            tests: updatedTests,
            status: allTestsInProgressOrCompleted ? 'in_progress' : request.status
          };
        }
        return request;
      })
    );
  };

  const addTestResults = (requestId: string, testId: string, reportText: string, reportImages?: string[]) => {
    setRadiologyRequests(
      radiologyRequests.map(request => {
        if (request.id === requestId) {
          const updatedTests = request.tests.map(test => 
            test.id === testId ? { 
              ...test, 
              status: 'completed' as RadiologyStatus,
              reportText,
              reportImages,
              completedBy: 'Current User', // This should be replaced with actual user info
              completedAt: new Date().toISOString()
            } : test
          );
          
          // If all tests are completed, update the request status
          const allTestsCompleted = updatedTests.every(test => test.status === 'completed');
          
          return { 
            ...request, 
            tests: updatedTests,
            status: allTestsCompleted ? 'completed' : request.status
          };
        }
        return request;
      })
    );
  };

  // External patient management functions
  const registerExternalPatient = (patient: Omit<ExternalPatient, 'id' | 'registrationDate'>) => {
    const id = uuidv4();
    const newPatient = { 
      ...patient, 
      id, 
      registrationDate: new Date().toISOString().split('T')[0] 
    };
    setExternalPatients([...externalPatients, newPatient]);
    return id;
  };

  const getExternalPatient = (id: string) => {
    return externalPatients.find(patient => patient.id === id);
  };

  return (
    <RadiologyContext.Provider
      value={{
        radiologyTests,
        radiologyRequests,
        externalPatients,
        
        // Test management
        addRadiologyTest,
        updateRadiologyTest,
        deleteRadiologyTest,
        getRadiologyTest,
        getRadiologyTestsByCategory,
        
        // Request management
        createRadiologyRequest,
        updateRadiologyRequest,
        cancelRadiologyRequest,
        getRadiologyRequest,
        getRadiologyRequestsByPatient,
        getRadiologyRequestsByStatus,
        
        // Test processing
        startProcessing,
        addTestResults,
        
        // External patient management
        registerExternalPatient,
        getExternalPatient
      }}
    >
      {children}
    </RadiologyContext.Provider>
  );
};

// Create a hook for using the context
export const useRadiology = () => {
  const context = useContext(RadiologyContext);
  if (context === undefined) {
    throw new Error('useRadiology must be used within a RadiologyProvider');
  }
  return context;
};
