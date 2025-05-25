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
  const adaptedPatients = patients.map((patient, index) => {
    // Ensure we have a valid numeric ID
    const numericId = parseInt(patient.id) || index + 1;

    // Split name properly
    const nameParts = patient.name.split(' ').filter(part => part.trim());
    const firstName = nameParts[0] || 'Unknown';
    const lastName = nameParts.slice(1).join(' ') || '';

    return {
      id: numericId,
      firstName: firstName,
      lastName: lastName,
      gender: patient.gender,
      dateOfBirth: patient.dateOfBirth || `${new Date().getFullYear() - patient.age}-01-01`,
      phone: patient.phone,
      email: patient.email,
      bloodGroup: patient.bloodType,
      lastVisit: patient.lastVisit,
      status: patient.status || 'Active',
      isAdmitted: patient.isAdmitted || false,
      isCleared: patient.isCleared || false,
      nationalId: patient.idNumber || patient.id // Use ID number or fallback to patient ID
    };
  });

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
