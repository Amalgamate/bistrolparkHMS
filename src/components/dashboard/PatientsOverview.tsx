import React from 'react';
import { LineChart } from '../charts/LineChart';
import { User } from 'lucide-react';

export const PatientsOverview: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 p-4 dashboard-content">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Patients Overview</h2>
      </div>

      <div className="flex items-center mb-4">
        <div className="p-2 rounded-full bg-blue-50 mr-3">
          <User className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Patients</h3>
          <div className="flex items-center">
            <p className="text-xl font-semibold text-gray-800">-</p>
            <span className="ml-2 text-sm text-gray-500">Discharged</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 flex flex-wrap gap-2">
        <div className="flex items-center bg-blue-50 px-2 py-1 rounded text-xs">
          <span className="font-medium mr-1 text-blue-700">-</span>
          <span className="text-gray-600">Executive Room</span>
        </div>
        <div className="flex items-center bg-green-50 px-2 py-1 rounded text-xs">
          <span className="font-medium mr-1 text-green-700">-</span>
          <span className="text-gray-600">Appointment</span>
        </div>
        <div className="flex items-center bg-purple-50 px-2 py-1 rounded text-xs">
          <span className="font-medium mr-1 text-purple-700">-</span>
          <span className="text-gray-600">Premium Room</span>
        </div>
        <div className="flex items-center bg-red-50 px-2 py-1 rounded text-xs">
          <span className="font-medium mr-1 text-red-700">-</span>
          <span className="text-gray-600">Emergency Room</span>
        </div>
      </div>

      <div className="mt-6 h-48">
        <LineChart
          data={[
            { label: '01-07', discharge: 12, new: 15 },
            { label: '08-12', discharge: 19, new: 22 },
            { label: '13-17', discharge: 15, new: 18 },
            { label: '18-21', discharge: 20, new: 23 },
            { label: '21-25', discharge: 18, new: 20 },
            { label: '26-31', discharge: 22, new: 25 },
          ]}
        />
      </div>

      <div className="flex justify-center mt-3 gap-6">
        <div className="flex items-center">
          <span className="w-4 h-0.5 bg-blue-600 mr-2"></span>
          <span className="text-xs text-gray-600">Discharge</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-0.5 border-b border-dashed border-gray-400 mr-2"></span>
          <span className="text-xs text-gray-600">New</span>
        </div>
      </div>
    </div>
  );
};