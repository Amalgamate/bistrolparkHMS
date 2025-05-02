import React, { useState } from 'react';
import {
  User, Phone, Mail, MapPin, Calendar, Clock, Heart,
  Activity, AlertCircle, FileText, Edit, Printer,
  Download, Share2, ChevronRight, Plus, X, Thermometer,
  Scale, Ruler
} from 'lucide-react';
import { usePatient } from '../../context/PatientContext';
import { useToast } from '../../context/ToastContext';
import { VitalsForm } from './VitalsForm';
import { VitalsHistory } from './VitalsHistory';
import '../../styles/theme.css';

// Mock data for visits, lab results, and prescriptions
const MOCK_VISITS = [
  {
    id: 101,
    date: '2023-11-05',
    type: 'Regular Checkup',
    doctor: 'Dr. Sarah Johnson',
    department: 'General Medicine',
    diagnosis: 'Routine examination, no significant findings',
    notes: 'Patient reports feeling well. Blood pressure slightly elevated at 135/85. Recommended lifestyle modifications and follow-up in 3 months.'
  },
  {
    id: 102,
    date: '2023-09-18',
    type: 'Sick Visit',
    doctor: 'Dr. Michael Chen',
    department: 'Pulmonology',
    diagnosis: 'Acute bronchitis',
    notes: 'Patient presented with cough, chest congestion, and low-grade fever. Prescribed antibiotics and cough suppressant. Advised rest and increased fluid intake.'
  },
  {
    id: 103,
    date: '2023-07-22',
    type: 'Specialist Consultation',
    doctor: 'Dr. Emily Rodriguez',
    department: 'Cardiology',
    diagnosis: 'Essential hypertension',
    notes: 'Referred by PCP for hypertension management. Adjusted medication dosage and recommended DASH diet. Scheduled follow-up in 2 months.'
  }
];

const MOCK_LAB_RESULTS = [
  {
    id: 201,
    date: '2023-11-05',
    name: 'Complete Blood Count (CBC)',
    status: 'Completed',
    result: 'Normal',
    notes: 'All values within normal range'
  },
  {
    id: 202,
    date: '2023-11-05',
    name: 'Lipid Panel',
    status: 'Completed',
    result: 'Abnormal',
    notes: 'LDL cholesterol elevated at 145 mg/dL (reference range: <100 mg/dL)'
  },
  {
    id: 203,
    date: '2023-09-18',
    name: 'Chest X-ray',
    status: 'Completed',
    result: 'Abnormal',
    notes: 'Findings consistent with acute bronchitis. No evidence of pneumonia.'
  }
];

const MOCK_PRESCRIPTIONS = [
  {
    id: 301,
    date: '2023-11-05',
    medication: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    duration: '90 days',
    prescribedBy: 'Dr. Sarah Johnson',
    refills: 3
  },
  {
    id: 302,
    date: '2023-09-18',
    medication: 'Azithromycin',
    dosage: '500mg',
    frequency: 'Once daily',
    duration: '5 days',
    prescribedBy: 'Dr. Michael Chen',
    refills: 0
  },
  {
    id: 303,
    date: '2023-09-18',
    medication: 'Benzonatate',
    dosage: '200mg',
    frequency: 'Three times daily',
    duration: '7 days',
    prescribedBy: 'Dr. Michael Chen',
    refills: 0
  }
];

interface PatientDetailsProps {
  patientId: number;
  onClose: () => void;
  onEdit: (patientId: number) => void;
  onStartConsultation?: (patientId: number) => void;
  onAdmitPatient?: (patientId: number) => void;
}

