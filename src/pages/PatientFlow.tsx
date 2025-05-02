import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { PatientRegistration } from '../components/patients/PatientRegistration';
import { PatientAdmission } from '../components/patients/PatientAdmission';
import { PatientTracking } from '../components/patients/PatientTracking';

const PatientFlow: React.FC = () => {
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
      <h1 className="text-2xl font-semibold text-[#2B4F60] mb-6">Patient Flow Management</h1>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => navigate('/patients/registration')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${isActive('/registration')
              ? 'border-[#0d6fe8] text-[#0d6fe8]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Registration
          </button>
          <button
            onClick={() => navigate('/patients/admission')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${isActive('/admission')
              ? 'border-[#0d6fe8] text-[#0d6fe8]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Admission
          </button>
          <button
            onClick={() => navigate('/patients/tracking')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${isActive('/tracking')
              ? 'border-[#0d6fe8] text-[#0d6fe8]'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Patient Tracking
          </button>
        </nav>
      </div>

      <Routes>
        <Route path="/" element={<PatientRegistration />} />
        <Route path="/registration" element={<PatientRegistration />} />
        <Route path="/admission" element={<PatientAdmission />} />
        <Route path="/tracking" element={<PatientTracking />} />
      </Routes>
    </div>
  );
};

export default PatientFlow;