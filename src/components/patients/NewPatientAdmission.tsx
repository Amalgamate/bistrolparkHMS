import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search, User, Bed, Calendar, FileText, Clock, UserCheck, AlertCircle } from 'lucide-react';
import apiClient from '../../services/apiClient';

const admissionSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  admissionDate: z.string().min(1, 'Admission date is required'),
  admissionTime: z.string().min(1, 'Admission time is required'),
  roomType: z.enum(['executive', 'premium', 'basic', 'ward']),
  roomNumber: z.string().min(1, 'Room number is required'),
  attendingDoctor: z.string().min(1, 'Attending doctor is required'),
  admissionReason: z.string().min(5, 'Admission reason must be at least 5 characters'),
  initialDiagnosis: z.string().min(5, 'Initial diagnosis must be at least 5 characters'),
  specialInstructions: z.string().optional(),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

// Define interfaces for API data
interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  phone: string;
  blood_type?: string;
  mrn?: string;
}

interface Room {
  id: string;
  name: string;
  type: string;
  status: string;
  floor?: string;
  wing?: string;
  daily_rate?: number;
}

interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  specialty?: string;
  role?: string;
}

export const NewPatientAdmission: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [availableRooms, setAvailableRooms] = useState<Room[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      admissionDate: new Date().toISOString().split('T')[0],
      admissionTime: new Date().toTimeString().split(' ')[0].substring(0, 5),
    }
  });

  const roomType = watch('roomType');

  // Search for patient
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a patient ID or name to search');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.get(`/patients?search=${encodeURIComponent(searchQuery)}`);

      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const foundPatient = response.data[0]; // Get the first matching patient
        setSelectedPatient(foundPatient);
        setValue('patientId', foundPatient.id || foundPatient.mrn);
      } else {
        setSelectedPatient(null);
        alert('Patient not found. Please check the ID or name and try again.');
      }
    } catch (error) {
      console.error('Error searching for patient:', error);
      alert('An error occurred while searching for the patient. Please try again later.');
      setSelectedPatient(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors on component mount
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/users?role=doctor');

        if (response.data && Array.isArray(response.data)) {
          setDoctors(response.data);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        alert('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Update available rooms when room type changes
  useEffect(() => {
    const fetchRooms = async () => {
      if (!roomType) {
        setAvailableRooms([]);
        return;
      }

      try {
        setLoading(true);
        const response = await apiClient.get(`/rooms?type=${roomType}&status=Available`);

        if (response.data && Array.isArray(response.data)) {
          setAvailableRooms(response.data);
        } else {
          setAvailableRooms([]);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
        alert('Failed to load available rooms. Please try again later.');
        setAvailableRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [roomType]);

  const onSubmit = async (data: AdmissionFormData) => {
    try {
      setLoading(true);
      console.log('Submitting admission data:', data);

      // Format the data for the API
      const admissionData = {
        patient_id: data.patientId,
        room_id: data.roomNumber,
        doctor_id: data.attendingDoctor,
        admission_date: data.admissionDate,
        admission_time: data.admissionTime,
        diagnosis: data.initialDiagnosis,
        notes: `${data.admissionReason}\n\n${data.specialInstructions || ''}`.trim(),
        status: 'admitted'
      };

      // Send the data to the API
      const response = await apiClient.post('/admissions', admissionData);

      if (response.data) {
        console.log('Admission created successfully:', response.data);
        alert('Patient admitted successfully!');
        reset();
        setSelectedPatient(null);
        setAvailableRooms([]);
      } else {
        console.error('Failed to create admission');
        alert('Failed to admit patient. Please try again.');
      }
    } catch (error) {
      console.error('Error creating admission:', error);
      alert('An error occurred while admitting the patient.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 relative">
      {/* Quick Action Buttons */}
      <div className="absolute right-0 top-24 flex flex-col space-y-2 mr-[-20px] z-10">
        <button
          type="button"
          className="bg-[#1961FB] text-white p-3 rounded-l-md shadow-md hover:bg-[#0A4EFA] transition-colors duration-200 group relative"
          title="Check Bed Availability"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="absolute left-[-155px] top-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Check Bed Availability
          </span>
        </button>
        <button
          type="button"
          className="bg-green-600 text-white p-3 rounded-l-md shadow-md hover:bg-green-700 transition-colors duration-200 group relative"
          title="Calculate Deposit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="absolute left-[-135px] top-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Calculate Deposit
          </span>
        </button>
        <button
          type="button"
          className="bg-amber-500 text-white p-3 rounded-l-md shadow-md hover:bg-amber-600 transition-colors duration-200 group relative"
          title="Assign Doctor"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="absolute left-[-115px] top-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Assign Doctor
          </span>
        </button>
      </div>

      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-[#01016C]">
        <h2 className="text-xl font-semibold text-[#01016C]">Patient Admission</h2>
        <p className="text-sm text-gray-600 mt-1">Admit a patient to the hospital</p>
      </div>

      {/* Patient Search */}
      <div className="mb-8 p-5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center mb-4">
          <div className="bg-white p-2 rounded-full shadow-sm mr-3">
            <Search className="h-5 w-5 text-[#0100F6]" />
          </div>
          <h3 className="text-lg font-medium text-[#0100F6]">Find Patient</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient ID or name"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#01016C] to-[#1961FB] rounded-md shadow-sm hover:from-[#01016C] hover:to-[#0A4EFA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01016C] transition-all duration-200"
          >
            <div className="flex items-center">
              Search
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Selected Patient Info */}
      {selectedPatient && (
        <div className="mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-l-4 border-[#0100F6] shadow-sm">
          <div className="flex items-center mb-4">
            <div className="bg-white p-2 rounded-full shadow-sm mr-3">
              <User className="w-5 h-5 text-[#0100F6]" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-[#0100F6]">Patient Information</h3>
              <p className="text-sm text-gray-600">Selected patient details</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg shadow-sm">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Patient ID</p>
              <p className="text-sm font-semibold text-gray-900">{selectedPatient.id}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-sm font-semibold text-gray-900">{selectedPatient.name}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Age / Gender</p>
              <p className="text-sm font-semibold text-gray-900">{selectedPatient.age} years / {selectedPatient.gender}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Phone</p>
              <p className="text-sm font-semibold text-gray-900">{selectedPatient.phone}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Blood Type</p>
              <p className="text-sm font-semibold text-gray-900">{selectedPatient.bloodType}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-500">Last Visit</p>
              <p className="text-sm font-semibold text-gray-900">{selectedPatient.lastVisit || 'N/A'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Admission Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <input type="hidden" {...register('patientId')} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Admission Date & Time */}
          <div>
            <label htmlFor="admissionDate" className="block text-sm font-medium text-gray-700">
              Admission Date <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="admissionDate"
                type="date"
                {...register('admissionDate')}
                className={`pl-10 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                  errors.admissionDate ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.admissionDate && (
              <p className="mt-1 text-sm text-red-600">{errors.admissionDate.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="admissionTime" className="block text-sm font-medium text-gray-700">
              Admission Time <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="admissionTime"
                type="time"
                {...register('admissionTime')}
                className={`pl-10 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                  errors.admissionTime ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {errors.admissionTime && (
              <p className="mt-1 text-sm text-red-600">{errors.admissionTime.message}</p>
            )}
          </div>

          {/* Room Selection */}
          <div>
            <label htmlFor="roomType" className="block text-sm font-medium text-gray-700">
              Room Type <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Bed className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="roomType"
                {...register('roomType')}
                className={`pl-10 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                  errors.roomType ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select room type</option>
                <option value="executive">Executive Room</option>
                <option value="premium">Premium Room</option>
                <option value="basic">Basic Room</option>
                <option value="ward">Ward</option>
              </select>
            </div>
            {errors.roomType && (
              <p className="mt-1 text-sm text-red-600">{errors.roomType.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="roomNumber" className="block text-sm font-medium text-gray-700">
              Room Number <span className="text-red-500">*</span>
            </label>
            <select
              id="roomNumber"
              {...register('roomNumber')}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                errors.roomNumber ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={availableRooms.length === 0}
            >
              <option value="">Select room number</option>
              {availableRooms.map(room => (
                <option key={room.number} value={room.number}>
                  {room.number} - {room.description}
                </option>
              ))}
            </select>
            {errors.roomNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.roomNumber.message}</p>
            )}
            {availableRooms.length === 0 && roomType && (
              <p className="mt-1 text-sm text-amber-600">No available rooms of this type</p>
            )}
          </div>

          {/* Doctor */}
          <div>
            <label htmlFor="attendingDoctor" className="block text-sm font-medium text-gray-700">
              Attending Doctor <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserCheck className="h-5 w-5 text-gray-400" />
              </div>
              <select
                id="attendingDoctor"
                {...register('attendingDoctor')}
                className={`pl-10 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                  errors.attendingDoctor ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={loading}
              >
                <option value="">Select doctor</option>
                {loading ? (
                  <option value="" disabled>Loading doctors...</option>
                ) : doctors.length > 0 ? (
                  doctors.map(doctor => (
                    <option key={doctor.id} value={doctor.id}>
                      Dr. {doctor.first_name} {doctor.last_name} {doctor.specialty ? `(${doctor.specialty})` : ''}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>No doctors available</option>
                )}
              </select>
            </div>
            {errors.attendingDoctor && (
              <p className="mt-1 text-sm text-red-600">{errors.attendingDoctor.message}</p>
            )}
          </div>
        </div>

        {/* Medical Information */}
        <div>
          <label htmlFor="admissionReason" className="block text-sm font-medium text-gray-700">
            Reason for Admission <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="admissionReason"
              {...register('admissionReason')}
              rows={3}
              className={`pl-10 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                errors.admissionReason ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Describe the reason for admission"
            />
          </div>
          {errors.admissionReason && (
            <p className="mt-1 text-sm text-red-600">{errors.admissionReason.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="initialDiagnosis" className="block text-sm font-medium text-gray-700">
            Initial Diagnosis <span className="text-red-500">*</span>
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="initialDiagnosis"
              {...register('initialDiagnosis')}
              rows={3}
              className={`pl-10 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                errors.initialDiagnosis ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Provide initial diagnosis"
            />
          </div>
          {errors.initialDiagnosis && (
            <p className="mt-1 text-sm text-red-600">{errors.initialDiagnosis.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="specialInstructions" className="block text-sm font-medium text-gray-700">
            Special Instructions
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AlertCircle className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              id="specialInstructions"
              {...register('specialInstructions')}
              rows={3}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
              placeholder="Any special instructions or notes"
            />
          </div>
        </div>

        {/* Room Pricing Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-[#01016C] mb-6">
          <h4 className="text-sm font-medium text-[#01016C] mb-3 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Room Pricing (Per Day)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs font-medium text-gray-500">Executive Room</p>
              <p className="text-lg font-bold text-[#01016C]">KSh 15,000</p>
              <p className="text-xs text-gray-500 mt-1">Private bathroom, TV, WiFi</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs font-medium text-gray-500">Premium Room</p>
              <p className="text-lg font-bold text-[#01016C]">KSh 8,500</p>
              <p className="text-xs text-gray-500 mt-1">Private bathroom, TV</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs font-medium text-gray-500">Basic Room</p>
              <p className="text-lg font-bold text-[#01016C]">KSh 4,500</p>
              <p className="text-xs text-gray-500 mt-1">Shared bathroom</p>
            </div>
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <p className="text-xs font-medium text-gray-500">Ward</p>
              <p className="text-lg font-bold text-[#01016C]">KSh 2,000</p>
              <p className="text-xs text-gray-500 mt-1">Shared space, 4-6 beds</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between pt-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="text-sm font-medium text-gray-700 mr-2">Estimated Cost:</div>
            <div className="text-lg font-bold text-[#01016C]">KSh 25,500</div>
            <div className="text-xs text-gray-500 ml-2">(Includes admission fee + first day)</div>
          </div>

          <button
            type="submit"
            disabled={!selectedPatient}
            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#01016C] to-[#1961FB] rounded-md shadow-sm hover:from-[#01016C] hover:to-[#0A4EFA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01016C] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center">
              Admit Patient
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </button>
        </div>
      </form>
    </div>
  );
};

// End of component
