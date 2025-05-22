import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import patientService from '../../services/patientService';

const PatientRegistrationForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    address: '',
    phone: '',
    email: '',
    emergency_contact: '',
    emergency_phone: '',
    blood_type: '',
    allergies: ''
  });

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

  const validateForm = () => {
    const errors = {};
    
    if (!formData.first_name.trim()) {
      errors.first_name = 'First name is required';
    }
    
    if (!formData.last_name.trim()) {
      errors.last_name = 'Last name is required';
    }
    
    if (!formData.date_of_birth) {
      errors.date_of_birth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.date_of_birth);
      const today = new Date();
      if (birthDate > today) {
        errors.date_of_birth = 'Date of birth cannot be in the future';
      }
    }
    
    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (formData.phone && !/^[0-9+\-\s()]*$/.test(formData.phone)) {
      errors.phone = 'Phone number format is invalid';
    }
    
    if (formData.emergency_phone && !/^[0-9+\-\s()]*$/.test(formData.emergency_phone)) {
      errors.emergency_phone = 'Emergency phone number format is invalid';
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
    setSuccess(false);
    
    try {
      const newPatient = await patientService.createPatient(formData);
      setSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        first_name: '',
        last_name: '',
        date_of_birth: '',
        gender: '',
        address: '',
        phone: '',
        email: '',
        emergency_contact: '',
        emergency_phone: '',
        blood_type: '',
        allergies: ''
      });
      
      // Redirect to patient list after a short delay
      setTimeout(() => {
        navigate('/patients');
      }, 2000);
    } catch (err) {
      console.error('Error registering patient:', err);
      
      // Handle validation errors from the server
      if (err.response?.data?.errors) {
        const serverErrors = {};
        err.response.data.errors.forEach(error => {
          serverErrors[error.param] = error.msg;
        });
        setValidationErrors(serverErrors);
      } else {
        setError(err.response?.data?.message || 'Failed to register patient. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Patient Registration</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Patient registered successfully! Redirecting to patient list...
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Personal Information</h2>
          </div>

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
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {validationErrors.gender && (
              <p className="text-red-500 text-xs italic">{validationErrors.gender}</p>
            )}
          </div>

          {/* Contact Information */}
          <div className="md:col-span-2 mt-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Contact Information</h2>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              className={`shadow appearance-none border ${validationErrors.phone ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="phone"
              name="phone"
              type="text"
              value={formData.phone || ''}
              onChange={handleChange}
              placeholder="e.g., 0712 345 678"
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

          <div className="md:col-span-2">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
              Address
            </label>
            <textarea
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="address"
              name="address"
              rows="3"
              value={formData.address || ''}
              onChange={handleChange}
              placeholder="Enter patient's address"
            ></textarea>
          </div>

          {/* Emergency Contact */}
          <div className="md:col-span-2 mt-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Emergency Contact</h2>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emergency_contact">
              Emergency Contact Name
            </label>
            <input
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="emergency_contact"
              name="emergency_contact"
              type="text"
              value={formData.emergency_contact || ''}
              onChange={handleChange}
              placeholder="e.g., John Doe"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emergency_phone">
              Emergency Contact Phone
            </label>
            <input
              className={`shadow appearance-none border ${validationErrors.emergency_phone ? 'border-red-500' : 'border-gray-300'} rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
              id="emergency_phone"
              name="emergency_phone"
              type="text"
              value={formData.emergency_phone || ''}
              onChange={handleChange}
              placeholder="e.g., 0712 345 678"
            />
            {validationErrors.emergency_phone && (
              <p className="text-red-500 text-xs italic">{validationErrors.emergency_phone}</p>
            )}
          </div>

          {/* Medical Information */}
          <div className="md:col-span-2 mt-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Medical Information</h2>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="blood_type">
              Blood Type
            </label>
            <select
              className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="blood_type"
              name="blood_type"
              value={formData.blood_type || ''}
              onChange={handleChange}
            >
              <option value="">Select Blood Type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
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
              placeholder="List any allergies the patient has"
            ></textarea>
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
            {loading ? 'Registering...' : 'Register Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientRegistrationForm;
