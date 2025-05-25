import React, { useState } from 'react';
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
  Ticket
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useClinical, Priority } from '../../context/ClinicalContext';
import { useToast } from '../../context/ToastContext';

// Define the form schema
const patientSchema = z.object({
  // File Numbers
  patientId: z.string().min(1, 'Patient ID is required'),
  outPatientFileNumber: z.string().optional(),
  oldReferenceNumber: z.string().optional(),
  inPatientFileNumber: z.string().optional(),

  // Personal Information
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'other']).optional(),

  // Contact Information
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().min(1, 'Address is required'),
  residence: z.string().optional(),

  // Identification
  idNumber: z.string().min(1, 'ID/Passport number is required'),

  // Insurance Information
  insuranceCovered: z.boolean().default(false),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  shaNumber: z.string().optional(), // SHA (formerly NHIF)

  // Next of Kin
  nextOfKin: z.object({
    name: z.string().optional(),
    relationship: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
  }).optional(),

  // Clinical Information
  priority: z.enum(['normal', 'urgent', 'emergency']).default('normal'),

  // Payment Information
  paymentType: z.enum(['cash', 'insurance', 'mpesa', 'card', 'credit', 'other']).optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

const PatientRegistration: React.FC = () => {
  const { registerPatient } = useClinical();
  const { showToast } = useToast();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [tokenNumber, setTokenNumber] = useState<number | null>(null);

  // Initialize form
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      // File Numbers
      patientId: `BP${Math.floor(10000000 + Math.random() * 90000000)}`, // Generate random ID
      outPatientFileNumber: '',
      oldReferenceNumber: '',
      inPatientFileNumber: '',

      // Personal Information
      firstName: '',
      middleName: '',
      lastName: '',
      gender: 'male',
      dateOfBirth: '',
      maritalStatus: 'single',

      // Contact Information
      phone: '',
      email: '',
      address: '',
      residence: '',

      // Identification
      idNumber: '',

      // Insurance Information
      insuranceCovered: false,
      insuranceProvider: '',
      insurancePolicyNumber: '',
      shaNumber: '',

      // Next of Kin
      nextOfKin: {
        name: '',
        relationship: '',
        phone: '',
        address: '',
      },

      // Clinical Information
      priority: 'normal',

      // Payment Information
      paymentType: 'cash',
    }
  });

  const insuranceCovered = form.watch('insuranceCovered');

  // Handle form submission
  const onSubmit = (data: PatientFormData) => {
    try {
      // Register patient in the queue
      const fullName = `${data.firstName} ${data.lastName}`;
      const queueEntry = registerPatient(data.patientId, fullName, data.priority as Priority);

      // Show success message
      showToast('success', `Patient ${fullName} registered successfully`);

      // Set success state and token number
      setRegistrationSuccess(true);
      setTokenNumber(queueEntry.tokenNumber);

      // Reset form
      form.reset({
        // File Numbers
        patientId: `BP${Math.floor(10000000 + Math.random() * 90000000)}`,
        outPatientFileNumber: '',
        oldReferenceNumber: '',
        inPatientFileNumber: '',

        // Personal Information
        firstName: '',
        middleName: '',
        lastName: '',
        gender: 'male',
        dateOfBirth: '',
        maritalStatus: 'single',

        // Contact Information
        phone: '',
        email: '',
        address: '',
        residence: '',

        // Identification
        idNumber: '',

        // Insurance Information
        insuranceCovered: false,
        insuranceProvider: '',
        insurancePolicyNumber: '',
        shaNumber: '',

        // Next of Kin
        nextOfKin: {
          name: '',
          relationship: '',
          phone: '',
          address: '',
        },

        // Clinical Information
        priority: 'normal',

        // Payment Information
        paymentType: 'cash',
      });
    } catch (error) {
      console.error('Error registering patient:', error);
      showToast('error', 'Failed to register patient');
    }
  };

  // Reset success state
  const handleReset = () => {
    setRegistrationSuccess(false);
    setTokenNumber(null);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Patient Registration</CardTitle>
              <CardDescription>Register new patients and add them to the consultation queue</CardDescription>
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
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* File Numbers */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold border-b pb-3 text-gray-800">File Numbers</h3>

                        <FormField
                          control={form.control}
                          name="patientId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Patient ID</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <EnhancedInput
                                    {...field}
                                    disabled
                                    className="pl-12 bg-gray-50"
                                    size="xl"
                                  />
                                  <User className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="outPatientFileNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Out-Patient File No.</FormLabel>
                                <FormControl>
                                  <EnhancedInput {...field} size="lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="oldReferenceNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Old Reference No.</FormLabel>
                                <FormControl>
                                  <EnhancedInput {...field} size="lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="inPatientFileNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>In-Patient File No.</FormLabel>
                              <FormControl>
                                <EnhancedInput {...field} size="lg" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Personal Information */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold border-b pb-3 text-gray-800">Personal Information</h3>

                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <EnhancedInput {...field} size="lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="middleName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Middle Name</FormLabel>
                                <FormControl>
                                  <EnhancedInput {...field} size="lg" />
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
                                  <EnhancedInput {...field} size="lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                                    <EnhancedSelectTrigger size="lg">
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
                                      className="pl-12"
                                      size="lg"
                                    />
                                    <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="maritalStatus"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Marital Status</FormLabel>
                              <EnhancedSelect
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <EnhancedSelectTrigger size="lg">
                                    <EnhancedSelectValue placeholder="Select marital status" />
                                  </EnhancedSelectTrigger>
                                </FormControl>
                                <EnhancedSelectContent>
                                  <EnhancedSelectItem value="single">Single</EnhancedSelectItem>
                                  <EnhancedSelectItem value="married">Married</EnhancedSelectItem>
                                  <EnhancedSelectItem value="divorced">Divorced</EnhancedSelectItem>
                                  <EnhancedSelectItem value="widowed">Widowed</EnhancedSelectItem>
                                  <EnhancedSelectItem value="other">Other</EnhancedSelectItem>
                                </EnhancedSelectContent>
                              </EnhancedSelect>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold border-b pb-3 text-gray-800">Contact Information</h3>

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
                                    className="pl-12"
                                    size="lg"
                                  />
                                  <Phone className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
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
                                    className="pl-12"
                                    size="lg"
                                  />
                                  <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
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
                                    className="pl-12"
                                    size="lg"
                                  />
                                  <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="residence"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Residence/Estate</FormLabel>
                              <FormControl>
                                <EnhancedInput {...field} size="lg" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Identification & Payment */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold border-b pb-3 text-gray-800">Identification & Payment</h3>

                        <FormField
                          control={form.control}
                          name="idNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID/Passport Number</FormLabel>
                              <FormControl>
                                <EnhancedInput {...field} size="lg" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="paymentType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Payment Type</FormLabel>
                              <EnhancedSelect
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <EnhancedSelectTrigger size="lg">
                                    <EnhancedSelectValue placeholder="Select payment type" />
                                  </EnhancedSelectTrigger>
                                </FormControl>
                                <EnhancedSelectContent>
                                  <EnhancedSelectItem value="cash">Cash</EnhancedSelectItem>
                                  <EnhancedSelectItem value="insurance">Insurance</EnhancedSelectItem>
                                  <EnhancedSelectItem value="mpesa">M-Pesa</EnhancedSelectItem>
                                  <EnhancedSelectItem value="card">Card</EnhancedSelectItem>
                                  <EnhancedSelectItem value="credit">Credit</EnhancedSelectItem>
                                  <EnhancedSelectItem value="other">Other</EnhancedSelectItem>
                                </EnhancedSelectContent>
                              </EnhancedSelect>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="insuranceCovered"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-3">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={field.onChange}
                                  className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                                />
                              </FormControl>
                              <div className="flex items-center space-x-1">
                                <Shield className="h-5 w-5 text-blue-600" />
                                <FormLabel className="font-normal">Covered by Insurance</FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        {insuranceCovered && (
                          <div className="space-y-4 border rounded-md p-3 bg-blue-50">
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
                                      <EnhancedSelectTrigger size="lg">
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
                                    <EnhancedInput {...field} size="lg" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="shaNumber"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>SHA Number</FormLabel>
                                  <FormControl>
                                    <EnhancedInput {...field} size="lg" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>

                      {/* Next of Kin */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold border-b pb-3 text-gray-800">Next of Kin</h3>

                        <FormField
                          control={form.control}
                          name="nextOfKin.name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <EnhancedInput {...field} size="lg" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="nextOfKin.relationship"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Relationship</FormLabel>
                                <FormControl>
                                  <EnhancedInput {...field} size="lg" />
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
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                  <EnhancedInput {...field} size="lg" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="nextOfKin.address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <EnhancedInput {...field} size="lg" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Clinical Information */}
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold border-b pb-3 text-gray-800">Clinical Information</h3>

                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Priority</FormLabel>
                              <EnhancedSelect
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <EnhancedSelectTrigger size="lg">
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
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Register & Generate Token
                      </Button>
                    </div>
                  </form>
                </Form>
              )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRegistration;
