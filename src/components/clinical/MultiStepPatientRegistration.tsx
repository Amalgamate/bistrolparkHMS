import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';
import { Button } from '../ui/button';
import { EnhancedInput } from '../ui/enhanced-input';
import {
  EnhancedSelect,
  EnhancedSelectContent,
  EnhancedSelectItem,
  EnhancedSelectTrigger,
  EnhancedSelectValue
} from '../ui/enhanced-select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Shield,
  UserPlus,
  CheckCircle2,
  Ticket,
  Clock,
  CreditCard,
  Heart,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useClinical, Priority } from '../../context/ClinicalContext';
import { useToast } from '../../context/ToastContext';

// Multi-step form schema
const patientSchema = z.object({
  // Step 1: Patient Registration
  patientId: z.string().min(1, 'Patient ID is required'),
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().min(1, 'Address is required'),
  idNumber: z.string().min(1, 'ID/Passport number is required'),

  // Step 2: Insurance Verification
  insuranceCovered: z.boolean().default(false),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  shaNumber: z.string().optional(),

  // Step 3: Payment Processing
  visitType: z.string().min(1, 'Visit type is required'),
  consultationFee: z.string().min(1, 'Consultation fee is required'),
  paymentType: z.enum(['cash', 'insurance', 'mpesa', 'card', 'credit', 'other']),

  // Step 4: Ready for Consultation
  priority: z.enum(['normal', 'urgent', 'emergency']).default('normal'),
  nextOfKin: z.object({
    name: z.string().optional(),
    relationship: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

const MultiStepPatientRegistration: React.FC = () => {
  const { registerPatient } = useClinical();
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [tokenNumber, setTokenNumber] = useState<number | null>(null);

  const totalSteps = 4;

  // Initialize form
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      patientId: `BP${Math.floor(10000000 + Math.random() * 90000000)}`,
      firstName: '',
      middleName: '',
      lastName: '',
      gender: 'male',
      dateOfBirth: '',
      phone: '',
      email: '',
      address: '',
      idNumber: '',
      insuranceCovered: false,
      insuranceProvider: '',
      insurancePolicyNumber: '',
      shaNumber: '',
      visitType: 'General Consultation',
      consultationFee: '2500',
      paymentType: 'cash',
      priority: 'normal',
      nextOfKin: {
        name: '',
        relationship: '',
        phone: '',
      },
    }
  });

  const insuranceCovered = form.watch('insuranceCovered');

  // Step navigation
  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const getFieldsForStep = (step: number): (keyof PatientFormData)[] => {
    switch (step) {
      case 1:
        return ['firstName', 'lastName', 'gender', 'dateOfBirth', 'phone', 'address', 'idNumber'];
      case 2:
        return insuranceCovered ? ['insuranceProvider', 'insurancePolicyNumber'] : [];
      case 3:
        return ['visitType', 'consultationFee', 'paymentType'];
      case 4:
        return ['priority'];
      default:
        return [];
    }
  };

  // Handle form submission
  const onSubmit = (data: PatientFormData) => {
    try {
      const fullName = `${data.firstName} ${data.lastName}`;
      const queueEntry = registerPatient(data.patientId, fullName, data.priority as Priority);

      showToast('success', `Patient ${fullName} registered successfully`);
      setRegistrationSuccess(true);
      setTokenNumber(queueEntry.tokenNumber);
    } catch (error) {
      console.error('Error registering patient:', error);
      showToast('error', 'Failed to register patient');
    }
  };

  const handleReset = () => {
    setRegistrationSuccess(false);
    setTokenNumber(null);
    setCurrentStep(1);
    form.reset({
      patientId: `BP${Math.floor(10000000 + Math.random() * 90000000)}`,
      firstName: '',
      middleName: '',
      lastName: '',
      gender: 'male',
      dateOfBirth: '',
      phone: '',
      email: '',
      address: '',
      idNumber: '',
      insuranceCovered: false,
      insuranceProvider: '',
      insurancePolicyNumber: '',
      shaNumber: '',
      visitType: 'General Consultation',
      consultationFee: '2500',
      paymentType: 'cash',
      priority: 'normal',
      nextOfKin: {
        name: '',
        relationship: '',
        phone: '',
      },
    });
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Patient Registration';
      case 2: return 'Insurance Verification';
      case 3: return 'Payment Processing';
      case 4: return 'Ready for Consultation';
      default: return '';
    }
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return 'Verify patient details and create visit';
      case 2: return 'Check insurance eligibility and coverage';
      case 3: return 'Process consultation payment';
      case 4: return 'Patient cleared for medical services';
      default: return '';
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <User className="h-6 w-6" />;
      case 2: return <Shield className="h-6 w-6" />;
      case 3: return <CreditCard className="h-6 w-6" />;
      case 4: return <Heart className="h-6 w-6" />;
      default: return null;
    }
  };

  if (registrationSuccess) {
    return (
      <div className="text-center py-8">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-800 mx-auto mb-4">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">Registration Successful</h3>
        <p className="text-gray-600 mb-6">The patient has been registered and added to the queue.</p>

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
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Stage Labels */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className={`text-center p-2 rounded-lg text-sm font-medium ${
            step === currentStep
              ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
              : step < currentStep
              ? 'bg-green-100 text-green-800 border-2 border-green-300'
              : 'bg-gray-100 text-gray-500 border-2 border-gray-200'
          }`}>
            <div className="flex items-center justify-center mb-1">
              {step < currentStep ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <span className="text-xs font-bold">{step}</span>
              )}
            </div>
            <div className="text-xs">{getStepTitle(step)}</div>
          </div>
        ))}
      </div>

      {/* Progress Steps - Compact */}
      <div className="flex items-center justify-center mb-4">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step === currentStep
                ? 'border-blue-500 bg-blue-500 text-white'
                : step < currentStep
                ? 'border-green-500 bg-green-500 text-white'
                : 'border-gray-300 bg-white text-gray-400'
            }`}>
              {step < currentStep ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <span className="text-xs font-bold">{step}</span>
              )}
            </div>
            {step < 4 && (
              <div className={`w-16 h-1 mx-1 ${
                step < currentStep ? 'bg-green-500' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Current Step Info - Compact */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold text-gray-900 mb-1">{getStepTitle(currentStep)}</h2>
        <p className="text-sm text-gray-600">{getStepDescription(currentStep)}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Card>
            <CardContent className="p-4">
              {/* Step 1: Patient Registration */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="patientId"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Patient ID</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <EnhancedInput
                                {...field}
                                disabled
                                className="pl-10 bg-gray-50"
                                size="md"
                              />
                              <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <EnhancedInput {...field} size="md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <EnhancedInput {...field} size="md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <EnhancedSelect
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <EnhancedSelectTrigger size="md">
                                <EnhancedSelectValue placeholder="Select gender" />
                              </EnhancedSelectTrigger>
                            </FormControl>
                            <EnhancedSelectContent>
                              <EnhancedSelectItem value="male">Male</EnhancedSelectItem>
                              <EnhancedSelectItem value="female">Female</EnhancedSelectItem>
                              <EnhancedSelectItem value="other">Other</EnhancedSelectItem>
                            </EnhancedSelectContent>
                          </EnhancedSelect>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <EnhancedInput
                                {...field}
                                type="date"
                                className="pl-10"
                                size="md"
                              />
                              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <EnhancedInput
                                {...field}
                                className="pl-10"
                                size="md"
                              />
                              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email (Optional)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <EnhancedInput
                                {...field}
                                type="email"
                                className="pl-10"
                                size="md"
                              />
                              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <EnhancedInput
                                {...field}
                                className="pl-10"
                                size="md"
                              />
                              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="idNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ID/Passport Number</FormLabel>
                          <FormControl>
                            <EnhancedInput {...field} size="md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Insurance Verification */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <Shield className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-xs text-blue-800 text-center">Verify insurance coverage</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="insuranceCovered"
                        checked={insuranceCovered}
                        onChange={(e) => form.setValue('insuranceCovered', e.target.checked)}
                        className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <label htmlFor="insuranceCovered" className="text-sm font-medium text-gray-700">
                        Patient has insurance coverage
                      </label>
                    </div>

                    {insuranceCovered && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <FormField
                          control={form.control}
                          name="insuranceProvider"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Insurance Provider</FormLabel>
                              <EnhancedSelect
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <EnhancedSelectTrigger size="md">
                                    <EnhancedSelectValue placeholder="Select provider" />
                                  </EnhancedSelectTrigger>
                                </FormControl>
                                <EnhancedSelectContent>
                                  <EnhancedSelectItem value="SHA">SHA</EnhancedSelectItem>
                                  <EnhancedSelectItem value="Jubilee">Jubilee</EnhancedSelectItem>
                                  <EnhancedSelectItem value="AAR">AAR</EnhancedSelectItem>
                                  <EnhancedSelectItem value="Britam">Britam</EnhancedSelectItem>
                                  <EnhancedSelectItem value="Madison">Madison</EnhancedSelectItem>
                                </EnhancedSelectContent>
                              </EnhancedSelect>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="insurancePolicyNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Policy Number</FormLabel>
                              <FormControl>
                                <EnhancedInput {...field} size="md" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="shaNumber"
                          render={({ field }) => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>SHA Number</FormLabel>
                              <FormControl>
                                <EnhancedInput {...field} size="md" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {!insuranceCovered && (
                      <div className="text-center py-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Patient will proceed with self-payment</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Payment Processing */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <CreditCard className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <p className="text-xs text-green-800 text-center">Process payment</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="visitType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Visit Type</FormLabel>
                          <EnhancedSelect
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <EnhancedSelectTrigger size="md">
                                <EnhancedSelectValue placeholder="Select visit type" />
                              </EnhancedSelectTrigger>
                            </FormControl>
                            <EnhancedSelectContent>
                              <EnhancedSelectItem value="General Consultation">General Consultation</EnhancedSelectItem>
                              <EnhancedSelectItem value="Specialist Consultation">Specialist Consultation</EnhancedSelectItem>
                              <EnhancedSelectItem value="Follow-up">Follow-up</EnhancedSelectItem>
                              <EnhancedSelectItem value="Emergency">Emergency</EnhancedSelectItem>
                            </EnhancedSelectContent>
                          </EnhancedSelect>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="consultationFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Consultation Fee (KES)</FormLabel>
                          <FormControl>
                            <EnhancedInput {...field} size="md" type="number" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="paymentType"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Payment Method</FormLabel>
                          <EnhancedSelect
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <EnhancedSelectTrigger size="md">
                                <EnhancedSelectValue placeholder="Select payment method" />
                              </EnhancedSelectTrigger>
                            </FormControl>
                            <EnhancedSelectContent>
                              <EnhancedSelectItem value="cash">Cash</EnhancedSelectItem>
                              <EnhancedSelectItem value="insurance">Insurance</EnhancedSelectItem>
                              <EnhancedSelectItem value="mpesa">M-Pesa</EnhancedSelectItem>
                              <EnhancedSelectItem value="card">Card</EnhancedSelectItem>
                              <EnhancedSelectItem value="credit">Credit</EnhancedSelectItem>
                            </EnhancedSelectContent>
                          </EnhancedSelect>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Ready for Consultation */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-center mb-4">
                    <div className="bg-purple-50 p-3 rounded-lg">
                      <Heart className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                      <p className="text-xs text-purple-800 text-center">Ready for consultation</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority Level</FormLabel>
                          <EnhancedSelect
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <EnhancedSelectTrigger size="md">
                                <EnhancedSelectValue placeholder="Select priority" />
                              </EnhancedSelectTrigger>
                            </FormControl>
                            <EnhancedSelectContent>
                              <EnhancedSelectItem value="normal">Normal</EnhancedSelectItem>
                              <EnhancedSelectItem value="urgent">Urgent</EnhancedSelectItem>
                              <EnhancedSelectItem value="emergency">Emergency</EnhancedSelectItem>
                            </EnhancedSelectContent>
                          </EnhancedSelect>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nextOfKin.name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Next of Kin Name (Optional)</FormLabel>
                          <FormControl>
                            <EnhancedInput {...field} size="md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nextOfKin.relationship"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Relationship (Optional)</FormLabel>
                          <FormControl>
                            <EnhancedInput {...field} size="md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nextOfKin.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Next of Kin Phone (Optional)</FormLabel>
                          <FormControl>
                            <EnhancedInput {...field} size="md" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg mt-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-blue-600 mr-2" />
                      <p className="text-xs text-blue-800">
                        Patient will be added to the consultation queue upon completion
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button type="submit">
                Complete Registration
                <CheckCircle2 className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MultiStepPatientRegistration;
