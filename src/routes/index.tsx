import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UnifiedDashboard from '../pages/UnifiedDashboard';
import PatientFlow from '../pages/PatientFlow';
import DocumentCenter from '../pages/DocumentCenter';
import { PatientRegister } from '../pages/PatientRegister';
import DesignSystem from '../pages/DesignSystem.jsx';
import Settings from '../pages/Settings';
import UserManagement from '../pages/UserManagement';
import PermissionTest from '../pages/PermissionTest';
import LoginCredentials from '../pages/LoginCredentials';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { UnifiedLayout } from '../components/layout/UnifiedLayout';
import { PatientProvider } from '../context/PatientContext';
import { ToastProvider } from '../context/ToastContext';
import { InsuranceProvider } from '../context/InsuranceContext';

export const AppRoutes: React.FC = () => {
  return (
    <UnifiedLayout>
      <Routes>
        <Route path="/" element={<UnifiedDashboard />} />
        <Route path="/dashboard" element={<UnifiedDashboard />} />

        <Route path="/patients/*" element={
          <ProtectedRoute requiredPermission="view_patients">
            <PatientFlow />
          </ProtectedRoute>
        } />

        <Route path="/patient-module" element={
          <ProtectedRoute requiredPermission="register_patient">
            <PatientProvider>
              <ToastProvider>
                <InsuranceProvider>
                  <PatientRegister />
                </InsuranceProvider>
              </ToastProvider>
            </PatientProvider>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute requiredPermission="upload_hospital_logo">
            <ToastProvider>
              <InsuranceProvider>
                <Settings />
              </InsuranceProvider>
            </ToastProvider>
          </ProtectedRoute>
        } />

        <Route path="/users" element={
          <ProtectedRoute requiredPermission="register_user">
            <UserManagement />
          </ProtectedRoute>
        } />

        {/* Document Center */}
        <Route path="/document-center" element={
          <ProtectedRoute requiredPermission="view_documents">
            <ToastProvider>
              <DocumentCenter />
            </ToastProvider>
          </ProtectedRoute>
        } />

        {/* Test and development routes */}
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="/permissions" element={<PermissionTest />} />
        <Route path="/login-credentials" element={<LoginCredentials />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UnifiedLayout>
  );
};
