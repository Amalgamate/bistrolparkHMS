import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import patientService from '../../services/patientService';
import { useToast } from '../../context/ToastContext';
import { usePatient } from '../../context/PatientContext';

const PatientForm = ({ onClose, onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { addPatient, updatePatient } = usePatient();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    middle_name: '',
    date_of_birth: '',
    gender: 'male',
    national_id: '',
    marital_status: 'single',
    address: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    residence: '',
    blood_type: 'O+',
    allergies: '',
    chronic_conditions: '',
    current_medications: '',
    emergency_contact_name: '',
    emergency_contact_relationship: '',
    emergency_contact_phone: '',
    insurance_provider: '',
    insurance_number: '',
    sha_number: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      fetchPatient();
    }
  }, [id]);

  const fetchPatient = async () => {
    try {
      setLoading(true);
      let patient;

      try {
        // First try to get from API
        patient = await patientService.getPatientById(id);
      } catch (apiError) {
        console.error('API error when fetching patient:', apiError);
        // Fall back to context if API fails
        const contextPatient = await usePatient().getPatient(parseInt(id));
        if (!contextPatient) {
          throw new Error('Patient not found in local storage');
        }
        patient = contextPatient;
      }

      // Format date for input field (YYYY-MM-DD)
      const formattedDate = patient.dateOfBirth || patient.date_of_birth ?
        new Date(patient.dateOfBirth || patient.date_of_birth).toISOString().split('T')[0] : '';

      // Map patient data to form fields
      setFormData({
        first_name: patient.firstName || patient.first_name,
        last_name: patient.lastName || patient.last_name,
        middle_name: patient.middleName || patient.middle_name,
        date_of_birth: formattedDate,
        gender: patient.gender,
        national_id: patient.nationalId || patient.national_id,
        marital_status: patient.maritalStatus || patient.marital_status || 'single',
        address: patient.address || '',
        phone: patient.phone || '',
        email: patient.email || '',
        city: patient.city || '',
        state: patient.state || '',
        residence: patient.residence || '',
        blood_type: patient.bloodGroup || patient.blood_type || 'O+',
        allergies: patient.allergies || '',
        chronic_conditions: patient.chronicConditions || patient.chronic_conditions || '',
        current_medications: patient.currentMedications || patient.current_medications || '',
        emergency_contact_name: patient.emergencyContact?.name || patient.emergency_contact_name || '',
        emergency_contact_relationship: patient.emergencyContact?.relationship || patient.emergency_contact_relationship || '',
        emergency_contact_phone: patient.emergencyContact?.phone || patient.emergency_contact_phone || '',
        insurance_provider: patient.insurance?.provider || patient.insurance_provider || '',
        insurance_number: patient.insurance?.policyNumber || patient.insurance_number || '',
        sha_number: patient.insurance?.shaNumber || patient.sha_number || ''
      });
    } catch (err) {
      console.error('Error fetching patient:', err);
      setError('Failed to load patient data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear validation error when field is changed
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Helper function to validate Kenyan phone numbers
  const isValidKenyanPhone = (phone) => {
    if (!phone) return true; // Optional field
    // Kenyan phone numbers can be in formats like:
    // +254 7XX XXX XXX, 07XX XXX XXX, 254 7XX XXX XXX
    const kenyanPhoneRegex = /^(?:\+254|254|0)7\d{8}$/;
    // Remove spaces, dashes, and parentheses for validation
    const cleanedPhone = phone.replace(/[\s\-()]/g, '');
    return kenyanPhoneRegex.test(cleanedPhone);
  };

  // Helper function to validate Kenyan National ID
  const isValidKenyanID = (id) => {
    if (!id) return true; // Optional field
    // Kenyan IDs are typically 8 digits, but can be 7-9 digits
    const kenyanIDRegex = /^\d{7,9}$/;
    return kenyanIDRegex.test(id);
  };

  // Helper function to validate date of birth (must be in the past and not more than 120 years ago)
  const isValidDateOfBirth = (dob) => {
    if (!dob) return false; // Required field
    const dobDate = new Date(dob);
    const today = new Date();
    const minDate = new Date();
    minDate.setFullYear(today.getFullYear() - 120); // 120 years ago

    return dobDate < today && dobDate > minDate;
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    } else if (formData.first_name.length < 2) {
      errors.first_name = 'First name must be at least 2 characters';
    }

    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    } else if (formData.last_name.length < 2) {
      errors.last_name = 'Last name must be at least 2 characters';
    }

    if (!formData.date_of_birth) {
      errors.date_of_birth = 'Date of birth is required';
    } else if (!isValidDateOfBirth(formData.date_of_birth)) {
      errors.date_of_birth = 'Date of birth must be in the past and not more than 120 years ago';
    }

    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!isValidKenyanPhone(formData.phone)) {
      errors.phone = 'Please enter a valid Kenyan phone number (e.g., 07XX XXX XXX or +254 7XX XXX XXX)';
    }

    if (!isValidKenyanID(formData.national_id)) {
      errors.national_id = 'Please enter a valid Kenyan National ID';
    }

    if (formData.emergency_contact_phone && !isValidKenyanPhone(formData.emergency_contact_phone)) {
      errors.emergency_contact_phone = 'Please enter a valid Kenyan phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Map form data to API format
      const patientData = {
        firstName: formData.first_name,
        lastName: formData.last_name,
        middleName: formData.middle_name || '',
        dateOfBirth: formData.date_of_birth,
        gender: formData.gender,
        nationalId: formData.national_id || '',
        maritalStatus: formData.marital_status,
        address: formData.address || '',
        phone: formData.phone || '',
        email: formData.email || '',
        city: formData.city || '',
        state: formData.state || '',
        residence: formData.residence || '',
        bloodGroup: formData.blood_type,
        allergies: formData.allergies || '',
        chronicConditions: formData.chronic_conditions || '',
        currentMedications: formData.current_medications || '',
        nextOfKinName: formData.emergency_contact_name || '',
        nextOfKinPhone: formData.emergency_contact_phone || '',
        emergencyContact: {
          name: formData.emergency_contact_name || '',
          relationship: formData.emergency_contact_relationship || '',
          phone: formData.emergency_contact_phone || ''
        },
        insurance: {
          provider: formData.insurance_provider || '',
          policyNumber: formData.insurance_number || '',
          holderName: `${formData.first_name} ${formData.last_name}`,
          shaNumber: formData.sha_number || ''
        },
        status: 'Active'
      };

      let result;

      if (isEditMode) {
        try {
          // First try the API
          await patientService.updatePatient(id, patientData);
          showToast('Patient updated successfully', 'success');
        } catch (apiError) {
          console.error('API error when updating patient:', apiError);
          // Fall back to context if API fails
          await updatePatient(parseInt(id), patientData);
          showToast('Patient updated successfully (offline mode)', 'success');
        }
      } else {
        try {
          // First try the API
          console.log('Attempting to create patient via API:', patientData);
          result = await patientService.createPatient(patientData);
          console.log('API response for patient creation:', result);
          showToast('Patient registered successfully', 'success');

          // Force a refresh of the patient list
          try {
            await patientService.getAllPatients();
          } catch (refreshError) {
            console.error('Error refreshing patient list:', refreshError);
          }
        } catch (apiError) {
          console.error('API error when creating patient:', apiError);
          // Fall back to context if API fails
          result = await addPatient(patientData);
          showToast('Patient registered successfully (offline mode)', 'success');
        }
      }

      // If onSave prop is provided, call it with the result
      if (onSave) {
        onSave(result || patientData);
      } else {
        // Otherwise, navigate to patients page
        navigate('/patients');
      }

      // If onClose prop is provided, call it
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error('Error saving patient:', err);

      // Handle validation errors from the server
      if (err.response?.data?.errors) {
        const serverErrors = {};
        err.response.data.errors.forEach(error => {
          serverErrors[error.param] = error.msg;
        });
        setValidationErrors(serverErrors);
      } else {
        setError('Failed to save patient. Please try again later.');
        showToast('Failed to save patient. Please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEditMode ? 'Edit Patient' : 'Register New Patient'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        {/* Personal Information Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="first_name">
                First Name *
              </label>
              <input
                className={`shadow appearance-none border ${validationErrors.first_name ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="first_name"
                name="first_name"
                type="text"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
              {validationErrors.first_name && (
                <p className="text-red-500 text-xs italic">{validationErrors.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="middle_name">
                Middle Name
              </label>
              <input
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="middle_name"
                name="middle_name"
                type="text"
                value={formData.middle_name || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="last_name">
                Last Name *
              </label>
              <input
                className={`shadow appearance-none border ${validationErrors.last_name ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="last_name"
                name="last_name"
                type="text"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
              {validationErrors.last_name && (
                <p className="text-red-500 text-xs italic">{validationErrors.last_name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date_of_birth">
                Date of Birth *
              </label>
              <input
                className={`shadow appearance-none border ${validationErrors.date_of_birth ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="date_of_birth"
                name="date_of_birth"
                type="date"
                value={formData.date_of_birth}
                onChange={handleChange}
                required
              />
              {validationErrors.date_of_birth && (
                <p className="text-red-500 text-xs italic">{validationErrors.date_of_birth}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gender">
                Gender *
              </label>
              <select
                className={`shadow appearance-none border ${validationErrors.gender ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {validationErrors.gender && (
                <p className="text-red-500 text-xs italic">{validationErrors.gender}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="national_id">
                National ID
              </label>
              <input
                className={`shadow appearance-none border ${validationErrors.national_id ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="national_id"
                name="national_id"
                type="text"
                value={formData.national_id || ''}
                onChange={handleChange}
                placeholder="e.g., 12345678"
              />
              {validationErrors.national_id && (
                <p className="text-red-500 text-xs italic">{validationErrors.national_id}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="marital_status">
                Marital Status
              </label>
              <select
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="marital_status"
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
              >
                <option value="single">Single</option>
                <option value="married">Married</option>
                <option value="divorced">Divorced</option>
                <option value="widowed">Widowed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                className={`shadow appearance-none border ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="phone"
                name="phone"
                type="text"
                value={formData.phone || ''}
                onChange={handleChange}
                placeholder="e.g., 0712345678"
              />
              {validationErrors.phone && (
                <p className="text-red-500 text-xs italic">{validationErrors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className={`shadow appearance-none border ${validationErrors.email ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="email"
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleChange}
                placeholder="e.g., patient@example.com"
              />
              {validationErrors.email && (
                <p className="text-red-500 text-xs italic">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="residence">
                Residence
              </label>
              <input
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="residence"
                name="residence"
                type="text"
                value={formData.residence || ''}
                onChange={handleChange}
                placeholder="e.g., Westlands"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                City/Town
              </label>
              <input
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="city"
                name="city"
                type="text"
                value={formData.city || ''}
                onChange={handleChange}
                placeholder="e.g., Nairobi"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                County
              </label>
              <input
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="state"
                name="state"
                type="text"
                value={formData.state || ''}
                onChange={handleChange}
                placeholder="e.g., Nairobi County"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                Physical Address
              </label>
              <textarea
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="address"
                name="address"
                rows="2"
                value={formData.address || ''}
                onChange={handleChange}
                placeholder="Enter detailed address"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Medical Information Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Medical Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="blood_type">
                Blood Type
              </label>
              <select
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="blood_type"
                name="blood_type"
                value={formData.blood_type}
                onChange={handleChange}
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="Unknown">Unknown</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="allergies">
                Allergies
              </label>
              <textarea
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="allergies"
                name="allergies"
                rows="2"
                value={formData.allergies || ''}
                onChange={handleChange}
                placeholder="List any allergies"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="chronic_conditions">
                Chronic Conditions
              </label>
              <textarea
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="chronic_conditions"
                name="chronic_conditions"
                rows="2"
                value={formData.chronic_conditions || ''}
                onChange={handleChange}
                placeholder="List any chronic conditions"
              ></textarea>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="current_medications">
                Current Medications
              </label>
              <textarea
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="current_medications"
                name="current_medications"
                rows="2"
                value={formData.current_medications || ''}
                onChange={handleChange}
                placeholder="List any current medications"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Emergency Contact Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Emergency Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emergency_contact_name">
                Name
              </label>
              <input
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="emergency_contact_name"
                name="emergency_contact_name"
                type="text"
                value={formData.emergency_contact_name || ''}
                onChange={handleChange}
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emergency_contact_relationship">
                Relationship
              </label>
              <input
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="emergency_contact_relationship"
                name="emergency_contact_relationship"
                type="text"
                value={formData.emergency_contact_relationship || ''}
                onChange={handleChange}
                placeholder="e.g., Spouse, Parent, Child"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emergency_contact_phone">
                Phone Number
              </label>
              <input
                className={`shadow appearance-none border ${validationErrors.emergency_contact_phone ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
                id="emergency_contact_phone"
                name="emergency_contact_phone"
                type="text"
                value={formData.emergency_contact_phone || ''}
                onChange={handleChange}
                placeholder="e.g., 0712345678"
              />
              {validationErrors.emergency_contact_phone && (
                <p className="text-red-500 text-xs italic">{validationErrors.emergency_contact_phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Insurance Information Section */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Insurance Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="insurance_provider">
                Insurance Provider
              </label>
              <input
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="insurance_provider"
                name="insurance_provider"
                type="text"
                value={formData.insurance_provider || ''}
                onChange={handleChange}
                placeholder="e.g., NHIF, AAR, Jubilee"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="insurance_number">
                Insurance Number
              </label>
              <input
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="insurance_number"
                name="insurance_number"
                type="text"
                value={formData.insurance_number || ''}
                onChange={handleChange}
                placeholder="Insurance ID number"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="sha_number">
                SHA Number
              </label>
              <input
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="sha_number"
                name="sha_number"
                type="text"
                value={formData.sha_number || ''}
                onChange={handleChange}
                placeholder="Social Health Authority number"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-8">
          <button
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={() => navigate('/patients')}
          >
            Cancel
          </button>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : isEditMode ? 'Update Patient' : 'Register Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
