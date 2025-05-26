import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  Clock,
  DollarSign
} from 'lucide-react';

interface PatientRegistrationFlowProps {
  patientId: number;
  onComplete?: (result: any) => void;
}

interface RegistrationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'current' | 'completed' | 'error';
  component?: React.ReactNode;
}

const PatientRegistrationFlow: React.FC<PatientRegistrationFlowProps> = ({
  patientId,
  onComplete
}) => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [visitData, setVisitData] = useState<any>(null);
  const [insuranceData, setInsuranceData] = useState<any>(null);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [steps, setSteps] = useState<RegistrationStep[]>([
    {
      id: 'registration',
      title: 'Patient Registration',
      description: 'Verify patient details and create visit',
      status: 'current'
    },
    {
      id: 'insurance',
      title: 'Insurance Verification',
      description: 'Check insurance eligibility and coverage',
      status: 'pending'
    },
    {
      id: 'payment',
      title: 'Payment Processing',
      description: 'Process consultation payment',
      status: 'pending'
    },
    {
      id: 'consultation',
      title: 'Ready for Consultation',
      description: 'Patient cleared for medical services',
      status: 'pending'
    }
  ]);

  // Step 1: Patient Registration Component
  const RegistrationStep = () => {
    const [formData, setFormData] = useState({
      visit_type: 'CONSULTATION',
      consultation_fee: 2500,
      assigned_doctor_id: '',
      notes: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);

      try {
        const response = await fetch('/api/financial/patient-visits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patient_id: patientId,
            ...formData
          })
        });

        const result = await response.json();
        if (result.success) {
          setVisitData(result.data);
          updateStepStatus(0, 'completed');
          setCurrentStep(1);
        }
      } catch (error) {
        console.error('Registration error:', error);
        updateStepStatus(0, 'error');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <User className="w-6 h-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-semibold">Patient Registration</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visit Type
            </label>
            <select
              value={formData.visit_type}
              onChange={(e) => setFormData({...formData, visit_type: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="CONSULTATION">General Consultation</option>
              <option value="FOLLOW_UP">Follow-up Visit</option>
              <option value="EMERGENCY">Emergency</option>
              <option value="SPECIALIST">Specialist Consultation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Consultation Fee (KES)
            </label>
            <input
              type="number"
              value={formData.consultation_fee}
              onChange={(e) => setFormData({...formData, consultation_fee: Number(e.target.value)})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              min="0"
              step="50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Any special notes or requirements..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <Clock className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4 mr-2" />
            )}
            Create Visit & Continue
          </button>
        </form>
      </div>
    );
  };

  // Step 2: Insurance Verification Component
  const InsuranceStep = () => {
    const [formData, setFormData] = useState({
      has_insurance: false,
      insurance_provider: '',
      insurance_number: ''
    });

    const handleInsuranceVerification = async () => {
      if (!formData.has_insurance) {
        // Skip insurance, proceed to payment
        updateStepStatus(1, 'completed');
        setCurrentStep(2);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('/api/financial/verify-insurance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            patient_id: patientId,
            insurance_provider_code: formData.insurance_provider,
            insurance_number: formData.insurance_number
          })
        });

        const result = await response.json();
        if (result.success && result.data.eligible) {
          setInsuranceData(result.data);
          updateStepStatus(1, 'completed');
          
          // If insurance covers consultation, skip payment
          if (result.data.verification_result.coverage_percentage >= 100) {
            updateStepStatus(2, 'completed');
            setCurrentStep(3);
          } else {
            setCurrentStep(2);
          }
        } else {
          updateStepStatus(1, 'error');
        }
      } catch (error) {
        console.error('Insurance verification error:', error);
        updateStepStatus(1, 'error');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <Shield className="w-6 h-6 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold">Insurance Verification</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="has_insurance"
              checked={formData.has_insurance}
              onChange={(e) => setFormData({...formData, has_insurance: e.target.checked})}
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="has_insurance" className="text-sm font-medium text-gray-700">
              Patient has insurance coverage
            </label>
          </div>

          {formData.has_insurance && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Provider
                </label>
                <select
                  value={formData.insurance_provider}
                  onChange={(e) => setFormData({...formData, insurance_provider: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Provider</option>
                  <option value="SHA">Social Health Authority (SHA)</option>
                  <option value="NHIF">NHIF</option>
                  <option value="SLADE360">Slade360</option>
                  <option value="AAR">AAR Insurance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Insurance Number
                </label>
                <input
                  type="text"
                  value={formData.insurance_number}
                  onChange={(e) => setFormData({...formData, insurance_number: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter insurance number"
                />
              </div>
            </>
          )}

          <button
            onClick={handleInsuranceVerification}
            disabled={loading || (formData.has_insurance && (!formData.insurance_provider || !formData.insurance_number))}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <Clock className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Shield className="w-4 h-4 mr-2" />
            )}
            {formData.has_insurance ? 'Verify Insurance' : 'Continue Without Insurance'}
          </button>
        </div>

        {insuranceData && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Insurance Verified</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Coverage: {insuranceData.verification_result.coverage_percentage}% 
              (Remaining: KES {insuranceData.verification_result.remaining_amount?.toLocaleString()})
            </p>
          </div>
        )}
      </div>
    );
  };

  // Step 3: Payment Processing Component
  const PaymentStep = () => {
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [externalReference, setExternalReference] = useState('');

    const consultationFee = visitData?.invoice?.total_amount || 2500;
    const insuranceCoverage = insuranceData?.verification_result?.coverage_percentage || 0;
    const patientAmount = consultationFee * (1 - insuranceCoverage / 100);

    const handlePayment = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/financial/process-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visit_id: visitData.visit.id,
            invoice_id: visitData.invoice.id,
            payment_method_code: paymentMethod,
            amount: patientAmount,
            external_reference: externalReference,
            notes: `Consultation payment via ${paymentMethod}`
          })
        });

        const result = await response.json();
        if (result.success) {
          setPaymentData(result.data);
          updateStepStatus(2, 'completed');
          setCurrentStep(3);
        }
      } catch (error) {
        console.error('Payment error:', error);
        updateStepStatus(2, 'error');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center mb-4">
          <CreditCard className="w-6 h-6 text-purple-600 mr-2" />
          <h3 className="text-lg font-semibold">Payment Processing</h3>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Consultation Fee:</span>
              <span className="font-medium">KES {consultationFee.toLocaleString()}</span>
            </div>
            {insuranceCoverage > 0 && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Insurance Coverage ({insuranceCoverage}%):</span>
                <span className="font-medium text-green-600">
                  -KES {(consultationFee * insuranceCoverage / 100).toLocaleString()}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center border-t pt-2">
              <span className="font-medium">Patient Amount:</span>
              <span className="font-bold text-lg">KES {patientAmount.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="CASH">Cash</option>
              <option value="MPESA">M-Pesa</option>
              <option value="CARD">Credit/Debit Card</option>
              <option value="BANK">Bank Transfer</option>
            </select>
          </div>

          {paymentMethod !== 'CASH' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reference Number
              </label>
              <input
                type="text"
                value={externalReference}
                onChange={(e) => setExternalReference(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${paymentMethod} reference number`}
              />
            </div>
          )}

          <button
            onClick={handlePayment}
            disabled={loading || (paymentMethod !== 'CASH' && !externalReference)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md disabled:opacity-50 flex items-center justify-center"
          >
            {loading ? (
              <Clock className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <DollarSign className="w-4 h-4 mr-2" />
            )}
            Process Payment (KES {patientAmount.toLocaleString()})
          </button>
        </div>
      </div>
    );
  };

  // Step 4: Completion Component
  const CompletionStep = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="text-center">
        <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Registration Complete!
        </h3>
        <p className="text-gray-600 mb-6">
          Patient is ready for consultation. All payments have been processed.
        </p>

        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Visit Number:</span>
              <span className="font-medium">{visitData?.visit?.visit_number}</span>
            </div>
            {paymentData && (
              <div className="flex justify-between">
                <span>Payment Reference:</span>
                <span className="font-medium">{paymentData.payment.payment_reference}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium text-green-600">Ready for Consultation</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate(`/patients/details/${patientId}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
        >
          View Patient Details
        </button>
      </div>
    </div>
  );

  const updateStepStatus = (stepIndex: number, status: 'pending' | 'current' | 'completed' | 'error') => {
    setSteps(prev => prev.map((step, index) => 
      index === stepIndex ? { ...step, status } : step
    ));
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-6 h-6 text-red-600" />;
      case 'current':
        return <Clock className="w-6 h-6 text-blue-600" />;
      default:
        return <div className="w-6 h-6 rounded-full border-2 border-gray-300" />;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return <RegistrationStep />;
      case 1:
        return <InsuranceStep />;
      case 2:
        return <PaymentStep />;
      case 3:
        return <CompletionStep />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Patient Registration & Payment Flow
        </h2>
        <p className="text-gray-600">
          Complete the registration process before consultation
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                {getStepIcon(step.status)}
                <div className="mt-2 text-center">
                  <div className="text-sm font-medium text-gray-900">
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {step.description}
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 h-px bg-gray-300 mx-4" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="mb-6">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default PatientRegistrationFlow;
