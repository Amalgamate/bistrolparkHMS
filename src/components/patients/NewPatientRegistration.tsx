import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { User, Phone, Mail, MapPin, Heart, AlertCircle, FileText } from 'lucide-react';

const patientSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'other']),
  nationalId: z.string().min(5, 'National ID must be at least 5 characters'),

  // Contact Information
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'Zip code must be at least 5 characters'),

  // Medical Information
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown']),
  allergies: z.string().optional(),
  currentMedications: z.string().optional(),

  // Emergency Contact
  emergencyContact: z.object({
    name: z.string().min(2, 'Emergency contact name must be at least 2 characters'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    relationship: z.string().min(2, 'Relationship must be at least 2 characters'),
  }),
});

type PatientFormData = z.infer<typeof patientSchema>;

export const NewPatientRegistration: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    trigger,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      bloodType: 'unknown',
      maritalStatus: 'single',
    }
  });

  const handleNextStep = async () => {
    let fieldsToValidate: string[] = [];

    switch (currentStep) {
      case 1: // Personal Information
        fieldsToValidate = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'maritalStatus', 'nationalId'];
        break;
      case 2: // Contact Information
        fieldsToValidate = ['email', 'phone', 'address', 'city', 'state', 'zipCode'];
        break;
      case 3: // Medical Information
        fieldsToValidate = ['bloodType'];
        break;
    }

    const isStepValid = await trigger(fieldsToValidate as any);

    if (isStepValid) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const onSubmit = (data: PatientFormData) => {
    console.log(data);
    alert('Patient registered successfully!');
    reset();
    setCurrentStep(1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 relative">
      {/* Quick Action Buttons */}
      <div className="absolute right-0 top-24 flex flex-col space-y-2 mr-[-20px] z-10">
        <button
          type="button"
          className="bg-[#1961FB] text-white p-3 rounded-l-md shadow-md hover:bg-[#0A4EFA] transition-colors duration-200 group relative"
          title="Scan ID"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="absolute left-[-85px] top-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Scan ID
          </span>
        </button>
        <button
          type="button"
          className="bg-green-600 text-white p-3 rounded-l-md shadow-md hover:bg-green-700 transition-colors duration-200 group relative"
          title="Import Data"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          <span className="absolute left-[-105px] top-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Import Data
          </span>
        </button>
        <button
          type="button"
          className="bg-amber-500 text-white p-3 rounded-l-md shadow-md hover:bg-amber-600 transition-colors duration-200 group relative"
          title="Verify Insurance"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="absolute left-[-135px] top-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Verify Insurance
          </span>
        </button>
        <button
          type="button"
          className="bg-purple-600 text-white p-3 rounded-l-md shadow-md hover:bg-purple-700 transition-colors duration-200 group relative"
          title="Help"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="absolute left-[-65px] top-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            Help
          </span>
        </button>
      </div>

      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-[#01016C]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-[#01016C]">New Patient Registration</h2>
          <div className="px-3 py-1 bg-white rounded-full text-sm text-[#01016C] font-medium shadow-sm">
            Step {currentStep} of {totalSteps}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white rounded-full h-2.5 shadow-inner">
          <div
            className="bg-gradient-to-r from-[#01016C] to-[#1961FB] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex items-center mb-4 bg-blue-50 p-3 rounded-lg">
              <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                <User className="w-5 h-5 text-[#01016C]" />
              </div>
              <h3 className="text-lg font-medium text-[#01016C]">Personal Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  {...register('firstName')}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                    errors.firstName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  {...register('lastName')}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                    errors.lastName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  id="dateOfBirth"
                  type="date"
                  {...register('dateOfBirth')}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                    errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  id="gender"
                  {...register('gender')}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                    errors.gender ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700">
                  Marital Status <span className="text-red-500">*</span>
                </label>
                <select
                  id="maritalStatus"
                  {...register('maritalStatus')}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                    errors.maritalStatus ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                  <option value="divorced">Divorced</option>
                  <option value="widowed">Widowed</option>
                  <option value="other">Other</option>
                </select>
                {errors.maritalStatus && (
                  <p className="mt-1 text-sm text-red-600">{errors.maritalStatus.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">
                  National ID <span className="text-red-500">*</span>
                </label>
                <input
                  id="nationalId"
                  type="text"
                  {...register('nationalId')}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                    errors.nationalId ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.nationalId && (
                  <p className="mt-1 text-sm text-red-600">{errors.nationalId.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center mb-4 bg-green-50 p-3 rounded-lg">
              <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                <Phone className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-green-700">Contact Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={`pl-10 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="patient@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    {...register('phone')}
                    className={`pl-10 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="(123) 456-7890"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="address"
                    type="text"
                    {...register('address')}
                    className={`pl-10 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                      errors.address ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Street address"
                  />
                </div>
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  id="city"
                  type="text"
                  {...register('city')}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                    errors.city ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  State/Province <span className="text-red-500">*</span>
                </label>
                <input
                  id="state"
                  type="text"
                  {...register('state')}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                    errors.state ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                  Zip/Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  id="zipCode"
                  type="text"
                  {...register('zipCode')}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                    errors.zipCode ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.zipCode.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Medical Information */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center mb-4 bg-red-50 p-3 rounded-lg">
              <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                <Heart className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-red-700">Medical Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
                  Blood Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="bloodType"
                  {...register('bloodType')}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                    errors.bloodType ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="unknown">Unknown</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                {errors.bloodType && (
                  <p className="mt-1 text-sm text-red-600">{errors.bloodType.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                  Allergies
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="allergies"
                    {...register('allergies')}
                    rows={3}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
                    placeholder="List any allergies (medications, food, etc.)"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="currentMedications" className="block text-sm font-medium text-gray-700">
                  Current Medications
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <textarea
                    id="currentMedications"
                    {...register('currentMedications')}
                    rows={3}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
                    placeholder="List any medications the patient is currently taking"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Emergency Contact */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center mb-4 bg-amber-50 p-3 rounded-lg">
              <div className="bg-white p-2 rounded-full shadow-sm mr-3">
                <Phone className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium text-amber-700">Emergency Contact</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="emergencyName" className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="emergencyName"
                    type="text"
                    {...register('emergencyContact.name')}
                    className={`pl-10 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                      errors.emergencyContact?.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.emergencyContact?.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContact.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700">
                  Phone <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="emergencyPhone"
                    type="tel"
                    {...register('emergencyContact.phone')}
                    className={`pl-10 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                      errors.emergencyContact?.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="(123) 456-7890"
                  />
                </div>
                {errors.emergencyContact?.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContact.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="emergencyRelationship" className="block text-sm font-medium text-gray-700">
                  Relationship <span className="text-red-500">*</span>
                </label>
                <input
                  id="emergencyRelationship"
                  type="text"
                  {...register('emergencyContact.relationship')}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm ${
                    errors.emergencyContact?.relationship ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g. Spouse, Parent, Child, Friend"
                />
                {errors.emergencyContact?.relationship && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergencyContact.relationship.message}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 bg-gray-50 p-4 rounded-lg">
          <button
            type="button"
            onClick={handlePrevStep}
            disabled={currentStep === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0100F6] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </div>
          </button>

          <div>
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="ml-3 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#01016C] to-[#1961FB] rounded-md shadow-sm hover:from-[#01016C] hover:to-[#0A4EFA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01016C] transition-all duration-200"
              >
                <div className="flex items-center">
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            ) : (
              <button
                type="submit"
                className="ml-3 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-500 rounded-md shadow-sm hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              >
                <div className="flex items-center">
                  Register Patient
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
