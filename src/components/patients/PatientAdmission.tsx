import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { mockRooms } from '../../data/mockData';

const admissionSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  roomType: z.enum(['Executive', 'Premium', 'Basic']),
  roomId: z.string().min(1, 'Room is required'),
  admissionDate: z.string(),
  admissionTime: z.string(),
  initialDiagnosis: z.string().min(5, 'Initial diagnosis is required'),
  assignedDoctor: z.string().min(1, 'Assigned doctor is required'),
  notes: z.string().optional(),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

export const PatientAdmission: React.FC = () => {
  const [selectedRoomType, setSelectedRoomType] = useState<string>('');
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
  });

  const availableRooms = mockRooms.filter(
    room => room.status === 'Available' && room.type === selectedRoomType
  );

  const onSubmit = (data: AdmissionFormData) => {
    console.log(data);
    // Here you would typically send the data to your backend
    reset();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-[#2B4F60] mb-6">Patient Admission</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient ID</label>
            <input
              type="text"
              {...register('patientId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A5C4D4] focus:ring focus:ring-[#A5C4D4] focus:ring-opacity-50"
            />
            {errors.patientId && (
              <p className="mt-1 text-sm text-red-600">{errors.patientId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Room Type</label>
            <select
              {...register('roomType')}
              onChange={(e) => setSelectedRoomType(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A5C4D4] focus:ring focus:ring-[#A5C4D4] focus:ring-opacity-50"
            >
              <option value="">Select room type</option>
              <option value="Executive">Executive Room</option>
              <option value="Premium">Premium Room</option>
              <option value="Basic">Basic Room</option>
            </select>
            {errors.roomType && (
              <p className="mt-1 text-sm text-red-600">{errors.roomType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Available Rooms</label>
            <select
              {...register('roomId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A5C4D4] focus:ring focus:ring-[#A5C4D4] focus:ring-opacity-50"
            >
              <option value="">Select room</option>
              {availableRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
            </select>
            {errors.roomId && (
              <p className="mt-1 text-sm text-red-600">{errors.roomId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assigned Doctor</label>
            <select
              {...register('assignedDoctor')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A5C4D4] focus:ring focus:ring-[#A5C4D4] focus:ring-opacity-50"
            >
              <option value="">Select doctor</option>
              <option value="1">Dr. Sarah Williams</option>
              <option value="2">Dr. Michael Chen</option>
              <option value="3">Dr. David Thompson</option>
            </select>
            {errors.assignedDoctor && (
              <p className="mt-1 text-sm text-red-600">{errors.assignedDoctor.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Admission Date</label>
            <input
              type="date"
              {...register('admissionDate')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A5C4D4] focus:ring focus:ring-[#A5C4D4] focus:ring-opacity-50"
            />
            {errors.admissionDate && (
              <p className="mt-1 text-sm text-red-600">{errors.admissionDate.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Admission Time</label>
            <input
              type="time"
              {...register('admissionTime')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A5C4D4] focus:ring focus:ring-[#A5C4D4] focus:ring-opacity-50"
            />
            {errors.admissionTime && (
              <p className="mt-1 text-sm text-red-600">{errors.admissionTime.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Initial Diagnosis</label>
          <textarea
            {...register('initialDiagnosis')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A5C4D4] focus:ring focus:ring-[#A5C4D4] focus:ring-opacity-50"
          />
          {errors.initialDiagnosis && (
            <p className="mt-1 text-sm text-red-600">{errors.initialDiagnosis.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
          <textarea
            {...register('notes')}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#A5C4D4] focus:ring focus:ring-[#A5C4D4] focus:ring-opacity-50"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A5C4D4]"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-[#2B4F60] rounded-md hover:bg-[#1e3b4a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A5C4D4]"
          >
            Admit Patient
          </button>
        </div>
      </form>
    </div>
  );
};