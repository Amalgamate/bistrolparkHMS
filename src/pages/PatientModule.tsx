import React, { useState } from 'react';
import { PatientList } from '../components/patients/PatientList';
import { PatientDetails } from '../components/patients/PatientDetails';
import { PatientSearch } from '../components/patients/PatientSearch';
import { PatientProvider } from '../context/PatientContext';
import { ToastProvider } from '../context/ToastContext';
import EnhancedPatientRegistration from '../components/patients/EnhancedPatientRegistration';
import '../styles/theme.css';

export const PatientModule: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showPatientSearch, setShowPatientSearch] = useState(true);
  const [showPatientList, setShowPatientList] = useState(false);
  const [showConsultation, setShowConsultation] = useState(false);
  const [showAdmission, setShowAdmission] = useState(false);

  // Toggle sidebar
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Handle patient actions
  const handleAddPatient = () => {
    setSelectedPatient(null);
    setShowRegistrationForm(true);
    setShowPatientSearch(false);
    setShowPatientList(false);
  };

  const handleViewPatient = (patientId: number) => {
    setSelectedPatient(patientId);
    setShowPatientDetails(true);
    setShowPatientSearch(false);
    setShowPatientList(false);
  };

  const handleEditPatient = (patientId: number) => {
    setSelectedPatient(patientId);
    setShowRegistrationForm(true);
    setShowPatientDetails(false);
  };

  const handleDeletePatient = (patientId: number) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      // The actual deletion happens in the PatientList component using the PatientContext
      alert(`Patient with ID: ${patientId} has been deleted`);
      if (selectedPatient === patientId) {
        setShowPatientDetails(false);
        setShowPatientSearch(true);
      }
    }
  };

  const handleSavePatient = (patientData: any) => {
    // The actual saving happens in the PatientRegistration component using the PatientContext
    console.log('Patient data saved:', patientData);
    setShowRegistrationForm(false);

    // If we were editing a patient, show the patient details
    if (selectedPatient) {
      setShowPatientDetails(true);
    } else {
      // If it was a new patient, go back to search
      setShowPatientSearch(true);
    }
  };

  const handleStartConsultation = (patientId: number) => {
    setSelectedPatient(patientId);
    setShowConsultation(true);
    setShowPatientDetails(false);
    // In a real app, you would navigate to the consultation module
    alert(`Starting consultation for patient ID: ${patientId}`);
  };

  const handleAdmitPatient = (patientId: number) => {
    setSelectedPatient(patientId);
    setShowAdmission(true);
    setShowPatientDetails(false);
    // In a real app, you would navigate to the admission module
    alert(`Admitting patient ID: ${patientId}`);
  };

  const handleBackToSearch = () => {
    setShowPatientSearch(true);
    setShowPatientList(false);
    setShowPatientDetails(false);
    setShowRegistrationForm(false);
  };

  const handleShowAllPatients = () => {
    setShowPatientList(true);
    setShowPatientSearch(false);
    setShowPatientDetails(false);
    setShowRegistrationForm(false);
  };

  return (
    <PatientProvider>
      <ToastProvider>
        <div className="flex flex-col h-full">
          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            {/* Page Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm mb-4">
              <div>
                <h2 className="text-xl font-semibold text-[#2B4F60]">Patients Register</h2>
                <p className="text-sm text-muted">Search, register and manage patients</p>
                <div className="mt-1 text-xs text-gray-500 flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2">NHIF Integrated</span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">KES Currency</span>
                </div>
              </div>
              <div className="flex gap-2">
                {!showPatientDetails && !showRegistrationForm && (
                  <>
                    <button
                      className={`btn ${showPatientSearch ? 'btn-primary' : 'btn-outline'}`}
                      onClick={handleBackToSearch}
                    >
                      Search Patients
                    </button>
                    <button
                      className={`btn ${showPatientList ? 'btn-primary' : 'btn-outline'}`}
                      onClick={handleShowAllPatients}
                    >
                      View All Patients
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleAddPatient}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Register New Patient
                    </button>
                  </>
                )}
                {(showPatientDetails || showRegistrationForm) && (
                  <button
                    className="btn btn-outline"
                    onClick={handleBackToSearch}
                  >
                    Back to Search
                  </button>
                )}
              </div>
            </div>

            {/* Patient Flow Guidance */}
            {showPatientSearch && (
              <div className="bg-blue-50 p-4 rounded-md mb-4 border border-blue-100">
                <h3 className="text-blue-800 font-medium mb-2">Patient Registration Workflow</h3>
                <div className="flex flex-wrap items-center text-sm text-blue-700">
                  <div className="flex items-center">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-1">1</span>
                    <span>Search/Register Patient</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <div className="flex items-center">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-1">2</span>
                    <span>Patient Profile</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <div className="flex items-center">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-1">3</span>
                    <span>Capture Vitals</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mx-2 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <div className="flex items-center">
                    <span className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center mr-1">4</span>
                    <span>Consultation/Admission</span>
                  </div>
                </div>
              </div>
            )}

            {/* Patient Search */}
            {showPatientSearch && (
              <PatientSearch
                onPatientSelect={handleViewPatient}
                onAddNewPatient={handleAddPatient}
              />
            )}

            {/* Patient List */}
            {showPatientList && (
              <PatientList
                onAddPatient={handleAddPatient}
                onViewPatient={handleViewPatient}
                onEditPatient={handleEditPatient}
                onDeletePatient={handleDeletePatient}
              />
            )}

            {/* Patient Details */}
            {showPatientDetails && (
              <div className="bg-white rounded-md shadow-sm">
                <PatientDetails
                  patientId={selectedPatient!}
                  onClose={handleBackToSearch}
                  onEdit={handleEditPatient}
                  onStartConsultation={handleStartConsultation}
                  onAdmitPatient={handleAdmitPatient}
                />
              </div>
            )}
          </div>

          {/* Patient Registration Modal */}
          {showRegistrationForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="w-full max-w-4xl max-h-[90vh] overflow-auto">
                <EnhancedPatientRegistration
                  onClose={() => setShowRegistrationForm(false)}
                  onSave={handleSavePatient}
                />
              </div>
            </div>
          )}
        </div>
      </ToastProvider>
    </PatientProvider>
  );
};
