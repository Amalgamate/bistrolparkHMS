import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { DB_USERS, TEST_PATIENT, TEST_VITALS, TEST_LAB_TESTS } from '../utils/testHelpers';
import { useAuth } from '../context/AuthContext';
import { useClinical } from '../context/ClinicalContext';
import { usePatient } from '../context/PatientContext';
import { useLab } from '../context/LabContext';
import { useToast } from '../context/ToastContext';

const TestPatientFlow: React.FC = () => {
  const { user } = useAuth();
  const { registerPatient, updatePatientStatus, recordVitals, orderLabTests } = useClinical();
  const { patients, addPatient } = usePatient();
  const { labRequests, collectSample, startProcessing, addTestResults } = useLab();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState('overview');
  const [testPatientId, setTestPatientId] = useState<string | null>(null);
  const [queueId, setQueueId] = useState<string | null>(null);

  // Initialize test patient
  const handleCreateTestPatient = () => {
    // Check if we already have a test patient
    const existingPatient = patients.find(p =>
      p.firstName === TEST_PATIENT.firstName &&
      p.lastName === TEST_PATIENT.lastName
    );

    if (existingPatient) {
      setTestPatientId(existingPatient.id.toString());
      showToast('info', 'Test patient already exists', `Patient ID: ${existingPatient.id}`);
      return;
    }

    // Add test patient
    const newPatient = addPatient({
      ...TEST_PATIENT,
      id: Math.floor(Math.random() * 1000) + 1000
    });

    setTestPatientId(newPatient.id.toString());
    showToast('success', 'Test patient created', `Patient ID: ${newPatient.id}`);
  };

  // Register patient in queue
  const handleRegisterInQueue = () => {
    if (!testPatientId) {
      showToast('error', 'No test patient', 'Create a test patient first');
      return;
    }

    const patient = patients.find(p => p.id.toString() === testPatientId);
    if (!patient) {
      showToast('error', 'Patient not found', 'The test patient could not be found');
      return;
    }

    const queueEntry = registerPatient(
      testPatientId,
      `${patient.firstName} ${patient.lastName}`,
      'normal'
    );

    setQueueId(queueEntry.id);
    showToast('success', 'Patient registered in queue', `Token: ${queueEntry.tokenNumber}`);
  };

  // Update patient status to waiting for vitals
  const handleWaitingForVitals = () => {
    if (!queueId) {
      showToast('error', 'No queue entry', 'Register the patient in the queue first');
      return;
    }

    updatePatientStatus(queueId, 'waiting_vitals');
    showToast('success', 'Patient status updated', 'Now waiting for vitals');
  };

  // Record vitals
  const handleRecordVitals = () => {
    if (!queueId) {
      showToast('error', 'No queue entry', 'Register the patient in the queue first');
      return;
    }

    recordVitals(queueId, TEST_VITALS);
    showToast('success', 'Vitals recorded', 'Patient is now ready for doctor');
  };

  // Order lab tests
  const handleOrderLabTests = () => {
    if (!queueId) {
      showToast('error', 'No queue entry', 'Register the patient in the queue first');
      return;
    }

    orderLabTests(queueId, TEST_LAB_TESTS);
    showToast('success', 'Lab tests ordered', 'Patient is now waiting for lab tests');
  };

  // Get current user role
  const getCurrentUserRole = () => {
    if (!user) return 'Not logged in';

    const roleMap: Record<string, string> = {
      'front-office': 'Front Office',
      'nurse': 'Nurse',
      'doctor': 'Doctor',
      'lab-technician': 'Lab Technician',
      'supa-admin': 'Super Admin',
      'admin': 'Admin'
    };

    return roleMap[user.role] || user.role;
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test Patient Flow</h1>
          <p className="text-gray-500">Test the complete patient journey through the system</p>
        </div>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md">
          Logged in as: <span className="font-bold">{getCurrentUserRole()}</span>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="front-office">Front Office</TabsTrigger>
          <TabsTrigger value="nurse">Nurse</TabsTrigger>
          <TabsTrigger value="doctor">Doctor</TabsTrigger>
          <TabsTrigger value="lab">Lab Technician</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Test Patient Flow</CardTitle>
              <CardDescription>
                This page helps you test the complete patient flow through the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  To test the patient flow, you need to open 4 different browsers or incognito windows
                  and log in as different users:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Admin:</strong> {DB_USERS.ADMIN.email} (Database user)
                  </li>
                  <li>
                    <strong>Doctor:</strong> {DB_USERS.DOCTOR.email} (Database user)
                  </li>
                  <li>
                    <strong>Test:</strong> {DB_USERS.TEST.email} (Database user)
                  </li>
                </ul>

                <p>
                  Each tab on this page provides actions for the corresponding role.
                  Follow the steps in order to test the complete patient flow.
                </p>

                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <p className="text-yellow-700">
                    <strong>Note:</strong> This is a testing tool and should only be used in development.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="front-office">
          <Card>
            <CardHeader>
              <CardTitle>Front Office Actions</CardTitle>
              <CardDescription>
                Register patients and manage the initial queue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={handleCreateTestPatient}>
                    1. Create Test Patient
                  </Button>
                  <Button onClick={handleRegisterInQueue} disabled={!testPatientId}>
                    2. Register in Queue
                  </Button>
                </div>

                <div className="bg-blue-50 p-4 rounded-md">
                  <p className="text-sm text-blue-700">
                    After registering the patient, go to the Clinical/Nursing module to see the patient in the queue.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nurse">
          <Card>
            <CardHeader>
              <CardTitle>Nurse Actions</CardTitle>
              <CardDescription>
                Take vitals and update patient status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Button onClick={handleWaitingForVitals} disabled={!queueId}>
                    1. Update to Waiting for Vitals
                  </Button>
                  <Button onClick={handleRecordVitals} disabled={!queueId}>
                    2. Record Vitals
                  </Button>
                </div>

                <div className="bg-pink-50 p-4 rounded-md">
                  <p className="text-sm text-pink-700">
                    After recording vitals, the patient will move to the "Up Next" queue for doctors.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctor">
          <Card>
            <CardHeader>
              <CardTitle>Doctor Actions</CardTitle>
              <CardDescription>
                Perform consultation and order lab tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <Button onClick={handleOrderLabTests} disabled={!queueId}>
                    Order Lab Tests
                  </Button>
                </div>

                <div className="bg-green-50 p-4 rounded-md">
                  <p className="text-sm text-green-700">
                    After ordering lab tests, the patient will move to the lab queue.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lab">
          <Card>
            <CardHeader>
              <CardTitle>Lab Technician Actions</CardTitle>
              <CardDescription>
                Process lab tests and update results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Go to the Lab Module to see the lab requests and process them:
                </p>

                <ol className="list-decimal pl-6 space-y-2">
                  <li>View lab requests</li>
                  <li>Collect sample</li>
                  <li>Start processing</li>
                  <li>Enter test results</li>
                </ol>

                <div className="bg-purple-50 p-4 rounded-md">
                  <p className="text-sm text-purple-700">
                    After completing the lab tests, the results will be available for the doctor to review.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TestPatientFlow;
