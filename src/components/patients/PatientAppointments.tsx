import React, { useState, useEffect } from 'react';
import { Clock, Edit, Trash2, Plus, Share2, Eye, X, Phone, MessageCircle, MessageSquare, Bell, XCircle } from 'lucide-react';
import PatientAppointmentButton from './PatientAppointmentButton';
import AppointmentForm from '../appointments/management/AppointmentForm';
import AppointmentShare from '../appointments/management/AppointmentShare';
import { useNotification } from '../../context/NotificationContext';

interface PatientAppointmentsProps {
  patient: {
    id: string;
    name: string;
  };
}

const PatientAppointments: React.FC<PatientAppointmentsProps> = ({ patient }) => {
  const { showNotification } = useNotification();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isViewOpen, setIsViewOpen] = useState(false);

  // Fetch patient appointments
  useEffect(() => {
    // Simulate API call to fetch patient appointments
    setTimeout(() => {
      // Sample data using the exact patients from the PatientModuleDemo
      const sampleAppointments = [
        {
          id: '1',
          patientId: 'BP10023456',
          patientName: 'David Kamau',
          patientGender: 'Male',
          patientAge: 45,
          patientPhone: '0712 345 678',
          date: '2025-06-15',
          time: '09:00',
          doctorName: 'Dr. Sarah Williams',
          department: 'Cardiology',
          status: 'scheduled',
          notes: 'Regular checkup'
        },
        {
          id: '2',
          patientId: 'BP10023457',
          patientName: 'Faith Wanjiku',
          patientGender: 'Female',
          patientAge: 32,
          patientPhone: '0723 456 789',
          date: '2025-06-20',
          time: '14:30',
          doctorName: 'Dr. Michael Chen',
          department: 'Neurology',
          status: 'confirmed',
          notes: 'Follow-up appointment'
        },
        {
          id: '3',
          patientId: 'BP10023458',
          patientName: 'Peter Omondi',
          patientGender: 'Male',
          patientAge: 28,
          patientPhone: '0734 567 890',
          date: '2025-06-10',
          time: '11:15',
          doctorName: 'Dr. Amelia Rodriguez',
          department: 'Pediatrics',
          status: 'completed',
          notes: 'Post-vaccination checkup'
        },
        {
          id: '4',
          patientId: 'BP10023459',
          patientName: 'Esther Muthoni',
          patientGender: 'Female',
          patientAge: 35,
          patientPhone: '0745 678 901',
          date: '2025-07-25',
          time: '10:00',
          doctorName: 'Dr. David Thompson',
          department: 'Orthopedics',
          status: 'cancelled',
          notes: 'Joint pain assessment'
        },
        {
          id: '5',
          patientId: 'BP10023460',
          patientName: 'John Njoroge',
          patientGender: 'Male',
          patientAge: 52,
          patientPhone: '0756 789 012',
          date: '2025-06-20',
          time: '13:45',
          doctorName: 'Dr. John Mwangi',
          department: 'Internal Medicine',
          status: 'scheduled',
          notes: 'Arthritis follow-up'
        }
      ];

      // Filter appointments to only show those for the current patient
      const filteredAppointments = sampleAppointments.filter(
        appointment => appointment.patientId === patient.id
      );

      setAppointments(filteredAppointments);
      setLoading(false);
    }, 1000);
  }, [patient.id]);

  // Function to get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to handle editing an appointment
  const handleEditAppointment = (appointment: any) => {
    setCurrentAppointment(appointment);
    setIsEditing(true);
    setIsFormOpen(true);
  };

  // Function to handle saving an appointment
  const handleSaveAppointment = (appointmentData: any) => {
    if (isEditing) {
      // Update existing appointment
      const updatedAppointments = appointments.map(appointment =>
        appointment.id === appointmentData.id ? appointmentData : appointment
      );
      setAppointments(updatedAppointments);
      showNotification('success', 'Appointment Updated', 'The appointment has been updated successfully.');
    } else {
      // Add new appointment
      const newAppointment = {
        ...appointmentData,
        id: Date.now().toString(),
        patientId: patient.id,
        patientName: patient.name
      };
      setAppointments([...appointments, newAppointment]);
      showNotification('success', 'Appointment Created', 'The appointment has been created successfully.');
    }

    setIsFormOpen(false);
  };

  // Function to handle sharing an appointment
  const handleShareAppointment = (appointment: any) => {
    setCurrentAppointment(appointment);
    setIsShareOpen(true);
  };

  // Function to handle deleting an appointment
  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      const updatedAppointments = appointments.filter(appointment => appointment.id !== id);
      setAppointments(updatedAppointments);
      showNotification('warning', 'Appointment Deleted', 'The appointment has been deleted.');
    }
  };

  // Function to handle creating a new appointment
  const handleNewAppointment = () => {
    setCurrentAppointment({
      patientId: patient.id,
      patientName: patient.name,
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      status: 'scheduled'
    });
    setIsEditing(false);
    setIsFormOpen(true);
  };

  // Add view appointment function
  const handleViewAppointment = (appointment: any) => {
    setCurrentAppointment(appointment);
    setIsViewOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Appointments</h3>
        <PatientAppointmentButton
          patient={patient}
          variant="primary"
          size="sm"
          onAppointmentCreated={handleSaveAppointment}
        />
      </div>

      {loading ? (
        <div className="p-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p className="mt-2 text-gray-600">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">No appointments found for this patient.</p>
          <button
            onClick={handleNewAppointment}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Schedule New Appointment
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Notes
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(appointment.date)}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock size={14} className="mr-1" />
                      {appointment.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.doctorName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {appointment.notes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewAppointment(appointment)}
                      className="text-indigo-600 hover:text-indigo-900 mr-2"
                      title="View Appointment"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEditAppointment(appointment)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      title="Edit Appointment"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleShareAppointment(appointment)}
                      className="text-green-600 hover:text-green-900 mr-2"
                      title="Share Appointment"
                    >
                      <Share2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Appointment"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Appointment Form Modal */}
      <AppointmentForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveAppointment}
        appointment={currentAppointment}
        isEditing={isEditing}
      />

      {/* Appointment Share Modal */}
      {isShareOpen && (
        <AppointmentShare
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          appointment={currentAppointment}
        />
      )}

      {/* View Appointment Modal */}
      {isViewOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Appointment Details</h3>
              <button onClick={() => setIsViewOpen(false)} className="text-gray-400 hover:text-gray-500">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Patient</p>
                    <p className="text-base">{currentAppointment.patientName}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        window.open(`tel:${currentAppointment.patientPhone || ''}`, '_blank');
                        showNotification('info', 'Initiating Call', 'Opening phone app to call patient...');
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                      disabled={!currentAppointment.patientPhone}
                      title="Call Patient"
                    >
                      <Phone size={16} />
                    </button>
                    <button
                      onClick={() => {
                        const message = `Reminder: You have an appointment with ${currentAppointment.doctorName} on ${formatDate(currentAppointment.date)} at ${currentAppointment.time}`;
                        window.open(`sms:${currentAppointment.patientPhone || ''}?body=${encodeURIComponent(message)}`, '_blank');
                        showNotification('info', 'Opening SMS', 'Opening SMS app to message patient...');
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                      disabled={!currentAppointment.patientPhone}
                      title="SMS"
                    >
                      <MessageSquare size={16} />
                    </button>
                    <button
                      onClick={() => {
                        const message = `Reminder: You have an appointment with ${currentAppointment.doctorName} on ${formatDate(currentAppointment.date)} at ${currentAppointment.time}`;
                        window.open(`https://wa.me/${currentAppointment.patientPhone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
                        showNotification('info', 'Opening WhatsApp', 'Redirecting to WhatsApp to message patient...');
                      }}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                      disabled={!currentAppointment.patientPhone}
                      title="WhatsApp"
                    >
                      <MessageCircle size={16} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Date</p>
                    <p className="text-base">{formatDate(currentAppointment.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Time</p>
                    <p className="text-base">{currentAppointment.time}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Doctor</p>
                    <p className="text-base">{currentAppointment.doctorName}</p>
                  </div>
                  <button
                    onClick={() => {
                      showNotification('success', 'Reminder Sent', `A reminder has been sent to ${currentAppointment.patientName} for their appointment.`);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    title="Send Reminder"
                  >
                    <Bell size={16} />
                  </button>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Department</p>
                  <p className="text-base">{currentAppointment.department}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(currentAppointment.status)}`}>
                    {currentAppointment.status.charAt(0).toUpperCase() + currentAppointment.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Notes</p>
                  <p className="text-base">{currentAppointment.notes || "No notes available"}</p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-center">
              <button
                onClick={() => {
                  if (window.confirm(`Are you sure you want to cancel this appointment with ${currentAppointment.patientName}?`)) {
                    // Update appointment status to cancelled
                    const updatedAppointments = appointments.map(appointment =>
                      appointment.id === currentAppointment.id
                        ? {...appointment, status: 'cancelled'}
                        : appointment
                    );
                    setAppointments(updatedAppointments);
                    showNotification('success', 'Appointment Cancelled', 'The appointment has been cancelled successfully.');
                    setIsViewOpen(false);
                  }
                }}
                className="flex items-center justify-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                <XCircle size={16} className="mr-2" />
                Cancel Appointment
              </button>
            </div>
            <div className="px-6 py-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsViewOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientAppointments;











