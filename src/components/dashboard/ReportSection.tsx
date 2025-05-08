import React from 'react';
import { DonutChart } from '../charts/DonutChart';
import { PlusCircle } from 'lucide-react';

export const ReportSection: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 dashboard-content">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium text-[#2B3990]">Report</h2>
        <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-[#2B3990] bg-[#E6F3F7] hover:bg-[#A5C4D4] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A5C4D4]">
          <PlusCircle className="w-4 h-4 mr-1" />
          Add Report
        </button>
      </div>

      <div className="flex justify-center">
        <div className="w-64 h-64">
          <DonutChart
            value={0}
            segments={[
              { percent: 0, color: '#A61F1F', label: 'Urgent' },
              { percent: 0, color: '#F8CE6A', label: 'Moderate' },
              { percent: 0, color: '#A5D8B5', label: 'Low' },
              { percent: 100, color: '#E6F3F7', label: '' },
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-4">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-[#A61F1F] mr-1"></span>
            <span className="text-sm font-medium text-gray-700">Urgent</span>
          </div>
          <p className="text-xs text-gray-500">0% done</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-[#F8CE6A] mr-1"></span>
            <span className="text-sm font-medium text-gray-700">Moderate</span>
          </div>
          <p className="text-xs text-gray-500">0% done</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-[#A5D8B5] mr-1"></span>
            <span className="text-sm font-medium text-gray-700">Low</span>
          </div>
          <p className="text-xs text-gray-500">0% done</p>
        </div>
      </div>
    </div>
  );
};