import React, { useState } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '../../components/ui/card';
import {
  Baby,
  FileText,
  Settings,
  Calendar,
  Clock,
  Users,
  BarChart,
  Heart,
  Stethoscope,
  Clipboard,
  Activity
} from 'lucide-react';
import { MaternityProvider } from '../../context/MaternityContext';
import MaternityMenu from '../../components/maternity/MaternityMenu';
import MaternityQuickActions from '../../components/maternity/MaternityQuickActions';
import MaternityDashboardComponent from '../../components/maternity/MaternityDashboard';
import PrenatalCare from '../../components/maternity/PrenatalCare';
import LaborDelivery from '../../components/maternity/LaborDelivery';
import Newborns from '../../components/maternity/Newborns';
import PostpartumCare from '../../components/maternity/PostpartumCare';
import MaternityPatients from '../../components/maternity/MaternityPatients';

const MaternityModule: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  // Handle tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    // Navigate to the appropriate route
    switch (tab) {
      case 'dashboard':
        navigate('/maternity');
        break;
      case 'prenatal':
        navigate('/maternity/prenatal');
        break;
      case 'labor':
        navigate('/maternity/labor');
        break;
      case 'newborns':
        navigate('/maternity/newborns');
        break;
      case 'postpartum':
        navigate('/maternity/postpartum');
        break;
      case 'patients':
        navigate('/maternity/patients');
        break;
      case 'reports':
        navigate('/maternity/reports');
        break;
      case 'settings':
        navigate('/maternity/settings');
        break;
      default:
        navigate('/maternity');
    }
  };

  return (
    <MaternityProvider>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Baby className="h-6 w-6 text-pink-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Maternity Module</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            {/* Maternity Menu */}
            <MaternityMenu activeItem={activeTab} onMenuItemClick={handleTabChange} />

            {/* Quick Actions */}
            <MaternityQuickActions onMenuItemClick={handleTabChange} />
          </div>

          <div className="md:col-span-3">
            <Routes>
              <Route path="/" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <MaternityDashboardComponent />
                </div>
              } />
              <Route path="/prenatal" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <PrenatalCare />
                </div>
              } />
              <Route path="/labor" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <LaborDelivery />
                </div>
              } />
              <Route path="/newborns" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <Newborns />
                </div>
              } />
              <Route path="/postpartum" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <PostpartumCare />
                </div>
              } />
              <Route path="/patients" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <MaternityPatients />
                </div>
              } />
              <Route path="/reports" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Maternity Reports</h2>
                  <p className="text-gray-500 mb-6">View and generate maternity reports</p>
                  <div className="text-center py-12">
                    <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">Reporting functionality will be implemented soon.</p>
                  </div>
                </div>
              } />
              <Route path="/settings" element={
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-4">Maternity Settings</h2>
                  <p className="text-gray-500 mb-6">Configure maternity module settings</p>
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
    </MaternityProvider>
  );
};



export default MaternityModule;
