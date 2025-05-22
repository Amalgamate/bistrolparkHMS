import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, User, FileText, MapPin, ArrowRight, Download, Printer } from 'lucide-react';
import apiClient from '../../services/apiClient';

interface Patient {
  id: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  visitDate?: string;
  visitTime?: string;
  purpose?: string;
  status?: string;
  location?: string;
}

export const NewPatientTracking: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch patients from API
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/patients');

        if (response.data && Array.isArray(response.data)) {
          // Format the data
          const formattedPatients = response.data.map((patient: any) => ({
            id: patient.id || patient.mrn,
            name: `${patient.first_name} ${patient.last_name}`,
            first_name: patient.first_name,
            last_name: patient.last_name,
            visitDate: new Date().toISOString().split('T')[0], // Today's date as default
            visitTime: new Date().toTimeString().split(' ')[0].substring(0, 5), // Current time as default
            purpose: 'General Checkup',
            status: 'waiting',
            location: 'Waiting Room'
          }));

          setPatients(formattedPatients);
          setFilteredPatients(formattedPatients);
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Handle search and filtering
  const handleSearch = () => {
    let results = [...patients];

    // Apply search query
    if (searchQuery) {
      results = results.filter(
        patient =>
          patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (patient.name && patient.name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      results = results.filter(patient => patient.status === filterStatus);
    }

    // Apply date filter
    if (filterDate) {
      results = results.filter(patient => patient.visitDate === filterDate);
    }

    setFilteredPatients(results);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterDate('');
    setFilteredPatients(patients);
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-[#0100F6] mb-4">Search & Filter</h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or name"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="waiting">Waiting</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="no-show">No Show</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleSearch}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#0100F6] rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0100F6]"
            >
              Apply
            </button>
            <button
              type="button"
              onClick={resetFilters}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0100F6]"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-[#0100F6]">Walk-in Patients</h3>
          <div className="flex space-x-2">
            <button
              type="button"
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0100F6] flex items-center"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0100F6] flex items-center"
            >
              <Printer className="h-4 w-4 mr-1" />
              Print
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visit Info
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purpose
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-[#0100F6]" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-500">{patient.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900 mr-3">{patient.visitDate}</span>
                      <Clock className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{patient.visitTime}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{patient.purpose}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                      {getStatusLabel(patient.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">{patient.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      type="button"
                      className="text-[#0100F6] hover:text-blue-800 mr-3"
                    >
                      View
                    </button>
                    {patient.status === 'waiting' && (
                      <button
                        type="button"
                        className="text-green-600 hover:text-green-800 flex items-center"
                      >
                        Process <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    )}
                    {patient.status === 'in-progress' && (
                      <button
                        type="button"
                        className="text-green-600 hover:text-green-800 flex items-center"
                      >
                        Complete <ArrowRight className="h-4 w-4 ml-1" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPatients.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-gray-500">No patients found matching your criteria.</p>
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredPatients.length} of {mockPatients.length} patients
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0100F6] disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button
              type="button"
              className="px-3 py-1 text-sm font-medium text-white bg-[#0100F6] rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0100F6]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getStatusColor = (status: string) => {
  switch (status) {
    case 'waiting':
      return 'bg-yellow-100 text-yellow-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'no-show':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'waiting':
      return 'Waiting';
    case 'in-progress':
      return 'In Progress';
    case 'completed':
      return 'Completed';
    case 'no-show':
      return 'No Show';
    default:
      return status;
  }
};

// End of component
