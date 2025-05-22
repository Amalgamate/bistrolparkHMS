import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import {
  Truck,
  FileText,
  Settings,
  Calendar,
  Clock,
  Users,
  BarChart,
  Clipboard,
  MapPin,
  Phone,
  Activity,
  Wrench,
  PhoneCall
} from 'lucide-react';
import AmbulanceMenu from '../../components/ambulance/AmbulanceMenu';
import AmbulanceQuickActions from '../../components/ambulance/AmbulanceQuickActions';
import AmbulanceDashboardComponent from '../../components/ambulance/AmbulanceDashboard';
import AmbulanceFleet from '../../components/ambulance/AmbulanceFleet';
import CrewManagement from '../../components/ambulance/CrewManagement';
import EmergencyCalls from '../../components/ambulance/EmergencyCalls';
import { AmbulanceProvider } from '../../context/AmbulanceContext';

const AmbulanceModule: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Navigate to the appropriate route
    switch (tab) {
      case 'dashboard':
        navigate('/ambulance');
        break;
      case 'dispatch':
        navigate('/ambulance/dispatch');
        break;
      case 'fleet':
        navigate('/ambulance/fleet');
        break;
      case 'staff':
        navigate('/ambulance/staff');
        break;
      case 'maintenance':
        navigate('/ambulance/maintenance');
        break;
      case 'reports':
        navigate('/ambulance/reports');
        break;
      case 'settings':
        navigate('/ambulance/settings');
        break;
      default:
        navigate('/ambulance');
    }
  };

  return (
    <AmbulanceProvider>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Truck className="h-6 w-6 text-amber-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Ambulance Module</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            {/* Ambulance Menu */}
            <AmbulanceMenu activeItem={activeTab} onMenuItemClick={handleTabChange} />

            {/* Quick Actions */}
            <AmbulanceQuickActions onMenuItemClick={handleTabChange} />
          </div>

          <div className="md:col-span-3">
            <Routes>
              <Route path="/" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <AmbulanceDashboardComponent />
                </div>
              } />
              <Route path="/fleet" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <AmbulanceFleet />
                </div>
              } />
              <Route path="/staff" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <CrewManagement />
                </div>
              } />
              <Route path="/dispatch" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <EmergencyCalls />
                </div>
              } />
              <Route path="/maintenance" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Ambulance Maintenance</h2>
                  <p className="text-gray-500 mb-6">Ambulance maintenance will be implemented soon.</p>
                </div>
              } />
              <Route path="/reports" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Ambulance Reports</h2>
                  <p className="text-gray-500 mb-6">View and generate ambulance service reports</p>
                </div>
              } />
              <Route path="/settings" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Ambulance Settings</h2>
                  <p className="text-gray-500 mb-6">Configure ambulance module settings</p>
                </div>
              } />
            </Routes>
          </div>
        </div>
      </div>
    </AmbulanceProvider>
  );
};



export default AmbulanceModule;
