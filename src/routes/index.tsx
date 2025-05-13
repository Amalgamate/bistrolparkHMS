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
import { AdmissionProvider } from '../context/AdmissionContext';
import TestPatientFlow from '../pages/TestPatientFlow';

// Appointment Module Pages
import AppointmentQueue from '../pages/appointments/AppointmentQueue';
import AppointmentManagement from '../pages/appointments/AppointmentManagement';
import VisitRecords from '../pages/appointments/VisitRecords';
import AppointmentReports from '../pages/appointments/AppointmentReports';

// Admissions Module
import AdmissionsModule from '../pages/admissions/AdmissionsModule';

// Clinical Module
import ClinicalModule from '../pages/clinical/ClinicalModule';
import { ClinicalProvider } from '../context/ClinicalContext';

// Lab Module
import LabModule from '../pages/lab/LabModule';
import { LabProvider } from '../context/LabContext';

// Settings Pages
import NotificationSettings from '../pages/settings/NotificationSettings';
import PatientDetailsDemo from '../pages/PatientDetailsDemo';

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

        <Route path="/settings/notifications" element={
          <ProtectedRoute requiredPermission="upload_hospital_logo">
            <ToastProvider>
              <NotificationSettings />
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

        {/* Appointment Module Routes */}
        <Route path="/appointments">
          <Route path="queue" element={
            <ProtectedRoute requiredPermission="view_queue">
              <ToastProvider>
                <AppointmentQueue />
              </ToastProvider>
            </ProtectedRoute>
          } />
          <Route path="management" element={
            <ProtectedRoute requiredPermission="view_appointments">
              <ToastProvider>
                <AppointmentManagement />
              </ToastProvider>
            </ProtectedRoute>
          } />
          <Route path="visits" element={
            <ProtectedRoute requiredPermission="view_visits">
              <ToastProvider>
                <VisitRecords />
              </ToastProvider>
            </ProtectedRoute>
          } />
          <Route path="reports" element={
            <ProtectedRoute requiredPermission="view_reports">
              <ToastProvider>
                <AppointmentReports />
              </ToastProvider>
            </ProtectedRoute>
          } />
        </Route>

        {/* Admissions Module Route */}
        <Route path="/admissions" element={
          <ProtectedRoute requiredPermission="view_admitted_patients">
            <ToastProvider>
              <AdmissionProvider>
                <AdmissionsModule />
              </AdmissionProvider>
            </ToastProvider>
          </ProtectedRoute>
        } />

        {/* Clinical Module Route */}
        <Route path="/clinical" element={
          <ProtectedRoute requiredPermission="view_patients">
            <PatientProvider>
              <ToastProvider>
                <InsuranceProvider>
                  <ClinicalProvider>
                    <ClinicalModule />
                  </ClinicalProvider>
                </InsuranceProvider>
              </ToastProvider>
            </PatientProvider>
          </ProtectedRoute>
        } />

        {/* Lab Module Route */}
        <Route path="/lab" element={
          <ProtectedRoute requiredPermission="view_waiting_patients_for_lab">
            <PatientProvider>
              <ToastProvider>
                <InsuranceProvider>
                  <LabModule />
                </InsuranceProvider>
              </ToastProvider>
            </PatientProvider>
          </ProtectedRoute>
        } />

        {/* Test and development routes */}
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="/permissions" element={<PermissionTest />} />
        <Route path="/login-credentials" element={<LoginCredentials />} />
        <Route path="/patient-demo" element={<PatientDetailsDemo />} />
        <Route path="/test-patient-flow" element={
          <PatientProvider>
            <ToastProvider>
              <InsuranceProvider>
                <ClinicalProvider>
                  <LabProvider>
                    <TestPatientFlow />
                  </LabProvider>
                </ClinicalProvider>
              </InsuranceProvider>
            </ToastProvider>
          </PatientProvider>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </UnifiedLayout>
  );
};
