import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AdmissionStatus = 'Active' | 'Discharged' | 'Transferred';
export type BedStatus = 'Available' | 'Occupied' | 'Maintenance' | 'Reserved';
export type WardType = 'General' | 'ICU' | 'Maternity' | 'Pediatric' | 'Surgical' | 'Medical';
export type Priority = 'normal' | 'urgent' | 'emergency';

export interface HospitalBranch {
  branch_id: number;
  branch_code: string;
  branch_name: string;
  location: string;
  floors: number;
  total_beds: number;
  active: boolean;
}

export interface Ward {
  ward_id: number;
  ward_name: string;
  ward_type: WardType;
  branch_id: number;
  branch_name: string;
  capacity: number;
  total_beds: number;
  available_beds: number;
  occupied_beds: number;
  maintenance_beds: number;
  reserved_beds: number;
  occupancy_percentage: number;
}

export interface Bed {
  bed_id: number;
  bed_number: string;
  ward_id: number;
  ward_name: string;
  ward_type: WardType;
  branch_id: number;
  branch_name: string;
  bed_type: string;
  status: BedStatus;
  daily_rate: number;
  current_patient_id?: number;
  current_patient_name?: string;
  occupied_since?: string;
  current_admission_id?: number;
}

export interface Admission {
  admission_id: number;
  patient_id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  patient_gender: string;
  dob: string;
  cell_phone?: string;
  admission_date: string;
  admission_time: string;
  discharge_date?: string;
  discharge_time?: string;
  ward_id: number;
  bed_id: number;
  hospital_id: number;
  doctor_admitting?: string;
  diagnosis?: string;
  clinical_summary?: string;
  admission_category_description?: string;
  admission_type_description?: string;
  admission_status: AdmissionStatus;
  length_of_stay: number;
}

export interface MaternityAdmission extends Admission {
  date_of_delivery?: string;
  normal_delivery?: string;
  caesarean_section?: string;
  breech_delivery?: string;
  assisted_vaginal_delivery?: string;
  live_birth?: string;
  still_birth?: string;
  neonatal_death?: string;
  new_born_discharged?: string;
}

export interface AdmissionMetadata {
  categories: Array<{
    admission_category_id: number;
    admission_category_description: string;
  }>;
  types: Array<{
    admission_type_id: number;
    admission_type_description: string;
  }>;
}

export interface Patient {
  patient_id: number;
  first_name: string;
  middle_name?: string;
  last_name: string;
  patient_gender: string;
  dob: string;
  cell_phone?: string;
  email?: string;
  residence?: string;
  id_number?: string;
}

interface EnhancedAdmissionContextType {
  // State
  branches: HospitalBranch[];
  wards: Ward[];
  beds: Bed[];
  admissions: Admission[];
  maternityAdmissions: MaternityAdmission[];
  metadata: AdmissionMetadata | null;
  selectedBranch: number | null;
  loading: boolean;
  error: string | null;

