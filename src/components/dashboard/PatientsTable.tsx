import React, { useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';
import ResponsiveTable from '../common/ResponsiveTable';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  idNumber: string;
  admissionDate: string;
  diagnosis: string;
  status: 'Urgent' | 'Moderate' | 'Low';
  room: string;
}

export const PatientsTable: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('Today');
  const [patients] = useState<Patient[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Urgent':
        return 'bg-red-50 text-[#A61F1F]';
      case 'Moderate':
        return 'bg-yellow-50 text-yellow-700';
      case 'Low':
        return 'bg-green-50 text-green-700';
      default:
        return 'bg-gray-50 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm dashboard-content">
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between">
          <h2 className="text-lg font-medium text-[#2B3990]">
            Patients Detail Information
          </h2>
          <div className="flex mt-2 md:mt-0">
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                timeFilter === 'Today'
                ? 'bg-[#2B3990] text-white'
                : 'text-gray-500 hover:text-[#2B3990]'
              } rounded-md transition-colors duration-200`}
              onClick={() => setTimeFilter('Today')}
            >
              Today
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                timeFilter === 'Last Week'
                ? 'bg-[#2B3990] text-white'
                : 'text-gray-500 hover:text-[#2B3990]'
              } rounded-md transition-colors duration-200`}
              onClick={() => setTimeFilter('Last Week')}
            >
              Last Week
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                timeFilter === 'Last Month'
                ? 'bg-[#2B3990] text-white'
                : 'text-gray-500 hover:text-[#2B3990]'
              } rounded-md transition-colors duration-200`}
              onClick={() => setTimeFilter('Last Month')}
            >
              Last Month
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                timeFilter === 'Last Year'
                ? 'bg-[#2B3990] text-white'
                : 'text-gray-500 hover:text-[#2B3990]'
              } rounded-md transition-colors duration-200`}
              onClick={() => setTimeFilter('Last Year')}
            >
              Last Year
            </button>
          </div>
        </div>
      </div>

      <ResponsiveTable
        columns={[
          {
            key: 'select',
            header: '',
            width: '40px',
            render: (value, row) => (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-[#2B4F60] border-gray-300 rounded focus:ring-[#A5C4D4]"
                />
              </div>
            ),
            hideOnMobile: true
          },
          {
            key: 'name',
            header: 'Name',
            priority: 1
          },
          {
            key: 'idNumber',
            header: 'ID Number',
            priority: 2
          },
          {
            key: 'admissionDate',
            header: 'Admission Date',
            priority: 3
          },
          {
            key: 'diagnosis',
            header: 'Diagnose',
            priority: 4
          },
          {
            key: 'status',
            header: 'Status',
            priority: 5,
            render: (value, row) => (
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(value)}`}>
                {value}
              </span>
            )
          },
          {
            key: 'room',
            header: 'Room Name',
            hideOnMobile: true
          },
          {
            key: 'actions',
            header: 'Actions',
            priority: 6,
            render: (value, row) => (
              <div className="flex space-x-2">
                <button className="text-indigo-600 hover:text-indigo-900">
                  <Edit2 size={18} />
                </button>
                <button className="text-red-600 hover:text-red-900">
                  <Trash2 size={18} />
                </button>
              </div>
            )
          }
        ]}
        data={patients}
        keyField="id"
        emptyMessage="No patient data available"
      />
    </div>
  );
};