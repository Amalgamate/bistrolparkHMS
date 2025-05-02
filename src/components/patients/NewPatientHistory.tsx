import React, { useState } from 'react';
import { Search, User, Calendar, Clock, FileText, Activity, Pill, Clipboard, Download, Printer, ChevronDown, ChevronUp } from 'lucide-react';

export const NewPatientHistory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [expandedRecords, setExpandedRecords] = useState<string[]>([]);

  // Handle search
  const handleSearch = () => {
    // In a real application, this would be an API call
    const foundPatient = mockPatients.find(
      p => p.id === searchQuery ||
           p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (foundPatient) {
      setSelectedPatient(foundPatient);
    } else {
      setSelectedPatient(null);
      alert('Patient not found. Please check the ID or name and try again.');
    }
  };

  // Toggle record expansion
  const toggleRecord = (recordId: string) => {
    if (expandedRecords.includes(recordId)) {
      setExpandedRecords(expandedRecords.filter(id => id !== recordId));
    } else {
      setExpandedRecords([...expandedRecords, recordId]);
    }
  };

  // Check if record is expanded
  const isExpanded = (recordId: string) => {
    return expandedRecords.includes(recordId);
  };

  return (
    <div className="space-y-6">
      {/* Patient Search */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-medium text-[#0100F6] mb-4">Find Patient</h3>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by patient ID or name"
              className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
            />
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="px-4 py-2 text-sm font-medium text-white bg-[#0100F6] rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0100F6]"
          >
            Search
          </button>
        </div>
      </div>

      {/* Selected Patient Info */}
      {selectedPatient && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-8 w-8 text-[#0100F6]" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{selectedPatient.name}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="mr-3">ID: {selectedPatient.id}</span>
                    <span className="mr-3">{selectedPatient.age} years</span>
                    <span>{selectedPatient.gender}</span>
                  </div>
                </div>
              </div>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-200 pt-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Contact</p>
                <p className="text-sm">{selectedPatient.phone}</p>
                <p className="text-sm">{selectedPatient.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="text-sm">{selectedPatient.address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Medical Info</p>
                <p className="text-sm">Blood Type: {selectedPatient.bloodType}</p>
                <p className="text-sm">Allergies: {selectedPatient.allergies || 'None'}</p>
              </div>
            </div>
          </div>

          {/* Medical History Records */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-[#0100F6]">Medical History</h3>
            </div>

            <div className="divide-y divide-gray-200">
              {selectedPatient.medicalRecords.map((record) => (
                <div key={record.id} className="px-6 py-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleRecord(record.id)}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${getRecordTypeColor(record.type)}`}>
                        {getRecordTypeIcon(record.type)}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{record.title}</h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="mr-3">{record.date}</span>
                          <Clock className="h-3 w-3 mr-1" />
                          <span className="mr-3">{record.time}</span>
                          <User className="h-3 w-3 mr-1" />
                          <span>{record.doctor}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      {isExpanded(record.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded(record.id) && (
                    <div className="mt-4 pl-12 border-l-2 border-gray-200">
                      <div className="mb-3">
                        <h5 className="text-xs font-medium text-gray-500 uppercase">Description</h5>
                        <p className="text-sm text-gray-900 mt-1">{record.description}</p>
                      </div>

                      {record.diagnosis && (
                        <div className="mb-3">
                          <h5 className="text-xs font-medium text-gray-500 uppercase">Diagnosis</h5>
                          <p className="text-sm text-gray-900 mt-1">{record.diagnosis}</p>
                        </div>
                      )}

                      {record.treatment && (
                        <div className="mb-3">
                          <h5 className="text-xs font-medium text-gray-500 uppercase">Treatment</h5>
                          <p className="text-sm text-gray-900 mt-1">{record.treatment}</p>
                        </div>
                      )}

                      {record.medications && record.medications.length > 0 && (
                        <div className="mb-3">
                          <h5 className="text-xs font-medium text-gray-500 uppercase">Medications</h5>
                          <ul className="mt-1 space-y-1">
                            {record.medications.map((medication, index) => (
                              <li key={index} className="text-sm text-gray-900 flex items-center">
                                <Pill className="h-3 w-3 text-gray-400 mr-1" />
                                {medication}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {record.notes && (
                        <div className="mb-3">
                          <h5 className="text-xs font-medium text-gray-500 uppercase">Notes</h5>
                          <p className="text-sm text-gray-900 mt-1">{record.notes}</p>
                        </div>
                      )}

                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          className="px-3 py-1 text-xs font-medium text-[#0100F6] bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0100F6]"
                        >
                          View Full Record
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {selectedPatient.medicalRecords.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-gray-500">No medical records found for this patient.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No patient selected state */}
      {!selectedPatient && (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <User className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">No Patient Selected</h3>
          <p className="mt-1 text-sm text-gray-500">
            Search for a patient by ID or name to view their medical history.
          </p>
        </div>
      )}
    </div>
  );
};

// Helper functions
const getRecordTypeColor = (type: string) => {
  switch (type) {
    case 'consultation':
      return 'bg-blue-100 text-blue-600';
    case 'lab':
      return 'bg-purple-100 text-purple-600';
    case 'procedure':
      return 'bg-green-100 text-green-600';
    case 'admission':
      return 'bg-yellow-100 text-yellow-600';
    case 'emergency':
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const getRecordTypeIcon = (type: string) => {
  switch (type) {
    case 'consultation':
      return <FileText className="h-5 w-5" />;
    case 'lab':
      return <Activity className="h-5 w-5" />;
    case 'procedure':
      return <Clipboard className="h-5 w-5" />;
    case 'admission':
      return <Calendar className="h-5 w-5" />;
    case 'emergency':
      return <AlertTriangle className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

// Mock data
interface MedicalRecord {
  id: string;
  type: string;
  title: string;
  date: string;
  time: string;
  doctor: string;
  description: string;
  diagnosis?: string;
  treatment?: string;
  medications?: string[];
  notes?: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodType: string;
  allergies?: string;
  medicalRecords: MedicalRecord[];
}

const mockPatients: Patient[] = [
  {
    id: 'BP10023456',
    name: 'David Kamau',
    age: 45,
    gender: 'Male',
    phone: '0712 345 678',
    email: 'david.kamau@example.com',
    address: 'Kileleshwa Estate, Nairobi',
    bloodType: 'O+',
    allergies: 'Penicillin',
    medicalRecords: [
      {
        id: 'MR001',
        type: 'consultation',
        title: 'Annual Physical Examination',
        date: '2024-05-15',
        time: '09:30 AM',
        doctor: 'Dr. John Mwangi',
        description: 'Patient came in for annual physical examination.',
        diagnosis: 'Hypertension (mild)',
        treatment: 'Lifestyle modifications recommended. Follow-up in 3 months.',
        medications: ['Lisinopril 10mg daily'],
        notes: 'Patient advised to reduce sodium intake and increase physical activity.'
      },
      {
        id: 'MR002',
        type: 'lab',
        title: 'Blood Work Panel',
        date: '2024-05-15',
        time: '10:45 AM',
        doctor: 'Dr. Grace Akinyi',
        description: 'Complete blood count, lipid panel, and metabolic panel.',
        notes: 'Results show slightly elevated cholesterol levels. All other values within normal range.'
      },
      {
        id: 'MR003',
        type: 'consultation',
        title: 'Follow-up Appointment',
        date: '2024-02-20',
        time: '02:15 PM',
        doctor: 'Dr. John Mwangi',
        description: 'Follow-up for hypertension management.',
        diagnosis: 'Hypertension (controlled)',
        treatment: 'Continue current medication regimen.',
        medications: ['Lisinopril 10mg daily'],
        notes: 'Blood pressure readings improved. Patient reports compliance with medication and lifestyle changes.'
      }
    ]
  },
  {
    id: 'BP10023457',
    name: 'Faith Wanjiku',
    age: 32,
    gender: 'Female',
    phone: '0723 456 789',
    email: 'faith.wanjiku@example.com',
    address: 'South B Estate, Nairobi',
    bloodType: 'A-',
    medicalRecords: [
      {
        id: 'MR004',
        type: 'emergency',
        title: 'Emergency Room Visit',
        date: '2024-04-10',
        time: '11:20 PM',
        doctor: 'Dr. Daniel Otieno',
        description: 'Patient presented with severe abdominal pain.',
        diagnosis: 'Acute appendicitis',
        treatment: 'Emergency appendectomy performed.',
        medications: ['Cefazolin 1g IV', 'Morphine 4mg IV PRN for pain'],
        notes: 'Surgery successful. Patient admitted for post-operative care.'
      },
      {
        id: 'MR005',
        type: 'admission',
        title: 'Inpatient Admission',
        date: '2024-04-10',
        time: '11:55 PM',
        doctor: 'Dr. Daniel Otieno',
        description: 'Post-appendectomy admission for monitoring and recovery.',
        treatment: 'IV antibiotics, pain management, and wound care.',
        medications: ['Cefazolin 1g IV q8h', 'Hydrocodone/Acetaminophen 5/325mg PO q6h PRN for pain'],
        notes: 'Patient recovering well. Anticipated discharge in 2-3 days.'
      },
      {
        id: 'MR006',
        type: 'procedure',
        title: 'Surgical Follow-up',
        date: '2024-04-17',
        time: '10:00 AM',
        doctor: 'Dr. Samuel Kipchoge',
        description: 'Post-operative follow-up appointment.',
        treatment: 'Wound check and suture removal.',
        notes: 'Incision healing well. No signs of infection. Patient cleared to resume normal activities in 1 week.'
      }
    ]
  }
];

function AlertTriangle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
      <path d="M12 9v4"></path>
      <path d="M12 17h.01"></path>
    </svg>
  );
}
