import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Thermometer, Heart, Activity, Scale, Ruler, Clock, Save, X } from 'lucide-react';
import { usePatient } from '../../context/PatientContext';
import { useToast } from '../../context/ToastContext';
import { format } from 'date-fns';

const vitalsSchema = z.object({
  temperature: z.number().min(30, 'Temperature must be at least 30°C').max(45, 'Temperature must be at most 45°C').optional(),
  bloodPressureSystolic: z.number().min(70, 'Systolic pressure must be at least 70').max(250, 'Systolic pressure must be at most 250').optional(),
  bloodPressureDiastolic: z.number().min(40, 'Diastolic pressure must be at least 40').max(150, 'Diastolic pressure must be at most 150').optional(),
  weight: z.number().min(1, 'Weight must be at least 1kg').max(300, 'Weight must be at most 300kg').optional(),
  height: z.number().min(30, 'Height must be at least 30cm').max(250, 'Height must be at most 250cm').optional(),
  pulseRate: z.number().min(30, 'Pulse rate must be at least 30bpm').max(220, 'Pulse rate must be at most 220bpm').optional(),
  notes: z.string().optional(),
});

type VitalsFormData = z.infer<typeof vitalsSchema>;

interface VitalsFormProps {
  patientId: number;
  onClose: () => void;
  onSave?: () => void;
}

export const VitalsForm: React.FC<VitalsFormProps> = ({
  patientId,
  onClose,
  onSave
}) => {
  const { getPatient, updatePatient } = usePatient();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const patient = getPatient(patientId);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VitalsFormData>({
    resolver: zodResolver(vitalsSchema),
    defaultValues: {
      temperature: undefined,
      bloodPressureSystolic: undefined,
      bloodPressureDiastolic: undefined,
      weight: undefined,
      height: undefined,
      pulseRate: undefined,
      notes: '',
    }
  });

  if (!patient) {
    return (
      <div className="bg-white rounded-md shadow-sm p-6 text-center">
        <p className="text-red-500">Patient not found</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Close
        </button>
      </div>
    );
  }

  const onSubmit = async (data: VitalsFormData) => {
    try {
      setIsSubmitting(true);
      
      // Create a new vitals entry
      const newVitalsEntry = {
        id: Date.now(),
        date: new Date().toISOString(),
        ...data
      };
      
      // Update patient with new vitals entry
      const currentVitals = patient.vitals || [];
      updatePatient(patientId, {
        vitals: [newVitalsEntry, ...currentVitals]
      });
      
      showToast('success', 'Vitals recorded successfully');
      reset();
      
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error('Error saving vitals:', error);
      showToast('error', 'Failed to record vitals');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="bg-[#0100F6] text-white p-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">Record Vitals</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-blue-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">
            Patient: <span className="font-medium text-gray-900">{patient.firstName} {patient.lastName}</span>
          </p>
          <p className="text-sm text-gray-500">
            Time: <span className="font-medium text-gray-900">{format(new Date(), 'dd-MMM-yyyy HH:mm')}</span>
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Temperature */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature (°C)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Thermometer className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.1"
                {...register('temperature', { valueAsNumber: true })}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
                placeholder="36.5"
              />
            </div>
            {errors.temperature && (
              <p className="mt-1 text-sm text-red-600">{errors.temperature.message}</p>
            )}
          </div>
          
          {/* Blood Pressure */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Pressure (mmHg)
            </label>
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Heart className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  {...register('bloodPressureSystolic', { valueAsNumber: true })}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
                  placeholder="Systolic (120)"
                />
              </div>
              <span className="flex items-center text-gray-500">/</span>
              <div className="relative flex-1">
                <input
                  type="number"
                  {...register('bloodPressureDiastolic', { valueAsNumber: true })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
                  placeholder="Diastolic (80)"
                />
              </div>
            </div>
            {(errors.bloodPressureSystolic || errors.bloodPressureDiastolic) && (
              <p className="mt-1 text-sm text-red-600">
                {errors.bloodPressureSystolic?.message || errors.bloodPressureDiastolic?.message}
              </p>
            )}
          </div>
          
          {/* Weight */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Scale className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.1"
                {...register('weight', { valueAsNumber: true })}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
                placeholder="70"
              />
            </div>
            {errors.weight && (
              <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
            )}
          </div>
          
          {/* Height */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Height (cm)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Ruler className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                {...register('height', { valueAsNumber: true })}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
                placeholder="170"
              />
            </div>
            {errors.height && (
              <p className="mt-1 text-sm text-red-600">{errors.height.message}</p>
            )}
          </div>
          
          {/* Pulse Rate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pulse Rate (bpm)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                {...register('pulseRate', { valueAsNumber: true })}
                className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
                placeholder="72"
              />
            </div>
            {errors.pulseRate && (
              <p className="mt-1 text-sm text-red-600">{errors.pulseRate.message}</p>
            )}
          </div>
          
          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              {...register('notes')}
              rows={3}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-[#0100F6] focus:border-[#0100F6] sm:text-sm"
              placeholder="Any additional observations..."
            ></textarea>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0100F6]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-[#0100F6] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0100F6] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <span className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Vitals
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
