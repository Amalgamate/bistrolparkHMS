import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import {
  FileText,
  Settings,
  Calendar,
  Users,
  Clipboard,
  Thermometer,
  Truck,
  Wrench,
  DollarSign
} from 'lucide-react';
import { MortuaryProvider } from '../../context/MortuaryContext';
import MortuaryMenu from '../../components/mortuary/MortuaryMenu';
import MortuaryQuickActions from '../../components/mortuary/MortuaryQuickActions';
import MortuaryDashboardComponent from '../../components/mortuary/MortuaryDashboard';

const MortuaryModule: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Navigate to the appropriate route
    switch (tab) {
      case 'dashboard':
        navigate('/mortuary');
        break;
      case 'deceased':
        navigate('/mortuary/deceased');
        break;
      case 'storage':
        navigate('/mortuary/storage');
        break;
      case 'services':
        navigate('/mortuary/services');
        break;
      case 'release':
        navigate('/mortuary/release');
        break;
      case 'certificates':
        navigate('/mortuary/certificates');
        break;
      case 'appointments':
        navigate('/mortuary/appointments');
        break;
      case 'billing':
        navigate('/mortuary/billing');
        break;
      case 'reports':
        navigate('/mortuary/reports');
        break;
      case 'settings':
        navigate('/mortuary/settings');
        break;
      default:
        navigate('/mortuary');
    }
  };

  return (
    <MortuaryProvider>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-gray-800 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Mortuary Module</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            {/* Mortuary Menu */}
            <MortuaryMenu activeItem={activeTab} onMenuItemClick={handleTabChange} />

            {/* Quick Actions */}
            <MortuaryQuickActions onMenuItemClick={handleTabChange} />
          </div>

          <div className="md:col-span-3">
            <Routes>
              <Route path="/" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <MortuaryDashboardComponent />
                </div>
              } />
              <Route path="/deceased" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Deceased Registry</h2>
                  <p className="text-gray-500 mb-6">Manage deceased person records</p>
                  <div className="text-center py-12">
                    <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Deceased registry functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/storage" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Storage Management</h2>
                  <p className="text-gray-500 mb-6">Manage mortuary storage facilities and assignments</p>
                  <div className="text-center py-12">
                    <Thermometer className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Storage management functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/services" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Mortuary Services</h2>
                  <p className="text-gray-500 mb-6">Manage mortuary services and preparations</p>
                  <div className="text-center py-12">
                    <Wrench className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Mortuary services functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/release" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Body Release</h2>
                  <p className="text-gray-500 mb-6">Process and manage body releases</p>
                  <div className="text-center py-12">
                    <Truck className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Body release functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/certificates" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Death Certificates</h2>
                  <p className="text-gray-500 mb-6">Manage death certificates</p>
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Death certificates functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/appointments" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Viewing Appointments</h2>
                  <p className="text-gray-500 mb-6">Manage viewing appointments</p>
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Viewing appointments functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/billing" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Mortuary Billing</h2>
                  <p className="text-gray-500 mb-6">Manage mortuary billing and payments</p>
                  <div className="text-center py-12">
                    <DollarSign className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Billing functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/reports" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Mortuary Reports</h2>
                  <p className="text-gray-500 mb-6">View and generate mortuary reports</p>
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Reporting functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/settings" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Mortuary Settings</h2>
                  <p className="text-gray-500 mb-6">Configure mortuary module settings</p>
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
    </MortuaryProvider>
  );
};



export default MortuaryModule;
