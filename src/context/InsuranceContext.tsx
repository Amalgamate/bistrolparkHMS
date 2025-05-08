import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface Insurance {
  id: string;
  name: string;
  code: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  active: boolean;
  coverageTypes?: string[]; // Types of coverage offered
  requiresPreAuthorization?: boolean;
  notes?: string;
}

interface InsuranceContextType {
  insuranceProviders: Insurance[];
  addInsurance: (insurance: Omit<Insurance, 'id'>) => void;
  updateInsurance: (id: string, insurance: Partial<Insurance>) => void;
  deleteInsurance: (id: string) => void;
  getInsurance: (id: string) => Insurance | undefined;
  getActiveInsuranceProviders: () => Insurance[];
}

const InsuranceContext = createContext<InsuranceContextType | undefined>(undefined);

// Default insurance providers
const defaultInsuranceProviders: Insurance[] = [
  {
    id: '1',
    name: 'SHA Insurance',
    code: 'SHA001',
    contactPerson: 'John Doe',
    phone: '+254 700 123 456',
    email: 'contact@shainsurance.com',
    address: 'Nairobi, Kenya',
    active: true,
    coverageTypes: ['Inpatient', 'Outpatient', 'Maternity', 'Dental'],
    requiresPreAuthorization: true
  },
  {
    id: '2',
    name: 'Jubilee Insurance',
    code: 'JUB001',
    contactPerson: 'Jane Smith',
    phone: '+254 700 234 567',
    email: 'contact@jubilee.co.ke',
    address: 'Nairobi, Kenya',
    active: true,
    coverageTypes: ['Inpatient', 'Outpatient', 'Optical'],
    requiresPreAuthorization: false
  },
  {
    id: '3',
    name: 'AAR Insurance',
    code: 'AAR001',
    contactPerson: 'Michael Omondi',
    phone: '+254 711 345 678',
    email: 'contact@aar.co.ke',
    address: 'Nairobi, Kenya',
    active: true,
    coverageTypes: ['Inpatient', 'Outpatient', 'Chronic Disease Management'],
    requiresPreAuthorization: true
  },
  {
    id: '4',
    name: 'NHIF',
    code: 'NHIF001',
    contactPerson: 'Government Representative',
    phone: '+254 722 456 789',
    email: 'info@nhif.or.ke',
    address: 'Nairobi, Kenya',
    active: true,
    coverageTypes: ['Basic Healthcare', 'Maternity'],
    requiresPreAuthorization: true,
    notes: 'National Health Insurance Fund'
  },
  {
    id: '5',
    name: 'Britam Insurance',
    code: 'BRI001',
    contactPerson: 'Sarah Wangari',
    phone: '+254 733 567 890',
    email: 'contact@britam.co.ke',
    address: 'Nairobi, Kenya',
    active: true,
    coverageTypes: ['Inpatient', 'Outpatient', 'Emergency'],
    requiresPreAuthorization: false
  }
];

export const InsuranceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [insuranceProviders, setInsuranceProviders] = useState<Insurance[]>(() => {
    // Try to load from localStorage
    const savedProviders = localStorage.getItem('insuranceProviders');
    return savedProviders ? JSON.parse(savedProviders) : defaultInsuranceProviders;
  });

  // Save to localStorage whenever insuranceProviders changes
  useEffect(() => {
    localStorage.setItem('insuranceProviders', JSON.stringify(insuranceProviders));
  }, [insuranceProviders]);

  const addInsurance = (insurance: Omit<Insurance, 'id'>) => {
    const newId = (insuranceProviders.length + 1).toString();
    const newInsurance = { ...insurance, id: newId };
    setInsuranceProviders([...insuranceProviders, newInsurance]);
  };

  const updateInsurance = (id: string, insurance: Partial<Insurance>) => {
    setInsuranceProviders(
      insuranceProviders.map(provider => 
        provider.id === id ? { ...provider, ...insurance } : provider
      )
    );
  };

  const deleteInsurance = (id: string) => {
    setInsuranceProviders(
      insuranceProviders.filter(provider => provider.id !== id)
    );
  };

  const getInsurance = (id: string) => {
    return insuranceProviders.find(provider => provider.id === id);
  };

  const getActiveInsuranceProviders = () => {
    return insuranceProviders.filter(provider => provider.active);
  };

  return (
    <InsuranceContext.Provider value={{
      insuranceProviders,
      addInsurance,
      updateInsurance,
      deleteInsurance,
      getInsurance,
      getActiveInsuranceProviders
    }}>
      {children}
    </InsuranceContext.Provider>
  );
};

export const useInsurance = () => {
  const context = useContext(InsuranceContext);
  if (context === undefined) {
    throw new Error('useInsurance must be used within an InsuranceProvider');
  }
  return context;
};
