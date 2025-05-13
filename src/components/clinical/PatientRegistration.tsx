import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../ui/tabs';
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Shield,
  UserPlus,
  Search,
  AlertTriangle,
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
  const [activeTab, setActiveTab] = useState('new');
  const [searchQuery, setSearchQuery] = useState('');
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

  // Handle search
  const handleSearch = () => {
    // In a real app, this would search the patient database
    showToast('info', `Searching for "${searchQuery}"`);
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
              <CardDescription>Register new patients or search existing records</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="new">New Patient</TabsTrigger>
              <TabsTrigger value="existing">Existing Patient</TabsTrigger>
            </TabsList>

            <TabsContent value="new">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* File Numbers */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium border-b pb-2">File Numbers</h3>

                        <FormField
                          control={form.control}
                          name="patientId"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Patient ID</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    disabled
                                    className="pl-10 bg-gray-50"
                                  />
                                  <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                                  <Input {...field} />
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
                                  <Input {...field} />
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
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium border-b pb-2">Personal Information</h3>

                        <div className="grid grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} />
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
                                  <Input {...field} />
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
                                  <Input {...field} />
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
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
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
                                    <Input
                                      {...field}
                                      type="date"
                                      className="pl-10"
                                    />
                                    <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select marital status" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="single">Single</SelectItem>
                                  <SelectItem value="married">Married</SelectItem>
                                  <SelectItem value="divorced">Divorced</SelectItem>
                                  <SelectItem value="widowed">Widowed</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium border-b pb-2">Contact Information</h3>

                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    {...field}
                                    className="pl-10"
                                  />
                                  <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                                  <Input
                                    {...field}
                                    type="email"
                                    className="pl-10"
                                  />
                                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                                  <Input
                                    {...field}
                                    className="pl-10"
                                  />
                                  <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
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
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Identification & Payment */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium border-b pb-2">Identification & Payment</h3>

                        <FormField
                          control={form.control}
                          name="idNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ID/Passport Number</FormLabel>
                              <FormControl>
                                <Input {...field} />
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
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="cash">Cash</SelectItem>
                                  <SelectItem value="insurance">Insurance</SelectItem>
                                  <SelectItem value="mpesa">M-Pesa</SelectItem>
                                  <SelectItem value="card">Card</SelectItem>
                                  <SelectItem value="credit">Credit</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
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
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select provider" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="SHA">SHA</SelectItem>
                                      <SelectItem value="Jubilee">Jubilee</SelectItem>
                                      <SelectItem value="AAR">AAR</SelectItem>
                                      <SelectItem value="Britam">Britam</SelectItem>
                                      <SelectItem value="Madison">Madison</SelectItem>
                                    </SelectContent>
                                  </Select>
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
                                    <Input {...field} />
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
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                      </div>

                      {/* Next of Kin */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium border-b pb-2">Next of Kin</h3>

                        <FormField
                          control={form.control}
                          name="nextOfKin.name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
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
                                  <Input {...field} />
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
                                  <Input {...field} />
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
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Clinical Information */}
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium border-b pb-2">Clinical Information</h3>

                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Priority</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="normal">Normal</SelectItem>
                                  <SelectItem value="urgent">Urgent</SelectItem>
                                  <SelectItem value="emergency">Emergency</SelectItem>
                                </SelectContent>
                              </Select>
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
            </TabsContent>

            <TabsContent value="existing">
              <div className="space-y-6">
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <Input
                      placeholder="Search by patient ID, name, or phone number"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                  <Button onClick={handleSearch}>Search</Button>
                </div>

                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No Patients Found</h3>
                  <p className="text-gray-500 mb-4">Try searching with a different term or register a new patient.</p>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('new')}
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register New Patient
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRegistration;
