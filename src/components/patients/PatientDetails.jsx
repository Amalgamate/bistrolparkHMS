import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import patientService from '../../services/patientService';
import { useToast } from '../../context/ToastContext';

const PatientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPatient();
  }, [id]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      const data = await patientService.getPatientById(id);
      setPatient(data);
      setError('');
    } catch (err) {
      console.error('Error fetching patient:', err);
      setError('Failed to load patient details. Please try again later.');
      showToast('Failed to load patient details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientService.deletePatient(id);
        showToast('Patient deleted successfully', 'success');
        navigate('/patients');
      } catch (err) {
        console.error('Error deleting patient:', err);
        setError('Failed to delete patient. Please try again later.');
        showToast('Failed to delete patient', 'error');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button
          onClick={() => navigate('/patients')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Patients
        </button>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Patient not found.</p>
        </div>
        <button
          onClick={() => navigate('/patients')}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Patients
        </button>
      </div>
    );
  }

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Patient Details</h1>
        <div className="flex space-x-2">
          <Link
            to={`/patients/${id}/edit`}
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete
          </button>
          <button
            onClick={() => navigate('/patients')}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Back
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Personal Information</h2>
          </div>
          
          <div>
            <p className="text-gray-600 text-sm">Patient ID</p>
            <p className="font-semibold">{patient.patient_id || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-gray-600 text-sm">Full Name</p>
            <p className="font-semibold">{`${patient.first_name} ${patient.middle_name || ''} ${patient.last_name}`}</p>
          </div>
          
          <div>
            <p className="text-gray-600 text-sm">Date of Birth</p>
            <p className="font-semibold">
              {new Date(patient.date_of_birth).toLocaleDateString()} ({calculateAge(patient.date_of_birth)} years)
            </p>
          </div>
          
          <div>
            <p className="text-gray-600 text-sm">Gender</p>
            <p className="font-semibold">{patient.gender}</p>
          </div>
          
          <div>
            <p className="text-gray-600 text-sm">National ID</p>
            <p className="font-semibold">{patient.national_id || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-gray-600 text-sm">Marital Status</p>
            <p className="font-semibold">{patient.marital_status || 'N/A'}</p>
          </div>

          {/* Contact Information */}
          <div className="md:col-span-2 mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Contact Information</h2>
          </div>
          
          <div>
            <p className="text-gray-600 text-sm">Phone</p>
            <p className="font-semibold">{patient.phone || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-gray-600 text-sm">Email</p>
            <p className="font-semibold">{patient.email || 'N/A'}</p>
          </div>
          
          <div className="md:col-span-2">
            <p className="text-gray-600 text-sm">Address</p>
            <p className="font-semibold">{patient.address || 'N/A'}</p>
          </div>

          {/* Medical Information */}
          <div className="md:col-span-2 mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Medical Information</h2>
          </div>
          
          <div>
            <p className="text-gray-600 text-sm">Blood Type</p>
            <p className="font-semibold">{patient.blood_type || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-gray-600 text-sm">Allergies</p>
            <p className="font-semibold">{patient.allergies || 'None'}</p>
          </div>
          
          <div className="md:col-span-2">
            <p className="text-gray-600 text-sm">Chronic Conditions</p>
            <p className="font-semibold">{patient.chronic_conditions || 'None'}</p>
          </div>

          {/* Emergency Contact */}
          <div className="md:col-span-2 mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Emergency Contact</h2>
          </div>
          
          <div>
            <p className="text-gray-600 text-sm">Name</p>
            <p className="font-semibold">{patient.emergency_contact || 'N/A'}</p>
          </div>
          
          <div>
            <p className="text-gray-600 text-sm">Phone</p>
            <p className="font-semibold">{patient.emergency_phone || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
