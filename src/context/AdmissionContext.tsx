import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import admissionService from '../services/admissionService';

// Define the shape of an admission
export interface Admission {
  id: string;
  patientId: string;
  patientName: string;
  admissionDate: string;
  admissionTime: string;
  roomId: string;
  roomName: string;
  roomType: string;
  bedNumber?: string;
  diagnosis: string;
  doctorId: string;
  doctorName: string;
  notes?: string;
  status: 'admitted' | 'discharged';
  dischargeDate?: string;
  dischargeTime?: string;
  dischargeNotes?: string;
  billAmount?: number;
  billPaid?: boolean;
  insuranceCovered?: boolean;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  insuranceApprovalCode?: string;
}

// Define the shape of a room/bed
export interface Room {
  id: string;
  name: string;
  type: 'Executive' | 'Premium' | 'Basic' | 'Ward';
  status: 'Occupied' | 'Available' | 'Maintenance';
  beds?: Bed[];
  floor: string;
  wing: string;
  dailyRate: number;
  features?: string[];
  patientId?: string;
  patientName?: string;
  admissionDate?: string;
}

// Define the shape of a bed (for ward rooms with multiple beds)
export interface Bed {
  id: string;
  number: string;
  status: 'Occupied' | 'Available' | 'Maintenance';
  patientId?: string;
  patientName?: string;
  admissionDate?: string;
}

// Define the context shape
interface AdmissionContextType {
  admittedPatients: Admission[];
  dischargedPatients: Admission[];
  rooms: Room[];
  loading: boolean;
  error: string | null;
  addAdmission: (admission: Omit<Admission, 'id' | 'status'>) => Promise<Admission | null>;
  dischargePatient: (admissionId: string, dischargeDetails: {
    dischargeDate: string;
    dischargeTime: string;
    dischargeNotes?: string;
    billAmount?: number;
    billPaid?: boolean;
  }) => Promise<Admission | null | undefined>;
  updateAdmission: (id: string, admission: Partial<Admission>) => void;
  deleteAdmission: (id: string) => void;
  getAdmission: (id: string) => Admission | undefined;
  getAdmissionsByDoctor: (doctorId: string) => Admission[];
  getAdmissionsByRoom: (roomId: string) => Admission[];
  getAvailableRooms: (type?: string) => Room[];
  getAvailableBeds: (roomId: string) => Bed[];
  updateRoom: (id: string, room: Partial<Room>) => void;
  updateBed: (roomId: string, bedId: string, bed: Partial<Bed>) => void;
}

// Create the context
const AdmissionContext = createContext<AdmissionContextType | undefined>(undefined);

