import React from 'react';
import PatientForm from './PatientForm';

/**
 * Enhanced Patient Registration component that wraps the PatientForm
 * This component is used as a bridge between the TypeScript components and our enhanced PatientForm
 */
const EnhancedPatientRegistration = ({ onClose, onSave }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <PatientForm onClose={onClose} onSave={onSave} />
    </div>
  );
};

export default EnhancedPatientRegistration;
