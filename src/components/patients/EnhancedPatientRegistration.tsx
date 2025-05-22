import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  Save, X, User, Phone, Mail, Calendar, MapPin,
  Heart, Activity, AlertCircle, FileText, Users,
  ChevronRight, ChevronLeft, Shield, MessageCircle,
  Flag, Globe
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useInsurance } from '../../context/InsuranceContext';
import { usePatient } from '../../context/PatientContext';
import { notifyPatientRegistration } from '../../utils/smsUtils';
import {
  KENYA_COUNTIES,
  COMMON_COUNTRIES,
  RELATIONSHIPS,
  BLOOD_GROUPS,
  isValidKenyanPhone,
  isValidKenyanID,
  isValidEmail
} from '../../utils/kenyaData';
import '../../styles/theme.css';

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

  // Date of Birth
  dateOfBirth: z.string()
    .min(1, 'Date of birth is required')
    .refine(isValidDateOfBirth, 'Date of birth must be in the past and not more than 120 years ago'),

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

  // Residence Information
  isKenyan: z.boolean().default(true),
  county: z.string().optional(),
  country: z.string().optional(),

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

  nextOfKinRelationship: z.string()
    .min(2, 'Relationship must be at least 2 characters'),

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

interface EnhancedPatientRegistrationProps {
  patientId?: number;
  onClose: () => void;
  onSave: (patientData: any) => void;
}

