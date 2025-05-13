import React from 'react';
import VirtualizedPatientList from './VirtualizedPatientList';

interface SimplifiedPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  bloodType?: string;
  lastVisit?: string;
  hasUpcomingAppointment?: boolean;
  nextAppointment?: string;
  status?: string;
  isAdmitted?: boolean;
  isCleared?: boolean;
}

interface PatientListAdapterProps {
  patients: SimplifiedPatient[];
  onView?: (patientId: string) => void;
  onEdit?: (patientId: string) => void;
  onDelete?: (patientId: string) => void;
}

/**
 * Adapter component that converts simplified patient data to the format expected by VirtualizedPatientList
 */
const PatientListAdapter: React.FC<PatientListAdapterProps> = ({
  patients,
  onView,
  onEdit,
  onDelete
}) => {
  // Convert simplified patients to the format expected by VirtualizedPatientList
  const adaptedPatients = patients.map(patient => ({
    id: parseInt(patient.id.replace(/\D/g, '')) || Math.floor(Math.random() * 10000), // Convert string ID to number or generate random ID
    firstName: patient.name.split(' ')[0],
    lastName: patient.name.split(' ').slice(1).join(' '),
    gender: patient.gender,
    dateOfBirth: `${new Date().getFullYear() - patient.age}-01-01`, // Approximate from age
    phone: patient.phone,
    email: patient.email,
    bloodGroup: patient.bloodType,
    lastVisit: patient.lastVisit,
    status: patient.status || 'Active',
    isAdmitted: patient.isAdmitted,
    isCleared: patient.isCleared,
    nationalId: patient.id // Use the original ID as nationalId for display
  }));

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Handle view patient
  const handleViewPatient = (id: number) => {
    if (onView) {
      const originalPatient = patients.find(p => parseInt(p.id.replace(/\D/g, '')) === id || p.id === id.toString());
      if (originalPatient) {
        onView(originalPatient.id);
      }
    }
  };

  // Handle edit patient
  const handleEditPatient = (id: number) => {
    if (onEdit) {
      const originalPatient = patients.find(p => parseInt(p.id.replace(/\D/g, '')) === id || p.id === id.toString());
      if (originalPatient) {
        onEdit(originalPatient.id);
      }
    }
  };

  // Handle delete patient
  const handleDeletePatient = (id: number) => {
    if (onDelete) {
      const originalPatient = patients.find(p => parseInt(p.id.replace(/\D/g, '')) === id || p.id === id.toString());
      if (originalPatient) {
        onDelete(originalPatient.id);
      }
    }
  };

  return (
    <VirtualizedPatientList
      patients={adaptedPatients}
      calculateAge={calculateAge}
      onView={handleViewPatient}
      onEdit={handleEditPatient}
      onDelete={handleDeletePatient}
    />
  );
};

export default PatientListAdapter;
