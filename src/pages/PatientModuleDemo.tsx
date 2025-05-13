import React, { useState, useEffect } from 'react';
import PatientModuleControls from '../components/patients/PatientModuleControls';
import { NotificationProvider } from '../context/NotificationContext';
import PatientListAdapter from '../components/patients/PatientListAdapter';

import { generatePatientListPDF } from '../utils/pdfUtils';
import { format } from 'date-fns';

// Make sure the state is properly initialized
const PatientModuleDemo: React.FC = () => {
  // Existing state
  const [selectedPatient, setSelectedPatient] = useState<{ id: string; name: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Selection state
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Make sure patients data is available
  const [patients] = useState<any[]>([
    {
      id: 'BP10023456',
      name: 'David Kamau',
      age: 45,
      gender: 'Male',
      phone: '0712 345 678',
      email: 'david.kamau@example.com',
      bloodType: 'O+',
      lastVisit: '10 May 2024',
      hasUpcomingAppointment: true,
      nextAppointment: '15 Jun 2024'
    },
    {
      id: 'BP10023457',
      name: 'Faith Wanjiku',
      age: 32,
      gender: 'Female',
      phone: '0723 456 789',
      email: 'faith.wanjiku@example.com',
      bloodType: 'A-',
      lastVisit: '15 May 2024'
    },
    {
      id: 'BP10023458',
      name: 'Peter Omondi',
      age: 28,
      gender: 'Male',
      phone: '0734 567 890',
      email: 'peter.omondi@example.com',
      bloodType: 'B+',
      lastVisit: '20 May 2024',
      hasUpcomingAppointment: true,
      nextAppointment: '10 Jun 2024'
    },
    {
      id: 'BP10023459',
      name: 'Esther Muthoni',
      age: 35,
      gender: 'Female',
      phone: '0745 678 901',
      email: 'esther.muthoni@example.com',
      bloodType: 'AB-',
      lastVisit: '25 May 2024'
    },
    {
      id: 'BP10023460',
      name: 'John Njoroge',
      age: 52,
      gender: 'Male',
      phone: '0756 789 012',
      email: 'john.njoroge@example.com',
      bloodType: 'O-',
      lastVisit: '30 May 2024',
      hasUpcomingAppointment: true,
      nextAppointment: '20 Jun 2024'
    }
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilter = () => {
    setShowFilters(!showFilters);
  };

  // Selection tracking for debugging
  useEffect(() => {
    console.log("Selected patients:", selectedPatients);
    console.log("Select all state:", selectAll);
  }, [selectedPatients, selectAll]);

  const handleExport = (type: 'pdf' | 'excel') => {
    if (type === 'pdf') {
      try {
        console.log("Starting PDF export...");

        // Check if there are patients to export
        if (filteredPatients.length === 0) {
          console.log('No patients to export');
          alert('No patients to export. Please add patients first.');
          return;
        }

        // Determine which patients to export (selected or all if none selected)
        const patientsToExport = selectedPatients.length > 0
          ? filteredPatients.filter(patient => selectedPatients.includes(patient.id))
          : filteredPatients;

        console.log('Patients to export:', patientsToExport.length);

        // Prepare filters for the PDF
        const filters: Record<string, string> = {};

        if (searchQuery) {
          filters['Search'] = searchQuery;
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

        console.log('Prepared patients for PDF:', exportPatients);

        // Generate the PDF using our utility function
        console.log('Calling generatePatientListPDF...');
        try {
          const doc = generatePatientListPDF(exportPatients, 'Patient Register', filters);

          if (!doc) {
            console.error('PDF generation failed - no document returned');
            alert('Failed to generate PDF. Please try again.');
            return;
          }

          console.log('PDF generated successfully');

          // Save the PDF
          const filename = `bristol_park_patient_register_${format(new Date(), 'yyyy-MM-dd')}.pdf`;
          console.log('Saving PDF as:', filename);
          doc.save(filename);

          console.log('Patient register exported to PDF successfully');
          alert('Patient register exported to PDF successfully!');
        } catch (pdfError) {
          console.error('PDF generation error:', pdfError);
          alert(`Error generating PDF: ${pdfError instanceof Error ? pdfError.message : String(pdfError)}`);
        }
      } catch (error) {
        console.error('Export to PDF failed:', error);
        console.error('Error details:', error instanceof Error ? error.message : String(error));
        alert(`Failed to export to PDF: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else if (type === 'excel') {
      alert('Excel export functionality is not yet implemented.');
      console.log('Exporting to Excel - functionality to be implemented');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRefresh = () => {
    setSearchQuery('');
    setSelectedPatient(null);
  };

  const handleAddPatient = () => {
    console.log('Add new patient');
  };

  const handleViewPatient = (patient: any) => {
    window.location.href = `/patient-demo/${patient.id}`;
  };

  const handleEditPatient = (patient: any) => {
    console.log('Edit patient', patient);
  };

  const handleDeletePatient = (patient: any) => {
    if (window.confirm(`Are you sure you want to delete ${patient.name}?`)) {
      console.log('Delete patient', patient);
    }
  };

  const filteredPatients = searchQuery
    ? patients.filter(
        patient =>
          patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.phone.includes(searchQuery)
      )
    : patients;

  return (
    <NotificationProvider>
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Patient Register</h1>

        <PatientModuleControls
          onSearch={handleSearch}
          onFilter={handleFilter}
          onExport={handleExport}
          onPrint={handlePrint}
          onRefresh={handleRefresh}
          onAddPatient={handleAddPatient}
          selectedPatient={selectedPatient}
        />

        {/* Selection info */}
        <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100 flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm font-medium text-blue-700 mr-2">
              {selectedPatients.length === 0
                ? 'No patients selected'
                : selectedPatients.length === 1
                  ? '1 patient selected'
                  : `${selectedPatients.length} patients selected`}
            </span>
            {selectedPatients.length > 0 && (
              <button
                onClick={() => {
                  setSelectedPatients([]);
                  setSelectAll(false);
                }}
                className="text-xs text-blue-600 hover:text-blue-800 underline"
              >
                Clear selection
              </button>
            )}
          </div>
          <div className="flex items-center">
            {selectedPatients.length > 0 && (
              <button
                onClick={() => handleExport('pdf')}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 mr-2"
              >
                Export Selected
              </button>
            )}
          </div>
        </div>

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
      </div>
    </NotificationProvider>
  );
};

export default PatientModuleDemo;























