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
  PlusCircle,
  Search,
  Filter,
  Download,
  Printer,
  RefreshCw,
  X,
  Settings
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
import { mockAdmittedPatients, mockDischargedPatients, mockRooms } from '../../data/mockAdmissionsData';
import { AdmissionProvider } from '../../context/AdmissionContext';
import '../../styles/theme.css';

const AdmissionsModule: React.FC = () => {
  const [activeTab, setActiveTab] = useState('admission-register');
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [showDischargeForm, setShowDischargeForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAdmittedPatients, setFilteredAdmittedPatients] = useState(mockAdmittedPatients);
  const [filteredDischargedPatients, setFilteredDischargedPatients] = useState(mockDischargedPatients);
  const [patientStatusFilter, setPatientStatusFilter] = useState('admitted');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');

  // Filter patients based on search query
  useEffect(() => {
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();

      setFilteredAdmittedPatients(
        mockAdmittedPatients.filter(patient =>
          patient.patientName.toLowerCase().includes(lowerCaseQuery) ||
          patient.patientId.toLowerCase().includes(lowerCaseQuery) ||
          patient.diagnosis.toLowerCase().includes(lowerCaseQuery)
        )
      );

      setFilteredDischargedPatients(
        mockDischargedPatients.filter(patient =>
          patient.patientName.toLowerCase().includes(lowerCaseQuery) ||
          patient.patientId.toLowerCase().includes(lowerCaseQuery) ||
          patient.diagnosis.toLowerCase().includes(lowerCaseQuery)
        )
      );
    } else {
      setFilteredAdmittedPatients(mockAdmittedPatients);
      setFilteredDischargedPatients(mockDischargedPatients);
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

  const handleSaveAdmission = (admissionData: any) => {
    console.log('Admission data saved:', admissionData);
    setShowAdmissionForm(false);
    // In a real app, you would update the state with the new admission
  };

  const handleSaveDischarge = (dischargeData: any) => {
    console.log('Discharge data saved:', dischargeData);
    setShowDischargeForm(false);
    // In a real app, you would update the state with the discharge
  };

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting in ${format} format`);
    // In a real app, you would generate and download the export file
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    // In a real app, you would fetch fresh data from the server
    console.log('Refreshing data');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSelectReport = (reportType: string) => {
    setSelectedReport(reportType);
    setActiveTab('reports');
  };

  return (
    <AdmissionProvider>
      <NotificationProvider>
        <ToastProvider>
          <div className="flex flex-col h-full bg-background">
            {/* Page Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm mb-4">
              <div>
                <h2 className="text-xl font-semibold text-[#2B4F60]">Admissions Management</h2>
                <p className="text-sm text-muted">Manage patient admissions, discharges, and bed allocation</p>
                <div className="mt-1 text-xs text-gray-500 flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded mr-2">SHA Integrated</span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">KES Currency</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAdmitPatient()}
                  className="flex items-center gap-1"
                >
                  <PlusCircle size={16} />
                  New Admission
                </Button>
              </div>
            </div>

            {/* Search and Controls */}
            <div className="bg-white p-4 rounded-md shadow-sm mb-4">
              <div className="flex flex-wrap gap-3 justify-between">
                <div className="flex gap-2 flex-grow">
                  <div className="relative flex-grow max-w-md">
                    <input
                      type="text"
                      placeholder="Search patients..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-5 w-5" />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleRefresh}>
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Refresh
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Admissions Module</h2>

                <div className="flex items-center gap-2">
                  <Select
                    value={activeTab}
                    onValueChange={setActiveTab}
                  >
                    <SelectTrigger className="w-[220px]">
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admission-register">
                        <div className="flex items-center">
                          <UserCheck className="h-4 w-4 mr-2 text-blue-600" />
                          <span>Admission Register</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="bed-management">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 mr-2 text-blue-600" />
                          <span>Bed Management</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="reports">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-600" />
                          <span>Admission Reports</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="settings">
                        <div className="flex items-center">
                          <Settings className="h-4 w-4 mr-2 text-blue-600" />
                          <span>Facility Settings</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">

                <TabsContent value="admission-register" className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                    <div className="flex flex-wrap gap-3 justify-between">
                      <div className="flex gap-2">
                        <Select
                          value={patientStatusFilter}
                          onValueChange={setPatientStatusFilter}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Patient Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Patients</SelectItem>
                            <SelectItem value="admitted">Admitted Only</SelectItem>
                            <SelectItem value="discharged">Discharged Only</SelectItem>
                          </SelectContent>
                        </Select>

                        <Select
                          value={paymentStatusFilter}
                          onValueChange={setPaymentStatusFilter}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Payment Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Payments</SelectItem>
                            <SelectItem value="paid">Paid Only</SelectItem>
                            <SelectItem value="unpaid">Unpaid Only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

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
                    rooms={mockRooms}
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
        </ToastProvider>
      </NotificationProvider>
    </AdmissionProvider>
  );
};

export default AdmissionsModule;
