import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Calendar, Clock, User, Stethoscope, ArrowLeft, Save, X, 
  AlertCircle, CheckCircle
} from 'lucide-react';
import { NotificationProvider } from '../context/NotificationContext';
import apiClient from '../services/apiClient';
import { format, addDays } from 'date-fns';

interface AppointmentFormData {
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  duration: number;
  reason: string;
  notes: string;
}

const AppointmentScheduler: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState<AppointmentFormData>({
    patient_id: searchParams.get('patientId') || '',
    doctor_id: '',
    appointment_date: format(new Date(), 'yyyy-MM-dd'),
    appointment_time: '09:00',
    duration: 30,
    reason: '',
    notes: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [patientName, setPatientName] = useState(searchParams.get('patientName') || '');

  // Mock doctors data - in real implementation, fetch from API
  const doctors = [
    { id: '1', name: 'Dr. Sarah Johnson', specialty: 'General Practice' },
    { id: '2', name: 'Dr. Michael Chen', specialty: 'Pediatrics' },
    { id: '3', name: 'Dr. Emily Davis', specialty: 'Cardiology' },
    { id: '4', name: 'Dr. James Wilson', specialty: 'Orthopedics' },
  ];

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // Combine date and time
      const appointmentDateTime = `${formData.appointment_date}T${formData.appointment_time}:00`;

      const appointmentData = {
        patient_id: formData.patient_id,
        doctor_id: formData.doctor_id,
        appointment_date: appointmentDateTime,
        duration: formData.duration,
        reason: formData.reason,
        notes: formData.notes,
        status: 'scheduled'
      };

      await apiClient.createAppointment(appointmentData);
      
      setSuccess('Appointment scheduled successfully!');
      
      // Redirect back to patient details after 2 seconds
      setTimeout(() => {
        if (formData.patient_id) {
          navigate(`/patients/details/${formData.patient_id}`);
        } else {
          navigate('/appointments');
        }
      }, 2000);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to schedule appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (formData.patient_id) {
      navigate(`/patients/details/${formData.patient_id}`);
    } else {
      navigate('/appointments');
    }
  };

  return (
    <NotificationProvider>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button
            onClick={handleCancel}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule Appointment</h1>
            <p className="text-sm text-gray-600">
              {patientName ? `Schedule appointment for ${patientName}` : 'Schedule a new appointment'}
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Appointment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient ID *
                </label>
                <input
                  type="text"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter patient ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient Name
                </label>
                <input
                  type="text"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Patient name (for reference)"
                />
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Appointment Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Doctor *
                </label>
                <select
                  name="doctor_id"
                  value={formData.doctor_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      {doctor.name} - {doctor.specialty}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  name="appointment_date"
                  value={formData.appointment_date}
                  onChange={handleInputChange}
                  min={format(new Date(), 'yyyy-MM-dd')}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time *
                </label>
                <select
                  name="appointment_time"
                  value={formData.appointment_time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  {timeSlots.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes) *
                </label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reason for Visit *
                </label>
                <input
                  type="text"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., General consultation, Follow-up, Check-up"
                />
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Stethoscope className="w-5 h-5 mr-2 text-purple-600" />
              Additional Notes
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional notes or special requirements..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Scheduling...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Schedule Appointment
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </NotificationProvider>
  );
};

export default AppointmentScheduler;
