import React from 'react';
import { LineChart } from '../charts/LineChart';
import { User } from 'lucide-react';

export const PatientsOverview: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 dashboard-content">
      <div className="mb-6">
        <h2 className="text-lg font-medium text-[#2B4F60]">Patients Overview</h2>
      </div>

      <div className="flex items-center mb-6">
        <div className="p-2 rounded-full bg-[#E6F3F7] mr-3">
          <User className="w-5 h-5 text-[#2B4F60]" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-500">Patients</h3>
          <div className="flex items-center">
            <p className="text-2xl font-semibold text-[#2B4F60]">50</p>
            <span className="ml-2 text-sm text-gray-500">Discharged</span>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 flex flex-wrap gap-2">
        <div className="flex items-center bg-[#E6F3F7] px-2 py-1 rounded text-xs">
          <span className="font-medium mr-1">10</span>
          <span className="text-gray-500">Executive Room</span>
        </div>
        <div className="flex items-center bg-[#E6F3F7] px-2 py-1 rounded text-xs">
          <span className="font-medium mr-1">16</span>
          <span className="text-gray-500">Appointment</span>
        </div>
        <div className="flex items-center bg-[#E6F3F7] px-2 py-1 rounded text-xs">
          <span className="font-medium mr-1">20</span>
          <span className="text-gray-500">Premium Room</span>
        </div>
        <div className="flex items-center bg-[#E6F3F7] px-2 py-1 rounded text-xs">
          <span className="font-medium mr-1">4</span>
          <span className="text-gray-500">Emergency Room</span>
        </div>
      </div>

      <div className="mt-6 h-56">
        <LineChart
          data={[
            { label: '01-07', discharge: 30, new: 40 },
            { label: '08-12', discharge: 35, new: 32 },
            { label: '13-17', discharge: 25, new: 30 },
            { label: '18-21', discharge: 40, new: 35 },
            { label: '21-25', discharge: 45, new: 38 },
            { label: '26-31', discharge: 35, new: 30 },
          ]}
        />
      </div>

      <div className="flex justify-center mt-4 gap-6">
        <div className="flex items-center">
          <span className="w-4 h-0.5 bg-[#2B4F60] mr-2"></span>
          <span className="text-sm">Discharge</span>
        </div>
        <div className="flex items-center">
          <span className="w-4 h-0.5 border-b border-dashed border-gray-400 mr-2"></span>
          <span className="text-sm">New</span>
        </div>
      </div>
    </div>
  );
};