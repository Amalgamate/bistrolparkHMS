import React, { useState } from 'react';
import { Calendar, Printer, FileText, Download, Filter, Search, Plus, RefreshCw } from 'lucide-react';
import PatientAppointmentButton from './PatientAppointmentButton';
import { useNotification } from '../../context/NotificationContext';

interface PatientModuleControlsProps {
  onSearch?: (query: string) => void;
  onFilter?: () => void;
  onExport?: (type: 'pdf' | 'excel') => void;
  onPrint?: () => void;
  onRefresh?: () => void;
  onAddPatient?: () => void;
  selectedPatient?: { id: string; name: string } | null;
}

const PatientModuleControls: React.FC<PatientModuleControlsProps> = ({
  onSearch,
  onFilter,
  onExport,
  onPrint,
  onRefresh,
  onAddPatient,
  selectedPatient
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { showNotification } = useNotification();
  const [showExportOptions, setShowExportOptions] = useState(false);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleExport = (type: 'pdf' | 'excel') => {
    if (onExport) {
      onExport(type);
    } else {
      // Fallback if no handler is provided
      showNotification(
        'info',
        `Export to ${type.toUpperCase()}`,
        `Exporting patient data to ${type.toUpperCase()} format...`
      );
      
      // Simulate export process
      setTimeout(() => {
        showNotification(
          'success',
          'Export Complete',
          `Patient data has been exported to ${type.toUpperCase()} format.`
        );
      }, 1500);
    }
    
    setShowExportOptions(false);
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      // Fallback if no handler is provided
      showNotification(
        'info',
        'Print Patient List',
        'Preparing patient list for printing...'
      );
      
      // Simulate print process
      setTimeout(() => {
        window.print();
        showNotification(
          'success',
          'Print Ready',
          'Patient list has been sent to the printer.'
        );
      }, 1000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search patients..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center justify-center"
          >
            <Search size={18} className="mr-1" />
            Search
          </button>
          
          {onFilter && (
            <button
              onClick={onFilter}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center justify-center"
            >
              <Filter size={18} className="mr-1" />
              Filters
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 justify-end">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center justify-center"
              title="Refresh patient list"
            >
              <RefreshCw size={18} />
            </button>
          )}
          
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center justify-center"
            title="Print patient list"
          >
            <Printer size={18} className="mr-1" />
            Print
          </button>
          
          <div className="relative">
            <button
              onClick={() => setShowExportOptions(!showExportOptions)}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center justify-center"
              title="Export patient data"
            >
              <Download size={18} className="mr-1" />
              Export
            </button>
            
            {showExportOptions && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleExport('pdf')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FileText size={16} className="inline mr-2" />
                    Export as PDF
                  </button>
                  <button
                    onClick={() => handleExport('excel')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <FileText size={16} className="inline mr-2" />
                    Export as Excel
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {onAddPatient && (
            <button
              onClick={onAddPatient}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center"
            >
              <Plus size={18} className="mr-1" />
              New Patient
            </button>
          )}
          
          {selectedPatient && (
            <PatientAppointmentButton
              patient={selectedPatient}
              variant="outline"
              size="md"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientModuleControls;
