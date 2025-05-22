import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/card';
import {
  Activity,
  FileText,
  Settings,
  Calendar,
  Clock,
  Users,
  BarChart,
  Clipboard,
  Dumbbell,
  Bone,
  Brain,
  Heart,
  Wrench
} from 'lucide-react';
import { PhysiotherapyProvider } from '../../context/PhysiotherapyContext';
import PhysiotherapyMenu from '../../components/physiotherapy/PhysiotherapyMenu';
import PhysiotherapyQuickActions from '../../components/physiotherapy/PhysiotherapyQuickActions';
import PhysiotherapyDashboardComponent from '../../components/physiotherapy/PhysiotherapyDashboard';
import PhysiotherapyPatients from '../../components/physiotherapy/PhysiotherapyPatients';
import PhysiotherapySessions from '../../components/physiotherapy/PhysiotherapySessions';

const PhysiotherapyModule: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Navigate to the appropriate route
    switch (tab) {
      case 'dashboard':
        navigate('/physiotherapy');
        break;
      case 'patients':
        navigate('/physiotherapy/patients');
        break;
      case 'assessments':
        navigate('/physiotherapy/assessments');
        break;
      case 'sessions':
        navigate('/physiotherapy/sessions');
        break;
      case 'exercises':
        navigate('/physiotherapy/exercises');
        break;
      case 'therapists':
        navigate('/physiotherapy/therapists');
        break;
      case 'equipment':
        navigate('/physiotherapy/equipment');
        break;
      case 'reports':
        navigate('/physiotherapy/reports');
        break;
      case 'settings':
        navigate('/physiotherapy/settings');
        break;
      default:
        navigate('/physiotherapy');
    }
  };

  return (
    <PhysiotherapyProvider>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Activity className="h-6 w-6 text-green-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Physiotherapy Module</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            {/* Physiotherapy Menu */}
            <PhysiotherapyMenu activeItem={activeTab} onMenuItemClick={handleTabChange} />

            {/* Quick Actions */}
            <PhysiotherapyQuickActions onMenuItemClick={handleTabChange} />
          </div>

          <div className="md:col-span-3">
            <Routes>
              <Route path="/" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <PhysiotherapyDashboardComponent />
                </div>
              } />
              <Route path="/patients" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <PhysiotherapyPatients />
                </div>
              } />
              <Route path="/sessions" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <PhysiotherapySessions />
                </div>
              } />
              <Route path="/assessments" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Physiotherapy Assessments</h2>
                  <p className="text-gray-500 mb-6">Manage patient assessments and evaluations</p>
                  <div className="text-center py-12">
                    <Clipboard className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Assessment management functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/exercises" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Exercise Library</h2>
                  <p className="text-gray-500 mb-6">Browse and manage therapeutic exercises</p>
                  <div className="text-center py-12">
                    <Dumbbell className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Exercise library functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/therapists" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Physiotherapists</h2>
                  <p className="text-gray-500 mb-6">Manage physiotherapists and their schedules</p>
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Therapist management functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/equipment" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Physiotherapy Equipment</h2>
                  <p className="text-gray-500 mb-6">Manage physiotherapy equipment and maintenance</p>
                  <div className="text-center py-12">
                    <Wrench className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Equipment management functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/reports" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Physiotherapy Reports</h2>
                  <p className="text-gray-500 mb-6">View and generate physiotherapy reports</p>
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Reporting functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/settings" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Physiotherapy Settings</h2>
                  <p className="text-gray-500 mb-6">Configure physiotherapy module settings</p>
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
    </PhysiotherapyProvider>
  );
};



export default PhysiotherapyModule;
