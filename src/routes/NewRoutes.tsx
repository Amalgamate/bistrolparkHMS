import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import NewDashboard from '../pages/NewDashboard';
import NewPatientFlow from '../pages/NewPatientFlow';
import { NewLayout } from '../components/layout/NewLayout';

export const NewRoutes: React.FC = () => {
  return (
    <NewLayout>
      <Routes>
        <Route path="/" element={<NewDashboard />} />
        <Route path="/dashboard" element={<NewDashboard />} />
        <Route path="/patients/*" element={<NewPatientFlow />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </NewLayout>
  );
};
