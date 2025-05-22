import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import {
  Users,
  UserCheck,
  UserMinus,
  FileText,
  UserCog,
  Bed,
  DollarSign,
  Search,
  Filter,
  X,
  Loader
} from 'lucide-react';
import { ToastProvider } from '../../context/ToastContext';
import { NotificationProvider } from '../../context/NotificationContext';
import AdmittedPatientsList from '../../components/admissions/AdmittedPatientsList';
import DischargedPatientsList from '../../components/admissions/DischargedPatientsList';
import BedManagement from '../../components/admissions/BedManagement';
import AdmissionForm from '../../components/admissions/AdmissionForm';
import DischargeForm from '../../components/admissions/DischargeForm';
import AdmissionsReportView from '../../components/admissions/reports/AdmissionsReportView';
import FacilityManagement from '../../components/admissions/settings/FacilityManagement';
import AdmissionsHeader from '../../components/admissions/AdmissionsHeader';
import AdmissionsModuleMenu from '../../components/admissions/AdmissionsModuleMenu';

import StandardSearchBar from '../../components/layout/StandardSearchBar';
import { AdmissionProvider, useAdmission } from '../../context/AdmissionContext';
import '../../styles/theme.css';

// Create a wrapper component that uses the AdmissionContext
const AdmissionsContent: React.FC = () => {
  const {
    admittedPatients,
    dischargedPatients,
    rooms,
    loading,
    error,
    addAdmission,
    dischargePatient
  } = useAdmission();

  const [activeTab, setActiveTab] = useState('admission-register');
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [showDischargeForm, setShowDischargeForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAdmittedPatients, setFilteredAdmittedPatients] = useState(admittedPatients);
  const [filteredDischargedPatients, setFilteredDischargedPatients] = useState(dischargedPatients);
  const [patientStatusFilter, setPatientStatusFilter] = useState('admitted');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');

  // Update filtered patients when admittedPatients or dischargedPatients change
  useEffect(() => {
    if (searchQuery) {
      filterPatients(searchQuery);
    } else {
      setFilteredAdmittedPatients(admittedPatients);
      setFilteredDischargedPatients(dischargedPatients);
    }
  }, [admittedPatients, dischargedPatients]);

  // Filter patients based on search query
  const filterPatients = (query: string) => {
    const lowerCaseQuery = query.toLowerCase();

    setFilteredAdmittedPatients(
      admittedPatients.filter(patient =>
        patient.patientName.toLowerCase().includes(lowerCaseQuery) ||
        patient.patientId.toLowerCase().includes(lowerCaseQuery) ||
        patient.diagnosis.toLowerCase().includes(lowerCaseQuery)
      )
    );

    setFilteredDischargedPatients(
      dischargedPatients.filter(patient =>
        patient.patientName.toLowerCase().includes(lowerCaseQuery) ||
        patient.patientId.toLowerCase().includes(lowerCaseQuery) ||
        patient.diagnosis.toLowerCase().includes(lowerCaseQuery)
      )
    );
  };

  // Update filtered patients when search query changes
  useEffect(() => {
    if (searchQuery) {
      filterPatients(searchQuery);
    } else {
      setFilteredAdmittedPatients(admittedPatients);
      setFilteredDischargedPatients(dischargedPatients);
    }
  }, [searchQuery]);

  const handleAdmitPatient = () => {
    setShowAdmissionForm(true);
    setSelectedPatient(null);
  };

  const handleDischargePatient = (patient: any) => {
    setSelectedPatient(patient);
    setShowDischargeForm(true);
  };

  const handleViewPatient = (patient: any) => {
    // Navigate to patient details
    console.log('View patient:', patient);
    // In a real app, you would navigate to the patient details page
  };

  const handleSaveAdmission = async (admissionData: any) => {
    try {
      console.log('Saving admission data:', admissionData);
      const result = await addAdmission(admissionData);
      if (result) {
        console.log('Admission saved successfully:', result);
      } else {
        console.error('Failed to save admission');
      }
      setShowAdmissionForm(false);
    } catch (error) {
      console.error('Error saving admission:', error);
    }
  };

  const handleSaveDischarge = async (dischargeData: any) => {
    try {
      if (!selectedPatient) {
        console.error('No patient selected for discharge');
        return;
      }

      console.log('Saving discharge data:', dischargeData);
      const result = await dischargePatient(selectedPatient.id, dischargeData);
      if (result) {
        console.log('Patient discharged successfully:', result);
      } else {
        console.error('Failed to discharge patient');
      }
      setShowDischargeForm(false);
    } catch (error) {
      console.error('Error discharging patient:', error);
    }
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting in ${format} format`);
    // In a real app, you would generate and download the export file
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = async () => {
    // Refresh data by forcing a re-fetch
    console.log('Refreshing data');

    // We can't directly refresh the data since it's managed by the context
    // But we can simulate a refresh by re-filtering the current data
    if (searchQuery) {
      filterPatients(searchQuery);
    } else {
      setFilteredAdmittedPatients(admittedPatients);
      setFilteredDischargedPatients(dischargedPatients);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    // Filter patients based on the search query
    if (query.trim() === '') {
      setFilteredAdmittedPatients(admittedPatients);
      setFilteredDischargedPatients(dischargedPatients);
    } else {
      filterPatients(query);
    }
  };

  const handleSelectReport = (reportType: string) => {
    setSelectedReport(reportType);
    setActiveTab('reports');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <Loader className="h-12 w-12 animate-spin text-blue-600 mb-4" />
        <h3 className="text-lg font-medium mb-2">Loading Admissions Data</h3>
        <p className="text-sm text-gray-500">Please wait while we fetch the latest information...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          <p className="font-medium">Error loading data</p>
          <p className="text-sm">{error}</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  // Define filter options for the search bar
  const filterOptions = [
    {
      id: 'patientStatus',
      label: 'Status',
      options: [
        { value: 'all', label: 'All' },
        { value: 'admitted', label: 'Admitted' },
        { value: 'discharged', label: 'Discharged' }
      ]
    },
    {
      id: 'paymentStatus',
      label: 'Payment Status',
      options: [
        { value: 'all', label: 'All Payments' },
        { value: 'paid', label: 'Paid' },
        { value: 'unpaid', label: 'Unpaid' }
      ]
    },
    {
      id: 'dateRange',
      label: 'Last Visit Date Range',
      type: 'date-range'
    }
  ];

  // Handle filter changes
  const handleFilterChange = (filters: Record<string, any>) => {
    console.log('Filters applied:', filters);

    // Update patient status filter
    if (filters.patientStatus) {
      setPatientStatusFilter(filters.patientStatus);
    }

    // Update payment status filter
    if (filters.paymentStatus) {
      setPaymentStatusFilter(filters.paymentStatus);
    }

    // Handle date range filtering if needed
    // This would be implemented based on your data structure
  };

  // Define badges for the header
  const badges = [
    { text: 'SHA Integrated', color: 'blue' },
    { text: 'KES Currency', color: 'green' }
  ];

  // Create search component for the header
  const searchComponent = (
    <StandardSearchBar
      title="Admissions Management"
      description="Manage patient admissions, discharges, and bed allocation"
      badges={badges}
      placeholder="Search patients by name, ID, or diagnosis..."
      value={searchQuery}
      onChange={handleSearch}
      showFilterButton={true}
      showAddButton={true}
      showExportButton={true}
      onFilter={handleFilterChange}
      onAdd={handleAdmitPatient}
      onExport={() => handleExport('pdf')}
      filterOptions={filterOptions}
    />
  );

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Page Header */}
      <div className="mb-4">
        {searchComponent}
      </div>



      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Module Menu */}
          <div className="md:w-64 flex-shrink-0">
            <AdmissionsModuleMenu
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="admission-register" className="space-y-4">

                {(() => {
                  // Determine which patients to show based on status filter
                  let patientsToShow = [];

                  if (patientStatusFilter === 'all') {
                    // Show both admitted and discharged patients
                    patientsToShow = [...filteredAdmittedPatients, ...filteredDischargedPatients];

                    // Apply payment filter
                    patientsToShow = patientsToShow.filter(patient =>
                      paymentStatusFilter === 'all' ? true :
                      paymentStatusFilter === 'paid' ? patient.billPaid :
                      !patient.billPaid
                    );

                    // Render combined list
                    return (
                      <div className="space-y-8">
                        <div>
                          <h3 className="text-lg font-medium mb-4 flex items-center">
                            <UserCheck className="mr-2 h-5 w-5 text-blue-600" />
                            Admitted Patients ({filteredAdmittedPatients.length})
                          </h3>
                          <AdmittedPatientsList
                            patients={filteredAdmittedPatients.filter(patient =>
                              paymentStatusFilter === 'all' ? true :
                              paymentStatusFilter === 'paid' ? patient.billPaid :
                              !patient.billPaid
                            )}
                            onDischarge={handleDischargePatient}
                            onView={handleViewPatient}
                          />
                        </div>

                        <div>
                          <h3 className="text-lg font-medium mb-4 flex items-center">
                            <UserMinus className="mr-2 h-5 w-5 text-blue-600" />
                            Discharged Patients ({filteredDischargedPatients.length})
                          </h3>
                          <DischargedPatientsList
                            patients={filteredDischargedPatients.filter(patient =>
                              paymentStatusFilter === 'all' ? true :
                              paymentStatusFilter === 'paid' ? patient.billPaid :
                              !patient.billPaid
                            )}
                            onView={handleViewPatient}
                          />
                        </div>
                      </div>
                    );
                  } else if (patientStatusFilter === 'discharged') {
                    // Show only discharged patients
                    return (
                      <DischargedPatientsList
                        patients={filteredDischargedPatients.filter(patient =>
                          paymentStatusFilter === 'all' ? true :
                          paymentStatusFilter === 'paid' ? patient.billPaid :
                          !patient.billPaid
                        )}
                        onView={handleViewPatient}
                      />
                    );
                  } else {
                    // Show only admitted patients (default)
                    return (
                      <AdmittedPatientsList
                        patients={filteredAdmittedPatients.filter(patient =>
                          paymentStatusFilter === 'all' ? true :
                          paymentStatusFilter === 'paid' ? patient.billPaid :
                          !patient.billPaid
                        )}
                        onDischarge={handleDischargePatient}
                        onView={handleViewPatient}
                      />
                    );
                  }
                })()}
          </TabsContent>

          <TabsContent value="bed-management" className="space-y-4">
            <BedManagement
              rooms={rooms}
              onAdmitPatient={handleAdmitPatient}
            />
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Admission Reports</h2>

              <div className="flex items-center gap-2">
                <Select
                  value={selectedReport || ""}
                  onValueChange={(value) => {
                    if (value) handleSelectReport(value);
                  }}
                >
                  <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select a report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="discharge-report">
                      <div className="flex items-center">
                        <UserMinus className="h-4 w-4 mr-2 text-blue-600" />
                        <span>Discharged Patients Report</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="admissions-report">
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-blue-600" />
                        <span>Admissions Report</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="doctor-admissions-report">
                      <div className="flex items-center">
                        <UserCog className="h-4 w-4 mr-2 text-blue-600" />
                        <span>Admissions By Doctor Report</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="current-admissions-report">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-blue-600" />
                        <span>Currently Admitted Patients Report</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="balances-report">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-blue-600" />
                        <span>Admitted Patients Balances Report</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="unoccupied-beds-report">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-2 text-blue-600" />
                        <span>Unoccupied Beds Report</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                {selectedReport && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedReport('')}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {!selectedReport ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <FileText className="h-12 w-12 mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No Report Selected</h3>
                <p className="text-sm text-center max-w-md">
                  Please select a report type from the dropdown above to view detailed admission reports.
                </p>
              </div>
            ) : (
              <AdmissionsReportView reportType={selectedReport} />
            )}
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <FacilityManagement onClose={() => setActiveTab('admission-register')} />
          </TabsContent>
        </Tabs>
          </div>
        </div>
      </div>

      {/* Admission Form Modal */}
      {showAdmissionForm && (
        <AdmissionForm
          isOpen={showAdmissionForm}
          onClose={() => setShowAdmissionForm(false)}
          onSave={handleSaveAdmission}
          patient={selectedPatient}
        />
      )}

      {/* Discharge Form Modal */}
      {showDischargeForm && (
        <DischargeForm
          isOpen={showDischargeForm}
          onClose={() => setShowDischargeForm(false)}
          onSave={handleSaveDischarge}
          patient={selectedPatient}
        />
      )}
    </div>
  );
};

// Main module component that wraps the content with providers
const AdmissionsModule: React.FC = () => {
  return (
    <AdmissionProvider>
      <NotificationProvider>
        <ToastProvider>
          <AdmissionsContent />
        </ToastProvider>
      </NotificationProvider>
    </AdmissionProvider>
  );
};

export default AdmissionsModule;
