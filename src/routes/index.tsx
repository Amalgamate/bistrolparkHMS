import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import PatientFlow from '../pages/PatientFlow';
import { PatientRegister } from '../pages/PatientRegister';
import DesignSystem from '../pages/DesignSystem';
import Settings from '../pages/Settings';
import UserManagement from '../pages/UserManagement';
import PermissionTest from '../pages/PermissionTest';
import LoginCredentials from '../pages/LoginCredentials';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { Layout } from '../components/layout/Layout';

export const AppRoutes: React.FC = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Protected routes with permission checks */}
        <Route path="/patients/*" element={
          <ProtectedRoute requiredPermission="view_patients">
            <PatientFlow />
          </ProtectedRoute>
        } />

        <Route path="/patient-module" element={
          <ProtectedRoute requiredPermission="register_patient">
            <PatientRegister />
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute requiredPermission="upload_hospital_logo">
            <Settings />
          </ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute requiredPermission="register_user">
            <UserManagement />
          </ProtectedRoute>
        } />

        {/* Test and development routes */}
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="/permissions" element={<PermissionTest />} />
        <Route path="/login-credentials" element={<LoginCredentials />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};
