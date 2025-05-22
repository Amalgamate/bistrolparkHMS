import React, { useState, Suspense, lazy } from 'react';
import { usePatient, PatientProvider } from '../context/PatientContext';
import { useToast, ToastProvider } from '../context/ToastContext';
import { Search, Plus, Filter, User, Phone, Calendar, Clock, FileText, MoreHorizontal, Edit, Trash2, Eye, X, Download, ChevronDown } from 'lucide-react';
import { format, isWithinInterval, parseISO } from 'date-fns';
import { jsPDF } from 'jspdf';
import { generatePatientListPDF } from '../utils/pdfUtils';
import '../styles/theme.css';

// Lazy load components for better performance
const PatientRegistration = lazy(() => import('../components/patients/EnhancedPatientRegistration'));
const PatientDetails = lazy(() => import('../components/patients/PatientDetails'));
const VirtualizedPatientList = lazy(() => import('../components/patients/VirtualizedPatientList'));

// Define filter options
type FilterStatus = 'All' | 'Active' | 'Inactive' | 'Admitted' | 'Cleared';

export const PatientRegister: React.FC = () => {
  const { patients, deletePatient } = usePatient();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');
  const [dateRangeFilter, setDateRangeFilter] = useState<{startDate: string, endDate: string} | null>(null);
  const filterRef = React.useRef<HTMLDivElement>(null);
  const exportRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdowns
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setShowExportOptions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calculate age from date of birth
  const calculateAge = React.useCallback((dateOfBirth: string) => {
    if (!dateOfBirth) {
      return 0;
    }

    try {
      const today = new Date();
      const birthDate = new Date(dateOfBirth);

      // Check if date is valid
      if (isNaN(birthDate.getTime())) {
        console.warn('Invalid date of birth:', dateOfBirth);
        return 0;
      }

      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    } catch (error) {
      console.error('Error calculating age:', error);
      return 0;
    }
  }, []);

  // Apply status filter
  const applyStatusFilter = React.useCallback((patient: any) => {
    switch (statusFilter) {
      case 'Active':
        return patient.status === 'Active';
      case 'Inactive':
        return patient.status === 'Inactive';
      case 'Admitted':
        // Assuming admitted patients have a specific property or status
        return patient.status === 'Active' && patient.isAdmitted === true;
      case 'Cleared':
        // Assuming cleared patients have a specific property or status
        return patient.status === 'Active' && patient.isCleared === true;
      case 'All':
      default:
        return true;
    }
  }, [statusFilter]);

  // Apply date range filter
  const applyDateRangeFilter = React.useCallback((patient: any) => {
    if (!dateRangeFilter) return true;

    // If patient has no lastVisit, exclude from date range filter
    if (!patient.lastVisit) return false;

    try {
      const visitDate = parseISO(patient.lastVisit);
      const startDate = parseISO(dateRangeFilter.startDate);
      const endDate = parseISO(dateRangeFilter.endDate);

      return isWithinInterval(visitDate, { start: startDate, end: endDate });
    } catch (error) {
      console.error('Date parsing error:', error);
      return false;
    }
  }, [dateRangeFilter]);

  // Filter patients based on search term, status, and date range
  const filteredPatients = React.useMemo(() => {
    console.log('Filtering patients:', patients);

    // Check if patients is an array
    if (!Array.isArray(patients)) {
      console.error('Patients is not an array:', patients);
      return [];
    }

    // Map patient properties based on API response format
    const processedPatients = patients.map(patient => {
      // Log the first patient to see its structure
      if (patients.indexOf(patient) === 0) {
        console.log('First patient structure:', patient);
      }

      // Handle different property naming conventions
      return {
        id: patient.id,
        firstName: patient.firstName || patient.first_name || '',
        lastName: patient.lastName || patient.last_name || '',
        phone: patient.phone || patient.contact_number || '',
        email: patient.email || '',
        nationalId: patient.nationalId || patient.national_id || patient.id_number || '',
        dateOfBirth: patient.dateOfBirth || patient.date_of_birth || '',
        gender: patient.gender || '',
        status: patient.status || 'Active',
        lastVisit: patient.lastVisit || patient.last_visit || '',
        bloodGroup: patient.bloodGroup || patient.blood_type || patient.blood_group || '',
        isAdmitted: patient.isAdmitted || false,
        isCleared: patient.isCleared || false,
      };
    });

    return processedPatients.filter(patient => {
      // First apply status filter
      if (!applyStatusFilter(patient)) return false;

      // Then apply date range filter
      if (!applyDateRangeFilter(patient)) return false;

      // Then apply search term filter
      if (!searchTerm) return true;

      const term = searchTerm.toLowerCase();
      const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
      const idMatch = patient.id.toString().includes(term);
      const nameMatch = fullName.includes(term);
      const phoneMatch = patient.phone && patient.phone.toLowerCase().includes(term);
      const nationalIdMatch = patient.nationalId?.toLowerCase().includes(term) || false;

      return idMatch || nameMatch || phoneMatch || nationalIdMatch;
    });
  }, [patients, searchTerm, applyStatusFilter, applyDateRangeFilter]);

  // Handle patient actions
  const handleAddPatient = React.useCallback(() => {
    setSelectedPatient(null);
    setShowRegistrationForm(true);
    setShowPatientDetails(false);
  }, []);

  const handleViewPatient = React.useCallback((patientId: number) => {
    setSelectedPatient(patientId);
    setShowPatientDetails(true);
    setShowRegistrationForm(false);
  }, []);

  const handleEditPatient = React.useCallback((patientId: number) => {
    setSelectedPatient(patientId);
    setShowRegistrationForm(true);
    setShowPatientDetails(false);
  }, []);

  const handleDeletePatient = React.useCallback((patientId: number) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      deletePatient(patientId);
      showToast('success', 'Patient deleted successfully');
    }
  }, [deletePatient, showToast]);

  const handleSavePatient = React.useCallback((patientData: any) => {
    setShowRegistrationForm(false);
    showToast('success', 'Patient saved successfully');
  }, [showToast]);

  // Export functions
  const exportToExcel = React.useCallback(() => {
    try {
      // Check if there are patients to export
      if (filteredPatients.length === 0) {
        showToast('warning', 'No patients to export');
        setShowExportOptions(false);
        return;
      }

      // Prepare data for export
      const data = filteredPatients.map(patient => ({
        'ID': patient.id,
        'First Name': patient.firstName,
        'Last Name': patient.lastName,
        'Gender': patient.gender,
        'Age': calculateAge(patient.dateOfBirth),
        'Phone': patient.phone,
        'National ID': patient.nationalId || 'N/A',
        'Blood Group': patient.bloodGroup || 'Unknown',
        'Status': patient.status,
        'Last Visit': patient.lastVisit || 'Never'
      }));

      // Convert data to CSV format
      const headers = Object.keys(data[0]).join(',');
      const csvRows = data.map(row =>
        Object.values(row).map(value =>
          typeof value === 'string' && value.includes(',') ? `"${value}"` : value
        ).join(',')
      );
      const csvContent = [headers, ...csvRows].join('\n');

      // Create a blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `patient_register_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('success', 'Patient register exported to Excel successfully');
    } catch (error) {
      console.error('Export to Excel failed:', error);
      showToast('error', 'Failed to export to Excel');
    }

    setShowExportOptions(false);
  }, [filteredPatients, calculateAge, showToast]);

  const exportToPDF = React.useCallback(() => {
    try {
      // Check if there are patients to export
      if (filteredPatients.length === 0) {
        showToast('warning', 'No patients to export');
        setShowExportOptions(false);
        return;
      }

      // Prepare filters for the PDF
      const filters: Record<string, string> = {};

      if (statusFilter !== 'All') {
        filters['Status'] = statusFilter;
      }

      if (dateRangeFilter) {
        filters['Date Range'] = `${format(parseISO(dateRangeFilter.startDate), 'MMM d, yyyy')} - ${format(parseISO(dateRangeFilter.endDate), 'MMM d, yyyy')}`;
      }

      if (searchTerm) {
        filters['Search'] = searchTerm;
      }

      // Generate the PDF using our utility function
      const doc = generatePatientListPDF(filteredPatients, 'Patient Register', filters);

      // Save the PDF
      doc.save(`bristol_park_patient_register_${format(new Date(), 'yyyy-MM-dd')}.pdf`);

      showToast('success', 'Patient register exported to PDF successfully');
    } catch (error) {
      console.error('Export to PDF failed:', error);
      showToast('error', 'Failed to export to PDF');
    }

    setShowExportOptions(false);
  }, [filteredPatients, statusFilter, dateRangeFilter, searchTerm, showToast]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto">
        {/* Page Header */}
        <div className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm mb-4">
          <div>
            <h2 className="text-xl font-semibold text-[#2B4F60]">Patients Register</h2>
            <p className="text-sm text-muted">Search, register and manage patients</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-md shadow-sm p-6">
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search patients by name, ID, phone, or national ID..."
                className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-[#F5B800] focus:border-[#F5B800] py-2.5 text-sm"
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm('')}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative" ref={filterRef}>
                <button
                  className={`btn ${showFilters ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>

                {showFilters && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="p-2 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700">Status</h3>
                    </div>
                    <div className="p-2">
                      {(['All', 'Active', 'Inactive', 'Admitted', 'Cleared'] as FilterStatus[]).map((status) => (
                        <div
                          key={status}
                          className={`px-3 py-2 text-sm rounded-md cursor-pointer ${statusFilter === status ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
                          onClick={() => {
                            setStatusFilter(status);
                          }}
                        >
                          {status}
                        </div>
                      ))}
                    </div>

                    <div className="p-2 border-t border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700">Last Visit Date Range</h3>
                    </div>
                    <div className="p-3">
                      <div className="mb-2">
                        <label className="block text-xs text-gray-500 mb-1">Start Date</label>
                        <input
                          type="date"
                          className="w-full p-1.5 text-sm border border-gray-300 rounded"
                          onChange={(e) => {
                            const startDate = e.target.value;
                            setDateRangeFilter(prev => ({
                              startDate,
                              endDate: prev?.endDate || format(new Date(), 'yyyy-MM-dd')
                            }));
                          }}
                          value={dateRangeFilter?.startDate || ''}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-xs text-gray-500 mb-1">End Date</label>
                        <input
                          type="date"
                          className="w-full p-1.5 text-sm border border-gray-300 rounded"
                          onChange={(e) => {
                            const endDate = e.target.value;
                            setDateRangeFilter(prev => ({
                              startDate: prev?.startDate || format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
                              endDate
                            }));
                          }}
                          value={dateRangeFilter?.endDate || ''}
                        />
                      </div>
                      <div className="flex justify-between mt-3">
                        <button
                          className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                          onClick={() => {
                            setDateRangeFilter(null);
                          }}
                        >
                          Clear Dates
                        </button>
                        <button
                          className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                          onClick={() => {
                            setShowFilters(false);
                          }}
                        >
                          Apply Filters
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button className="btn btn-primary" onClick={handleAddPatient}>
                <Plus className="w-4 h-4 mr-2" />
                Add Patient
              </button>

              {/* Export Button with Dropdown */}
              <div className="relative" ref={exportRef}>
                <button
                  className={`btn ${showExportOptions ? 'btn-secondary' : 'btn-outline'}`}
                  onClick={() => setShowExportOptions(!showExportOptions)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                  <ChevronDown className="w-3 h-3 ml-1" />
                </button>

                {showExportOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="p-2 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700">Export Options</h3>
                    </div>
                    <div className="p-2">
                      <div
                        className="px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 flex items-center"
                        onClick={exportToExcel}
                      >
                        <FileText className="w-4 h-4 mr-2 text-green-600" />
                        Export to Excel
                      </div>
                      <div
                        className="px-3 py-2 text-sm rounded-md cursor-pointer hover:bg-gray-100 flex items-center"
                        onClick={exportToPDF}
                      >
                        <FileText className="w-4 h-4 mr-2 text-red-600" />
                        Export to PDF
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {(statusFilter !== 'All' || dateRangeFilter) && (
            <div className="flex flex-wrap items-center mb-4 gap-2">
              <span className="text-sm text-gray-500 mr-1">Filters:</span>

              {statusFilter !== 'All' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Status: {statusFilter}
                  <button
                    className="ml-1 text-blue-500 hover:text-blue-700"
                    onClick={() => setStatusFilter('All')}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}

              {dateRangeFilter && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <Calendar className="h-3 w-3 mr-1" />
                  {format(parseISO(dateRangeFilter.startDate), 'MMM d, yyyy')} - {format(parseISO(dateRangeFilter.endDate), 'MMM d, yyyy')}
                  <button
                    className="ml-1 text-green-500 hover:text-green-700"
                    onClick={() => setDateRangeFilter(null)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Patient List */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <Suspense fallback={
              <div className="p-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2B3990] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-gray-600">Loading patients...</p>
              </div>
            }>
              <VirtualizedPatientList
                patients={filteredPatients}
                calculateAge={calculateAge}
                onView={handleViewPatient}
                onEdit={handleEditPatient}
                onDelete={handleDeletePatient}
              />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Patient Registration Modal */}
      {showRegistrationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <Suspense fallback={
              <div className="p-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2B3990] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-gray-600">Loading form...</p>
              </div>
            }>
              <PatientRegistration
                onClose={() => setShowRegistrationForm(false)}
                onSave={handleSavePatient}
              />
            </Suspense>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {showPatientDetails && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-md shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <Suspense fallback={
              <div className="p-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2B3990] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-gray-600">Loading patient details...</p>
              </div>
            }>
              <PatientDetails
                patientId={selectedPatient}
                onClose={() => setShowPatientDetails(false)}
                onEdit={handleEditPatient}
                onStartConsultation={() => {}}
                onAdmitPatient={() => {}}
              />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};



