import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import {
  Save, X, User, Phone, Mail, Calendar, MapPin,
  Heart, Activity, AlertCircle, FileText, Users,
  ChevronRight, ChevronLeft
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import '../../styles/theme.css';

const patientSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other']),
  nationalId: z.string().optional(),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'other']).optional(),

  // Contact Information
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zipCode: z.string().min(5, 'Zip code must be at least 5 characters'),

  // Medical Information
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown']).optional(),
  allergies: z.string().optional(),
  currentMedications: z.string().optional(),
  chronicConditions: z.string().optional(),

  // Referral Information
  referral: z.object({
    isReferred: z.boolean().optional(),
    referringHospital: z.string().optional(),
    referringDoctor: z.string().optional(),
    referralReason: z.string().optional(),
    referralDate: z.string().optional(),
  }).optional(),

  // Emergency Contact
  emergencyContact: z.object({
    name: z.string().min(2, 'Emergency contact name must be at least 2 characters'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits'),
    relationship: z.string().min(2, 'Relationship must be at least 2 characters'),
  }),

  // Insurance Information
  insuranceProvider: z.string().optional(),
  insuranceNumber: z.string().optional(),
  insuranceGroupNumber: z.string().optional(),
  kraPin: z.string().optional(),
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
      'contact': ['email', 'phone', 'address', 'city', 'state', 'zipCode'],
      'medical': [],
      'referral': [],
      'emergency': ['emergencyContact.name', 'emergencyContact.phone', 'emergencyContact.relationship']
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
      console.log(data);
      // Here you would typically send the data to your backend
      onSave(data);
      showToast('success', 'Patient registered successfully!');
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
                  <label className="form-label" htmlFor="address">Address*</label>
                  <div className="relative">
                    <textarea
                      id="address"
                      {...register('address')}
                      rows={3}
                      className="form-control pl-10"
                      aria-invalid={errors.address ? "true" : "false"}
                    />
                    <MapPin className="absolute left-3 top-3 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.address.message}</p>
                  )}
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
                <div className="form-group">
                  <label className="form-label" htmlFor="emergencyName">Emergency Contact Name*</label>
                  <div className="relative">
                    <input
                      id="emergencyName"
                      type="text"
                      {...register('emergencyContact.name')}
                      className="form-control pl-10"
                      aria-invalid={errors.emergencyContact?.name ? "true" : "false"}
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                  {errors.emergencyContact?.name && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.emergencyContact.name.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="emergencyRelationship">Relationship to Patient*</label>
                  <div className="relative">
                    <input
                      id="emergencyRelationship"
                      type="text"
                      {...register('emergencyContact.relationship')}
                      className="form-control pl-10"
                      aria-invalid={errors.emergencyContact?.relationship ? "true" : "false"}
                    />
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                  {errors.emergencyContact?.relationship && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.emergencyContact.relationship.message}</p>
                  )}
                </div>

                <div className="form-group md:col-span-2">
                  <label className="form-label" htmlFor="emergencyPhone">Emergency Contact Phone*</label>
                  <div className="relative">
                    <input
                      id="emergencyPhone"
                      type="tel"
                      {...register('emergencyContact.phone')}
                      placeholder="(123) 456-7890"
                      className="form-control pl-10"
                      aria-invalid={errors.emergencyContact?.phone ? "true" : "false"}
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none w-5 h-5" />
                  </div>
                  {errors.emergencyContact?.phone && (
                    <p className="mt-1 text-sm text-red-600" role="alert">{errors.emergencyContact.phone.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="insuranceProvider">Insurance Provider</label>
                  <select
                    id="insuranceProvider"
                    {...register('insuranceProvider')}
                    className="form-select"
                  >
                    <option value="">Select Insurance Provider</option>
                    <option value="NHIF">NHIF (National Hospital Insurance Fund)</option>
                    <option value="AAR">AAR Insurance</option>
                    <option value="Jubilee">Jubilee Insurance</option>
                    <option value="Britam">Britam Insurance</option>
                    <option value="CIC">CIC Insurance</option>
                    <option value="Madison">Madison Insurance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="insuranceNumber">NHIF/Policy Number</label>
                  <input
                    id="insuranceNumber"
                    type="text"
                    {...register('insuranceNumber')}
                    className="form-control"
                    placeholder="e.g. NHIF12345678"
                  />
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