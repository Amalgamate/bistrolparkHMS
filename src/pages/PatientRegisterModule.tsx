import React, { useState, useEffect } from 'react';
import PatientModuleControls from '../components/patients/PatientModuleControls';
import { NotificationProvider } from '../context/NotificationContext';
import PatientListAdapter from '../components/patients/PatientListAdapter';
import apiClient from '../services/apiClient';

import { generatePatientListPDF } from '../utils/pdfUtils';
import { format } from 'date-fns';

// Patient Register - Real patient data from database
const PatientRegisterModule: React.FC = () => {

  // Existing state
  const [selectedPatient, setSelectedPatient] = useState<{ id: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Selection state
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // State for patients data from API with pagination
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const limit = 50; // Number of patients per page

  // Search and sorting state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('patient_id');
  const [sortOrder, setSortOrder] = useState('DESC');

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return Math.max(0, age);
  };

  // Fetch patients from API with pagination and search
  const fetchPatients = async (page = 1, append = false) => {
    try {
      if (!append) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError(null);

      const response = await apiClient.getPatients({
        page,
        limit,
        search: debouncedSearchTerm,
        sortBy,
        sortOrder
      });

      // Validate API response format - must have paginated structure
      if (!response.data || !response.data.data || !Array.isArray(response.data.data)) {
        setError('Invalid data format received from server. Expected paginated response.');
        return;
      }

      const patientsData = response.data.data;
      const paginationInfo = response.data.pagination;

      if (!paginationInfo) {
        setError('Missing pagination information from server');
        return;
      }

      // Transform API data to match the expected format
      const transformedPatients = patientsData.map((patient: any) => {
        // Build full name from components
        const fullName = patient.full_name ||
          `${patient.first_name || ''} ${patient.middle_name || ''} ${patient.last_name || ''}`.trim();

        // Calculate age from date of birth
        const age = patient.date_of_birth ? calculateAge(patient.date_of_birth) : 0;

        return {
          id: patient.id?.toString() || '',
          name: fullName || 'Unknown',
          age: age,
          gender: patient.gender || 'Unknown',
          phone: patient.phone || 'N/A',
          email: patient.email || 'N/A',
          bloodType: patient.blood_type || 'Unknown',
          lastVisit: patient.last_visit || 'Never',
          status: 'Active', // All imported patients are active
          hasUpcomingAppointment: false,
          nextAppointment: null,
          mrn: patient.mrn || patient.out_patient_file_no || 'N/A',
          address: patient.address || patient.residence || 'N/A',
          // Additional fields from real data
          firstName: patient.first_name || '',
          middleName: patient.middle_name || '',
          lastName: patient.last_name || '',
          dateOfBirth: patient.date_of_birth || '',
          insuranceId: patient.insurance_id || '',
          idNumber: patient.id_number || ''
        };
      });

      if (append) {
        setPatients(prev => [...prev, ...transformedPatients]);
      } else {
        setPatients(transformedPatients);
      }

      // Update pagination info
      setCurrentPage(paginationInfo.currentPage);
      setTotalPages(paginationInfo.totalPages);
      setTotalRecords(paginationInfo.totalRecords);
      setHasNextPage(paginationInfo.hasNextPage);

      if (transformedPatients.length === 0 && !debouncedSearchTerm) {
        setError('No patients found in the database. Please check if patient data has been imported.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch patients from database');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load and search changes
  useEffect(() => {
    setCurrentPage(1);
    fetchPatients(1, false);
  }, [debouncedSearchTerm, sortBy, sortOrder]);

  // Load more patients (infinite scroll)
  const loadMorePatients = () => {
    if (hasNextPage && !loadingMore) {
      const nextPage = currentPage + 1;
      fetchPatients(nextPage, true);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSearchTerm(query); // This will trigger the debounced search
  };

  const handleFilter = () => {
    setShowFilters(!showFilters);
  };

  const handleExport = (type: 'pdf' | 'excel') => {
    if (type === 'pdf') {
      try {
        // Determine which patients to export
        const patientsToExport = selectedPatients.length > 0
          ? patients.filter(patient => selectedPatients.includes(patient.id))
          : patients;

        if (patientsToExport.length === 0) {
          alert('No patients to export. Please select patients or ensure there are patients in the list.');
          return;
        }

        // Create a simplified array of patients with all necessary fields
        const exportPatients = patientsToExport.map(patient => {
          return {
            // Required fields with fallbacks
            id: patient.id || '',
            name: patient.name || '',
            firstName: patient.name ? patient.name.split(' ')[0] : '',
            lastName: patient.name ? patient.name.split(' ').slice(1).join(' ') : '',
            gender: patient.gender || '',
            age: patient.age || 0,
            dateOfBirth: patient.dateOfBirth || `${new Date().getFullYear() - (patient.age || 0)}-01-01`,
            phone: patient.phone || '',
            email: patient.email || '',
            status: patient.status || 'Active',
            lastVisit: patient.lastVisit || ''
          };
        });

        // Generate PDF with proper title
        const title = selectedPatients.length > 0
          ? `Selected Patients Report (${selectedPatients.length} patients)`
          : `All Patients Report (${patients.length} patients)`;

        const subtitle = `Generated on ${format(new Date(), 'MMMM dd, yyyy')}`;

        generatePatientListPDF(exportPatients, title, subtitle);

      } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
      }
    } else if (type === 'excel') {
      alert('Excel export functionality is not yet implemented.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = async () => {
    setSearchQuery('');
    setSearchTerm('');
    setSelectedPatient(null);
    setSelectedPatients([]);
    setSelectAll(false);
    setCurrentPage(1);

    // Refetch patients from API (first page)
    await fetchPatients(1, false);
  };

  const handleAddPatient = () => {
    console.log('Add new patient');
  };

  const handleViewPatient = (patient: any) => {
    window.location.href = `/patients/details/${patient.id}`;
  };

  const handleEditPatient = (patient: any) => {
    console.log('Edit patient', patient);
  };

  const handleDeletePatient = async (patient: any) => {
    if (window.confirm(`Are you sure you want to delete ${patient.name}?`)) {
      try {
        await apiClient.deletePatient(patient.id);

        // Remove patient from local state
        setPatients(prevPatients => prevPatients.filter(p => p.id !== patient.id));

        // Remove from selected patients if it was selected
        setSelectedPatients(prevSelected => prevSelected.filter(id => id !== patient.id));

        alert('Patient deleted successfully!');
      } catch (err: any) {
        alert(err.response?.data?.message || 'Failed to delete patient');
      }
    }
  };

  // Since we're using server-side search, we don't need client-side filtering
  const filteredPatients = patients;

  return (
    <NotificationProvider>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Patient Register</h1>



        {/* Enhanced Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-4">
            <div className="flex flex-col gap-4">
              {/* Search Bar Row */}
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search patients by name, ID, phone, or national ID..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    {searchQuery && (
                      <button
                        onClick={() => handleSearch('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleFilter}
                    className={`px-4 py-3 rounded-lg border transition-colors flex items-center gap-2 ${
                      showFilters
                        ? 'bg-blue-50 border-blue-200 text-blue-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                    </svg>
                    Filters
                  </button>

                  <button
                    onClick={handleRefresh}
                    className="px-4 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>

                  <button
                    onClick={handleAddPatient}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Patient
                  </button>
                </div>
              </div>

              {/* Filters Panel */}
              {showFilters && (
                <div className="border-t pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Gender Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                        <option value="">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* Age Range Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Age Range</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                        <option value="">All Ages</option>
                        <option value="0-18">0-18 years</option>
                        <option value="19-35">19-35 years</option>
                        <option value="36-50">36-50 years</option>
                        <option value="51-65">51-65 years</option>
                        <option value="65+">65+ years</option>
                      </select>
                    </div>

                    {/* Blood Group Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                        <option value="">All Blood Groups</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm">
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="admitted">Admitted</option>
                        <option value="discharged">Discharged</option>
                      </select>
                    </div>
                  </div>

                  {/* Date Range Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date From</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date To</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>

                  {/* Filter Actions */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t">
                    <button
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                      onClick={() => {
                        // Clear all filters logic here
                        console.log('Clear all filters');
                      }}
                    >
                      Clear All Filters
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowFilters(false)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        onClick={() => {
                          // Apply filters logic here
                          console.log('Apply filters');
                          setShowFilters(false);
                        }}
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Summary */}
              <div className="flex items-center justify-between text-sm text-gray-600 border-t pt-4">
                <span>
                  Total: <span className="font-semibold text-gray-900">{totalRecords.toLocaleString()}</span> patients
                  {debouncedSearchTerm && (
                    <span className="ml-2">
                      | Showing results for: "<span className="font-medium text-blue-600">{debouncedSearchTerm}</span>"
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleExport('excel')}
                    className="text-green-600 hover:text-green-700 flex items-center gap-1"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export
                  </button>
                  <button
                    onClick={handlePrint}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading patients...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Patients</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={() => fetchPatients(1, false)}
                  className="mt-2 text-sm text-red-800 underline hover:text-red-900"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Patient List */}
        {!loading && !error && (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <PatientListAdapter
                  patients={filteredPatients}
                  onView={(id) => handleViewPatient({id, name: filteredPatients.find(p => p.id === id)?.name || ''})}
                  onEdit={(id) => handleEditPatient({id, name: filteredPatients.find(p => p.id === id)?.name || ''})}
                  onDelete={(id) => handleDeletePatient({id, name: filteredPatients.find(p => p.id === id)?.name || ''})}
                />
              </div>
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="flex justify-center mt-6">
                <button
                  onClick={loadMorePatients}
                  disabled={loadingMore}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More Patients
                      <span className="text-blue-200">({totalRecords - patients.length} remaining)</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Pagination Info */}
            <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
              <span>
                Showing {patients.length} of {totalRecords.toLocaleString()} patients
              </span>
              <span>
                Page {currentPage} of {totalPages.toLocaleString()}
              </span>
            </div>
          </>
        )}
      </div>
    </NotificationProvider>
  );
};

export default PatientRegisterModule;
