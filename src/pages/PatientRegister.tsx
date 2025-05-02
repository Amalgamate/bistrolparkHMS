import React, { useState } from 'react';
import { usePatient, PatientProvider } from '../context/PatientContext';
import { useToast, ToastProvider } from '../context/ToastContext';
import { PatientRegistration } from '../components/patients/PatientRegistration';
import { PatientDetails } from '../components/patients/PatientDetails';
import { Search, Plus, Filter, User, Phone, Calendar, Clock, FileText, MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react';
import '../styles/theme.css';

export const PatientRegister: React.FC = () => {
  const { patients, deletePatient } = usePatient();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState<number | null>(null);

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

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => {
    if (!searchTerm) return true;

    const term = searchTerm.toLowerCase();
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const idMatch = patient.id.toString().includes(term);
    const nameMatch = fullName.includes(term);
    const phoneMatch = patient.phone.toLowerCase().includes(term);
    const nationalIdMatch = patient.nationalId?.toLowerCase().includes(term) || false;

    return idMatch || nameMatch || phoneMatch || nationalIdMatch;
  });

  // Handle patient actions
  const handleAddPatient = () => {
    setSelectedPatient(null);
    setShowRegistrationForm(true);
    setShowPatientDetails(false);
  };

  const handleViewPatient = (patientId: number) => {
    setSelectedPatient(patientId);
    setShowPatientDetails(true);
    setShowRegistrationForm(false);
  };

  const handleEditPatient = (patientId: number) => {
    setSelectedPatient(patientId);
    setShowRegistrationForm(true);
    setShowPatientDetails(false);
  };

  const handleDeletePatient = (patientId: number) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      deletePatient(patientId);
      showToast('success', 'Patient deleted successfully');
    }
  };

  const handleSavePatient = (patientData: any) => {
    setShowRegistrationForm(false);
    showToast('success', 'Patient saved successfully');
  };

  return (
    <PatientProvider>
      <ToastProvider>
        <div className="flex flex-col h-full bg-background">
      <div className="flex-1 overflow-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm mb-4">
          <div>
            <h2 className="text-xl font-semibold text-[#2B4F60]">Patients Register</h2>
            <p className="text-sm text-muted">Search, register and manage patients</p>
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              onClick={handleAddPatient}
            >
              <Plus className="h-5 w-5 mr-1" />
              Register New Patient
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-md shadow-sm p-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patients by name, ID, phone, or national ID..."
                className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-[#F5B800] focus:border-[#F5B800] py-2.5 text-sm"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button className="btn btn-outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </button>
              <button className="btn btn-primary" onClick={handleAddPatient}>
                <Plus className="w-4 h-4 mr-2" />
                Add Patient
              </button>
            </div>
          </div>

          {/* Patient List */}
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Contact</th>
                  <th>Blood Group</th>
                  <th>Last Visit</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(patient => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar avatar-md bg-secondary flex items-center justify-center text-primary font-semibold rounded-full w-10 h-10">
                          {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold">{patient.firstName} {patient.lastName}</div>
                          <div className="text-sm text-muted">
                            {patient.gender}, {calculateAge(patient.dateOfBirth)} years
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-1 text-gray-400" />
                          <span>{patient.phone}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ID: {patient.nationalId || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                        {patient.bloodGroup || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          <span>{patient.lastVisit || 'Never'}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>Last: {patient.vitals && patient.vitals.length > 0 ? 'Check-up' : 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        patient.status === 'Active'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td>
                      <div className="relative">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            onClick={() => handleViewPatient(patient.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            onClick={() => handleEditPatient(patient.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            onClick={() => handleDeletePatient(patient.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center">
                        <User className="w-12 h-12 text-gray-300 mb-2" />
                        <p className="text-gray-500 mb-4">No patients found</p>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={handleAddPatient}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Register New Patient
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Patient Registration Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <PatientRegistration
              onClose={() => setShowRegistrationForm(false)}
              onSave={handleSavePatient}
            />
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {showPatientDetails && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <PatientDetails
              patientId={selectedPatient}
              onClose={() => setShowPatientDetails(false)}
              onEdit={handleEditPatient}
              onStartConsultation={() => {}}
              onAdmitPatient={() => {}}
            />
          </div>
        </div>
      )}
    </div>
      </ToastProvider>
    </PatientProvider>
  );
};