// Create the provider component
export const AdmissionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [admittedPatients, setAdmittedPatients] = useState<Admission[]>([]);
  const [dischargedPatients, setDischargedPatients] = useState<Admission[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch admissions and rooms on component mount
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        if (isMounted) setLoading(true);

        // Fetch admissions
        console.log('Fetching admissions from API');
        const admissionsData = await admissionService.getAllAdmissions();

        if (isMounted) {
          // Split into admitted and discharged
          const admitted = admissionsData.filter(a => a.status === 'admitted');
          const discharged = admissionsData.filter(a => a.status === 'discharged');

          console.log(`Setting ${admitted.length} admitted patients and ${discharged.length} discharged patients`);
          setAdmittedPatients(admitted);
          setDischargedPatients(discharged);
        }

        // Fetch rooms
        console.log('Fetching rooms from API');
        const roomsData = await admissionService.getAllRooms();

        if (isMounted) {
          console.log(`Setting ${roomsData.length} rooms`);
          setRooms(roomsData);
        }

        if (isMounted) {
          setError(null);
        }
      } catch (err: any) {
        console.error('Error fetching admission data:', err);

        if (isMounted) {
          setError('Failed to load admission data. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Add a new admission
  const addAdmission = async (admission: Omit<Admission, 'id' | 'status'>) => {
    try {
      // Call API to create admission
      const newAdmission = await admissionService.createAdmission(admission);

      if (newAdmission) {
        // Update local state
        setAdmittedPatients([...admittedPatients, newAdmission]);

        // Update room status
        updateRoom(admission.roomId, {
          status: 'Occupied',
          patientId: admission.patientId,
          patientName: admission.patientName,
          admissionDate: admission.admissionDate
        });

        return newAdmission;
      } else {
        console.error('Failed to create admission');
        return null;
      }
    } catch (error) {
      console.error('Error creating admission:', error);
      return null;
    }
  };

  // Discharge a patient
  const dischargePatient = async (admissionId: string, dischargeDetails: {
    dischargeDate: string;
    dischargeTime: string;
    dischargeNotes?: string;
    billAmount?: number;
    billPaid?: boolean;
  }) => {
    try {
      const admission = admittedPatients.find(a => a.id === admissionId);
      if (!admission) return;

      // Call API to discharge patient
      const updatedAdmission = await admissionService.dischargePatient(admissionId, dischargeDetails);

      if (updatedAdmission) {
        // Remove from admitted patients
        setAdmittedPatients(admittedPatients.filter(a => a.id !== admissionId));

        // Add to discharged patients
        setDischargedPatients([...dischargedPatients, updatedAdmission]);

        // Update room status
        updateRoom(admission.roomId, {
          status: 'Available',
          patientId: undefined,
          patientName: undefined,
          admissionDate: undefined
        });

        return updatedAdmission;
      } else {
        console.error('Failed to discharge patient');
        return null;
      }
    } catch (error) {
      console.error('Error discharging patient:', error);
      return null;
    }
  };

  // Update an existing admission
  const updateAdmission = (id: string, updatedAdmission: Partial<Admission>) => {
    // Check if the admission is in admitted patients
    if (admittedPatients.some(a => a.id === id)) {
      setAdmittedPatients(
        admittedPatients.map(admission =>
          admission.id === id ? { ...admission, ...updatedAdmission } : admission
        )
      );
    }
    // Check if the admission is in discharged patients
    else if (dischargedPatients.some(a => a.id === id)) {
      setDischargedPatients(
        dischargedPatients.map(admission =>
          admission.id === id ? { ...admission, ...updatedAdmission } : admission
        )
      );
    }
  };

  // Delete an admission
  const deleteAdmission = (id: string) => {
    // Check if the admission is in admitted patients
    if (admittedPatients.some(a => a.id === id)) {
      setAdmittedPatients(admittedPatients.filter(a => a.id !== id));
    }
    // Check if the admission is in discharged patients
    else if (dischargedPatients.some(a => a.id === id)) {
      setDischargedPatients(dischargedPatients.filter(a => a.id !== id));
    }
  };

  // Get an admission by ID
  const getAdmission = (id: string) => {
    return admittedPatients.find(a => a.id === id) || dischargedPatients.find(a => a.id === id);
  };

  // Get admissions by doctor
  const getAdmissionsByDoctor = (doctorId: string) => {
    return admittedPatients.filter(a => a.doctorId === doctorId);
  };

  // Get admissions by room
  const getAdmissionsByRoom = (roomId: string) => {
    return admittedPatients.filter(a => a.roomId === roomId);
  };

  // Get available rooms
  const getAvailableRooms = (type?: string) => {
    return rooms.filter(room =>
      room.status === 'Available' &&
      (!type || room.type === type)
    );
  };

  // Get available beds in a room
  const getAvailableBeds = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room || !room.beds) return [];
    return room.beds.filter(bed => bed.status === 'Available');
  };

  // Update a room
  const updateRoom = (id: string, updatedRoom: Partial<Room>) => {
    setRooms(
      rooms.map(room =>
        room.id === id ? { ...room, ...updatedRoom } : room
      )
    );
  };

  // Update a bed in a room
  const updateBed = (roomId: string, bedId: string, updatedBed: Partial<Bed>) => {
    setRooms(
      rooms.map(room => {
        if (room.id === roomId && room.beds) {
          return {
            ...room,
            beds: room.beds.map(bed =>
              bed.id === bedId ? { ...bed, ...updatedBed } : bed
            )
          };
        }
        return room;
      })
    );
  };

  return (
    <AdmissionContext.Provider
      value={{
        admittedPatients,
        dischargedPatients,
        rooms,
        loading,
        error,
        addAdmission,
        dischargePatient,
        updateAdmission,
        deleteAdmission,
        getAdmission,
        getAdmissionsByDoctor,
        getAdmissionsByRoom,
        getAvailableRooms,
        getAvailableBeds,
        updateRoom,
        updateBed
      }}
    >
      {children}
    </AdmissionContext.Provider>
  );
};

// Create a hook to use the admission context
export const useAdmission = () => {
  const context = useContext(AdmissionContext);
  if (context === undefined) {
    throw new Error('useAdmission must be used within an AdmissionProvider');
  }
  return context;
};
