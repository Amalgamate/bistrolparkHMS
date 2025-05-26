import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Define branch type with location data
export interface BranchLocation {
  latitude: number;
  longitude: number;
  radius: number; // Radius in meters for geofencing
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  operatingHours: string;
  staffCount: string;
  dailyPatients: string;
  appointmentsToday: string;
  location: BranchLocation;
  allowRemoteAccess: boolean; // Whether this branch can be accessed remotely
}

// Define company settings
export interface CompanySettings {
  name: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
}

// Define settings context type
interface SettingsContextType {
  branches: Branch[];
  companySettings: CompanySettings;
  addBranch: (branch: Omit<Branch, 'id'>) => void;
  updateBranch: (id: string, branch: Partial<Branch>) => void;
  deleteBranch: (id: string) => void;
  updateCompanySettings: (settings: Partial<CompanySettings>) => void;
  getCurrentLocation: () => Promise<GeolocationPosition | null>;
  checkBranchAccess: (branchId: string) => Promise<boolean>;
  getBranchById: (id: string) => Branch | undefined;
  getBranchByName: (name: string) => Branch | undefined;
}

// Initial company settings
const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  name: 'Bristol Park Hospital',
  logo: '/bristol-logo.png',
  primaryColor: '#2B3990',
  secondaryColor: '#A61F1F',
  contactEmail: 'info@bristolparkhospital.com',
  contactPhone: '+254 700 123 456',
  website: 'www.bristolparkhospital.com',
};

// Initial branches data
const INITIAL_BRANCHES: Branch[] = [
  {
    id: 'fedha',
    name: 'Fedha',
    address: '123 Fedha Road, Nairobi',
    phone: '+254 700 123 456',
    operatingHours: '8:00 AM - 8:00 PM',
    staffCount: '120',
    dailyPatients: '85',
    appointmentsToday: '42',
    location: {
      latitude: -1.3173,
      longitude: 36.8572,
      radius: 500, // 500 meters
    },
    allowRemoteAccess: true,
  },
  {
    id: 'utawala',
    name: 'Utawala',
    address: '45 Utawala Road, Nairobi',
    phone: '+254 700 234 567',
    operatingHours: '8:00 AM - 6:00 PM',
    staffCount: '65',
    dailyPatients: '40',
    appointmentsToday: '28',
    location: {
      latitude: -1.2921,
      longitude: 36.9265,
      radius: 500,
    },
    allowRemoteAccess: true,
  },
  {
    id: 'machakos',
    name: 'Machakos',
    address: '78 Machakos Road, Machakos',
    phone: '+254 700 345 678',
    operatingHours: '8:00 AM - 6:00 PM',
    staffCount: '60',
    dailyPatients: '38',
    appointmentsToday: '25',
    location: {
      latitude: -1.5177,
      longitude: 37.2634,
      radius: 500,
    },
    allowRemoteAccess: false,
  },
  {
    id: 'tassia',
    name: 'Tassia',
    address: '12 Tassia Street, Nairobi',
    phone: '+254 700 456 789',
    operatingHours: '8:00 AM - 6:00 PM',
    staffCount: '55',
    dailyPatients: '35',
    appointmentsToday: '22',
    location: {
      latitude: -1.3173,
      longitude: 36.8972,
      radius: 500,
    },
    allowRemoteAccess: true,
  },
  {
    id: 'kitengela',
    name: 'Kitengela',
    address: '34 Kitengela Lane, Kajiado',
    phone: '+254 700 567 890',
    operatingHours: '8:00 AM - 6:00 PM',
    staffCount: '50',
    dailyPatients: '30',
    appointmentsToday: '20',
    location: {
      latitude: -1.4731,
      longitude: 36.9600,
      radius: 500,
    },
    allowRemoteAccess: false,
  },
];

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Safety check for React context
  if (typeof React === 'undefined' || !React.useState) {
    console.error('React is not properly loaded');
    return <>{children}</>;
  }

  const [branches, setBranches] = useState<Branch[]>(() => {
    try {
      const storedBranches = localStorage.getItem('branches');
      return storedBranches ? JSON.parse(storedBranches) : INITIAL_BRANCHES;
    } catch (error) {
      console.error('Error loading branches from localStorage:', error);
      return INITIAL_BRANCHES;
    }
  });

  const [companySettings, setCompanySettings] = useState<CompanySettings>(() => {
    try {
      const storedSettings = localStorage.getItem('companySettings');
      return storedSettings ? JSON.parse(storedSettings) : DEFAULT_COMPANY_SETTINGS;
    } catch (error) {
      console.error('Error loading company settings from localStorage:', error);
      return DEFAULT_COMPANY_SETTINGS;
    }
  });

  // Save to localStorage when settings change
  useEffect(() => {
    try {
      localStorage.setItem('branches', JSON.stringify(branches));
    } catch (error) {
      console.error('Error saving branches to localStorage:', error);
    }
  }, [branches]);

  useEffect(() => {
    try {
      localStorage.setItem('companySettings', JSON.stringify(companySettings));
    } catch (error) {
      console.error('Error saving company settings to localStorage:', error);
    }
  }, [companySettings]);

  // Add a new branch
  const addBranch = (branch: Omit<Branch, 'id'>) => {
    const newBranch = {
      ...branch,
      id: branch.name.toLowerCase().replace(/\s+/g, '-'),
    };
    setBranches([...branches, newBranch as Branch]);
  };

  // Update an existing branch
  const updateBranch = (id: string, updatedBranch: Partial<Branch>) => {
    setBranches(
      branches.map(branch => (branch.id === id ? { ...branch, ...updatedBranch } : branch))
    );
  };

  // Delete a branch
  const deleteBranch = (id: string) => {
    setBranches(branches.filter(branch => branch.id !== id));
  };

  // Update company settings
  const updateCompanySettings = (settings: Partial<CompanySettings>) => {
    setCompanySettings({ ...companySettings, ...settings });
  };

  // Get current location
  const getCurrentLocation = async (): Promise<GeolocationPosition | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser.');
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          console.error('Error getting location:', error);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    });
  };

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Distance in meters
  };

  // Check if user is within a branch's geofence
  const checkBranchAccess = async (branchId: string): Promise<boolean> => {
    const branch = branches.find(b => b.id === branchId);

    if (!branch) {
      return false;
    }

    // If remote access is allowed, return true
    if (branch.allowRemoteAccess) {
      return true;
    }

    // Otherwise, check if user is within the geofence
    const position = await getCurrentLocation();
    if (!position) {
      return false; // If we can't get location, deny access
    }

    const { latitude, longitude } = position.coords;
    const distance = calculateDistance(
      latitude,
      longitude,
      branch.location.latitude,
      branch.location.longitude
    );

    return distance <= branch.location.radius;
  };

  // Get branch by ID
  const getBranchById = (id: string): Branch | undefined => {
    return branches.find(branch => branch.id === id);
  };

  // Get branch by name
  const getBranchByName = (name: string): Branch | undefined => {
    return branches.find(branch => branch.name === name);
  };

  return (
    <SettingsContext.Provider
      value={{
        branches,
        companySettings,
        addBranch,
        updateBranch,
        deleteBranch,
        updateCompanySettings,
        getCurrentLocation,
        checkBranchAccess,
        getBranchById,
        getBranchByName,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the settings context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
