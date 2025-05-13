import React, { useState, useEffect } from 'react';
import { X, Calendar, Bell, MessageCircle } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import {
  notifyAppointmentCreated,
  notifyAppointmentRescheduled,
  notifyAppointmentCancelled
} from '../../../utils/smsUtils';

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointmentData: any) => void;
  appointment?: any;
  isEditing?: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  isOpen,
  onClose,
  onSave,
  appointment,
  isEditing = false
}) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    patientPhone: '', // Added patient phone for SMS
    date: '',
    time: '',
    doctorName: '',
    doctorPhone: '', // Added doctor phone for SMS
    department: '',
    status: 'scheduled',
    notes: '',
    sendReminder: true,
    sendSmsNotification: true, // Added SMS notification option
    addToGoogleCalendar: false,
    reminderTime: '1hour',
    previousDate: '', // To track changes for rescheduling
    previousTime: '' // To track changes for rescheduling
  });

  // Sample data for dropdowns
  const doctors = [
    { id: '1', name: 'Dr. Smith', department: 'Cardiology' },
    { id: '2', name: 'Dr. Johnson', department: 'Neurology' },
    { id: '3', name: 'Dr. Williams', department: 'Orthopedics' },
    { id: '4', name: 'Dr. Brown', department: 'Pediatrics' },
    { id: '5', name: 'Dr. Davis', department: 'Dermatology' }
  ];

  const departments = [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'Ophthalmology',
    'ENT',
    'Gynecology'
  ];

  const statuses = [
    'scheduled',
    'confirmed',
    'completed',
    'cancelled'
  ];

  // Initialize form data when editing an existing appointment
  useEffect(() => {
    if (isEditing && appointment) {
      setFormData({
        patientName: appointment.patientName || '',
        patientId: appointment.patientId || '',
        patientPhone: appointment.patientPhone || '0712345678', // Default for demo
        date: appointment.date || '',
        time: appointment.time || '',
        doctorName: appointment.doctorName || '',
        doctorPhone: appointment.doctorPhone || '0723456789', // Default for demo
        department: appointment.department || '',
        status: appointment.status || 'scheduled',
        notes: appointment.notes || '',
        sendReminder: appointment.sendReminder !== undefined ? appointment.sendReminder : true,
        sendSmsNotification: appointment.sendSmsNotification !== undefined ? appointment.sendSmsNotification : true,
        addToGoogleCalendar: appointment.addToGoogleCalendar || false,
        reminderTime: appointment.reminderTime || '1hour',
        previousDate: appointment.date || '',
        previousTime: appointment.time || ''
      });
    } else {
      // Reset form for new appointment
      setFormData({
        patientName: '',
        patientId: '',
        patientPhone: '0712345678', // Default for demo
        date: '',
        time: '',
        doctorName: '',
        doctorPhone: '0723456789', // Default for demo
        department: '',
        status: 'scheduled',
        notes: '',
        sendReminder: true,
        sendSmsNotification: true,
        addToGoogleCalendar: false,
        reminderTime: '1hour',
        previousDate: '',
        previousTime: ''
      });
    }
  }, [isEditing, appointment, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-fill department based on selected doctor
    if (name === 'doctorName') {
      const selectedDoctor = doctors.find(doctor => doctor.name === value);
      if (selectedDoctor) {
        setFormData(prev => ({
          ...prev,
          department: selectedDoctor.department
        }));
      }
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Format date for display
    const formatDateForDisplay = (dateStr: string) => {
      const [year, month, day] = dateStr.split('-');
      return `${day}/${month}/${year}`;
    };

    // Prepare data for saving
    const appointmentData = {
      ...formData,
      id: isEditing && appointment ? appointment.id : Date.now().toString()
    };

    // Send SMS notifications if enabled
    if (formData.sendSmsNotification) {
      try {
        // For new appointments
        if (!isEditing) {
          const notificationResult = await notifyAppointmentCreated(
            formData.patientName,
            formData.patientPhone,
            formData.doctorName,
            formData.doctorPhone,
            formatDateForDisplay(formData.date),
            formData.time
          );

          if (notificationResult.patientNotified && notificationResult.doctorNotified) {
            showToast('success', 'SMS notifications sent to both patient and doctor');
          } else if (notificationResult.patientNotified) {
            showToast('info', 'SMS notification sent to patient only');
          } else if (notificationResult.doctorNotified) {
            showToast('info', 'SMS notification sent to doctor only');
          } else {
            showToast('warning', 'SMS notifications could not be sent');
          }
        }
        // For rescheduled appointments
        else if (formData.date !== formData.previousDate || formData.time !== formData.previousTime) {
          const notificationResult = await notifyAppointmentRescheduled(
            formData.patientName,
            formData.patientPhone,
            formData.doctorName,
            formData.doctorPhone,
            formatDateForDisplay(formData.previousDate),
            formData.previousTime,
            formatDateForDisplay(formData.date),
            formData.time
          );

          if (notificationResult.patientNotified && notificationResult.doctorNotified) {
            showToast('success', 'Rescheduling notifications sent to both patient and doctor');
          } else {
            showToast('warning', 'Some rescheduling notifications could not be sent');
          }
        }
        // For cancelled appointments
        else if (formData.status === 'cancelled' && appointment.status !== 'cancelled') {
          const notificationResult = await notifyAppointmentCancelled(
            formData.patientName,
            formData.patientPhone,
            formData.doctorName,
            formData.doctorPhone,
            formatDateForDisplay(formData.date),
            formData.time
          );

          if (notificationResult.patientNotified && notificationResult.doctorNotified) {
            showToast('success', 'Cancellation notifications sent to both patient and doctor');
          } else {
            showToast('warning', 'Some cancellation notifications could not be sent');
          }
        }
      } catch (error) {
        console.error('Error sending SMS notifications:', error);
        showToast('error', 'Failed to send SMS notifications');
      }
    }

    // Save the appointment data
    onSave(appointmentData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? 'Edit Appointment' : 'New Appointment'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name
              </label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient ID
              </label>
              <input
                type="text"
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Phone
              </label>
              <input
                type="tel"
                name="patientPhone"
                value={formData.patientPhone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 0712345678"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor
              </label>
              <select
                name="doctorName"
                value={formData.doctorName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.name}>
                    {doctor.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor Phone
              </label>
              <input
                type="tel"
                name="doctorPhone"
                value={formData.doctorPhone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., 0723456789"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4 border-t pt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Notifications & Calendar</h3>

            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="sendReminder"
                name="sendReminder"
                checked={formData.sendReminder}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="sendReminder" className="ml-2 block text-sm text-gray-700">
                Send appointment reminder
              </label>
            </div>

            <div className="flex items-center mb-3">
              <input
                type="checkbox"
                id="sendSmsNotification"
                name="sendSmsNotification"
                checked={formData.sendSmsNotification}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="sendSmsNotification" className="ml-2 block text-sm text-gray-700 flex items-center">
                <MessageCircle size={16} className="mr-1 text-blue-500" />
                Send SMS notification to patient and doctor
              </label>
            </div>

            {formData.sendReminder && (
              <div className="ml-6 mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder Time
                </label>
                <select
                  name="reminderTime"
                  value={formData.reminderTime}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="15min">15 minutes before</option>
                  <option value="30min">30 minutes before</option>
                  <option value="1hour">1 hour before</option>
                  <option value="2hours">2 hours before</option>
                  <option value="1day">1 day before</option>
                </select>
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="addToGoogleCalendar"
                name="addToGoogleCalendar"
                checked={formData.addToGoogleCalendar}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="addToGoogleCalendar" className="ml-2 block text-sm text-gray-700 flex items-center">
                <Calendar size={16} className="mr-1 text-blue-500" />
                Add to Google Calendar
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditing ? 'Update' : 'Create'} Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
