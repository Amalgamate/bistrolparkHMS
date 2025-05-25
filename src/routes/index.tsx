import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UnifiedDashboard from '../pages/UnifiedDashboard';
import PatientFlow from '../pages/PatientFlow';
import DocumentCenter from '../pages/DocumentCenter';
import { PatientRegister } from '../pages/PatientRegister';
import DesignSystem from '../pages/DesignSystem';
import Settings from '../pages/Settings';
// import UserManagement from '../pages/UserManagement'; // Old component
import PermissionTest from '../pages/PermissionTest';
import LoginCredentials from '../pages/LoginCredentials';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import { UnifiedLayout } from '../components/layout/UnifiedLayout';
import { PatientProvider } from '../context/PatientContext';
import { ToastProvider } from '../context/ToastContext';
import { InsuranceProvider } from '../context/InsuranceContext';
import { AdmissionProvider } from '../context/AdmissionContext';
import { ChatProvider } from '../context/ChatContext';
import TestPatientFlow from '../pages/TestPatientFlow';
import ApprovalModule from '../pages/back-office/modules/ApprovalModule';
import ChatPage from '../pages/ChatPage';

// Appointment Module Pages
import AppointmentQueue from '../pages/appointments/AppointmentQueue';
import AppointmentManagement from '../pages/appointments/AppointmentManagement';
import VisitRecords from '../pages/appointments/VisitRecords';
import AppointmentReports from '../pages/appointments/AppointmentReports';

// Admissions Module
import AdmissionsModule from '../pages/admissions/AdmissionsModule';
import BristolParkWardsModule from '../pages/admissions/BristolParkWardsModule';

// Clinical Module
import ClinicalModule from '../pages/clinical/ClinicalModule';
import { ClinicalProvider } from '../context/ClinicalContext';

// Lab Module
import LabModule from '../pages/lab/LabModule';
import { LabProvider } from '../context/LabContext';

// Pharmacy Module
import PharmacyModule from '../pages/pharmacy/PharmacyModule';
import { PharmacyProvider } from '../context/PharmacyContext';

// Radiology Module
import RadiologyModule from '../pages/radiology/RadiologyModule';
import { RadiologyProvider } from '../context/RadiologyContext';

// New Clinical Modules
import ProceduresModule from '../pages/procedures/ProceduresModule';
import MaternityModule from '../pages/maternity/MaternityModule';
import PhysiotherapyModule from '../pages/physiotherapy/PhysiotherapyModule';
import MortuaryModule from '../pages/mortuary/MortuaryModule';

// Emergency Services Group
import EmergencyModule from '../pages/emergency/EmergencyModule';
import BloodBankModule from '../pages/blood-bank/BloodBankModule';
import AmbulanceModule from '../pages/ambulance/AmbulanceModule';

// Back Office Module
import BackOfficeModule from '../pages/back-office/BackOfficeModule';

// Admin Service Management
import ServiceManagement from '../pages/admin/ServiceManagement';
import UserManagement from '../pages/admin/UserManagement';

// Settings Pages
import NotificationSettings from '../pages/settings/NotificationSettings';
import PatientRegisterModule from '../pages/PatientRegisterModule';
import PatientDetailsView from '../pages/PatientDetailsView';
import PatientEditForm from '../pages/PatientEditForm';
import AppointmentScheduler from '../pages/AppointmentScheduler';
import IconTest from '../components/IconTest';

