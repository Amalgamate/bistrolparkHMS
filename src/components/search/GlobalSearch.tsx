import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, User, Calendar, FileText, Activity, Pill, Stethoscope, Clipboard, DollarSign, Settings } from 'lucide-react';
import { usePatient } from '../../context/PatientContext';
import { useNavigate } from 'react-router-dom';

interface SearchResult {
  id: string;
  type: 'patient' | 'action' | 'module';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  path?: string;
  action?: () => void;
}

// Define common actions and modules
const commonActions: Omit<SearchResult, 'id'>[] = [
  {
    type: 'action',
    title: 'Register New Patient',
    subtitle: 'Add a new patient to the system',
    icon: <User className="w-5 h-5 text-blue-500" />,
    path: '/patient-module'
  },
  {
    type: 'action',
    title: 'Schedule Appointment',
    subtitle: 'Book a new appointment',
    icon: <Calendar className="w-5 h-5 text-green-500" />
  },
  {
    type: 'action',
    title: 'Create Invoice',
    subtitle: 'Generate a new invoice',
    icon: <FileText className="w-5 h-5 text-yellow-500" />
  },
  {
    type: 'action',
    title: 'Record Vitals',
    subtitle: 'Capture patient vital signs',
    icon: <Activity className="w-5 h-5 text-red-500" />
  },
  {
    type: 'action',
    title: 'Dispense Medication',
    subtitle: 'Process pharmacy request',
    icon: <Pill className="w-5 h-5 text-purple-500" />
  }
];

const commonModules: Omit<SearchResult, 'id'>[] = [
  {
    type: 'module',
    title: 'Patient Management',
    subtitle: 'Search and manage patients',
    icon: <User className="w-5 h-5 text-blue-500" />,
    path: '/patient-module'
  },
  {
    type: 'module',
    title: 'Appointments',
    subtitle: 'Manage patient appointments',
    icon: <Calendar className="w-5 h-5 text-green-500" />
  },
  {
    type: 'module',
    title: 'Laboratory',
    subtitle: 'Lab tests and results',
    icon: <Clipboard className="w-5 h-5 text-yellow-500" />
  },
  {
    type: 'module',
    title: 'Pharmacy',
    subtitle: 'Medication dispensing',
    icon: <Pill className="w-5 h-5 text-purple-500" />
  },
  {
    type: 'module',
    title: 'Billing',
    subtitle: 'Invoices and payments',
    icon: <DollarSign className="w-5 h-5 text-green-500" />
  },
  {
    type: 'module',
    title: "Doctor's Dashboard",
    subtitle: 'Clinical workspace',
    icon: <Stethoscope className="w-5 h-5 text-red-500" />
  },
  {
    type: 'module',
    title: 'Settings',
    subtitle: 'System configuration',
    icon: <Settings className="w-5 h-5 text-gray-500" />
  }
];

