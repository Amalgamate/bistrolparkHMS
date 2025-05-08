import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of a patient
export interface Patient {
  id: number;
  // File Numbers
  outPatientFileNumber?: string;
  oldReferenceNumber?: string;
  inPatientFileNumber?: string;

  // Personal Information
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  birthDay?: string;
  birthMonth?: string;
  birthYear?: string;
  gender: string;
  nationalId?: string; // National ID or Passport
  maritalStatus?: string;

  // Contact Information
  email: string;
  phone: string;
  residence: string; // Primary residence (required)
  address?: string; // Additional address (optional)
  city?: string;
  state?: string;
  zipCode?: string;

  // Medical Information
  bloodGroup?: string;
  allergies?: string;
  chronicConditions?: string;
  currentMedications?: string;
  shaNumber?: string; // SHA (formerly NHIF) number
  paymentType?: string;

  // Next of Kin (required)
  nextOfKinName: string;
  nextOfKinPhone: string;

  // Emergency Contact (optional, can be different from Next of Kin)
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  insurance?: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    holderName: string;
    coverageType?: string;
    coverageLimit?: number;
    expiryDate?: string;
  };

  // Payment history
  payments?: Array<{
    id: number;
    date: string;
    amount: number;
    paymentMethod: 'Cash' | 'Card' | 'Mobile Money' | 'Insurance' | 'Corporate';
    paymentType: 'Consultation' | 'Medication' | 'Lab Test' | 'Procedure' | 'Admission' | 'Other';
    reference: string;
    status: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
    insuranceProvider?: string;
    insuranceCoverage?: number;
    patientResponsibility?: number;
    description?: string;
  }>;
  // Referral information
  referral?: {
    isReferred: boolean;
    referringHospital?: string;
    referringDoctor?: string;
    referralReason?: string;
    referralDate?: string;
  };
  // Vitals history
  vitals?: Array<{
    id: number;
    date: string;
    temperature?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    weight?: number;
    height?: number;
    pulseRate?: number;
    notes?: string;
  }>;
  lastVisit?: string;
  status: 'Active' | 'Inactive';
  isAdmitted?: boolean;
  isCleared?: boolean;
}

// Define the context shape
interface PatientContextType {
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: number, patient: Partial<Patient>) => void;
  deletePatient: (id: number) => void;
  getPatient: (id: number) => Patient | undefined;
}

// Create the context
const PatientContext = createContext<PatientContextType | undefined>(undefined);

