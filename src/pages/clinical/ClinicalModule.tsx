import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';
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
import { useClinical, PatientStatus } from '../../context/ClinicalContext';
import PatientRegistration from '../../components/clinical/PatientRegistration';
import ConsultationQueue from '../../components/clinical/ConsultationQueue';
import VitalsCapture from '../../components/clinical/VitalsCapture';
import DoctorConsultation from '../../components/clinical/DoctorConsultation';
import LabQueue from '../../components/clinical/LabQueue';
import PharmacyQueue from '../../components/clinical/PharmacyQueue';

const ClinicalModule: React.FC = () => {
  const { queue, getQueueByStatus } = useClinical();
  // Check if there's a tab parameter in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const tabParam = urlParams.get('tab');

  // Set the initial active tab based on URL parameter or default to 'registration'
  const [activeTab, setActiveTab] = useState(tabParam || 'registration');
  const [selectedView, setSelectedView] = useState<string>('all');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

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
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clinical/Nursing Module</h1>
          <p className="text-gray-500">Manage patient consultations, vitals, and nursing workflow</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => {
            setActiveTab('registration');
            setSelectedPatientId(null);
          }}>
            <UserPlus className="h-4 w-4 mr-2" />
            New Patient
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left sidebar with module navigation */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-medium text-gray-700">Clinical Workflow</h3>
            </div>
            <div className="p-2">
              <nav className="space-y-1">
                <button
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeTab === 'registration'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setActiveTab('registration');
                    setSelectedPatientId(null);
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-3" />
                  <span>Patient Registration</span>
                </button>

                <button
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
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
                    <Users className="h-4 w-4 mr-3" />
                    <span>Consultation Queue</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    {registeredCount + waitingVitalsCount + vitalsTakenCount}
                  </span>
                </button>

                <button
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
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
                    <Activity className="h-4 w-4 mr-3" />
                    <span>Vitals Capture</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    {waitingVitalsCount}
                  </span>
                </button>

                <button
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
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
                    <Stethoscope className="h-4 w-4 mr-3" />
                    <span>Doctor Consultation</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    {vitalsTakenCount + withDoctorCount + labCompletedCount}
                  </span>
                </button>

                <button
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
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
                    <FlaskConical className="h-4 w-4 mr-3" />
                    <span>Laboratory</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    {labOrderedCount}
                  </span>
                </button>

                <button
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
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
                    <Pill className="h-4 w-4 mr-3" />
                    <span>Pharmacy</span>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    {pharmacyCount}
                  </span>
                </button>

                <button
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-md ${
                    activeTab === 'settings'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setActiveTab('settings');
                    setSelectedPatientId(null);
                  }}
                >
                  <Settings className="h-4 w-4 mr-3" />
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
            <PharmacyQueue />
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Clinical Settings</h2>
              <p className="text-gray-500">Configure clinical workflow, templates, and preferences.</p>
              {/* Settings content would go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicalModule;