interface GlobalSearchProps {
  onSelect?: (result: SearchResult) => void;
  className?: string;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ onSelect, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Try to use PatientContext, but don't fail if it's not available
  let patients: any[] = [];
  try {
    const patientContext = usePatient();
    patients = patientContext?.patients || [];
  } catch (error) {
    console.log('PatientProvider not available, patient search disabled');
  }

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setShowResults(true);
      }

      // Escape to close search results
      if (e.key === 'Escape') {
        setShowResults(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Custom debounce function
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  // Debounced search function
  const performSearch = useCallback(
    debounce((term: string) => {
    setIsLoading(true);

    // Simulate network delay for AJAX-like behavior
    setTimeout(() => {
      if (!term.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      const lowerTerm = term.toLowerCase();

      // Search patients (only if patients array is available)
      const patientResults = patients.length > 0
        ? patients
            .filter(patient => {
              const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
              const idMatch = patient.id.toString().includes(lowerTerm);
              const nameMatch = fullName.includes(lowerTerm);
              const phoneMatch = patient.phone.toLowerCase().includes(lowerTerm);
              const idNumberMatch = patient.nationalId?.toLowerCase().includes(lowerTerm) || false;

              return idMatch || nameMatch || phoneMatch || idNumberMatch;
            })
            .map(patient => ({
              id: `patient-${patient.id}`,
              type: 'patient' as const,
              title: `${patient.firstName} ${patient.lastName}`,
              subtitle: `ID: ${patient.id} | ${patient.gender} | ${patient.phone}`,
              icon: <User className="w-5 h-5 text-blue-500" />,
              action: () => navigate(`/patient-module?id=${patient.id}`)
            }))
        : [];

      // Search actions
      const actionResults = commonActions
        .filter(action =>
          action.title.toLowerCase().includes(lowerTerm) ||
          action.subtitle.toLowerCase().includes(lowerTerm)
        )
        .map((action, index) => ({
          ...action,
          id: `action-${index}`
        }));

      // Search modules
      const moduleResults = commonModules
        .filter(module =>
          module.title.toLowerCase().includes(lowerTerm) ||
          module.subtitle.toLowerCase().includes(lowerTerm)
        )
        .map((module, index) => ({
          ...module,
          id: `module-${index}`
        }));

      // Combine and sort results
      const allResults = [
        ...patientResults,
        ...actionResults,
        ...moduleResults
      ];

      setResults(allResults);
      setIsLoading(false);
    }, 300); // Simulate network delay
  }, 300),
  [patients, navigate]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    performSearch(value);
  };

  // Handle result selection
  const handleResultClick = (result: SearchResult) => {
    if (onSelect) {
      onSelect(result);
    } else if (result.action) {
      result.action();
    } else if (result.path) {
      navigate(result.path);
    }

    setShowResults(false);
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowResults(true)}
          className="block w-full py-2 pl-10 pr-10 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-1 focus:ring-[#0100F6] focus:border-[#0100F6]"
          placeholder="Search patients, actions, modules..."
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {searchTerm ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setResults([]);
                inputRef.current?.focus();
              }}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="px-1.5 py-0.5 text-xs text-gray-500 bg-gray-100 border border-gray-300 rounded">⌘K</kbd>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-md shadow-lg max-h-96 overflow-y-auto border border-gray-200">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="w-5 h-5 border-2 border-t-[#0100F6] border-r-[#0100F6] border-b-[#0100F6] border-l-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-sm text-gray-500">Searching...</span>
            </div>
          ) : results.length > 0 ? (
            <div>
              {/* Group results by type */}
              {['patient', 'action', 'module'].map(type => {
                const typeResults = results.filter(r => r.type === type);
                if (typeResults.length === 0) return null;

                return (
                  <div key={type}>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 uppercase">
                      {type === 'patient' ? 'Patients' : type === 'action' ? 'Actions' : 'Modules'}
                    </div>
                    <ul>
                      {typeResults.map(result => (
                        <li key={result.id}>
                          <button
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
                            onClick={() => handleResultClick(result)}
                          >
                            <div className="flex-shrink-0 mr-3">
                              {result.icon}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{result.title}</div>
                              <div className="text-xs text-gray-500">{result.subtitle}</div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          ) : searchTerm ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No results found for "{searchTerm}"
            </div>
          ) : (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                QUICK ACTIONS
              </div>
              <ul>
                {commonActions.slice(0, 3).map((action, index) => (
                  <li key={`quick-action-${index}`}>
                    <button
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
                      onClick={() => handleResultClick({
                        ...action,
                        id: `quick-action-${index}`
                      })}
                    >
                      <div className="flex-shrink-0 mr-3">
                        {action.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{action.title}</div>
                        <div className="text-xs text-gray-500">{action.subtitle}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>

              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                COMMON MODULES
              </div>
              <ul>
                {commonModules.slice(0, 3).map((module, index) => (
                  <li key={`quick-module-${index}`}>
                    <button
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center"
                      onClick={() => handleResultClick({
                        ...module,
                        id: `quick-module-${index}`
                      })}
                    >
                      <div className="flex-shrink-0 mr-3">
                        {module.icon}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{module.title}</div>
                        <div className="text-xs text-gray-500">{module.subtitle}</div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