export const PatientDetails: React.FC<PatientDetailsProps> = ({
  patientId,
  onClose,
  onEdit,
  onStartConsultation,
  onAdmitPatient
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showVitalsForm, setShowVitalsForm] = useState(false);
  const { getPatient } = usePatient();
  const { showToast } = useToast();
  const patient = getPatient(patientId);

  // If patient not found, show error
  if (!patient) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-primary mb-2">Patient Not Found</h2>
        <p className="text-muted mb-4">The patient you are looking for does not exist or has been removed.</p>
        <button
          onClick={onClose}
          className="btn btn-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Add mock data to the patient for the UI
  const patientWithMockData = {
    ...patient,
    visits: MOCK_VISITS,
    labResults: MOCK_LAB_RESULTS,
    prescriptions: MOCK_PRESCRIPTIONS
  };

  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* Patient Header */}
      <div className="bg-primary text-white p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center">
            <div className="avatar avatar-lg bg-accent text-primary font-bold flex items-center justify-center mr-4">
              {patientWithMockData.firstName.charAt(0)}{patientWithMockData.lastName.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-semibold">{patientWithMockData.firstName} {patientWithMockData.lastName}</h2>
              <div className="flex items-center mt-1 text-gray-200">
                <User className="w-4 h-4 mr-1" />
                <span>{patientWithMockData.gender}, {calculateAge(patientWithMockData.dateOfBirth)} years</span>
                <span className="mx-2">•</span>
                <Phone className="w-4 h-4 mr-1" />
                <span>{patientWithMockData.phone}</span>
              </div>
              <div className="flex items-center mt-1 text-gray-200">
                <Mail className="w-4 h-4 mr-1" />
                <span>{patientWithMockData.email}</span>
                <span className="mx-2">•</span>
                <Heart className="w-4 h-4 mr-1" />
                <span>Blood Type: {patientWithMockData.bloodGroup || 'Unknown'}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="btn btn-sm bg-accent text-primary"
              onClick={() => onEdit(patientWithMockData.id)}
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>
            <button
              className="btn-icon btn-sm bg-secondary text-primary"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-700">
          <div className="flex items-center">
            <span className={`rounded-full w-2 h-2 mr-2 ${patientWithMockData.status === 'Active' ? 'bg-success' : 'bg-warning'}`}></span>
            <span>{patientWithMockData.status} Patient</span>
          </div>

          <div className="flex gap-3">
            <button className="btn btn-sm bg-secondary text-primary">
              <Printer className="w-4 h-4 mr-1" />
              Print
            </button>
            <button className="btn btn-sm bg-secondary text-primary">
              <Download className="w-4 h-4 mr-1" />
              Export
            </button>
            <button className="btn btn-sm bg-secondary text-primary">
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs p-4 border-b overflow-x-auto">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <User className="w-4 h-4 mr-2" />
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'vitals' ? 'active' : ''}`}
          onClick={() => setActiveTab('vitals')}
        >
          <Thermometer className="w-4 h-4 mr-2" />
          Vitals
        </button>
        <button
          className={`tab ${activeTab === 'visits' ? 'active' : ''}`}
          onClick={() => setActiveTab('visits')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Visits
        </button>
        <button
          className={`tab ${activeTab === 'lab' ? 'active' : ''}`}
          onClick={() => setActiveTab('lab')}
        >
          <Activity className="w-4 h-4 mr-2" />
          Lab Results
        </button>
        <button
          className={`tab ${activeTab === 'prescriptions' ? 'active' : ''}`}
          onClick={() => setActiveTab('prescriptions')}
        >
          <FileText className="w-4 h-4 mr-2" />
          Prescriptions
        </button>
        <button
          className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          <FileText className="w-4 h-4 mr-2" />
          Documents
        </button>
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-gray-50 border-b">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-sm p-4 mb-4 border-l-4 border-blue-500">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <Thermometer className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">Vitals Capture Required</h3>
                <p className="text-sm text-gray-600">
                  Capture patient vitals before proceeding to consultation or admission.
                  This includes temperature, blood pressure, weight, and other vital signs.
                </p>
              </div>
              <button
                className="btn btn-primary"
                onClick={() => setShowVitalsForm(true)}
              >
                <Thermometer className="w-4 h-4 mr-2" />
                Capture Vitals
              </button>
            </div>
          </div>

          <div className="flex justify-center gap-4 w-full">
            {onStartConsultation && (
              <button
                className="btn btn-accent"
                onClick={() => {
                  if (!patient.vitals || patient.vitals.length === 0) {
                    showToast('warning', 'Please capture vitals before starting consultation');
                    setShowVitalsForm(true);
                  } else {
                    onStartConsultation(patientId);
                  }
                }}
              >
                <FileText className="w-4 h-4 mr-2" />
                Start Consultation
              </button>
            )}
            {onAdmitPatient && (
              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (!patient.vitals || patient.vitals.length === 0) {
                    showToast('warning', 'Please capture vitals before admitting patient');
                    setShowVitalsForm(true);
                  } else {
                    onAdmitPatient(patientId);
                  }
                }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Admit Patient
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Vitals Form Modal */}
        {showVitalsForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-md shadow-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
              <VitalsForm
                patientId={patientId}
                onClose={() => setShowVitalsForm(false)}
                onSave={() => {
                  setShowVitalsForm(false);
                  showToast('success', 'Vitals recorded successfully');
                  setActiveTab('vitals');
                }}
              />
            </div>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">Personal Information</h3>
                <button
                  className="btn-icon btn-sm bg-secondary"
                  onClick={() => onEdit(patient.id)}
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="card-body space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted">Full Name</p>
                    <p className="font-medium">{patientWithMockData.firstName} {patientWithMockData.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Date of Birth</p>
                    <p className="font-medium">{formatDate(patientWithMockData.dateOfBirth)} ({calculateAge(patientWithMockData.dateOfBirth)} years)</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Gender</p>
                    <p className="font-medium">{patientWithMockData.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Marital Status</p>
                    <p className="font-medium">{patientWithMockData.maritalStatus || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Phone</p>
                    <p className="font-medium">{patientWithMockData.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted">Email</p>
                    <p className="font-medium">{patientWithMockData.email}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted">Address</p>
                  <p className="font-medium">{patientWithMockData.address}</p>
                  <p className="font-medium">{patientWithMockData.city}, {patientWithMockData.state} {patientWithMockData.zipCode}</p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">Medical Information</h3>
                <button
                  className="btn-icon btn-sm bg-secondary"
                  onClick={() => onEdit(patient.id)}
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="card-body space-y-4">
                <div>
                  <p className="text-sm text-muted">Blood Group</p>
                  <p className="font-medium">{patientWithMockData.bloodGroup || 'Unknown'}</p>
                </div>

                <div>
                  <p className="text-sm text-muted">Allergies</p>
                  <p className="font-medium">{patientWithMockData.allergies || 'None reported'}</p>
                </div>

                <div>
                  <p className="text-sm text-muted">Chronic Conditions</p>
                  <p className="font-medium">{patientWithMockData.chronicConditions || 'None reported'}</p>
                </div>

                <div>
                  <p className="text-sm text-muted">Current Medications</p>
                  <p className="font-medium">{patientWithMockData.currentMedications || 'None reported'}</p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">Emergency Contact</h3>
                <button
                  className="btn-icon btn-sm bg-secondary"
                  onClick={() => onEdit(patient.id)}
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="card-body space-y-4">
                <div>
                  <p className="text-sm text-muted">Name</p>
                  <p className="font-medium">{patientWithMockData.emergencyContact?.name || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-sm text-muted">Relationship</p>
                  <p className="font-medium">{patientWithMockData.emergencyContact?.relationship || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-sm text-muted">Phone</p>
                  <p className="font-medium">{patientWithMockData.emergencyContact?.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div className="card">
              <div className="card-header flex items-center justify-between">
                <h3 className="text-lg font-semibold text-primary">Insurance Information</h3>
                <button
                  className="btn-icon btn-sm bg-secondary"
                  onClick={() => onEdit(patient.id)}
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="card-body space-y-4">
                <div>
                  <p className="text-sm text-muted">Provider</p>
                  <p className="font-medium">{patientWithMockData.insurance?.provider || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-sm text-muted">Policy Number</p>
                  <p className="font-medium">{patientWithMockData.insurance?.policyNumber || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-sm text-muted">Group Number</p>
                  <p className="font-medium">{patientWithMockData.insurance?.groupNumber || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-sm text-muted">Policy Holder</p>
                  <p className="font-medium">{patientWithMockData.insurance?.holderName || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vitals Tab */}
        {activeTab === 'vitals' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-primary">Patient Vitals</h3>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowVitalsForm(true)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Record New Vitals
              </button>
            </div>

            {patient.vitals && patient.vitals.length > 0 ? (
              <VitalsHistory vitals={patient.vitals} />
            ) : (
              <div className="bg-gray-50 p-6 text-center rounded-md">
                <Thermometer className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No vitals recorded</h3>
                <p className="text-gray-500 mb-4">This patient doesn't have any vitals records yet.</p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowVitalsForm(true)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Record Vitals
                </button>
              </div>
            )}
          </div>
        )}

        {/* Visits Tab */}
        {activeTab === 'visits' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-primary">Visit History</h3>
              <button className="btn btn-primary btn-sm">
                <Plus className="w-4 h-4 mr-1" />
                New Visit
              </button>
            </div>

            <div className="space-y-4">
              {patientWithMockData.visits.map(visit => (
                <div key={visit.id} className="card">
                  <div className="card-header flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-accent" />
                      <h4 className="font-semibold">{visit.type}</h4>
                    </div>
                    <div className="text-sm text-muted">{formatDate(visit.date)}</div>
                  </div>
                  <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted">Doctor</p>
                        <p className="font-medium">{visit.doctor}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted">Department</p>
                        <p className="font-medium">{visit.department}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted">Diagnosis</p>
                        <p className="font-medium">{visit.diagnosis}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted">Notes</p>
                      <p>{visit.notes}</p>
                    </div>
                  </div>
                  <div className="card-footer flex justify-end">
                    <button className="btn btn-sm btn-outline">
                      View Details
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lab Results Tab */}
        {activeTab === 'lab' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-primary">Laboratory Results</h3>
              <button className="btn btn-primary btn-sm">
                <Plus className="w-4 h-4 mr-1" />
                New Lab Order
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Test Name</th>
                    <th>Status</th>
                    <th>Result</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patientWithMockData.labResults.map(lab => (
                    <tr key={lab.id}>
                      <td>{formatDate(lab.date)}</td>
                      <td>{lab.name}</td>
                      <td>
                        <span className={`badge ${lab.status === 'Completed' ? 'badge-success' : 'badge-warning'}`}>
                          {lab.status}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${lab.result === 'Normal' ? 'badge-success' : 'badge-warning'}`}>
                          {lab.result}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button className="btn btn-sm btn-outline">
                            View
                          </button>
                          <button className="btn btn-sm btn-secondary">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Prescriptions Tab */}
        {activeTab === 'prescriptions' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-primary">Prescriptions</h3>
              <button className="btn btn-primary btn-sm">
                <Plus className="w-4 h-4 mr-1" />
                New Prescription
              </button>
            </div>

            <div className="space-y-4">
              {patientWithMockData.prescriptions.map(prescription => (
                <div key={prescription.id} className="card">
                  <div className="card-header flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-accent" />
                      <h4 className="font-semibold">{prescription.medication}</h4>
                    </div>
                    <div className="text-sm text-muted">Prescribed: {formatDate(prescription.date)}</div>
                  </div>
                  <div className="card-body">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted">Dosage</p>
                        <p className="font-medium">{prescription.dosage}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted">Frequency</p>
                        <p className="font-medium">{prescription.frequency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted">Duration</p>
                        <p className="font-medium">{prescription.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted">Prescribed By</p>
                        <p className="font-medium">{prescription.prescribedBy}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted">Refills</p>
                        <p className="font-medium">{prescription.refills}</p>
                      </div>
                    </div>
                  </div>
                  <div className="card-footer flex justify-end gap-2">
                    <button className="btn btn-sm btn-outline">
                      <Printer className="w-4 h-4 mr-1" />
                      Print
                    </button>
                    <button className="btn btn-sm btn-primary">
                      <Plus className="w-4 h-4 mr-1" />
                      Refill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-primary">Patient Documents</h3>
              <button className="btn btn-primary btn-sm">
                <Plus className="w-4 h-4 mr-1" />
                Upload Document
              </button>
            </div>

            <div className="text-center py-8">
              <div className="text-lg font-medium text-muted mb-2">No documents found</div>
              <p className="text-muted">Upload patient documents such as consent forms, ID proofs, or medical records</p>
              <button className="btn btn-primary mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Upload New Document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
