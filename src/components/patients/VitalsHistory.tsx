import React from 'react';
import { format } from 'date-fns';
import { Thermometer, Heart, Activity, Scale, Ruler, Clock } from 'lucide-react';

interface VitalsHistoryProps {
  vitals: Array<{
    id: number;
    date: string;
    temperature?: number;
    bloodPressureSystolic?: number;
    bloodPressureDiastolic?: number;
    weight?: number;
    height?: number;
    pulseRate?: number;
    notes?: string;
  }>;
}

export const VitalsHistory: React.FC<VitalsHistoryProps> = ({ vitals }) => {
  if (!vitals || vitals.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-md text-center">
        <p className="text-gray-500">No vitals records available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Date/Time
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              <div className="flex items-center">
                <Thermometer className="w-4 h-4 mr-1" />
                Temp (°C)
              </div>
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                BP (mmHg)
              </div>
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              <div className="flex items-center">
                <Scale className="w-4 h-4 mr-1" />
                Weight (kg)
              </div>
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              <div className="flex items-center">
                <Ruler className="w-4 h-4 mr-1" />
                Height (cm)
              </div>
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              <div className="flex items-center">
                <Activity className="w-4 h-4 mr-1" />
                Pulse (bpm)
              </div>
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Notes
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {vitals.map((vital) => (
            <tr key={vital.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {format(new Date(vital.date), 'dd-MMM-yyyy HH:mm')}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {vital.temperature !== undefined ? vital.temperature : '-'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {vital.bloodPressureSystolic !== undefined && vital.bloodPressureDiastolic !== undefined
                  ? `${vital.bloodPressureSystolic}/${vital.bloodPressureDiastolic}`
                  : '-'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {vital.weight !== undefined ? vital.weight : '-'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {vital.height !== undefined ? vital.height : '-'}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {vital.pulseRate !== undefined ? vital.pulseRate : '-'}
              </td>
              <td className="px-3 py-4 text-sm text-gray-500">
                {vital.notes || '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
