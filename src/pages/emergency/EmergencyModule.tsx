import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/card';
import {
  AlertTriangle,
  FileText,
  Settings,
  Calendar,
  Clock,
  Users,
  BarChart,
  Clipboard,
  Stethoscope,
  Heart,
  Activity,
  Bed
} from 'lucide-react';
import EmergencyMenu from '../../components/emergency/EmergencyMenu';
import EmergencyQuickActions from '../../components/emergency/EmergencyQuickActions';
import EmergencyDashboardComponent from '../../components/emergency/EmergencyDashboard';
import EmergencyTriage from '../../components/emergency/EmergencyTriage';
import EmergencyPatients from '../../components/emergency/EmergencyPatients';
import EmergencyBeds from '../../components/emergency/EmergencyBeds';
import { EmergencyProvider } from '../../context/EmergencyContext';

const EmergencyModule: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Navigate to the appropriate route
    switch (tab) {
      case 'dashboard':
        navigate('/emergency');
        break;
      case 'triage':
        navigate('/emergency/triage');
        break;
      case 'patients':
        navigate('/emergency/patients');
        break;
      case 'trauma':
        navigate('/emergency/trauma');
        break;
      case 'resources':
        navigate('/emergency/resources');
        break;
      case 'reports':
        navigate('/emergency/reports');
        break;
      case 'settings':
        navigate('/emergency/settings');
        break;
      default:
        navigate('/emergency');
    }
  };

  return (
    <EmergencyProvider>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Emergency Module</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            {/* Emergency Menu */}
            <EmergencyMenu activeItem={activeTab} onMenuItemClick={handleTabChange} />

            {/* Quick Actions */}
            <EmergencyQuickActions onMenuItemClick={handleTabChange} />
          </div>

          <div className="md:col-span-3">
            <Routes>
              <Route path="/" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <EmergencyDashboardComponent />
                </div>
              } />
              <Route path="/triage" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <EmergencyTriage />
                </div>
              } />
              <Route path="/patients" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <EmergencyPatients />
                </div>
              } />
              <Route path="/resources" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <EmergencyBeds />
                </div>
              } />
              <Route path="/trauma" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Trauma Center</h2>
                  <p className="text-gray-500 mb-6">Manage trauma center operations</p>
                  <div className="text-center py-12">
                    <Heart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Trauma center functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/reports" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Emergency Reports</h2>
                  <p className="text-gray-500 mb-6">View and generate emergency department reports</p>
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Reporting functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/settings" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Emergency Settings</h2>
                  <p className="text-gray-500 mb-6">Configure emergency department settings</p>
                  <div className="text-center py-12">
                    <Settings className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Settings functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </EmergencyProvider>
  );
};



export default EmergencyModule;
