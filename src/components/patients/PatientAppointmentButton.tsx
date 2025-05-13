import React, { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';
import AppointmentForm from '../appointments/management/AppointmentForm';
import { useNotification } from '../../context/NotificationContext';

interface PatientAppointmentButtonProps {
  patient: {
    id: string;
    name: string;
  };
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onAppointmentCreated?: (appointmentData: any) => void;
}

const PatientAppointmentButton: React.FC<PatientAppointmentButtonProps> = ({
  patient,
  variant = 'primary',
  size = 'md',
  className = '',
  onAppointmentCreated
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { showNotification } = useNotification();

  // Get variant styles
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-100 hover:bg-blue-200 text-blue-700';
      case 'secondary':
        return 'bg-gray-100 hover:bg-gray-200 text-gray-700';
      case 'outline':
        return 'bg-white hover:bg-blue-50 text-blue-700 border border-blue-300';
      default:
        return 'bg-blue-100 hover:bg-blue-200 text-blue-700';
    }
  };

  // Get size styles
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  // Handle saving the appointment
  const handleSaveAppointment = (appointmentData: any) => {
    // Add patient information to the appointment data
    const appointmentWithPatient = {
      ...appointmentData,
      patientId: patient.id,
      patientName: patient.name
    };

    // Call the onAppointmentCreated callback if provided
    if (onAppointmentCreated) {
      onAppointmentCreated(appointmentWithPatient);
    }

    // Show a success notification
    showNotification('success', 'Appointment Created', `Appointment for ${patient.name} has been created successfully.`);

    // Close the form
    setIsFormOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsFormOpen(true)}
        className={`rounded-md ${getVariantStyles()} ${getSizeStyles()} flex items-center ${className}`}
      >
        <Calendar size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="mr-1" />
        <span>New Appointment</span>
      </button>

      {isFormOpen && (
        <AppointmentForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSaveAppointment}
          appointment={{
            patientId: patient.id,
            patientName: patient.name,
            date: new Date().toISOString().split('T')[0],
            time: '09:00',
            status: 'scheduled'
          }}
          isEditing={false}
        />
      )}
    </>
  );
};

export default PatientAppointmentButton;
