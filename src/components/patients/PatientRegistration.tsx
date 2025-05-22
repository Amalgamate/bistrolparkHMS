import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  Save, X, User, Phone, Mail, Calendar, MapPin,
  Heart, Activity, AlertCircle, FileText, Users,
  ChevronRight, ChevronLeft, Shield, MessageCircle
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useInsurance } from '../../context/InsuranceContext';
import { usePatient } from '../../context/PatientContext';
import { notifyPatientRegistration } from '../../utils/smsUtils';
import '../../styles/theme.css';

// Helper function to validate Kenyan phone numbers
const isValidKenyanPhone = (phone: string) => {
  // Kenyan phone numbers can be in formats like:
  // +254 7XX XXX XXX, 07XX XXX XXX, 254 7XX XXX XXX
  const kenyanPhoneRegex = /^(?:\+254|254|0)7\d{8}$/;
  // Remove spaces, dashes, and parentheses for validation
  const cleanedPhone = phone.replace(/[\s\-()]/g, '');
  return kenyanPhoneRegex.test(cleanedPhone);
};

// Helper function to validate Kenyan National ID
const isValidKenyanID = (id: string) => {
  // Kenyan IDs are typically 8 digits, but can be 7-9 digits
  const kenyanIDRegex = /^\d{7,9}$/;
  return kenyanIDRegex.test(id);
};

// Helper function to validate date of birth (must be in the past and not more than 120 years ago)
const isValidDateOfBirth = (dob: string) => {
  const dobDate = new Date(dob);
  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 120); // 120 years ago

  return dobDate < today && dobDate > minDate;
};

const patientSchema = z.object({
  // File Numbers
  outPatientFileNumber: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),

  oldReferenceNumber: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),

  inPatientFileNumber: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),

  // Personal Information
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),

  middleName: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),

  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),

  // Date of Birth - Both as combined field and separate components
  dateOfBirth: z.string()
    .min(1, 'Date of birth is required')
    .refine(isValidDateOfBirth, 'Date of birth must be in the past and not more than 120 years ago'),

  birthDay: z.string().optional(),
  birthMonth: z.string().optional(),
  birthYear: z.string().optional(),

  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Please select a gender' })
  }),

  nationalId: z.string()
    .optional()
    .refine(val => !val || isValidKenyanID(val), 'Please enter a valid Kenyan National ID or Passport Number'),

  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'other']).optional(),

  // Contact Information
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email cannot exceed 100 characters'),

  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .refine(isValidKenyanPhone, 'Please enter a valid Kenyan phone number (e.g., 07XX XXX XXX or +254 7XX XXX XXX)'),

  residence: z.string()
    .min(5, 'Residence must be at least 5 characters')
    .max(200, 'Residence cannot exceed 200 characters'),

  address: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),

  city: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),

  state: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),

  zipCode: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),

  // Medical Information
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown']).optional(),

  allergies: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),

  currentMedications: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),

  chronicConditions: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),

  // SHA (formerly NHIF) Information
  shaNumber: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),

  // Payment Type
  paymentType: z.enum(['cash', 'insurance', 'mpesa', 'card', 'credit', 'other']).optional(),

  // Referral Information
  referral: z.object({
    isReferred: z.boolean().optional(),

    referringHospital: z.string()
      .optional()
      .transform(val => val === '' ? undefined : val),

    referringDoctor: z.string()
      .optional()
      .transform(val => val === '' ? undefined : val),

    referralReason: z.string()
      .optional()
      .transform(val => val === '' ? undefined : val),

    referralDate: z.string()
      .optional()
      .transform(val => val === '' ? undefined : val),
  }).optional(),

  // Next of Kin (Required)
  nextOfKinName: z.string()
    .min(2, 'Next of Kin name must be at least 2 characters')
    .max(100, 'Next of Kin name cannot exceed 100 characters'),

  nextOfKinPhone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number cannot exceed 15 digits')
    .refine(isValidKenyanPhone, 'Please enter a valid Kenyan phone number'),

  // Emergency Contact (Optional, can be different from Next of Kin)
  emergencyContact: z.object({
    name: z.string()
      .min(2, 'Emergency contact name must be at least 2 characters')
      .max(100, 'Emergency contact name cannot exceed 100 characters'),

    phone: z.string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number cannot exceed 15 digits')
      .refine(isValidKenyanPhone, 'Please enter a valid Kenyan phone number'),

    relationship: z.string()
      .min(2, 'Relationship must be at least 2 characters')
      .max(50, 'Relationship cannot exceed 50 characters'),
  }).optional(),

  // Insurance Information
  insuranceProvider: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),

  insuranceNumber: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),

  insuranceGroupNumber: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val),

  kraPin: z.string()
    .optional()
    .transform(val => val === '' ? undefined : val)
    .refine(val => !val || /^[A-Z]\d{9}[A-Z]$/.test(val), 'Please enter a valid KRA PIN (format: A123456789B)'),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface PatientRegistrationProps {
  onClose: () => void;
  onSave: (patientData: any) => void;
}