export const AppRoutes: React.FC = () => {
  return (
    <UnifiedLayout>
      <Routes>
        <Route path="/" element={<UnifiedDashboard />} />
        <Route path="/dashboard" element={<UnifiedDashboard />} />

        <Route path="/patients" element={
          <ProtectedRoute requiredPermission="view_patients">
            <PatientProvider>
              <ToastProvider>
                <InsuranceProvider>
                  <PatientRegisterModule />
                </InsuranceProvider>
              </ToastProvider>
            </PatientProvider>
          </ProtectedRoute>
        } />

        <Route path="/patients/details/:patientId" element={
          <ProtectedRoute requiredPermission="view_patients">
            <PatientProvider>
              <ToastProvider>
                <InsuranceProvider>
                  <PatientDetailsView />
                </InsuranceProvider>
              </ToastProvider>
            </PatientProvider>
          </ProtectedRoute>
        } />

        <Route path="/patients/edit/:patientId" element={
          <ProtectedRoute requiredPermission="edit_patients">
            <PatientProvider>
              <ToastProvider>
                <InsuranceProvider>
                  <PatientEditForm />
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
          <ProtectedRoute requiredPermission="manage_hospital_users">
            <ToastProvider>
              <UserManagement />
            </ToastProvider>
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
          <Route path="new" element={
            <ProtectedRoute requiredPermission="create_appointments">
              <AppointmentScheduler />
            </ProtectedRoute>
          } />
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

        {/* Admissions Module Routes */}
        <Route path="/admissions" element={
          <ProtectedRoute requiredPermission="view_admitted_patients">
            <ToastProvider>
              <AdmissionProvider>
                <AdmissionsModule />
              </AdmissionProvider>
            </ToastProvider>
          </ProtectedRoute>
        } />

        {/* Bristol Park Wards Module Route */}
        <Route path="/wards" element={
          <ProtectedRoute requiredPermission="view_admitted_patients">
            <ToastProvider>
              <BristolParkWardsModule />
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

        {/* Pharmacy Module Route */}
        <Route path="/pharmacy/*" element={
          <ProtectedRoute requiredPermission="view_waiting_patients_for_pharmacy">
            <PatientProvider>
              <ToastProvider>
                <InsuranceProvider>
                  <ClinicalProvider>
                    <PharmacyProvider>
                      <PharmacyModule />
                    </PharmacyProvider>
                  </ClinicalProvider>
                </InsuranceProvider>
              </ToastProvider>
            </PatientProvider>
          </ProtectedRoute>
        } />

        {/* Radiology Module Route */}
        <Route path="/radiology/*" element={
          <ProtectedRoute requiredPermission="view_waiting_patients_for_radiology">
            <PatientProvider>
              <ToastProvider>
                <InsuranceProvider>
                  <ClinicalProvider>
                    <RadiologyProvider>
                      <RadiologyModule />
                    </RadiologyProvider>
                  </ClinicalProvider>
                </InsuranceProvider>
              </ToastProvider>
            </PatientProvider>
          </ProtectedRoute>
        } />

        {/* Procedures Module Route */}
        <Route path="/procedures/*" element={
          <ProtectedRoute requiredPermission="view_patients">
            <PatientProvider>
              <ToastProvider>
                <InsuranceProvider>
                  <ClinicalProvider>
                    <ProceduresModule />
                  </ClinicalProvider>
                </InsuranceProvider>
              </ToastProvider>
            </PatientProvider>
          </ProtectedRoute>
        } />

        {/* Maternity Module Route */}
        <Route path="/maternity/*" element={
          <ProtectedRoute requiredPermission="view_patients">
            <PatientProvider>
              <ToastProvider>
                <InsuranceProvider>
                  <ClinicalProvider>
                    <MaternityModule />
                  </ClinicalProvider>
                </InsuranceProvider>
              </ToastProvider>
            </PatientProvider>
          </ProtectedRoute>
        } />

        {/* Physiotherapy Module Route */}
        <Route path="/physiotherapy/*" element={
          <ProtectedRoute requiredPermission="view_patients">
            <PatientProvider>
              <ToastProvider>
                <InsuranceProvider>
                  <ClinicalProvider>
                    <PhysiotherapyModule />
                  </ClinicalProvider>
                </InsuranceProvider>
              </ToastProvider>
            </PatientProvider>
          </ProtectedRoute>
        } />

        {/* Mortuary Module Route */}
        <Route path="/mortuary/*" element={
          <ProtectedRoute requiredPermission="view_patients">
            <PatientProvider>
              <ToastProvider>
                <InsuranceProvider>
                  <MortuaryModule />
                </InsuranceProvider>
              </ToastProvider>
            </PatientProvider>
          </ProtectedRoute>
        } />

        {/* Emergency Services Group Routes */}
        <Route path="/emergency/*" element={
          <ProtectedRoute requiredPermission="view_patients">
            <PatientProvider>
              <ToastProvider>
                <InsuranceProvider>
                  <ClinicalProvider>
                    <EmergencyModule />
                  </ClinicalProvider>
                </InsuranceProvider>
              </ToastProvider>
            </PatientProvider>
          </ProtectedRoute>
        } />

        <Route path="/blood-bank/*" element={
          <ProtectedRoute requiredPermission="view_patients">
            <PatientProvider>
              <ToastProvider>
                <InsuranceProvider>
                  <BloodBankModule />
                </InsuranceProvider>
              </ToastProvider>
            </PatientProvider>
          </ProtectedRoute>
        } />

        <Route path="/ambulance/*" element={
          <ProtectedRoute requiredPermission="view_patients">
            <PatientProvider>
              <ToastProvider>
                <InsuranceProvider>
                  <AmbulanceModule />
                </InsuranceProvider>
              </ToastProvider>
            </PatientProvider>
          </ProtectedRoute>
        } />

        {/* Administration Module Routes */}
        <Route path="/admin/services" element={
          <ProtectedRoute requiredPermission="access_service_management">
            <ToastProvider>
              <ServiceManagement />
            </ToastProvider>
          </ProtectedRoute>
        } />

        <Route path="/admin/roles" element={
          <ProtectedRoute requiredPermission="manage_hospital_users">
            <div className="p-6">
              <h1 className="text-2xl font-bold">Role & Permissions Management</h1>
              <p className="text-gray-600 mt-2">Manage user roles and permissions (Coming Soon)</p>
            </div>
          </ProtectedRoute>
        } />

        <Route path="/admin/database" element={
          <ProtectedRoute requiredPermission="manage_database">
            <div className="p-6">
              <h1 className="text-2xl font-bold">Database Management</h1>
              <p className="text-gray-600 mt-2">Database administration and maintenance (Coming Soon)</p>
            </div>
          </ProtectedRoute>
        } />

        <Route path="/admin/audit" element={
          <ProtectedRoute requiredPermission="view_audit_logs">
            <div className="p-6">
              <h1 className="text-2xl font-bold">Audit Logs</h1>
              <p className="text-gray-600 mt-2">System audit logs and user activity tracking (Coming Soon)</p>
            </div>
          </ProtectedRoute>
        } />

        <Route path="/admin/security" element={
          <ProtectedRoute requiredPermission="manage_security_settings">
            <div className="p-6">
              <h1 className="text-2xl font-bold">Security Settings</h1>
              <p className="text-gray-600 mt-2">System security configuration and policies (Coming Soon)</p>
            </div>
          </ProtectedRoute>
        } />

        {/* Back Office Module Route */}
        <Route path="/back-office/*" element={
          <ProtectedRoute requiredPermission="view_patients">
            <ToastProvider>
              <BackOfficeModule />
            </ToastProvider>
          </ProtectedRoute>
        } />

        {/* Approvals Module Route */}
        <Route path="/approvals/*" element={
          <ProtectedRoute requiredPermission="view_patients">
            <ToastProvider>
              <ApprovalModule />
            </ToastProvider>
          </ProtectedRoute>
        } />

        {/* Chat Module Route */}
        <Route path="/messages" element={
          <ProtectedRoute>
            <ToastProvider>
              <ChatProvider>
                <ChatPage />
              </ChatProvider>
            </ToastProvider>
          </ProtectedRoute>
        } />

        {/* Test and development routes */}
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="/permissions" element={<PermissionTest />} />
        <Route path="/login-credentials" element={<LoginCredentials />} />
        <Route path="/icon-test" element={<IconTest />} />
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