  // Actions
  setBranches: (branches: HospitalBranch[]) => void;
  setWards: (wards: Ward[]) => void;
  setBeds: (beds: Bed[]) => void;
  setAdmissions: (admissions: Admission[]) => void;
  setMaternityAdmissions: (admissions: MaternityAdmission[]) => void;
  setMetadata: (metadata: AdmissionMetadata) => void;
  setSelectedBranch: (branchId: number | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // API Functions
  fetchBranches: () => Promise<void>;
  fetchWards: (branchId?: number) => Promise<void>;
  fetchBeds: (branchId?: number, wardId?: number, status?: string) => Promise<void>;
  fetchAdmissions: (branchId?: number, wardId?: number, category?: string) => Promise<void>;
  fetchMaternityAdmissions: (branchId?: number) => Promise<void>;
  fetchMetadata: () => Promise<void>;
  searchPatients: (query: string) => Promise<Patient[]>;
  admitPatient: (admissionData: any) => Promise<void>;
  refreshData: () => Promise<void>;
}

const EnhancedAdmissionContext = createContext<EnhancedAdmissionContextType | undefined>(undefined);

export const useEnhancedAdmission = () => {
  const context = useContext(EnhancedAdmissionContext);
  if (context === undefined) {
    throw new Error('useEnhancedAdmission must be used within an EnhancedAdmissionProvider');
  }
  return context;
};

interface EnhancedAdmissionProviderProps {
  children: ReactNode;
}

export const EnhancedAdmissionProvider: React.FC<EnhancedAdmissionProviderProps> = ({ children }) => {
  const [branches, setBranches] = useState<HospitalBranch[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [beds, setBeds] = useState<Bed[]>([]);
  const [admissions, setAdmissions] = useState<Admission[]>([]);
  const [maternityAdmissions, setMaternityAdmissions] = useState<MaternityAdmission[]>([]);
  const [metadata, setMetadata] = useState<AdmissionMetadata | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = '/api/admissions';

  // API Functions
  const fetchBranches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/branches`);
      const data = await response.json();
      
      if (data.success) {
        setBranches(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch branches');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch branches');
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async (branchId?: number) => {
    try {
      setLoading(true);
      setError(null);
      const url = branchId ? `${API_BASE}/wards/statistics/${branchId}` : `${API_BASE}/wards/statistics`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setWards(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch wards');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wards');
    } finally {
      setLoading(false);
    }
  };

  const fetchBeds = async (branchId?: number, wardId?: number, status?: string) => {
    try {
      setLoading(true);
      setError(null);
      let url = branchId ? `${API_BASE}/beds/occupancy/${branchId}` : `${API_BASE}/beds/occupancy`;
      
      const params = new URLSearchParams();
      if (wardId) params.append('wardId', wardId.toString());
      if (status) params.append('status', status);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setBeds(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch beds');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch beds');
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmissions = async (branchId?: number, wardId?: number, category?: string) => {
    try {
      setLoading(true);
      setError(null);
      let url = branchId ? `${API_BASE}/active/${branchId}` : `${API_BASE}/active`;
      
      const params = new URLSearchParams();
      if (wardId) params.append('wardId', wardId.toString());
      if (category) params.append('category', category);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setAdmissions(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch admissions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch admissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchMaternityAdmissions = async (branchId?: number) => {
    try {
      setLoading(true);
      setError(null);
      const url = branchId ? `${API_BASE}/maternity/${branchId}` : `${API_BASE}/maternity`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setMaternityAdmissions(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch maternity admissions');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch maternity admissions');
    } finally {
      setLoading(false);
    }
  };

  const fetchMetadata = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/metadata`);
      const data = await response.json();
      
      if (data.success) {
        setMetadata(data.data);
      } else {
        throw new Error(data.message || 'Failed to fetch metadata');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metadata');
    } finally {
      setLoading(false);
    }
  };

  const searchPatients = async (query: string): Promise<Patient[]> => {
    try {
      const response = await fetch(`${API_BASE}/patients/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        return data.data;
      } else {
        throw new Error(data.message || 'Failed to search patients');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search patients');
      return [];
    }
  };

  const admitPatient = async (admissionData: any) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE}/admit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(admissionData),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Refresh data after successful admission
        await refreshData();
      } else {
        throw new Error(data.message || 'Failed to admit patient');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to admit patient');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await Promise.all([
      fetchBranches(),
      fetchWards(selectedBranch || undefined),
      fetchBeds(selectedBranch || undefined),
      fetchAdmissions(selectedBranch || undefined),
      fetchMaternityAdmissions(selectedBranch || undefined),
      fetchMetadata(),
    ]);
  };

  // Initialize data on mount
  useEffect(() => {
    refreshData();
  }, []);

  // Refresh data when selected branch changes
  useEffect(() => {
    if (selectedBranch) {
      fetchWards(selectedBranch);
      fetchBeds(selectedBranch);
      fetchAdmissions(selectedBranch);
      fetchMaternityAdmissions(selectedBranch);
    }
  }, [selectedBranch]);

  const value: EnhancedAdmissionContextType = {
    // State
    branches,
    wards,
    beds,
    admissions,
    maternityAdmissions,
    metadata,
    selectedBranch,
    loading,
    error,

    // Actions
    setBranches,
    setWards,
    setBeds,
    setAdmissions,
    setMaternityAdmissions,
    setMetadata,
    setSelectedBranch,
    setLoading,
    setError,

    // API Functions
    fetchBranches,
    fetchWards,
    fetchBeds,
    fetchAdmissions,
    fetchMaternityAdmissions,
    fetchMetadata,
    searchPatients,
    admitPatient,
    refreshData,
  };

  return (
    <EnhancedAdmissionContext.Provider value={value}>
      {children}
    </EnhancedAdmissionContext.Provider>
  );
};
