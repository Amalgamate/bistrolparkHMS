import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useEnhancedNavigation } from '../hooks/useEnhancedNavigation';
import {
  User, Phone, Mail, MapPin, Calendar, FileText, CreditCard,
  Clock, Heart, Activity, AlertCircle, Edit, Printer, Download,
  Share2, ArrowLeft, Shield, Users, Stethoscope, Pill, TestTube,
  Eye, EyeOff, DollarSign, Receipt, Building, Smartphone, Plus, UserPlus
} from 'lucide-react';
import { NotificationProvider } from '../context/NotificationContext';
import apiClient from '../services/apiClient';
import { format, parseISO } from 'date-fns';
import PatientRegistrationFlow from '../components/financial/PatientRegistrationFlow';
import HMRDemo from '../components/HMRDemo';

interface PatientDetails {
  id: string;
  mrn: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  phone: string;
  email?: string;
  address: string;
  insurance_id?: string;
  id_number?: string;
  allergies?: string;
  created_at: string;
  // Additional computed fields
  age: number;
  full_name: string;
  insurance_provider?: string;
}

const PatientDetailsView: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { navigate, goBack } = useEnhancedNavigation();

  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);

  // Financial data states
  const [billingSummary, setBillingSummary] = useState<any>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [insuranceClaims, setInsuranceClaims] = useState<any[]>([]);
  const [financialLoading, setFinancialLoading] = useState(false);

  // Medical data states
  const [visitHistory, setVisitHistory] = useState<any[]>([]);
  const [vitalsHistory, setVitalsHistory] = useState<any[]>([]);
  const [labResults, setLabResults] = useState<any[]>([]);
  const [medicalLoading, setMedicalLoading] = useState(false);

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

  // Fetch financial data
  const fetchFinancialData = async () => {
    if (!patientId) return;

    try {
      setFinancialLoading(true);
      console.log('🔍 Fetching financial data for patient ID:', patientId);

      // Fetch billing summary
      const summaryResponse = await apiClient.getPatientBillingSummary(patientId);
      console.log('💰 Billing summary response:', summaryResponse.data);
      if (summaryResponse.data?.success) {
        setBillingSummary(summaryResponse.data.data);
      } else {
        console.warn('❌ No billing summary data found');
      }

      // Fetch recent invoices
      const invoicesResponse = await apiClient.getPatientInvoices(patientId, { limit: 10 });
      console.log('📄 Invoices response:', invoicesResponse.data);
      if (invoicesResponse.data?.success) {
        setInvoices(invoicesResponse.data.data.invoices || []);
      }

      // Fetch recent payments
      const paymentsResponse = await apiClient.getPatientPayments(patientId, { limit: 10 });
      console.log('💳 Payments response:', paymentsResponse.data);
      if (paymentsResponse.data?.success) {
        setPayments(paymentsResponse.data.data.payments || []);
      }

      // Fetch insurance claims
      const claimsResponse = await apiClient.getPatientInsuranceClaims(patientId, { limit: 10 });
      console.log('🏥 Insurance claims response:', claimsResponse.data);
      if (claimsResponse.data?.success) {
        setInsuranceClaims(claimsResponse.data.data.claims || []);
      }
    } catch (err: any) {
      console.error('❌ Error fetching financial data:', err);
      console.error('Error details:', err.response?.data);
      // Don't set error state for financial data, just log it
    } finally {
      setFinancialLoading(false);
    }
  };

  // Fetch medical data (visits, vitals, lab results)
  const fetchMedicalData = async () => {
    if (!patientId) return;

    try {
      setMedicalLoading(true);
      console.log('🏥 Fetching medical data for patient ID:', patientId);

      // Fetch visit history
      try {
        const visitsResponse = await apiClient.get(`/patients/${patientId}/visits`);
        console.log('📋 Visit history response:', visitsResponse.data);
        if (visitsResponse.data?.success) {
          setVisitHistory(visitsResponse.data.data || []);
        }
      } catch (err) {
        console.warn('⚠️ Visit history not available:', err);
        setVisitHistory([]);
      }

      // Fetch vitals history
      try {
        const vitalsResponse = await apiClient.get(`/patients/${patientId}/vitals`);
        console.log('💓 Vitals history response:', vitalsResponse.data);
        if (vitalsResponse.data?.success) {
          setVitalsHistory(vitalsResponse.data.data || []);
        }
      } catch (err) {
        console.warn('⚠️ Vitals history not available:', err);
        setVitalsHistory([]);
      }

      // Fetch lab results
      try {
        const labResponse = await apiClient.get(`/patients/${patientId}/lab-results`);
        console.log('🧪 Lab results response:', labResponse.data);
        if (labResponse.data?.success) {
          setLabResults(labResponse.data.data || []);
        }
      } catch (err) {
        console.warn('⚠️ Lab results not available:', err);
        setLabResults([]);
      }
    } catch (err: any) {
      console.error('❌ Error fetching medical data:', err);
    } finally {
      setMedicalLoading(false);
    }
  };

  // Fetch patient details
  useEffect(() => {
    const fetchPatientDetails = async () => {
      if (!patientId) {
        setError('Patient ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await apiClient.getPatientById(patientId);

        if (response.data) {
          const patientData = response.data;

          // Transform and enrich the data
          const transformedPatient: PatientDetails = {
            ...patientData,
            age: calculateAge(patientData.date_of_birth),
            full_name: `${patientData.first_name} ${patientData.middle_name || ''} ${patientData.last_name}`.trim(),
            gender: patientData.gender === '0' ? 'Male' : patientData.gender === '1' ? 'Female' : patientData.gender,
            insurance_provider: patientData.insurance_id ? 'NHIF' : null
          };

          setPatient(transformedPatient);
        } else {
          setError('Patient not found');
        }
      } catch (err: any) {
        console.error('Error fetching patient details:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch patient details');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientDetails();
  }, [patientId]);

  // Fetch financial data when billing tab is accessed
  useEffect(() => {
    if (activeTab === 'billing' && patientId && !billingSummary) {
      fetchFinancialData();
    }
  }, [activeTab, patientId, billingSummary]);

  // Fetch medical data when medical tabs are accessed
  useEffect(() => {
    if ((activeTab === 'medical' || activeTab === 'visits') && patientId && visitHistory.length === 0) {
      fetchMedicalData();
    }
  }, [activeTab, patientId, visitHistory]);

  const handleBack = () => {
    navigate('/patients');
  };

  const handleEdit = () => {
    navigate(`/patients/edit/${patient?.id}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Generate and download patient details as PDF
    if (!patient) return;

    const printContent = document.getElementById('patient-details-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Patient Details - ${patient.full_name}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .section { margin-bottom: 20px; }
                .label { font-weight: bold; }
                .value { margin-left: 10px; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1>Bristol Park Hospital</h1>
                <h2>Patient Details Report</h2>
                <p>Generated on ${format(new Date(), 'MMMM dd, yyyy')}</p>
              </div>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleScheduleAppointment = () => {
    // Navigate to appointment scheduling with patient pre-selected
    navigate(`/appointments/new?patientId=${patient?.id}&patientName=${encodeURIComponent(patient?.full_name || '')}`);
  };

  if (loading) {
    return (
      <NotificationProvider>
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Loading patient details...</span>
          </div>
        </div>
      </NotificationProvider>
    );
  }

  if (error) {
    return (
      <NotificationProvider>
        <div className="container mx-auto px-4 py-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error Loading Patient</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
                <button
                  onClick={handleBack}
                  className="mt-2 text-sm text-red-800 underline hover:text-red-900"
                >
                  Back to Patient List
                </button>
              </div>
            </div>
          </div>
        </div>
      </NotificationProvider>
    );
  }

  if (!patient) {
    return (
      <NotificationProvider>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-300 mb-2 mx-auto" />
            <p className="text-gray-500 mb-4">Patient not found</p>
            <button
              onClick={handleBack}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Back to Patient List
            </button>
          </div>
        </div>
      </NotificationProvider>
    );
  }

  return (
    <NotificationProvider>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <button
              onClick={handleBack}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{patient.full_name}</h1>
              <p className="text-sm text-gray-600">
                Patient ID: {patient.mrn || patient.id} • {patient.gender}, {patient.age} years old
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleScheduleAppointment}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Appointment
            </button>
            <button
              onClick={handleEdit}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </button>
            <button
              onClick={handlePrint}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </button>
            <button
              onClick={handleExport}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: User },
              { id: 'registration-flow', label: 'New Visit', icon: UserPlus },
              { id: 'medical', label: 'Medical History', icon: Stethoscope },
              { id: 'visits', label: 'Visit History', icon: Clock },
              { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
              { id: 'documents', label: 'Documents', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div id="patient-details-content">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-blue-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.full_name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.gender}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {patient.date_of_birth ? format(parseISO(patient.date_of_birth), 'MMMM dd, yyyy') : 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Age</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.age} years</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">National ID</label>
                    <div className="flex items-center">
                      <p className="mt-1 text-sm text-gray-900">
                        {showSensitiveInfo ? (patient.id_number || 'Not provided') : '••••••••'}
                      </p>
                      <button
                        onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        {showSensitiveInfo ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Patient MRN</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.mrn || 'Not assigned'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-green-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.email || 'Not provided'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-600" />
                  Medical Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Allergies</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {patient.allergies || 'No known allergies'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Blood Type</label>
                    <p className="mt-1 text-sm text-gray-900">Not available</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Insurance Information */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-600" />
                  Insurance Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Provider</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.insurance_provider || 'Not insured'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Insurance ID</label>
                    <p className="mt-1 text-sm text-gray-900">{patient.insurance_id || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    New Consultation
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center">
                    <TestTube className="w-4 h-4 mr-2" />
                    Order Lab Tests
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center">
                    <Pill className="w-4 h-4 mr-2" />
                    Prescribe Medication
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </button>
                </div>
              </div>

              {/* Registration Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Registration Info</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Registered On</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {patient.created_at ? format(parseISO(patient.created_at), 'MMMM dd, yyyy') : 'Not available'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Registration Flow Tab */}
        {activeTab === 'registration-flow' && (
          <PatientRegistrationFlow
            patientId={Number(patientId)}
            onComplete={(result) => {
              console.log('Registration completed:', result);
              // Refresh financial data
              fetchFinancialData();
              // Switch to billing tab to see results
              setActiveTab('billing');
            }}
          />
        )}

        {/* Medical History Tab */}
        {activeTab === 'medical' && (
          <div className="space-y-6">
            {/* Allergies & Medical Conditions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                Allergies & Medical Conditions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Known Allergies</h4>
                  <div className="space-y-2">
                    {patient.allergies ? (
                      <div className="bg-red-50 border border-red-200 rounded-md p-3">
                        <p className="text-sm text-red-800">{patient.allergies}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No known allergies</p>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Chronic Conditions</h4>
                  <p className="text-sm text-gray-500">No chronic conditions recorded</p>
                </div>
              </div>
            </div>

            {/* Vital Signs History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Recent Vital Signs
              </h3>
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mb-2 mx-auto" />
                <p className="text-gray-500">No vital signs recorded</p>
                <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm">
                  Record Vital Signs
                </button>
              </div>
            </div>

            {/* Medications */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Pill className="w-5 h-5 mr-2 text-green-600" />
                Current Medications
              </h3>
              <div className="text-center py-8">
                <Pill className="w-12 h-12 text-gray-300 mb-2 mx-auto" />
                <p className="text-gray-500">No current medications</p>
                <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm">
                  Prescribe Medication
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Visit History Tab */}
        {activeTab === 'visits' && (
          <div className="space-y-6">
            {medicalLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading medical data...</span>
              </div>
            )}

            {/* Recent Visits */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Visit History
              </h3>
              {visitHistory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Doctor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Diagnosis
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {visitHistory.map((visit, index) => (
                        <tr key={visit.id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {visit.visit_date ? format(new Date(visit.visit_date), 'MMM dd, yyyy') : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {visit.visit_type || 'Consultation'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {visit.doctor_name || 'Dr. Unknown'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {visit.diagnosis || 'Pending'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              visit.status === 'completed' ? 'bg-green-100 text-green-800' :
                              visit.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {visit.status || 'completed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mb-2 mx-auto" />
                  <p className="text-gray-500">No visit history available</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Visit records will appear here once the patient has consultations
                  </p>
                </div>
              )}
            </div>

            {/* Latest Vitals */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-red-600" />
                Latest Vital Signs
              </h3>
              {vitalsHistory.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {vitalsHistory.slice(0, 1).map((vitals, index) => (
                    <div key={index} className="space-y-4">
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <p className="text-sm text-red-600 font-medium">Blood Pressure</p>
                        <p className="text-xl font-bold text-red-900">
                          {vitals.systolic || 'N/A'}/{vitals.diastolic || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">mmHg</p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-600 font-medium">Heart Rate</p>
                        <p className="text-xl font-bold text-blue-900">
                          {vitals.heart_rate || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">bpm</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <p className="text-sm text-green-600 font-medium">Temperature</p>
                        <p className="text-xl font-bold text-green-900">
                          {vitals.temperature || 'N/A'}°C
                        </p>
                        <p className="text-xs text-gray-500">Celsius</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <p className="text-sm text-purple-600 font-medium">Weight</p>
                        <p className="text-xl font-bold text-purple-900">
                          {vitals.weight || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">kg</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-300 mb-2 mx-auto" />
                  <p className="text-gray-500">No vital signs recorded</p>
                  <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm">
                    Record Vital Signs
                  </button>
                </div>
              )}
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-green-600" />
                Upcoming Appointments
              </h3>
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mb-2 mx-auto" />
                <p className="text-gray-500">No upcoming appointments</p>
                <button
                  onClick={handleScheduleAppointment}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Schedule Appointment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Billing & Payments Tab */}
        {activeTab === 'billing' && (
          <div className="space-y-6">
            {financialLoading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading financial data...</span>
              </div>
            )}

            {/* Enhanced Payment Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Financial Summary
                </h3>
                <button
                  onClick={() => setActiveTab('registration-flow')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Visit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-600 font-medium">Total Billed</p>
                  <p className="text-2xl font-bold text-blue-900">
                    KES {billingSummary?.summary?.total_billed ? Number(billingSummary.summary.total_billed).toLocaleString() : '0'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {billingSummary?.summary?.total_invoices || 0} invoices
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-green-600 font-medium">Total Paid</p>
                  <p className="text-2xl font-bold text-green-900">
                    KES {billingSummary?.summary?.total_paid ? Number(billingSummary.summary.total_paid).toLocaleString() : '0'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {billingSummary?.summary?.total_billed ?
                      ((Number(billingSummary.summary.total_paid) / Number(billingSummary.summary.total_billed)) * 100).toFixed(1) : 0}% collected
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <p className="text-sm text-orange-600 font-medium">Outstanding</p>
                  <p className="text-2xl font-bold text-orange-900">
                    KES {billingSummary?.summary?.total_outstanding ? Number(billingSummary.summary.total_outstanding).toLocaleString() : '0'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {billingSummary?.summary?.overdue_invoices || 0} overdue
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <p className="text-sm text-purple-600 font-medium">Insurance Coverage</p>
                  <p className="text-2xl font-bold text-purple-900">
                    KES {billingSummary?.summary?.insurance_coverage ? Number(billingSummary.summary.insurance_coverage).toLocaleString() : '0'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {patient?.insurance_id ? 'Verified' : 'No insurance'}
                  </p>
                </div>
              </div>

              {/* Financial Health Indicator */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${
                      (Number(billingSummary?.summary?.total_outstanding) || 0) === 0 ? 'bg-green-500' :
                      (Number(billingSummary?.summary?.total_outstanding) || 0) < 5000 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">
                      Financial Status: {
                        (Number(billingSummary?.summary?.total_outstanding) || 0) === 0 ? 'Good Standing' :
                        (Number(billingSummary?.summary?.total_outstanding) || 0) < 5000 ? 'Minor Outstanding' : 'Attention Required'
                      }
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Credit Limit: KES 10,000
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Invoices */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Receipt className="w-5 h-5 mr-2 text-blue-600" />
                Recent Invoices
              </h3>
              {invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Invoice #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {invoice.invoice_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(invoice.invoice_date), 'MMM dd, yyyy')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            KES {Number(invoice.total_amount).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                              invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              invoice.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                              invoice.payment_status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {invoice.payment_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Receipt className="w-12 h-12 text-gray-300 mb-2 mx-auto" />
                  <p className="text-gray-500">No invoices found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Invoices will appear here after consultations and services
                  </p>
                  <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                    Create Invoice
                  </button>
                </div>
              )}
            </div>

            {/* Payment History */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                Payment History
              </h3>
              {payments.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reference
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Method
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {payment.payment_reference}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {format(new Date(payment.payment_date), 'MMM dd, yyyy')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            KES {Number(payment.amount).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              {payment.payment_method === 'mpesa' && <Smartphone className="w-4 h-4 mr-1 text-green-600" />}
                              {payment.payment_method === 'card' && <CreditCard className="w-4 h-4 mr-1 text-blue-600" />}
                              {payment.payment_method === 'cash' && <DollarSign className="w-4 h-4 mr-1 text-gray-600" />}
                              {payment.payment_method}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-300 mb-2 mx-auto" />
                  <p className="text-gray-500">No payment history</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Payment records will appear here after transactions
                  </p>
                  <div className="mt-4 flex justify-center space-x-2">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm flex items-center">
                      <Smartphone className="w-4 h-4 mr-2" />
                      M-Pesa Payment
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm flex items-center">
                      <CreditCard className="w-4 h-4 mr-2" />
                      Card Payment
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Insurance Claims */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-purple-600" />
                Insurance Claims
              </h3>
              {insuranceClaims.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Claim #
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Provider
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Claim Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Approved
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {insuranceClaims.map((claim) => (
                        <tr key={claim.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {claim.claim_number}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {claim.insurance_provider}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            KES {Number(claim.claim_amount).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            KES {claim.approved_amount ? Number(claim.approved_amount).toLocaleString() : '0'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              claim.claim_status === 'approved' ? 'bg-green-100 text-green-800' :
                              claim.claim_status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                              claim.claim_status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {claim.claim_status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gray-300 mb-2 mx-auto" />
                  <p className="text-gray-500">No insurance claims</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Insurance claims and approvals will appear here
                  </p>
                  {patient?.insurance_id && (
                    <button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm">
                      Submit Insurance Claim
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-6">
            {/* Medical Records */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-purple-600" />
                Medical Records & Documents
              </h3>
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mb-2 mx-auto" />
                <p className="text-gray-500">No documents uploaded</p>
                <p className="text-sm text-gray-400 mt-1">
                  Medical records, lab results, and other documents will appear here
                </p>
                <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm">
                  Upload Document
                </button>
              </div>
            </div>

            {/* Lab Results */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TestTube className="w-5 h-5 mr-2 text-orange-600" />
                Lab Results
              </h3>
              {labResults.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Test Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Result
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reference Range
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {labResults.map((result, index) => (
                        <tr key={result.id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {result.test_date ? format(new Date(result.test_date), 'MMM dd, yyyy') : 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {result.test_name || 'Unknown Test'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {result.result_value || 'Pending'} {result.unit || ''}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {result.reference_range || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              result.status === 'normal' ? 'bg-green-100 text-green-800' :
                              result.status === 'abnormal' ? 'bg-red-100 text-red-800' :
                              result.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {result.status || 'completed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TestTube className="w-12 h-12 text-gray-300 mb-2 mx-auto" />
                  <p className="text-gray-500">No lab results available</p>
                  <button className="mt-2 text-blue-600 hover:text-blue-800 text-sm">
                    Order Lab Tests
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        </div>

        {/* HMR Demo Component */}
        <HMRDemo />
      </div>
    </NotificationProvider>
  );
};

export default PatientDetailsView;
