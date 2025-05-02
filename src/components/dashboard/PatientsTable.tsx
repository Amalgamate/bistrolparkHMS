import React, { useState } from 'react';
import { Trash2, Edit2 } from 'lucide-react';

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
  const [patients] = useState<Patient[]>([
    {
      id: '1',
      name: 'Sabrina Carpenter',
      age: 39,
      gender: 'Female',
      idNumber: 'BR263585643',
      admissionDate: '6 Jan 2024',
      diagnosis: 'Bruised Rib',
      status: 'Urgent',
      room: 'Tulip Room'
    },
    {
      id: '2',
      name: 'Andrea Tea',
      age: 22,
      gender: 'Female',
      idNumber: 'PN386419007',
      admissionDate: '6 Jan 2024',
      diagnosis: 'Pneumonia',
      status: 'Moderate',
      room: 'Rose Room'
    },
    {
      id: '3',
      name: 'Andrea Tea',
      age: 22,
      gender: 'Female',
      idNumber: 'PN386419007',
      admissionDate: '6 Jan 2024',
      diagnosis: 'Pneumonia',
      status: 'Moderate',
      room: 'Rose Room'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Urgent':
        return 'bg-red-50 text-[#FF7F7F]';
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
          <h2 className="text-lg font-medium text-[#2B4F60]">
            Patients Detail Information
          </h2>
          <div className="flex mt-2 md:mt-0">
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                timeFilter === 'Today'
                ? 'bg-[#2B4F60] text-white'
                : 'text-gray-500 hover:text-[#2B4F60]'
              } rounded-md transition-colors duration-200`}
              onClick={() => setTimeFilter('Today')}
            >
              Today
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                timeFilter === 'Last Week'
                ? 'bg-[#2B4F60] text-white'
                : 'text-gray-500 hover:text-[#2B4F60]'
              } rounded-md transition-colors duration-200`}
              onClick={() => setTimeFilter('Last Week')}
            >
              Last Week
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                timeFilter === 'Last Month'
                ? 'bg-[#2B4F60] text-white'
                : 'text-gray-500 hover:text-[#2B4F60]'
              } rounded-md transition-colors duration-200`}
              onClick={() => setTimeFilter('Last Month')}
            >
              Last Month
            </button>
            <button
              className={`px-3 py-1.5 text-sm font-medium ${
                timeFilter === 'Last Year'
                ? 'bg-[#2B4F60] text-white'
                : 'text-gray-500 hover:text-[#2B4F60]'
              } rounded-md transition-colors duration-200`}
              onClick={() => setTimeFilter('Last Year')}
            >
              Last Year
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[#2B4F60] border-gray-300 rounded focus:ring-[#A5C4D4]"
                  />
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID Number
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Admission Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diagnose
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Room Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-[#2B4F60] border-gray-300 rounded focus:ring-[#A5C4D4]"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                    <div className="text-xs text-gray-500">{patient.age} y.o., {patient.gender}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.idNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.admissionDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {patient.diagnosis}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.room}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-[#FF7F7F] transition-colors duration-200">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-[#2B4F60] transition-colors duration-200">
                      <Edit2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};