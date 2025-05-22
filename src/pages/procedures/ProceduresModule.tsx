import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/card';
import {
  Scissors,
  FileText,
  Settings,
  Calendar,
  Clock,
  Users,
  BarChart,
  Stethoscope,
  Heart,
  Brain,
  Bone,
  Eye,
  Ear,
  BookOpen,
  Briefcase,
  CheckSquare
} from 'lucide-react';
import { ProceduresProvider } from '../../context/ProceduresContext';
import ProceduresMenu from '../../components/procedures/ProceduresMenu';
import ProceduresQuickActions from '../../components/procedures/ProceduresQuickActions';
import ProceduresDashboardComponent from '../../components/procedures/ProceduresDashboard';
import ProceduresSchedule from '../../components/procedures/ProceduresSchedule';

const ProceduresModule: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Navigate to the appropriate route
    switch (tab) {
      case 'dashboard':
        navigate('/procedures');
        break;
      case 'schedule':
        navigate('/procedures/schedule');
        break;
      case 'procedures':
        navigate('/procedures/procedures');
        break;
      case 'templates':
        navigate('/procedures/templates');
        break;
      case 'rooms':
        navigate('/procedures/rooms');
        break;
      case 'consents':
        navigate('/procedures/consents');
        break;
      case 'patients':
        navigate('/procedures/patients');
        break;
      case 'reports':
        navigate('/procedures/reports');
        break;
      case 'settings':
        navigate('/procedures/settings');
        break;
      default:
        navigate('/procedures');
    }
  };

  return (
    <ProceduresProvider>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Scissors className="h-6 w-6 text-purple-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Procedures Module</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            {/* Procedures Menu */}
            <ProceduresMenu activeItem={activeTab} onMenuItemClick={handleTabChange} />

            {/* Quick Actions */}
            <ProceduresQuickActions onMenuItemClick={handleTabChange} />
          </div>

          <div className="md:col-span-3">
            <Routes>
              <Route path="/" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <ProceduresDashboardComponent />
                </div>
              } />
              <Route path="/schedule" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <ProceduresSchedule />
                </div>
              } />
              <Route path="/procedures" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Procedures</h2>
                  <p className="text-gray-500 mb-6">View and manage all procedures</p>
                  <div className="text-center py-12">
                    <Scissors className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Procedures management functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/templates" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Procedure Templates</h2>
                  <p className="text-gray-500 mb-6">Manage procedure templates and protocols</p>
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Templates management functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/rooms" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Procedure Rooms</h2>
                  <p className="text-gray-500 mb-6">Manage procedure and operating rooms</p>
                  <div className="text-center py-12">
                    <Briefcase className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Room management functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/consents" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Consent Forms</h2>
                  <p className="text-gray-500 mb-6">Manage procedure consent forms</p>
                  <div className="text-center py-12">
                    <CheckSquare className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Consent forms functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/patients" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Procedure Patients</h2>
                  <p className="text-gray-500 mb-6">View and manage patients undergoing procedures</p>
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Patient management functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/reports" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Procedure Reports</h2>
                  <p className="text-gray-500 mb-6">View and generate procedure reports</p>
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Reporting functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/settings" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Procedure Settings</h2>
                  <p className="text-gray-500 mb-6">Configure procedure settings</p>
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
    </ProceduresProvider>
  );
};



export default ProceduresModule;