const EnhancedPatientRegistration: React.FC<EnhancedPatientRegistrationProps> = ({
  patientId,
  onClose,
  onSave
}) => {
  // Tab management
  const [activeTab, setActiveTab] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();
  const { getActiveInsuranceProviders } = useInsurance();
  const { addPatient, getPatient, updatePatient } = usePatient();
  const isEditMode = !!patientId;

  // Form management
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    trigger,
    watch,
    setValue,
    control
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    mode: "onChange",
  });

  const isKenyan = watch('isKenyan');

  // Load patient data if in edit mode
  useEffect(() => {
    if (isEditMode && patientId) {
      const patient = getPatient(patientId);
      if (patient) {
        // Map patient data to form fields
        setValue('firstName', patient.firstName);
        setValue('lastName', patient.lastName);
        setValue('middleName', patient.middleName || '');
        setValue('dateOfBirth', patient.dateOfBirth);
        setValue('gender', patient.gender as any);
        setValue('nationalId', patient.nationalId || '');
        setValue('maritalStatus', patient.maritalStatus as any || 'single');
        setValue('email', patient.email);
        setValue('phone', patient.phone);
        setValue('residence', patient.residence);
        setValue('address', patient.address || '');
        setValue('city', patient.city || '');
        setValue('state', patient.state || '');
        setValue('zipCode', patient.zipCode || '');
        setValue('bloodType', patient.bloodGroup as any || 'unknown');
        setValue('allergies', patient.allergies || '');
        setValue('chronicConditions', patient.chronicConditions || '');
        setValue('currentMedications', patient.currentMedications || '');
        setValue('shaNumber', patient.shaNumber || '');
        setValue('paymentType', patient.paymentType as any || 'cash');
        setValue('nextOfKinName', patient.nextOfKinName || '');
        setValue('nextOfKinPhone', patient.nextOfKinPhone || '');

        // Set isKenyan based on county/country data
        if (patient.county) {
          setValue('isKenyan', true);
          setValue('county', patient.county);
        } else if (patient.country) {
          setValue('isKenyan', false);
          setValue('country', patient.country);
        }

        // Set referral data if available
        if (patient.referral) {
          setValue('referral.isReferred', patient.referral.isReferred);
          setValue('referral.referringHospital', patient.referral.referringHospital || '');
          setValue('referral.referringDoctor', patient.referral.referringDoctor || '');
          setValue('referral.referralReason', patient.referral.referralReason || '');
          setValue('referral.referralDate', patient.referral.referralDate || '');
        }

        // Set emergency contact if available
        if (patient.emergencyContact) {
          setValue('emergencyContact.name', patient.emergencyContact.name || '');
          setValue('emergencyContact.phone', patient.emergencyContact.phone || '');
          setValue('emergencyContact.relationship', patient.emergencyContact.relationship || '');
        }

        // Set insurance data if available
        setValue('insuranceProvider', patient.insuranceProvider || '');
        setValue('insuranceNumber', patient.insuranceNumber || '');
        setValue('insuranceGroupNumber', patient.insuranceGroupNumber || '');
      }
    }
  }, [isEditMode, patientId, getPatient, setValue]);

  const handleTabChange = async (tab: string) => {
    // Validate current tab before switching
    const fieldsToValidate: Record<string, string[]> = {
      'personal': ['firstName', 'lastName', 'dateOfBirth', 'gender', 'nationalId'],
      'contact': ['email', 'phone', 'residence'],
      'medical': ['paymentType'],
      'referral': [],
      'emergency': ['nextOfKinName', 'nextOfKinPhone', 'nextOfKinRelationship']
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
        nextOfKinRelationship: data.nextOfKinRelationship,
        nextOfKinPhone: data.nextOfKinPhone,
        emergencyContact: data.emergencyContact,
        status: 'Active' as const,
        // Add county/country based on nationality
        county: data.isKenyan ? data.county : undefined,
        country: !data.isKenyan ? data.country : undefined,
        referral: data.referral,
        insuranceProvider: data.insuranceProvider,
        insuranceNumber: data.insuranceNumber,
        insuranceGroupNumber: data.insuranceGroupNumber,
      };

      // Call the onSave function which will try to save to the API
      onSave(patientData);

      // If in edit mode, update the patient
      if (isEditMode && patientId) {
        await updatePatient(patientId, patientData);
        showToast('success', 'Patient updated successfully!');
      } else {
        // Add new patient
        await addPatient(patientData);

        // Send SMS notification to the patient
        const patientName = `${data.firstName} ${data.lastName}`;
        const smsResult = await notifyPatientRegistration(patientName, data.phone);

        if (smsResult.success) {
          showToast('success', 'Patient registered successfully! SMS notification sent.');
        } else {
          showToast('success', 'Patient registered successfully! SMS notification could not be sent.');
          console.error('SMS notification failed:', smsResult.error);
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
    <div className="bg-white rounded-xl shadow-lg w-full max-h-[90vh] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <h2 className="text-xl font-semibold text-[#2B4F60] flex items-center">
          <User className="mr-2 text-[#0100F6]" />
          {isEditMode ? 'Edit Patient' : 'Patient Registration'}
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
                    placeholder="e.g. 0722123456"
                    className="form-control pl-10"
                    aria-invalid={errors.phone ? "true" : "false"}
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600" role="alert">{errors.phone.message}</p>
                )}
              </div>

              {/* Nationality Selection */}
              <div className="form-group md:col-span-2">
                <div className="flex items-center mb-2">
                  <Controller
                    name="isKenyan"
                    control={control}
                    render={({ field }) => (
                      <>
                        <input
                          id="isKenyan"
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-4 w-4 text-[#0100F6] focus:ring-[#0100F6] border-gray-300 rounded"
                        />
                        <label htmlFor="isKenyan" className="ml-2 block text-sm font-medium text-gray-700">
                          Kenyan Resident
                        </label>
                      </>
                    )}
                  />
                </div>
              </div>

              {/* County or Country based on nationality */}
              {isKenyan ? (
                <div className="form-group md:col-span-2">
                  <label className="form-label" htmlFor="county">County*</label>
                  <div className="relative">
                    <select
                      id="county"
                      {...register('county')}
                      className="form-select pl-10"
                    >
                      <option value="">Select County</option>
                      {KENYA_COUNTIES.map(county => (
                        <option key={county.id} value={county.name}>
                          {county.name}
                        </option>
                      ))}
                    </select>
                    <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                </div>
              ) : (
                <div className="form-group md:col-span-2">
                  <label className="form-label" htmlFor="country">Country*</label>
                  <div className="relative">
                    <select
                      id="country"
                      {...register('country')}
                      className="form-select pl-10"
                    >
                      <option value="">Select Country</option>
                      {COMMON_COUNTRIES.map(country => (
                        <option key={country.code} value={country.name}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                </div>
              )}

              <div className="form-group md:col-span-2">
                <label className="form-label" htmlFor="residence">Residence Address*</label>
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

              <div className="form-group">
                <label className="form-label" htmlFor="city">City</label>
                <input
                  id="city"
                  type="text"
                  {...register('city')}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="state">State/Province</label>
                <input
                  id="state"
                  type="text"
                  {...register('state')}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="zipCode">Zip/Postal Code</label>
                <input
                  id="zipCode"
                  type="text"
                  {...register('zipCode')}
                  className="form-control"
                />
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
                  {BLOOD_GROUPS.map(bloodGroup => (
                    <option key={bloodGroup} value={bloodGroup}>
                      {bloodGroup}
                    </option>
                  ))}
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
                <label className="form-label" htmlFor="nextOfKinRelationship">Relationship*</label>
                <div className="relative">
                  <select
                    id="nextOfKinRelationship"
                    {...register('nextOfKinRelationship')}
                    className="form-select pl-10"
                    aria-invalid={errors.nextOfKinRelationship ? "true" : "false"}
                  >
                    <option value="">Select Relationship</option>
                    {RELATIONSHIPS.map(relationship => (
                      <option key={relationship} value={relationship}>
                        {relationship}
                      </option>
                    ))}
                  </select>
                  <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                </div>
                {errors.nextOfKinRelationship && (
                  <p className="mt-1 text-sm text-red-600" role="alert">{errors.nextOfKinRelationship.message}</p>
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
                  <select
                    id="emergencyRelationship"
                    {...register('emergencyContact.relationship')}
                    className="form-select pl-10"
                  >
                    <option value="">Select Relationship</option>
                    {RELATIONSHIPS.map(relationship => (
                      <option key={relationship} value={relationship}>
                        {relationship}
                      </option>
                    ))}
                  </select>
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
                    placeholder="e.g. 0722123456"
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
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-between mt-6 pt-6 border-t">
            <div>
              {activeTab !== 'personal' && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    const tabs = ['personal', 'contact', 'medical', 'referral', 'emergency'];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex > 0) {
                      handleTabChange(tabs[currentIndex - 1]);
                    }
                  }}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleCancel}
              >
                Cancel
              </button>
              {activeTab !== 'emergency' ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    const tabs = ['personal', 'contact', 'medical', 'referral', 'emergency'];
                    const currentIndex = tabs.indexOf(activeTab);
                    if (currentIndex < tabs.length - 1) {
                      handleTabChange(tabs[currentIndex + 1]);
                    }
                  }}
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner-border spinner-border-sm mr-2" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {isEditMode ? 'Update Patient' : 'Register Patient'}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedPatientRegistration;
