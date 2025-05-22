import React, { useState } from 'react';
import { X, Calendar, ChevronRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePatient } from '../../context/PatientContext';
import { useToast } from '../../context/ToastContext';

// Define the form schema
const patientSchema = z.object({
  // File Numbers
  outPatientFileNumber: z.string().optional(),
  inPatientFileNumber: z.string().optional(),
  oldReferenceNumber: z.string().optional(),

  // Personal Information
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']).optional(),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'other']).optional(),

  // Contact Information
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),

  // Medical Information
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
  allergies: z.string().optional(),
  chronicConditions: z.string().optional(),

  // Referral Information
  referredBy: z.string().optional(),
  referralDate: z.string().optional(),
  referralReason: z.string().optional(),

  // Emergency Contact
  emergencyContactName: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactAddress: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface ModalPatientRegistrationProps {
  onClose?: () => void;
  onSave?: (patientData: any) => void;
}

const ModalPatientRegistration: React.FC<ModalPatientRegistrationProps> = ({
  onClose,
  onSave
}) => {
  const { addPatient } = usePatient();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('personal');

  // Initialize form
  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      outPatientFileNumber: '',
      inPatientFileNumber: '',
      oldReferenceNumber: '',
      firstName: '',
      middleName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'male',
      maritalStatus: 'single',
      phone: '',
      email: '',
      address: '',
      city: '',
      country: '',
      bloodGroup: 'O+',
      allergies: '',
      chronicConditions: '',
      referredBy: '',
      referralDate: '',
      referralReason: '',
      emergencyContactName: '',
      emergencyContactRelationship: '',
      emergencyContactPhone: '',
      emergencyContactAddress: '',
    }
  });

  // Handle form submission
  const onSubmit = (data: PatientFormData) => {
    try {
      // Add patient to the system
      const fullName = `${data.firstName} ${data.lastName}`;
      const patientId = `BP${Math.floor(10000000 + Math.random() * 90000000)}`;

      const newPatient = addPatient({
        ...data,
        name: fullName,
        id: patientId
      });

      // Show success message
      showToast('success', `Patient ${fullName} registered successfully`);

      // Call onSave if provided
      if (onSave) {
        onSave(data);
      }
    } catch (error) {
      console.error('Error registering patient:', error);
      showToast('error', 'Failed to register patient');
    }
  };

  // Handle close
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Handle next button
  const handleNext = () => {
    // Validate current tab fields
    form.trigger().then((isValid) => {
      if (isValid) {
        // Move to next tab based on current tab
        switch (activeTab) {
          case 'personal':
            setActiveTab('contact');
            break;
          case 'contact':
            setActiveTab('medical');
            break;
          case 'medical':
            setActiveTab('referral');
            break;
          case 'referral':
            setActiveTab('emergency');
            break;
          case 'emergency':
            // Submit the form if on the last tab
            form.handleSubmit(onSubmit)();
            break;
        }
      }
    });
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      {/* Header with close button */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-gray-800">Patient Registration</h2>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b">
          <TabsList className="flex w-full rounded-none bg-white">
            <TabsTrigger
              value="personal"
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
            >
              <div className="flex items-center justify-center py-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Personal Info
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
            >
              <div className="flex items-center justify-center py-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Contact Info
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="medical"
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
            >
              <div className="flex items-center justify-center py-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg>
                Medical Info
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="referral"
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
            >
              <div className="flex items-center justify-center py-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                </svg>
                Referral Info
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="emergency"
              className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none"
            >
              <div className="flex items-center justify-center py-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Emergency Contact
              </div>
            </TabsTrigger>
          </TabsList>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="p-6">
            <TabsContent value="personal" className="mt-0">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Out-Patient File Number</label>
                  <Input
                    {...form.register('outPatientFileNumber')}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">In-Patient File Number</label>
                  <Input
                    {...form.register('inPatientFileNumber')}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Old Reference Number</label>
                <Input
                  {...form.register('oldReferenceNumber')}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name<span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...form.register('firstName')}
                    className="w-full"
                  />
                  {form.formState.errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{form.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name<span className="text-red-500">*</span>
                  </label>
                  <Input
                    {...form.register('lastName')}
                    className="w-full"
                  />
                  {form.formState.errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{form.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
                <Input
                  {...form.register('middleName')}
                  className="w-full"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Input
                    {...form.register('dateOfBirth')}
                    type="date"
                    className="w-full"
                    placeholder="mm/dd/yyyy"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                {form.formState.errors.dateOfBirth && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.dateOfBirth.message}</p>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth (Day/Month/Year)</label>
                <p className="text-sm text-gray-500">This field is automatically calculated from the Date of Birth above.</p>
              </div>
            </TabsContent>

            <TabsContent value="contact" className="mt-0">
              <div className="py-8 text-center text-gray-500">
                <p>Contact information fields will be displayed here.</p>
              </div>
            </TabsContent>

            <TabsContent value="medical" className="mt-0">
              <div className="py-8 text-center text-gray-500">
                <p>Medical information fields will be displayed here.</p>
              </div>
            </TabsContent>

            <TabsContent value="referral" className="mt-0">
              <div className="py-8 text-center text-gray-500">
                <p>Referral information fields will be displayed here.</p>
              </div>
            </TabsContent>

            <TabsContent value="emergency" className="mt-0">
              <div className="py-8 text-center text-gray-500">
                <p>Emergency contact fields will be displayed here.</p>
              </div>
            </TabsContent>
          </div>

          <div className="flex justify-between items-center p-4 border-t bg-gray-50">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleNext}
            >
              {activeTab === 'emergency' ? 'Submit' : 'Next'}
              {activeTab !== 'emergency' && <ChevronRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  );
};

export default ModalPatientRegistration;