// Mock data for initial patients with Kenyan names and addresses
const INITIAL_PATIENTS: Patient[] = [
  {
    id: 1,
    // File Numbers
    outPatientFileNumber: 'OP-12345',
    oldReferenceNumber: 'REF-98765',
    inPatientFileNumber: 'IP-54321',

    // Personal Information
    firstName: 'Wanjiku',
    middleName: 'Njeri',
    lastName: 'Kamau',
    dateOfBirth: '1985-05-15',
    birthDay: '15',
    birthMonth: '5',
    birthYear: '1985',
    gender: 'Female',
    nationalId: '22456789',
    maritalStatus: 'married',

    // Contact Information
    email: 'wanjiku.kamau@gmail.com',
    phone: '0722 123 456',
    residence: 'Fedha Estate, Nairobi',
    address: 'Block C, Apt 304',
    city: 'Nairobi',
    state: 'Nairobi County',
    zipCode: '00100',

    // Medical Information
    bloodGroup: 'O+',
    allergies: 'Penicillin, Peanuts',
    chronicConditions: 'Hypertension, Asthma',
    currentMedications: 'Lisinopril 10mg daily, Ventolin inhaler as needed',
    shaNumber: 'SHA12345678',
    paymentType: 'insurance',

    // Next of Kin
    nextOfKinName: 'James Kamau',
    nextOfKinPhone: '0733 987 654',

    // Emergency Contact
    emergencyContact: {
      name: 'James Kamau',
      relationship: 'Husband',
      phone: '0733 987 654'
    },
    insurance: {
      provider: 'SHA',
      policyNumber: 'SHA23456789',
      groupNumber: 'GRP987654',
      holderName: 'Wanjiku Kamau',
      coverageType: 'Premium',
      coverageLimit: 1000000,
      expiryDate: '2024-12-31'
    },
    payments: [
      {
        id: 1001,
        date: '2023-11-05',
        amount: 15000,
        paymentMethod: 'Insurance',
        paymentType: 'Consultation',
        reference: 'INV-2023-1001',
        status: 'Paid',
        insuranceProvider: 'SHA',
        insuranceCoverage: 12000,
        patientResponsibility: 3000,
        description: 'Consultation with Dr. Sarah Johnson'
      },
      {
        id: 1002,
        date: '2023-10-15',
        amount: 25000,
        paymentMethod: 'Insurance',
        paymentType: 'Lab Test',
        reference: 'INV-2023-985',
        status: 'Paid',
        insuranceProvider: 'SHA',
        insuranceCoverage: 20000,
        patientResponsibility: 5000,
        description: 'Complete Blood Count and Lipid Panel'
      },
      {
        id: 1003,
        date: '2023-09-22',
        amount: 5000,
        paymentMethod: 'Cash',
        paymentType: 'Medication',
        reference: 'INV-2023-876',
        status: 'Paid',
        description: 'Prescription medications'
      }
    ],
    referral: {
      isReferred: true,
      referringHospital: 'Kenyatta National Hospital',
      referringDoctor: 'Dr. James Mwangi',
      referralReason: 'Specialized cardiac care',
      referralDate: '2023-10-25'
    },
    vitals: [
      {
        id: 1,
        date: '2023-11-05T09:30:00',
        temperature: 36.8,
        bloodPressureSystolic: 120,
        bloodPressureDiastolic: 80,
        weight: 65,
        height: 165,
        pulseRate: 72,
        notes: 'Patient appears healthy'
      },
      {
        id: 2,
        date: '2023-10-15T14:45:00',
        temperature: 37.2,
        bloodPressureSystolic: 130,
        bloodPressureDiastolic: 85,
        weight: 66,
        height: 165,
        pulseRate: 78,
        notes: 'Patient complained of mild headache'
      }
    ],
    lastVisit: '2023-11-05',
    status: 'Active',
    isAdmitted: true
  },
  {
    id: 2,
    firstName: 'Otieno',
    lastName: 'Odhiambo',
    dateOfBirth: '1990-08-22',
    gender: 'Male',
    nationalId: '30987654',
    email: 'otieno.odhiambo@yahoo.com',
    phone: '0711 987 654',
    address: 'Nyayo Estate, Phase 2, House 45',
    city: 'Nairobi',
    state: 'Nairobi County',
    zipCode: '00200',
    bloodGroup: 'A-',
    allergies: 'Sulfa drugs',
    chronicConditions: 'Diabetes Type 2',
    currentMedications: 'Metformin 500mg twice daily',
    emergencyContact: {
      name: 'Akinyi Odhiambo',
      relationship: 'Wife',
      phone: '0712 456 789'
    },
    insurance: {
      provider: 'AAR Insurance',
      policyNumber: 'AAR987654321',
      groupNumber: 'GRP123456',
      holderName: 'Otieno Odhiambo'
    },
    referral: {
      isReferred: false
    },
    vitals: [
      {
        id: 1,
        date: '2023-11-02T10:15:00',
        temperature: 36.5,
        bloodPressureSystolic: 110,
        bloodPressureDiastolic: 70,
        weight: 75,
        height: 175,
        pulseRate: 68,
        notes: 'Regular checkup'
      }
    ],
    lastVisit: '2023-11-02',
    status: 'Active',
    isCleared: true
  },
  {
    id: 3,
    firstName: 'Njeri',
    lastName: 'Waweru',
    dateOfBirth: '1978-03-12',
    gender: 'Female',
    nationalId: '19876543',
    email: 'njeri.waweru@gmail.com',
    phone: '0700 234 567',
    address: 'Kileleshwa, Gatundu Road, House 12',
    city: 'Nairobi',
    state: 'Nairobi County',
    zipCode: '00100',
    bloodGroup: 'B+',
    allergies: 'None',
    chronicConditions: 'None',
    currentMedications: 'None',
    emergencyContact: {
      name: 'John Waweru',
      relationship: 'Husband',
      phone: '0722 345 678'
    },
    insurance: {
      provider: 'Jubilee Insurance',
      policyNumber: 'JUB23456789',
      groupNumber: 'GRP345678',
      holderName: 'Njeri Waweru',
      coverageType: 'Corporate',
      coverageLimit: 2000000,
      expiryDate: '2024-08-31'
    },
    payments: [
      {
        id: 3001,
        date: '2023-10-20',
        amount: 35000,
        paymentMethod: 'Corporate',
        paymentType: 'Procedure',
        reference: 'INV-2023-950',
        status: 'Paid',
        insuranceProvider: 'Jubilee Insurance',
        insuranceCoverage: 35000,
        patientResponsibility: 0,
        description: 'Annual physical examination and wellness check'
      },
      {
        id: 3002,
        date: '2023-09-15',
        amount: 18000,
        paymentMethod: 'Corporate',
        paymentType: 'Lab Test',
        reference: 'INV-2023-875',
        status: 'Paid',
        insuranceProvider: 'Jubilee Insurance',
        insuranceCoverage: 18000,
        patientResponsibility: 0,
        description: 'Comprehensive blood work and hormone panel'
      }
    ],
    referral: {
      isReferred: false
    },
    vitals: [
      {
        id: 1,
        date: '2023-10-20T11:00:00',
        temperature: 36.6,
        bloodPressureSystolic: 118,
        bloodPressureDiastolic: 78,
        weight: 62,
        height: 160,
        pulseRate: 70,
        notes: 'Annual physical'
      }
    ],
    lastVisit: '2023-10-20',
    status: 'Active'
  },
  {
    id: 4,
    firstName: 'Mwangi',
    lastName: 'Kariuki',
    dateOfBirth: '1982-11-30',
    gender: 'Male',
    nationalId: '25678901',
    email: 'mwangi.kariuki@gmail.com',
    phone: '0733 456 789',
    address: 'South B, Mumias Road, Apt 7B',
    city: 'Nairobi',
    state: 'Nairobi County',
    zipCode: '00200',
    bloodGroup: 'AB+',
    allergies: 'Shellfish',
    chronicConditions: 'Hypertension',
    currentMedications: 'Amlodipine 5mg daily',
    emergencyContact: {
      name: 'Grace Kariuki',
      relationship: 'Wife',
      phone: '0722 567 890'
    },
    insurance: {
      provider: 'SHA',
      policyNumber: 'SHA34567890',
      groupNumber: 'GRP456789',
      holderName: 'Mwangi Kariuki',
      coverageType: 'Standard',
      coverageLimit: 500000,
      expiryDate: '2024-10-15'
    },
    payments: [
      {
        id: 2001,
        date: '2023-11-10',
        amount: 12000,
        paymentMethod: 'Insurance',
        paymentType: 'Consultation',
        reference: 'INV-2023-1105',
        status: 'Paid',
        insuranceProvider: 'SHA',
        insuranceCoverage: 10000,
        patientResponsibility: 2000,
        description: 'Consultation with Dr. Michael Chen'
      },
      {
        id: 2002,
        date: '2023-10-05',
        amount: 8000,
        paymentMethod: 'Mobile Money',
        paymentType: 'Medication',
        reference: 'INV-2023-1050',
        status: 'Paid',
        description: 'Prescription medications'
      }
    ],
    referral: {
      isReferred: false
    },
    vitals: [
      {
        id: 1,
        date: '2023-11-10T14:30:00',
        temperature: 36.7,
        bloodPressureSystolic: 135,
        bloodPressureDiastolic: 85,
        weight: 78,
        height: 172,
        pulseRate: 75,
        notes: 'Blood pressure slightly elevated'
      }
    ],
    lastVisit: '2023-11-10',
    status: 'Active'
  },
  {
    id: 5,
    firstName: 'Auma',
    lastName: 'Onyango',
    dateOfBirth: '1995-07-18',
    gender: 'Female',
    nationalId: '32109876',
    email: 'auma.onyango@yahoo.com',
    phone: '0712 345 678',
    address: 'Umoja Estate, Phase 1, Block D, House 23',
    city: 'Nairobi',
    state: 'Nairobi County',
    zipCode: '00100',
    bloodGroup: 'O-',
    allergies: 'Dust, Pollen',
    chronicConditions: 'Asthma',
    currentMedications: 'Symbicort inhaler as needed',
    emergencyContact: {
      name: 'Peter Onyango',
      relationship: 'Father',
      phone: '0722 678 901'
    },
    insurance: {
      provider: 'Britam Insurance',
      policyNumber: 'BRT45678901',
      groupNumber: 'GRP567890',
      holderName: 'Auma Onyango'
    },
    referral: {
      isReferred: true,
      referringHospital: 'Aga Khan Hospital',
      referringDoctor: 'Dr. Sarah Omondi',
      referralReason: 'Pulmonary function testing',
      referralDate: '2023-11-15'
    },
    vitals: [
      {
        id: 1,
        date: '2023-11-20T10:45:00',
        temperature: 36.6,
        bloodPressureSystolic: 115,
        bloodPressureDiastolic: 75,
        weight: 58,
        height: 162,
        pulseRate: 72,
        notes: 'Mild wheezing on examination'
      }
    ],
    lastVisit: '2023-11-20',
    status: 'Active'
  },
  {
    id: 6,
    firstName: 'Kipchoge',
    lastName: 'Kipruto',
    dateOfBirth: '1970-04-05',
    gender: 'Male',
    nationalId: '12345670',
    email: 'kipchoge.kipruto@gmail.com',
    phone: '0722 890 123',
    address: 'Langata, Maasai Road, House 45',
    city: 'Nairobi',
    state: 'Nairobi County',
    zipCode: '00509',
    bloodGroup: 'A+',
    allergies: 'None',
    chronicConditions: 'Arthritis',
    currentMedications: 'Diclofenac 50mg as needed',
    emergencyContact: {
      name: 'Chebet Kipruto',
      relationship: 'Daughter',
      phone: '0711 234 567'
    },
    insurance: {
      provider: 'CIC Insurance',
      policyNumber: 'CIC56789012',
      groupNumber: 'GRP678901',
      holderName: 'Kipchoge Kipruto'
    },
    referral: {
      isReferred: false
    },
    vitals: [
      {
        id: 1,
        date: '2023-11-25T09:00:00',
        temperature: 36.5,
        bloodPressureSystolic: 140,
        bloodPressureDiastolic: 90,
        weight: 82,
        height: 168,
        pulseRate: 80,
        notes: 'Joint pain in knees and hips'
      }
    ],
    lastVisit: '2023-11-25',
    status: 'Inactive'
  }
];

// Create the provider component
export const PatientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);

  // Add a new patient
  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient = {
      ...patient,
      id: patients.length > 0 ? Math.max(...patients.map(p => p.id)) + 1 : 1
    };
    setPatients([...patients, newPatient as Patient]);
  };

  // Update an existing patient
  const updatePatient = (id: number, updatedPatient: Partial<Patient>) => {
    setPatients(
      patients.map(patient =>
        patient.id === id ? { ...patient, ...updatedPatient } : patient
      )
    );
  };

  // Delete a patient
  const deletePatient = (id: number) => {
    setPatients(patients.filter(patient => patient.id !== id));
  };

  // Get a patient by ID
  const getPatient = (id: number) => {
    return patients.find(patient => patient.id === id);
  };

  return (
    <PatientContext.Provider
      value={{
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        getPatient
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

// Create a hook to use the patient context
export const usePatient = () => {
  const context = useContext(PatientContext);
  if (context === undefined) {
    throw new Error('usePatient must be used within a PatientProvider');
  }
  return context;
};
