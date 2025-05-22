import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import {
  FileText,
  DollarSign,
  Home,
  Clipboard,
  Users,
  User,
  PlusCircle,
  Stethoscope,
  MonitorSmartphone,
  Settings,
  FileImage,
  Calendar,
  Database
} from 'lucide-react';
import { RadiologyProvider } from '../../context/RadiologyContext';
import { radiologyMenuItems } from '../../utils/moduleMenuItems';
import { ModuleLayout } from '../../components/layout/ModuleLayout';
import RadiologyDashboardComponent from '../../components/radiology/RadiologyDashboard';
import RadiologyRequestsComponent from '../../components/radiology/RadiologyRequests';
import RadiologyTestsComponent from '../../components/radiology/RadiologyTests';
import RadiologyScheduleComponent from '../../components/radiology/RadiologySchedule';

// Updated components
const RadiologyDashboard = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <RadiologyDashboardComponent />
  </div>
);

const RadiologyRequests = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <RadiologyRequestsComponent />
  </div>
);

const InternalPatientVisits = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-semibold mb-4">Internal Patient Radiology Visits</h2>
    <p className="text-gray-500 mb-6">This feature is coming soon</p>
  </div>
);

const ExternalPatientVisits = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-semibold mb-4">External Patient Radiology Visits</h2>
    <p className="text-gray-500 mb-6">This feature is coming soon</p>
  </div>
);

const RadiologyVisitReport = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-semibold mb-4">Radiology Visit Report</h2>
    <p className="text-gray-500 mb-6">This feature is coming soon</p>
  </div>
);

const RadiologyVisitReportPerPatient = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-semibold mb-4">Radiology Visit Report (Per Patient)</h2>
    <p className="text-gray-500 mb-6">This feature is coming soon</p>
  </div>
);

const RadiologyTestPrices = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-semibold mb-4">Radiology Test Prices</h2>
    <p className="text-gray-500 mb-6">This feature is coming soon</p>
  </div>
);

const PostNewRadiologyRequests = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-semibold mb-4">Post New Radiology Requests</h2>
    <p className="text-gray-500 mb-6">This feature is coming soon</p>
  </div>
);

const WalkInPatients = () => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-semibold mb-4">Walk In Patients</h2>
    <p className="text-gray-500 mb-6">This feature is coming soon</p>
  </div>
);

const RadiologyQuickActions: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="flex flex-col items-center p-6">
        <Clipboard className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Radiology Requests</h3>
        <p className="text-gray-500 mb-4 text-center">
          View and manage radiology requests
        </p>
        <Button onClick={() => navigate('/radiology/requests')} className="mt-auto">View Requests</Button>
      </Card>

      <Card className="flex flex-col items-center p-6">
        <User className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Internal Patient Visits</h3>
        <p className="text-gray-500 mb-4 text-center">
          Manage internal patient radiology visits
        </p>
        <Button onClick={() => navigate('/radiology/internal-visits')} className="mt-auto">View Visits</Button>
      </Card>

      <Card className="flex flex-col items-center p-6">
        <MonitorSmartphone className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">External Patient Visits</h3>
        <p className="text-gray-500 mb-4 text-center">
          Manage external patient radiology visits
        </p>
        <Button onClick={() => navigate('/radiology/external-visits')} className="mt-auto">View Visits</Button>
      </Card>

      <Card className="flex flex-col items-center p-6">
        <FileText className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Radiology Visit Report</h3>
        <p className="text-gray-500 mb-4 text-center">
          Generate and view radiology visit reports
        </p>
        <Button onClick={() => navigate('/radiology/visit-report')} className="mt-auto">View Reports</Button>
      </Card>

      <Card className="flex flex-col items-center p-6">
        <FileText className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Patient Visit Report</h3>
        <p className="text-gray-500 mb-4 text-center">
          Generate and view patient-specific reports
        </p>
        <Button onClick={() => navigate('/radiology/patient-report')} className="mt-auto">View Reports</Button>
      </Card>

      <Card className="flex flex-col items-center p-6">
        <DollarSign className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Radiology Test Prices</h3>
        <p className="text-gray-500 mb-4 text-center">
          View and manage radiology test prices
        </p>
        <Button onClick={() => navigate('/radiology/test-prices')} className="mt-auto">View Prices</Button>
      </Card>

      <Card className="flex flex-col items-center p-6">
        <PlusCircle className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Post New Requests</h3>
        <p className="text-gray-500 mb-4 text-center">
          Create new radiology requests
        </p>
        <Button onClick={() => navigate('/radiology/post-requests')} className="mt-auto">Create Request</Button>
      </Card>

      <Card className="flex flex-col items-center p-6">
        <Users className="h-12 w-12 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Walk In Patients</h3>
        <p className="text-gray-500 mb-4 text-center">
          Register and manage walk-in patients
        </p>
        <Button onClick={() => navigate('/radiology/walkin')} className="mt-auto">Manage Walk-ins</Button>
      </Card>
    </div>
  );
};

const RadiologyModule: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/radiology${value === 'dashboard' ? '' : `/${value}`}`);
  };

  return (
    <RadiologyProvider>
      <ModuleLayout
        title="Radiology Department"
        description="Manage radiology requests, visits, and reports"
        menuTitle="Radiology Menu"
        menuItems={radiologyMenuItems}
        settingsPath="/radiology/settings"
      >
        {/* Navigation Tabs */}
        <div className="bg-white p-1 rounded-md shadow-sm mb-4">
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid grid-cols-7">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-background">
                <Home className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="requests" className="data-[state=active]:bg-background">
                <FileImage className="h-4 w-4 mr-2" />
                Requests
              </TabsTrigger>
              <TabsTrigger value="schedule" className="data-[state=active]:bg-background">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="tests" className="data-[state=active]:bg-background">
                <Database className="h-4 w-4 mr-2" />
                Tests
              </TabsTrigger>
              <TabsTrigger value="visits" className="data-[state=active]:bg-background">
                <Stethoscope className="h-4 w-4 mr-2" />
                Visits
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-background">
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-background">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<RadiologyDashboard />} />
          <Route path="/requests" element={<RadiologyRequests />} />
          <Route path="/schedule" element={
            <div className="bg-white rounded-lg shadow-sm p-6">
              <RadiologyScheduleComponent />
            </div>
          } />
          <Route path="/tests" element={
            <div className="bg-white rounded-lg shadow-sm p-6">
              <RadiologyTestsComponent />
            </div>
          } />
          <Route path="/internal-visits" element={<InternalPatientVisits />} />
          <Route path="/external-visits" element={<ExternalPatientVisits />} />
          <Route path="/visit-report" element={<RadiologyVisitReport />} />
          <Route path="/patient-report" element={<RadiologyVisitReportPerPatient />} />
          <Route path="/test-prices" element={<RadiologyTestPrices />} />
          <Route path="/post-requests" element={<PostNewRadiologyRequests />} />
          <Route path="/walkin" element={<WalkInPatients />} />
          <Route path="/settings" element={
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-4">Radiology Settings</h2>
              <p className="text-gray-500 mb-6">This feature is coming soon</p>
            </div>
          } />
        </Routes>
      </ModuleLayout>
    </RadiologyProvider>
  );
};

export default RadiologyModule;
