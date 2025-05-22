import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/card';
import {
  Droplets,
  FileText,
  Settings,
  Calendar,
  Clock,
  Users,
  BarChart,
  Clipboard,
  Search,
  Heart,
  Activity,
  RefreshCw
} from 'lucide-react';
import BloodBankMenu from '../../components/blood-bank/BloodBankMenu';
import BloodBankQuickActions from '../../components/blood-bank/BloodBankQuickActions';
import BloodBankDashboardComponent from '../../components/blood-bank/BloodBankDashboard';
import BloodInventory from '../../components/blood-bank/BloodInventory';
import DonorManagement from '../../components/blood-bank/DonorManagement';
import BloodRequests from '../../components/blood-bank/BloodRequests';
import { BloodBankProvider } from '../../context/BloodBankContext';

const BloodBankModule: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Navigate to the appropriate route
    switch (tab) {
      case 'dashboard':
        navigate('/blood-bank');
        break;
      case 'inventory':
        navigate('/blood-bank/inventory');
        break;
      case 'donors':
        navigate('/blood-bank/donors');
        break;
      case 'requests':
        navigate('/blood-bank/requests');
        break;
      case 'screening':
        navigate('/blood-bank/screening');
        break;
      case 'reports':
        navigate('/blood-bank/reports');
        break;
      case 'settings':
        navigate('/blood-bank/settings');
        break;
      default:
        navigate('/blood-bank');
    }
  };

  return (
    <BloodBankProvider>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Droplets className="h-6 w-6 text-red-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Blood Bank Module</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            {/* Blood Bank Menu */}
            <BloodBankMenu activeItem={activeTab} onMenuItemClick={handleTabChange} />

            {/* Quick Actions */}
            <BloodBankQuickActions onMenuItemClick={handleTabChange} />
          </div>

          <div className="md:col-span-3">
            <Routes>
              <Route path="/" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <BloodBankDashboardComponent />
                </div>
              } />
              <Route path="/inventory" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <BloodInventory />
                </div>
              } />
              <Route path="/donors" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <DonorManagement />
                </div>
              } />
              <Route path="/requests" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <BloodRequests />
                </div>
              } />
              <Route path="/reports" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Blood Bank Reports</h2>
                  <p className="text-gray-500 mb-6">View and generate blood bank reports</p>
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Reporting functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/settings" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Blood Bank Settings</h2>
                  <p className="text-gray-500 mb-6">Configure blood bank module settings</p>
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
    </BloodBankProvider>
  );
};



export default BloodBankModule;
