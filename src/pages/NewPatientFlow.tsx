import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { NewPatientRegistration } from '../components/patients/NewPatientRegistration';
import { NewPatientAdmission } from '../components/patients/NewPatientAdmission';
import { NewPatientTracking } from '../components/patients/NewPatientTracking';
import { NewPatientHistory } from '../components/patients/NewPatientHistory';
import { NewPatientReports } from '../components/patients/NewPatientReports';

const NewPatientFlow: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  // Redirect to registration by default if on the base patients path
  useEffect(() => {
    if (path === '/patients') {
      navigate('/patients/registration');
    }
  }, [path, navigate]);

  const isActive = (route: string) => path.includes(route);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[#01016C]">Patient Management</h1>

        {/* Quick Actions */}
        <div className="flex space-x-2">
          <button
            onClick={() => navigate('/patients/registration')}
            className="px-3 py-1.5 text-sm font-medium text-white bg-[#1961FB] rounded-md shadow-sm hover:bg-[#0A4EFA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1961FB] transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Patient
          </button>
          <button
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1961FB] transition-all duration-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </button>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6 bg-white rounded-t-lg shadow-sm">
        <nav className="-mb-px flex space-x-8 overflow-x-auto px-4">
          <button
            onClick={() => navigate('/patients/registration')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${isActive('/registration')
              ? 'border-[#1961FB] text-[#01016C]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Patient Registration
          </button>
          <button
            onClick={() => navigate('/patients/history')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${isActive('/history')
              ? 'border-[#1961FB] text-[#01016C]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Medical History
          </button>
          <button
            onClick={() => navigate('/patients/admission')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${isActive('/admission')
              ? 'border-[#1961FB] text-[#01016C]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Admission History
          </button>
          <button
            onClick={() => navigate('/patients/tracking')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${isActive('/tracking')
              ? 'border-[#1961FB] text-[#01016C]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Walk-in History
          </button>
          <button
            onClick={() => navigate('/patients/reports')}
            className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${isActive('/reports')
              ? 'border-[#1961FB] text-[#01016C]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Patient Reports
          </button>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<NewPatientRegistration />} />
        <Route path="/registration" element={<NewPatientRegistration />} />
        <Route path="/history" element={<NewPatientHistory />} />
        <Route path="/admission" element={<NewPatientAdmission />} />
        <Route path="/tracking" element={<NewPatientTracking />} />
        <Route path="/reports" element={<NewPatientReports />} />
      </Routes>
    </div>
  );
};

export default NewPatientFlow;
