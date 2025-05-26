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
import MultiStepPatientRegistration from '../../components/clinical/MultiStepPatientRegistration';
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
    <div className="container mx-auto px-4 py-4 max-w-full">
      {/* Top Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Clinical Navigation">
            <button
              className={`py-4 px-6 border-b-2 font-medium text-base transition-colors ${
                activeTab === 'registration'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => {
                setActiveTab('registration');
                setSelectedPatientId(null);
              }}
            >
              <div className="flex items-center">
                <UserPlus className="h-5 w-5 mr-3" />
                <span>Register Patients</span>
              </div>
            </button>

            <button
              className={`py-4 px-6 border-b-2 font-medium text-base transition-colors ${
                activeTab === 'queue'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => {
                setActiveTab('queue');
                setSelectedView('all');
                setSelectedPatientId(null);
              }}
            >
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-3" />
                <span>Queue Management</span>
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {registeredCount + waitingVitalsCount + vitalsTakenCount}
                </span>
              </div>
            </button>

            <button
              className={`py-4 px-6 border-b-2 font-medium text-base transition-colors ${
                activeTab === 'settings'
                  ? 'border-gray-500 text-gray-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => {
                setActiveTab('settings');
                setSelectedPatientId(null);
              }}
            >
              <div className="flex items-center">
                <Settings className="h-5 w-5 mr-3" />
                <span>Settings</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content Area - Full Width */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          {activeTab === 'registration' && (
            <MultiStepPatientRegistration />
          )}

          {activeTab === 'queue' && (
            <ConsultationQueue
              view={selectedView}
              onChangeView={setSelectedView}
              onSelectForVitals={(patientId) => handleSelectPatient(patientId, 'vitals')}
              onSelectForConsultation={(patientId) => handleSelectPatient(patientId, 'consultation')}
            />
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Clinical Settings</h2>
                <p className="text-gray-600">Configure clinical workflow, templates, and preferences.</p>
              </div>
              {/* Settings content would go here */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Workflow Settings</h3>
                  <p className="text-sm text-gray-600">Configure patient flow and queue management</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Templates</h3>
                  <p className="text-sm text-gray-600">Manage clinical forms and templates</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Preferences</h3>
                  <p className="text-sm text-gray-600">Set default values and preferences</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClinicalModule;
