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
  FlaskConical,
  Users,
  UserPlus,
  ClipboardList,
  FileText,
  Settings,
  RefreshCw,
  DollarSign
} from 'lucide-react';
import { LabProvider } from '../../context/LabContext';
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
  const [activeTab, setActiveTab] = useState<string>('requests');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedReport, setSelectedReport] = useState<string>('visit');

  // Function to refresh data
  const handleRefresh = () => {
    console.log('Refreshing lab data...');
    // In a real app, this would fetch fresh data from the API
  };

  return (
    <LabProvider>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Laboratory</h1>
            <p className="text-gray-500">Manage lab tests, samples, and results</p>
          </div>
          <div className="flex items-center gap-2">
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

        {/* Navigation Tabs */}
        <Tabs defaultValue="requests" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <TabsList className="bg-transparent h-auto p-0">
              <TabsTrigger
                value="requests"
                className="py-2.5 px-4 rounded-none lab-tab lab-tab-requests"
              >
                <FlaskConical className="h-4 w-4 mr-2" />
                Lab Requests
              </TabsTrigger>
              <TabsTrigger
                value="internal"
                className="py-2.5 px-4 rounded-none lab-tab lab-tab-internal"
              >
                <Users className="h-4 w-4 mr-2" />
                Internal Patient Visits
              </TabsTrigger>
              <TabsTrigger
                value="external"
                className="py-2.5 px-4 rounded-none lab-tab lab-tab-external"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                External Patient Visits
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="py-2.5 px-4 rounded-none lab-tab lab-tab-reports"
              >
                <FileText className="h-4 w-4 mr-2" />
                Reports
              </TabsTrigger>
              <TabsTrigger
                value="prices"
                className="py-2.5 px-4 rounded-none lab-tab lab-tab-prices"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Test Prices
              </TabsTrigger>
              <TabsTrigger
                value="new"
                className="py-2.5 px-4 rounded-none lab-tab lab-tab-new"
              >
                <ClipboardList className="h-4 w-4 mr-2" />
                New Lab Request
              </TabsTrigger>
              <TabsTrigger
                value="walkin"
                className="py-2.5 px-4 rounded-none lab-tab lab-tab-walkin"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Walk-In Patients
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            <TabsContent value="requests" className="m-0">
              <LabRequests branch={selectedBranch} />
            </TabsContent>

            <TabsContent value="internal" className="m-0">
              <InternalLabVisits branch={selectedBranch} />
            </TabsContent>

            <TabsContent value="external" className="m-0">
              <ExternalLabVisits branch={selectedBranch} />
            </TabsContent>

            <TabsContent value="reports" className="m-0">
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
            </TabsContent>

            <TabsContent value="prices" className="m-0">
              <LabTestPrices />
            </TabsContent>

            <TabsContent value="new" className="m-0">
              <NewLabRequest branch={selectedBranch} />
            </TabsContent>

            <TabsContent value="walkin" className="m-0">
              <WalkInPatients branch={selectedBranch} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </LabProvider>
  );
};

export default LabModule;
