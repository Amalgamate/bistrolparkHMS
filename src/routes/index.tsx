import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import PatientFlow from '../pages/PatientFlow';
import { PatientModule } from '../pages/PatientModule';
import { Layout } from '../components/layout/Layout';

export const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients/*" element={<PatientFlow />} />
        <Route path="/patient-module" element={<PatientModule />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};