export const PatientRegistration: React.FC<PatientRegistrationProps> = ({
  onClose,
  onSave
}) => {
  // Tab management
  const [activeTab, setActiveTab] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { getActiveInsuranceProviders } = useInsurance();
  const { addPatient } = usePatient();

  // Form management
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    trigger,
    watch,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    mode: "onChange",
  });

  const handleTabChange = async (tab: string) => {
    // Validate current tab before switching
    const fieldsToValidate: Record<string, string[]> = {
      'personal': ['firstName', 'lastName', 'dateOfBirth', 'gender', 'nationalId'],
      'contact': ['email', 'phone', 'residence'],
      'medical': ['paymentType'],
      'referral': [],
      'emergency': ['nextOfKinName', 'nextOfKinPhone']
    };

    // Only validate if moving away from a tab with required fields
    if (fieldsToValidate[activeTab] && fieldsToValidate[activeTab].length > 0) {
      const isValid = await trigger(fieldsToValidate[activeTab] as any);
      if (!isValid) {
        showToast('warning', 'Please fill in all required fields before proceeding');
        return;
      }
    }

    setActiveTab(tab);
  };

  const onSubmit = async (data: PatientFormData) => {
    try {
      setIsSubmitting(true);

      // Combine day, month, year fields if they're filled in but dateOfBirth is not
      if ((!data.dateOfBirth || data.dateOfBirth === '') &&
          data.birthDay && data.birthMonth && data.birthYear) {
        try {
          // Import the utility function dynamically to avoid circular dependencies
          const { combineDateParts } = await import('../../utils/legacySystemUtils');
          data.dateOfBirth = combineDateParts(data.birthDay, data.birthMonth, data.birthYear);
        } catch (err) {
          console.error('Error importing legacy utils:', err);
        }
      }

      // Try to save to the API first
      try {
        // Call the onSave function which will try to save to the API
        onSave(data);

        // Send SMS notification to the patient
        const patientName = `${data.firstName} ${data.lastName}`;
        const smsResult = await notifyPatientRegistration(patientName, data.phone);

        if (smsResult.success) {
          showToast('success', 'Patient registered successfully! SMS notification sent.');
        } else {
          showToast('success', 'Patient registered successfully! SMS notification could not be sent.');
          console.error('SMS notification failed:', smsResult.error);
        }
      } catch (apiError) {
        console.error('Error saving to API:', apiError);

        // Fall back to local context if API fails
        try {
          // Format the data for the PatientContext
          const patientData = {
            firstName: data.firstName,
            lastName: data.lastName,
            middleName: data.middleName,
            dateOfBirth: data.dateOfBirth,
            gender: data.gender,
            nationalId: data.nationalId,
            maritalStatus: data.maritalStatus,
            email: data.email,
            phone: data.phone,
            residence: data.residence,
            address: data.address,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            bloodGroup: data.bloodType,
            allergies: data.allergies,
            chronicConditions: data.chronicConditions,
            currentMedications: data.currentMedications,
            shaNumber: data.shaNumber,
            paymentType: data.paymentType,
            nextOfKinName: data.nextOfKinName,
            nextOfKinPhone: data.nextOfKinPhone,
            emergencyContact: data.emergencyContact,
            status: 'Active' as const
          };

          // Add patient to local context
          await addPatient(patientData);

          showToast('success', 'Patient registered successfully in offline mode!');
        } catch (contextError) {
          console.error('Error saving to local context:', contextError);
          throw new Error('Failed to save patient data in both API and local context');
        }
      }

      reset();
    } catch (error) {
      showToast('error', 'An error occurred while saving patient data');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('Are you sure you want to cancel? All changes will be lost.')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-[#2B4F60] flex items-center">
            <User className="mr-2 text-[#0100F6]" />
            Patient Registration
          </h2>
          <button
            onClick={handleCancel}
            className="p-1 text-gray-500 rounded-md hover:bg-gray-200 focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="tabs p-4 border-b">
          <button
            className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => handleTabChange('personal')}
          >
            <User className="w-4 h-4 mr-2" />
            Personal Info
          </button>
          <button
            className={`tab ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => handleTabChange('contact')}
          >
            <Phone className="w-4 h-4 mr-2" />
            Contact Info
          </button>
          <button
            className={`tab ${activeTab === 'medical' ? 'active' : ''}`}
            onClick={() => handleTabChange('medical')}
          >
            <Heart className="w-4 h-4 mr-2" />
            Medical Info
          </button>
          <button
            className={`tab ${activeTab === 'referral' ? 'active' : ''}`}
            onClick={() => handleTabChange('referral')}
          >
            <FileText className="w-4 h-4 mr-2" />
            Referral Info
          </button>
          <button
            className={`tab ${activeTab === 'emergency' ? 'active' : ''}`}
            onClick={() => handleTabChange('emergency')}
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Emergency Contact
          </button>
        </div>

        <div className="overflow-y-auto p-4 flex-grow">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Personal Information */}
            {activeTab === 'personal' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* File Numbers Section */}
                <div className="form-group">
                  <label className="form-label" htmlFor="outPatientFileNumber">Out-Patient File Number</label>
                  <div className="relative">
                    <input
                      id="outPatientFileNumber"
                      type="text"
                      {...register('outPatientFileNumber')}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="inPatientFileNumber">In-Patient File Number</label>
                  <div className="relative">
                    <input
                      id="inPatientFileNumber"
                      type="text"
                      {...register('inPatientFileNumber')}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="oldReferenceNumber">Old Reference Number</label>
                  <div className="relative">
                    <input
                      id="oldReferenceNumber"
                      type="text"
                      {...register('oldReferenceNumber')}
                      className="form-control"
                    />
                  </div>
                </div>

                {/* Name Fields */}
                <div className="form-group">
                  <label className="form-label" htmlFor="firstName">First Name*</label>
                  <div className="relative">
                    <input
                      id="firstName"
                      type="text"
                      {...register('firstName')}
                      className="form-control"
                      aria-invalid={errors.firstName ? "true" : "false"}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="middleName">Middle Name</label>
                  <div className="relative">
                    <input
                      id="middleName"
                      type="text"
                      {...register('middleName')}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="lastName">Last Name*</label>
                  <div className="relative">
                    <input
                      id="lastName"
                      type="text"
                      {...register('lastName')}
                      className="form-control"
                      aria-invalid={errors.lastName ? "true" : "false"}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.lastName.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="dateOfBirth">Date of Birth*</label>
                  <div className="relative">
                    <input
                      id="dateOfBirth"
                      type="date"
                      {...register('dateOfBirth')}
                      max={format(new Date(), 'yyyy-MM-dd')}
                      className="form-control"
                      aria-invalid={errors.dateOfBirth ? "true" : "false"}
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                  {errors.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.dateOfBirth.message}</p>
                  )}
                </div>

                {/* Separate Day/Month/Year fields (alternative to the date picker) */}
                <div className="form-group md:col-span-2">
                  <label className="form-label">Date of Birth (Day/Month/Year)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs text-gray-500" htmlFor="birthDay">Day</label>
                      <input
                        id="birthDay"
                        type="number"
                        min="1"
                        max="31"
                        {...register('birthDay')}
                        className="form-control"
                        placeholder="DD"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500" htmlFor="birthMonth">Month</label>
                      <input
                        id="birthMonth"
                        type="number"
                        min="1"
                        max="12"
                        {...register('birthMonth')}
                        className="form-control"
                        placeholder="MM"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500" htmlFor="birthYear">Year</label>
                      <input
                        id="birthYear"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        {...register('birthYear')}
                        className="form-control"
                        placeholder="YYYY"
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">Alternative to the date picker above. Fill either one.</p>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="gender">Gender*</label>
                  <select
                    id="gender"
                    {...register('gender')}
                    className="form-select"
                    aria-invalid={errors.gender ? "true" : "false"}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.gender.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="nationalId">National ID / Passport No.</label>
                  <div className="relative">
                    <input
                      id="nationalId"
                      type="text"
                      {...register('nationalId')}
                      className="form-control pl-10"
                      placeholder="e.g. 12345678"
                    />
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                  {errors.nationalId && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.nationalId.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="maritalStatus">Marital Status</label>
                  <select
                    id="maritalStatus"
                    {...register('maritalStatus')}
                    className="form-select"
                  >
                    <option value="">Select marital status</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Contact Information */}
            {activeTab === 'contact' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Email*</label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="form-control pl-10"
                      aria-invalid={errors.email ? "true" : "false"}
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.email.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">Phone*</label>
                  <div className="relative">
                    <input
                      id="phone"
                      type="tel"
                      {...register('phone')}
                      placeholder="(123) 456-7890"
                      className="form-control pl-10"
                      aria-invalid={errors.phone ? "true" : "false"}
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.phone.message}</p>
                  )}
                </div>

                <div className="form-group md:col-span-2">
                  <label className="form-label" htmlFor="residence">Residence*</label>
                  <div className="relative">
                    <textarea
                      id="residence"
                      {...register('residence')}
                      rows={3}
                      className="form-control pl-10"
                      aria-invalid={errors.residence ? "true" : "false"}
                    />
                    <MapPin className="absolute left-3 top-3 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                  {errors.residence && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.residence.message}</p>
                  )}
                </div>

                <div className="form-group md:col-span-2">
                  <label className="form-label" htmlFor="address">Additional Address (Optional)</label>
                  <div className="relative">
                    <textarea
                      id="address"
                      {...register('address')}
                      rows={2}
                      className="form-control pl-10"
                    />
                    <MapPin className="absolute left-3 top-3 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="city">City*</label>
                  <input
                    id="city"
                    type="text"
                    {...register('city')}
                    className="form-control"
                    aria-invalid={errors.city ? "true" : "false"}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.city.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="state">State/Province*</label>
                  <input
                    id="state"
                    type="text"
                    {...register('state')}
                    className="form-control"
                    aria-invalid={errors.state ? "true" : "false"}
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.state.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="zipCode">Zip/Postal Code*</label>
                  <input
                    id="zipCode"
                    type="text"
                    {...register('zipCode')}
                    className="form-control"
                    aria-invalid={errors.zipCode ? "true" : "false"}
                  />
                  {errors.zipCode && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.zipCode.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Medical Information */}
            {activeTab === 'medical' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label" htmlFor="bloodType">Blood Type</label>
                  <select
                    id="bloodType"
                    {...register('bloodType')}
                    className="form-select"
                  >
                    <option value="">Select Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="unknown">Unknown</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="shaNumber">SHA Number (formerly NHIF)</label>
                  <div className="relative">
                    <input
                      id="shaNumber"
                      type="text"
                      {...register('shaNumber')}
                      className="form-control pl-10"
                      placeholder="Enter SHA/NHIF number"
                    />
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="paymentType">Payment Type*</label>
                  <select
                    id="paymentType"
                    {...register('paymentType')}
                    className="form-select"
                  >
                    <option value="">Select Payment Type</option>
                    <option value="cash">Cash</option>
                    <option value="insurance">Insurance</option>
                    <option value="mpesa">M-Pesa</option>
                    <option value="card">Card</option>
                    <option value="credit">Credit</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group md:col-span-2">
                  <label className="form-label" htmlFor="allergies">Allergies</label>
                  <textarea
                    id="allergies"
                    {...register('allergies')}
                    rows={3}
                    className="form-control"
                    placeholder="List any allergies the patient has"
                  />
                </div>

                <div className="form-group md:col-span-2">
                  <label className="form-label" htmlFor="currentMedications">Current Medications</label>
                  <textarea
                    id="currentMedications"
                    {...register('currentMedications')}
                    rows={3}
                    className="form-control"
                    placeholder="List any medications the patient is currently taking"
                  />
                </div>

                <div className="form-group md:col-span-2">
                  <label className="form-label" htmlFor="chronicConditions">Chronic Conditions</label>
                  <textarea
                    id="chronicConditions"
                    {...register('chronicConditions')}
                    rows={3}
                    className="form-control"
                    placeholder="List any chronic conditions the patient has"
                  />
                </div>
              </div>
            )}

            {/* Referral Information */}
            {activeTab === 'referral' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group md:col-span-2">
                  <div className="flex items-center mb-2">
                    <input
                      id="isReferred"
                      type="checkbox"
                      {...register('referral.isReferred')}
                      className="h-4 w-4 text-[#0100F6] focus:ring-[#0100F6] border-gray-300 rounded"
                    />
                    <label htmlFor="isReferred" className="ml-2 block text-sm font-medium text-gray-700">
                      Is this patient referred from another hospital?
                    </label>
                  </div>
                </div>

                {watch('referral.isReferred') && (
                  <>
                    <div className="form-group">
                      <label className="form-label" htmlFor="referringHospital">Referring Hospital</label>
                      <input
                        id="referringHospital"
                        type="text"
                        {...register('referral.referringHospital')}
                        className="form-control"
                        placeholder="e.g. Kenyatta National Hospital"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="referringDoctor">Referring Doctor</label>
                      <input
                        id="referringDoctor"
                        type="text"
                        {...register('referral.referringDoctor')}
                        className="form-control"
                        placeholder="e.g. Dr. James Mwangi"
                      />
                    </div>

                    <div className="form-group md:col-span-2">
                      <label className="form-label" htmlFor="referralReason">Reason for Referral</label>
                      <textarea
                        id="referralReason"
                        {...register('referral.referralReason')}
                        rows={3}
                        className="form-control"
                        placeholder="Explain why the patient was referred"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="referralDate">Referral Date</label>
                      <div className="relative">
                        <input
                          id="referralDate"
                          type="date"
                          {...register('referral.referralDate')}
                          max={format(new Date(), 'yyyy-MM-dd')}
                          className="form-control"
                        />
                        <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Emergency Contact */}
            {activeTab === 'emergency' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Next of Kin Section */}
                <div className="form-group md:col-span-2">
                  <h3 className="text-lg font-medium text-[#01016C] mb-3">Next of Kin Information*</h3>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="nextOfKinName">Next of Kin Name*</label>
                  <div className="relative">
                    <input
                      id="nextOfKinName"
                      type="text"
                      {...register('nextOfKinName')}
                      className="form-control pl-10"
                      aria-invalid={errors.nextOfKinName ? "true" : "false"}
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                  {errors.nextOfKinName && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.nextOfKinName.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="nextOfKinPhone">Next of Kin Phone*</label>
                  <div className="relative">
                    <input
                      id="nextOfKinPhone"
                      type="tel"
                      {...register('nextOfKinPhone')}
                      className="form-control pl-10"
                      aria-invalid={errors.nextOfKinPhone ? "true" : "false"}
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                  {errors.nextOfKinPhone && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.nextOfKinPhone.message}</p>
                  )}
                </div>

                {/* Emergency Contact Section (Optional) */}
                <div className="form-group md:col-span-2 mt-6">
                  <h3 className="text-lg font-medium text-[#01016C] mb-3">Additional Emergency Contact (Optional)</h3>
                  <p className="text-sm text-gray-500 mb-3">Only fill this if different from Next of Kin</p>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="emergencyName">Emergency Contact Name</label>
                  <div className="relative">
                    <input
                      id="emergencyName"
                      type="text"
                      {...register('emergencyContact.name')}
                      className="form-control pl-10"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="emergencyRelationship">Relationship to Patient</label>
                  <div className="relative">
                    <input
                      id="emergencyRelationship"
                      type="text"
                      {...register('emergencyContact.relationship')}
                      className="form-control pl-10"
                    />
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                </div>

                <div className="form-group md:col-span-2">
                  <label className="form-label" htmlFor="emergencyPhone">Emergency Contact Phone</label>
                  <div className="relative">
                    <input
                      id="emergencyPhone"
                      type="tel"
                      {...register('emergencyContact.phone')}
                      placeholder="(123) 456-7890"
                      className="form-control pl-10"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="insuranceProvider">Insurance Provider</label>
                  <div className="relative">
                    <select
                      id="insuranceProvider"
                      {...register('insuranceProvider')}
                      className="form-select pl-10"
                    >
                      <option value="">Select Insurance Provider</option>
                      {getActiveInsuranceProviders().map(provider => (
                        <option key={provider.id} value={provider.id}>
                          {provider.name}
                        </option>
                      ))}
                    </select>
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="insuranceNumber">Policy Number</label>
                  <input
                    id="insuranceNumber"
                    type="text"
                    {...register('insuranceNumber')}
                    className="form-control"
                    placeholder="e.g. NHIF12345678"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="insuranceGroupNumber">Group Number</label>
                  <input
                    id="insuranceGroupNumber"
                    type="text"
                    {...register('insuranceGroupNumber')}
                    className="form-control"
                    placeholder="e.g. GRP12345"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="insuranceCoverageType">Coverage Type</label>
                  <select
                    id="insuranceCoverageType"
                    {...register('insuranceCoverageType')}
                    className="form-select"
                  >
                    <option value="">Select Coverage Type</option>
                    <option value="Inpatient">Inpatient</option>
                    <option value="Outpatient">Outpatient</option>
                    <option value="Maternity">Maternity</option>
                    <option value="Dental">Dental</option>
                    <option value="Optical">Optical</option>
                    <option value="Comprehensive">Comprehensive</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="kraPin">KRA PIN (Optional)</label>
                  <input
                    id="kraPin"
                    type="text"
                    {...register('kraPin')}
                    className="form-control"
                    placeholder="e.g. A012345678Z"
                  />
                </div>
              </div>
            )}
          </form>
        </div>

        <div className="flex items-center justify-between gap-2 p-4 border-t bg-gray-50">
          <div>
            {activeTab !== 'personal' && (
              <button
                type="button"
                onClick={() => {
                  const tabs = ['personal', 'contact', 'medical', 'referral', 'emergency'];
                  const currentIndex = tabs.indexOf(activeTab);
                  if (currentIndex > 0) {
                    handleTabChange(tabs[currentIndex - 1]);
                  }
                }}
                className="btn btn-outline"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-outline"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </button>

            {activeTab === 'emergency' ? (
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Patient
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const tabs = ['personal', 'contact', 'medical', 'referral', 'emergency'];
                  const currentIndex = tabs.indexOf(activeTab);
                  if (currentIndex < tabs.length - 1) {
                    handleTabChange(tabs[currentIndex + 1]);
                  }
                }}
                className="btn btn-primary"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};