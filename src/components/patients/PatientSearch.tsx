import React, { useState } from 'react';
import { Search, User, UserPlus, X } from 'lucide-react';
import { usePatient } from '../../context/PatientContext';
import { useToast } from '../../context/ToastContext';

interface PatientSearchProps {
  onPatientSelect: (patientId: number) => void;
  onAddNewPatient: () => void;
}

export const PatientSearch: React.FC<PatientSearchProps> = ({
  onPatientSelect,
  onAddNewPatient
}) => {
  const { patients } = usePatient();
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchBy, setSearchBy] = useState<'name' | 'id' | 'phone' | 'nationalId'>('name');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      showToast('warning', 'Please enter a search term');
      return;
    }

    // Show loading state
    setShowResults(true);
    setSearchResults([]);
    setIsLoading(true);

    // Simulate AJAX-like delay
    setTimeout(() => {
      let results = [];
      const term = searchTerm.toLowerCase().trim();

      switch (searchBy) {
        case 'name':
          results = patients.filter(patient => {
            const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
            return fullName.includes(term);
          });
          break;
        case 'id':
          results = patients.filter(patient =>
            patient.id.toString().includes(term)
          );
          break;
        case 'phone':
          results = patients.filter(patient =>
            patient.phone.replace(/\D/g, '').includes(term.replace(/\D/g, ''))
          );
          break;
        case 'nationalId':
          results = patients.filter(patient =>
            patient.nationalId?.toLowerCase().includes(term)
          );
          break;
      }

      setSearchResults(results);

      if (results.length === 0) {
        showToast('info', 'No patients found. You can register a new patient.');
      } else {
        showToast('success', `Found ${results.length} patient${results.length === 1 ? '' : 's'}`);
      }

      setIsLoading(false);
    }, 500); // Simulate network delay
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="bg-white rounded-md shadow-sm p-6">
      <h2 className="text-xl font-semibold text-[#2B4F60] mb-4">Patient Search</h2>

      <div className="flex flex-col space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="mb-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Search By</h3>
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setSearchBy('name')}
                className={`px-4 py-2 text-sm font-medium ${
                  searchBy === 'name'
                    ? 'bg-[#F5B800] text-black font-semibold border-[#F5B800]'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                } border rounded-l-lg focus:z-10 focus:ring-2 focus:ring-[#F5B800] focus:outline-none`}
              >
                Name
              </button>
              <button
                type="button"
                onClick={() => setSearchBy('id')}
                className={`px-4 py-2 text-sm font-medium ${
                  searchBy === 'id'
                    ? 'bg-[#F5B800] text-black font-semibold border-[#F5B800]'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                } border-t border-b border-r focus:z-10 focus:ring-2 focus:ring-[#F5B800] focus:outline-none`}
              >
                Hospital ID
              </button>
              <button
                type="button"
                onClick={() => setSearchBy('nationalId')}
                className={`px-4 py-2 text-sm font-medium ${
                  searchBy === 'nationalId'
                    ? 'bg-[#F5B800] text-black font-semibold border-[#F5B800]'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                } border-t border-b border-r focus:z-10 focus:ring-2 focus:ring-[#F5B800] focus:outline-none`}
              >
                National ID/Passport
              </button>
              <button
                type="button"
                onClick={() => setSearchBy('phone')}
                className={`px-4 py-2 text-sm font-medium ${
                  searchBy === 'phone'
                    ? 'bg-[#F5B800] text-black font-semibold border-[#F5B800]'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                } border-t border-b border-r rounded-r-lg focus:z-10 focus:ring-2 focus:ring-[#F5B800] focus:outline-none`}
              >
                Phone Number
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search by ${searchBy === 'name' ? 'patient name' :
                  searchBy === 'id' ? 'hospital ID' :
                  searchBy === 'nationalId' ? 'national ID/passport' : 'phone number'}`}
                className="pl-10 block w-full rounded-md border border-gray-300 shadow-sm focus:ring-[#F5B800] focus:border-[#F5B800] py-2.5 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
              {searchTerm && (
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={handleSearch}
              className="px-5 py-2.5 bg-[#0100F6] text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-[#F5B800] focus:ring-offset-2 font-medium"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {showResults && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Search Results ({searchResults.length})
            </h3>
            <button
              type="button"
              onClick={clearSearch}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear Results
            </button>
          </div>

          {isLoading ? (
            <div className="bg-white p-8 text-center rounded-lg border border-gray-200">
              <div className="flex justify-center">
                <div className="w-10 h-10 border-4 border-t-[#0100F6] border-r-[#0100F6] border-b-[#0100F6] border-l-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="mt-4 text-sm font-medium text-gray-900">Searching for patients...</h3>
              <p className="mt-1 text-sm text-gray-500">
                This will only take a moment.
              </p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Patient
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      ID/National ID
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Contact
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {searchResults.map((patient) => (
                    <tr key={patient.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#A5C4D4] flex items-center justify-center">
                            <span className="text-[#2B4F60] font-medium">
                              {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</div>
                            <div className="text-gray-500">
                              {patient.gender}, {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div>Hospital ID: {patient.id}</div>
                        {patient.nationalId && <div>National ID: {patient.nationalId}</div>}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div>{patient.phone}</div>
                        <div>{patient.email}</div>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          type="button"
                          onClick={() => onPatientSelect(patient.id)}
                          className="text-[#0100F6] hover:text-blue-900"
                        >
                          Select<span className="sr-only">, {patient.firstName} {patient.lastName}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : searchTerm ? (
            <div className="bg-gray-50 p-6 text-center rounded-lg border border-gray-200">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No patients match your search criteria.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={onAddNewPatient}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#0100F6] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <UserPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Register New Patient
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Quick Register Button */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={onAddNewPatient}
          className="inline-flex items-center px-5 py-2.5 border border-[#F5B800] shadow-sm text-sm font-medium rounded-md text-black bg-[#F5B800] hover:bg-[#E5A800] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F5B800]"
        >
          <UserPlus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Register New Patient
        </button>
      </div>
    </div>
  );
};
