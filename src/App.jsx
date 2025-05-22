import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth components
import LoginForm from './components/auth/LoginForm';

// Patient components
import PatientList from './components/patients/PatientList';
import PatientForm from './components/patients/PatientForm';

// Prescription components
import PrescriptionList from './components/prescriptions/PrescriptionList';

// Layout components
import Layout from './components/layout/Layout';
import Unauthorized from './components/common/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              {/* Dashboard */}
              <Route path="/dashboard" element={<div>Dashboard</div>} />

              {/* Patients */}
              <Route path="/patients" element={<PatientList />} />
              <Route path="/patients/new" element={<PatientForm />} />
              <Route path="/patients/:id" element={<div>Patient Details</div>} />
              <Route path="/patients/:id/edit" element={<PatientForm />} />

              {/* Appointments */}
              <Route path="/appointments" element={<div>Appointments</div>} />

              {/* Prescriptions */}
              <Route path="/prescriptions" element={<PrescriptionList />} />
              <Route path="/prescriptions/:id" element={<div>Prescription Details</div>} />

              {/* Doctor-only routes */}
              <Route element={<ProtectedRoute requiredRole="doctor" />}>
                <Route path="/prescriptions/new" element={<div>New Prescription</div>} />
              </Route>

              {/* Admin-only routes */}
              <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route path="/admin/users" element={<div>User Management</div>} />
                <Route path="/admin/settings" element={<div>System Settings</div>} />
              </Route>
            </Route>
          </Route>

          {/* Redirect root to dashboard or login */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 route */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
