import React, { useState, Suspense, lazy } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';
import { Button } from '../ui/button';
import {
  UserPlus,
  Ticket,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { usePatient } from '../../context/PatientContext';
import { useClinical, Priority } from '../../context/ClinicalContext';
import { useToast } from '../../context/ToastContext';

// Lazy load the patient registration component from the patient module
const PatientRegistrationForm = lazy(() =>
  import('../../components/patients/EnhancedPatientRegistration')
);

interface IntegratedPatientRegistrationProps {
  onRegistrationComplete?: () => void;
}

const IntegratedPatientRegistration: React.FC<IntegratedPatientRegistrationProps> = ({
  onRegistrationComplete
}) => {
  const { registerPatient } = useClinical();
  const { showToast } = useToast();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [tokenNumber, setTokenNumber] = useState<number | null>(null);
  const [patientId, setPatientId] = useState<string>('');
  const [patientName, setPatientName] = useState<string>('');
  const [priority, setPriority] = useState<Priority>('normal');

  // Handle patient registration completion
  const handlePatientSaved = (patientData: any) => {
    try {
      // Extract patient information
      const fullName = `${patientData.firstName} ${patientData.lastName}`;
      const patientPriority = patientData.priority || 'normal';

      // Register patient in the clinical queue
      const queueEntry = registerPatient(
        patientData.id || `BP${Math.floor(10000000 + Math.random() * 90000000)}`,
        fullName,
        patientPriority as Priority
      );

      // Store patient information
      setPatientId(patientData.id);
      setPatientName(fullName);
      setPriority(patientPriority);

      // Set success state and token number
      setRegistrationSuccess(true);
      setTokenNumber(queueEntry.tokenNumber);

      // Show success message
      showToast('success', `Patient ${fullName} registered successfully and added to queue`);
    } catch (error) {
      console.error('Error registering patient in clinical queue:', error);
      showToast('error', 'Failed to add patient to clinical queue');
    }
  };

  // Reset success state
  const handleReset = () => {
    setRegistrationSuccess(false);
    setTokenNumber(null);
    setPatientId('');
    setPatientName('');
    setPriority('normal');
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Patient Registration</CardTitle>
              <CardDescription>Register new patients and add them to the clinical queue</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {registrationSuccess ? (
            <div className="text-center py-8">
              <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-800 mx-auto mb-4">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Registration Successful</h3>
              <p className="text-gray-600 mb-6">
                Patient <span className="font-semibold">{patientName}</span> has been registered and added to the queue.
              </p>

              <div className="bg-blue-50 p-6 rounded-lg inline-block mb-6">
                <div className="text-center">
                  <div className="text-sm text-gray-600 mb-1">Token Number</div>
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-800 mx-auto mb-2">
                    <Ticket className="h-8 w-8" />
                    <span className="absolute text-lg font-bold">{tokenNumber}</span>
                  </div>
                  <div className="text-sm text-gray-600">Please direct the patient to the waiting area.</div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={handleReset}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register Another Patient
                </Button>
                <Button>
                  Print Token
                </Button>
              </div>
            </div>
          ) : (
            <Suspense fallback={
              <div className="p-8 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#2B3990] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-4 text-gray-600">Loading registration form...</p>
              </div>
            }>
              <PatientRegistrationForm
                onClose={() => {}}
                onSave={handlePatientSaved}
              />
            </Suspense>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegratedPatientRegistration;
