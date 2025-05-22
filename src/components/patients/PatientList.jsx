import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import patientService from '../../services/patientService';
import { useToast } from '../../context/ToastContext';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      console.log('PatientList: Fetching patients...');

      // Try to get the token
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('PatientList: No authentication token found');
        setError('Authentication required. Please log in to view patients.');
        showToast('Authentication required. Please log in to view patients.', 'error');
        return;
      }

      // Use the patient service to fetch patients
      console.log('PatientList: Fetching patients from API');
      const data = await patientService.getAllPatients();
      console.log('PatientList: API response:', data);

      if (Array.isArray(data)) {
        console.log('PatientList: Setting', data.length, 'patients from array');
        setPatients(data);

        // Store in localStorage for offline access
        localStorage.setItem('localPatients', JSON.stringify(data));
      } else if (data && data.rows && Array.isArray(data.rows)) {
        console.log('PatientList: Setting', data.rows.length, 'patients from data.rows');
        setPatients(data.rows);

        // Store in localStorage for offline access
        localStorage.setItem('localPatients', JSON.stringify(data.rows));
      } else {
        console.warn('PatientList: Unexpected API response format:', data);
        setPatients([]);
      }

      setError('');
    } catch (err) {
      console.error('PatientList: Error fetching patients:', err);
      setError('Failed to load patients. Please try again later.');
      showToast('Failed to load patients. Please try again later.', 'error');

      // Try to get locally stored patients as fallback
      try {
        const localPatients = localStorage.getItem('localPatients');
        if (localPatients) {
          const parsedPatients = JSON.parse(localPatients);
          console.log('PatientList: Using locally stored patients:', parsedPatients.length);
          setPatients(parsedPatients);
          setError('Using locally stored patients (offline mode)');
        } else {
          setPatients([]);
          setError('No patients found. Please check your API connection.');
        }
      } catch (storageErr) {
        console.error('PatientList: Error reading from localStorage:', storageErr);
        setPatients([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase();
    const patientId = patient.patient_id.toLowerCase();
    const searchValue = searchTerm.toLowerCase();

    return fullName.includes(searchValue) || patientId.includes(searchValue);
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientService.deletePatient(id);
        setPatients(patients.filter(patient => patient.id !== id));
        showToast('Patient deleted successfully', 'success');
      } catch (err) {
        console.error('Error deleting patient:', err);
        setError('Failed to delete patient. Please try again later.');
        showToast('Failed to delete patient. Please try again later.', 'error');
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

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Patients</h1>
        <Link
          to="/patients/new"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
        >
          Add New Patient
        </Link>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search patients by name or ID..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {filteredPatients.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No patients found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient ID
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Birth
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{patient.patient_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {patient.first_name} {patient.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{patient.gender}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(patient.date_of_birth).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{patient.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`/patients/${patient.id}`}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      View
                    </Link>
                    <Link
                      to={`/patients/${patient.id}/edit`}
                      className="text-yellow-600 hover:text-yellow-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(patient.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PatientList;
