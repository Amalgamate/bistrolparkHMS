import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { RefreshCw } from 'lucide-react';
import { LabProvider } from '../../context/LabContext';
import LabMenu from '../../components/lab/LabMenu';
import LabQuickActions from '../../components/lab/LabQuickActions';
import LabDashboard from '../../components/lab/LabDashboard';
import LabRequests from '../../components/lab/LabRequests';
import InternalLabVisits from '../../components/lab/InternalLabVisits';
import ExternalLabVisits from '../../components/lab/ExternalLabVisits';
import LabVisitReport from '../../components/lab/reports/LabVisitReport';
import LabPatientReport from '../../components/lab/reports/LabPatientReport';
import LabReferralsReport from '../../components/lab/reports/LabReferralsReport';
import LabTestPrices from '../../components/lab/settings/LabTestPrices';
import NewLabRequest from '../../components/lab/NewLabRequest';
import WalkInPatients from '../../components/lab/WalkInPatients';

const LabModule: React.FC = () => {
  // State for active tab and filters
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<string>('visit');

  // Function to refresh data
  const handleRefresh = () => {
    console.log('Refreshing lab data...');
    // In a real app, this would fetch fresh data from the API
  };

  return (
    <LabProvider>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Laboratory Module</h1>
          <div className="flex items-center gap-4">
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Branch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Branches</SelectItem>
                <SelectItem value="fedha">Fedha Branch</SelectItem>
                <SelectItem value="utawala">Utawala Branch</SelectItem>
                <SelectItem value="machakos">Machakos Branch</SelectItem>
                <SelectItem value="tassia">Tassia Branch</SelectItem>
                <SelectItem value="kitengela">Kitengela Branch</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            {/* Lab Menu */}
            <LabMenu activeItem={activeTab} onMenuItemClick={setActiveTab} />

            {/* Quick Actions */}
            <LabQuickActions onMenuItemClick={setActiveTab} />
          </div>

          <div className="md:col-span-3">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <LabDashboard />
            )}

            {/* Lab Requests */}
            {activeTab === 'requests' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Lab Requests</h2>
                <p className="text-gray-500 mb-6">Manage laboratory test requests</p>
                <LabRequests branch={selectedBranch} />
              </div>
            )}

            {/* Internal Patient Visits */}
            {activeTab === 'internal' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Internal Patient Visits</h2>
                <p className="text-gray-500 mb-6">Manage lab visits for internal patients</p>
                <InternalLabVisits branch={selectedBranch} />
              </div>
            )}

            {/* External Patient Visits */}
            {activeTab === 'external' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">External Patient Visits</h2>
                <p className="text-gray-500 mb-6">Manage lab visits for external patients</p>
                <ExternalLabVisits branch={selectedBranch} />
              </div>
            )}

            {/* Reports */}
            {activeTab === 'reports' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Lab Reports</h2>
                <p className="text-gray-500 mb-6">Generate and view laboratory reports</p>

                <div className="mb-4">
                  <Select value={selectedReport} onValueChange={setSelectedReport}>
                    <SelectTrigger className="w-[250px]">
                      <SelectValue placeholder="Select Report Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visit">Lab Visit Report</SelectItem>
                      <SelectItem value="patient">Lab Visit Report (Per Patient)</SelectItem>
                      <SelectItem value="referrals">Lab Referrals Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedReport === 'visit' && <LabVisitReport branch={selectedBranch} />}
                {selectedReport === 'patient' && <LabPatientReport branch={selectedBranch} />}
                {selectedReport === 'referrals' && <LabReferralsReport branch={selectedBranch} />}
              </div>
            )}

            {/* Test Prices */}
            {activeTab === 'prices' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Test Prices</h2>
                <p className="text-gray-500 mb-6">Manage laboratory test prices</p>
                <LabTestPrices />
              </div>
            )}

            {/* New Lab Request */}
            {activeTab === 'new' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">New Lab Request</h2>
                <p className="text-gray-500 mb-6">Create a new laboratory test request</p>
                <NewLabRequest branch={selectedBranch} />
              </div>
            )}

            {/* Walk-In Patients */}
            {activeTab === 'walkin' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Walk-In Patients</h2>
                <p className="text-gray-500 mb-6">Manage walk-in patients for laboratory tests</p>
                <WalkInPatients branch={selectedBranch} />
              </div>
            )}

            {/* Settings */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Lab Settings</h2>
                <p className="text-gray-500 mb-6">Configure laboratory settings and preferences</p>
                <div className="text-center py-12">
                  <p className="text-gray-500">Settings functionality will be implemented soon.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </LabProvider>
  );
};

export default LabModule;
