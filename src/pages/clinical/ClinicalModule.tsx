import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../components/ui/tabs';
import { Button } from '../../components/ui/button';
import ModuleSelector from '../../components/layout/ModuleSelector';
import {
  UserPlus,
  Users,
  Stethoscope,
  Activity,
  FlaskConical,
  Pill,
  Settings,
  RefreshCw
} from 'lucide-react';
import CompactModuleHeader from '../../components/layout/CompactModuleHeader';
import { useClinical, PatientStatus } from '../../context/ClinicalContext';
import { PharmacyProvider } from '../../context/PharmacyContext';
import PatientRegistration from '../../components/clinical/PatientRegistration';
import ConsultationQueue from '../../components/clinical/ConsultationQueue';
import VitalsCapture from '../../components/clinical/VitalsCapture';
import DoctorConsultation from '../../components/clinical/DoctorConsultation';
import LabQueue from '../../components/clinical/LabQueue';
import PharmacyQueue from '../../components/clinical/PharmacyQueue';

const ClinicalModule: React.FC = () => {
  const navigate = useNavigate();
  const { queue, getQueueByStatus } = useClinical();
  // Check if there's a tab parameter in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab');

  // Set the initial active tab based on URL parameter or default to 'registration'
  const [activeTab, setActiveTab] = useState(tabParam || 'registration');
  const [selectedView, setSelectedView] = useState<string>('all');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  // No need for module options or handler as they're now in the ModuleSelector component

  // Count patients in different statuses
  const registeredCount = getQueueByStatus('registered').length;
  const waitingVitalsCount = getQueueByStatus('waiting_vitals').length;
  const vitalsTakenCount = getQueueByStatus('vitals_taken').length;
  const withDoctorCount = getQueueByStatus('with_doctor').length;
  const labOrderedCount = getQueueByStatus('lab_ordered').length;
  const labCompletedCount = getQueueByStatus('lab_completed').length;
  const pharmacyCount = getQueueByStatus('pharmacy').length;

  // Handle refresh
  const handleRefresh = () => {
    // In a real app, this would fetch the latest queue data from the server
    console.log('Refreshing queue data...');
  };

  // Handle patient selection for vitals or consultation
  const handleSelectPatient = (patientId: string, view: string) => {
    setSelectedPatientId(patientId);
    setSelectedView(view);
  };

  return (
    <div className="container mx-auto px-2 py-2 max-w-7xl">
      <CompactModuleHeader
        title="Clinical Menu"
        actions={
          <div className="flex items-center gap-2">
            <ModuleSelector currentModule="clinical" />

            <Button size="sm" onClick={() => {
              setActiveTab('registration');
              setSelectedPatientId(null);
            }}>
              <UserPlus className="h-3 w-3 mr-1.5" />
              New Patient
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Left sidebar with module navigation */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-2">
              <h2 className="text-sm font-semibold mb-2 text-gray-700 px-2">Clinical Menu</h2>
              <nav className="space-y-0.5">
                <button
                  className={`w-full flex items-center px-2 py-1.5 text-xs rounded-md ${
                    activeTab === 'registration'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setActiveTab('registration');
                    setSelectedPatientId(null);
                  }}
                >
                  <UserPlus className="h-3 w-3 mr-2" />
                  <span>Patient Registration</span>
                </button>

                <button
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md ${
                    activeTab === 'queue'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setActiveTab('queue');
                    setSelectedView('all');
                    setSelectedPatientId(null);
                  }}
                >
                  <div className="flex items-center">
                    <Users className="h-3 w-3 mr-2" />
                    <span>Consultation Queue</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs">
                    {registeredCount + waitingVitalsCount + vitalsTakenCount}
                  </span>
                </button>

                <button
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md ${
                    activeTab === 'vitals'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setActiveTab('vitals');
                    setSelectedView('waiting');
                    setSelectedPatientId(null);
                  }}
                >
                  <div className="flex items-center">
                    <Activity className="h-3 w-3 mr-2" />
                    <span>Vitals Capture</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs">
                    {waitingVitalsCount}
                  </span>
                </button>

                <button
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md ${
                    activeTab === 'consultation'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setActiveTab('consultation');
                    setSelectedView('waiting');
                    setSelectedPatientId(null);
                  }}
                >
                  <div className="flex items-center">
                    <Stethoscope className="h-3 w-3 mr-2" />
                    <span>Doctor Consultation</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs">
                    {vitalsTakenCount + withDoctorCount + labCompletedCount}
                  </span>
                </button>

                <button
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md ${
                    activeTab === 'lab'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setActiveTab('lab');
                    setSelectedPatientId(null);
                  }}
                >
                  <div className="flex items-center">
                    <FlaskConical className="h-3 w-3 mr-2" />
                    <span>Laboratory</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs">
                    {labOrderedCount}
                  </span>
                </button>

                <button
                  className={`w-full flex items-center justify-between px-2 py-1.5 text-xs rounded-md ${
                    activeTab === 'pharmacy'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setActiveTab('pharmacy');
                    setSelectedPatientId(null);
                  }}
                >
                  <div className="flex items-center">
                    <Pill className="h-3 w-3 mr-2" />
                    <span>Pharmacy</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs">
                    {pharmacyCount}
                  </span>
                </button>

                <button
                  className={`w-full flex items-center px-2 py-1.5 text-xs rounded-md ${
                    activeTab === 'settings'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setActiveTab('settings');
                    setSelectedPatientId(null);
                  }}
                >
                  <Settings className="h-3 w-3 mr-2" />
                  <span>Clinical Settings</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="md:col-span-3">
          {activeTab === 'registration' && (
            <PatientRegistration />
          )}

          {activeTab === 'queue' && (
            <ConsultationQueue
              view={selectedView}
              onChangeView={setSelectedView}
              onSelectForVitals={(patientId) => handleSelectPatient(patientId, 'vitals')}
              onSelectForConsultation={(patientId) => handleSelectPatient(patientId, 'consultation')}
            />
          )}

          {activeTab === 'vitals' && (
            <VitalsCapture
              patientId={selectedPatientId}
              view={selectedView}
              onChangeView={setSelectedView}
              onSelectPatient={(patientId) => setSelectedPatientId(patientId)}
            />
          )}

          {activeTab === 'consultation' && (
            <DoctorConsultation
              patientId={selectedPatientId}
              view={selectedView}
              onChangeView={setSelectedView}
              onSelectPatient={(patientId) => setSelectedPatientId(patientId)}
            />
          )}

          {activeTab === 'lab' && (
            <LabQueue />
          )}

          {activeTab === 'pharmacy' && (
            <PharmacyProvider>
              <PharmacyQueue />
            </PharmacyProvider>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold mb-2">Clinical Settings</h2>
              <p className="text-sm text-gray-500">Configure clinical workflow, templates, and preferences.</p>
              {/* Settings content would go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicalModule;
