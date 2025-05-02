import React from 'react';
import { Building, MapPin, Phone, Users, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Branch-specific data
const branchData = {
  'Fedha': {
    address: '123 Fedha Road, Nairobi',
    phone: '+254 700 123 456',
    operatingHours: '8:00 AM - 8:00 PM',
    staffCount: 45,
    dailyPatients: 120,
    appointmentsToday: 35,
    coordinates: '-1.2921,36.8219'
  },
  'Utawala': {
    address: '456 Utawala Avenue, Nairobi',
    phone: '+254 700 234 567',
    operatingHours: '8:00 AM - 6:00 PM',
    staffCount: 32,
    dailyPatients: 85,
    appointmentsToday: 28,
    coordinates: '-1.2921,36.8219'
  },
  'Machakos': {
    address: '789 Machakos Street, Machakos',
    phone: '+254 700 345 678',
    operatingHours: '8:00 AM - 7:00 PM',
    staffCount: 28,
    dailyPatients: 75,
    appointmentsToday: 22,
    coordinates: '-1.5177,37.2634'
  },
  'Tassia': {
    address: '321 Tassia Road, Nairobi',
    phone: '+254 700 456 789',
    operatingHours: '8:00 AM - 6:00 PM',
    staffCount: 25,
    dailyPatients: 65,
    appointmentsToday: 18,
    coordinates: '-1.2921,36.8219'
  },
  'Kitengela': {
    address: '654 Kitengela Avenue, Kajiado',
    phone: '+254 700 567 890',
    operatingHours: '8:00 AM - 7:00 PM',
    staffCount: 30,
    dailyPatients: 80,
    appointmentsToday: 25,
    coordinates: '-1.4778,36.9592'
  }
};

export const BranchOverview: React.FC = () => {
  const { user } = useAuth();
  const branch = user?.branch || 'Fedha';
  const data = branchData[branch];

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 bg-[#0100F6] text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-semibold">{branch} Branch</h2>
          </div>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${data.coordinates}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded flex items-center hover:bg-opacity-30"
          >
            <MapPin className="w-3 h-3 mr-1" />
            View on Map
          </a>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg">
            <Users className="w-8 h-8 text-blue-500 mb-2" />
            <p className="text-xs text-gray-500">Staff Count</p>
            <p className="text-xl font-semibold text-blue-700">{data.staffCount}</p>
            <p className="text-xs text-gray-500">employees</p>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-lg">
            <Users className="w-8 h-8 text-green-500 mb-2" />
            <p className="text-xs text-gray-500">Daily Patients</p>
            <p className="text-xl font-semibold text-green-700">~{data.dailyPatients}</p>
            <p className="text-xs text-gray-500">patients/day</p>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-purple-50 rounded-lg">
            <Calendar className="w-8 h-8 text-purple-500 mb-2" />
            <p className="text-xs text-gray-500">Today's Appointments</p>
            <p className="text-xl font-semibold text-purple-700">{data.appointmentsToday}</p>
            <p className="text-xs text-gray-500">scheduled</p>
          </div>
        </div>
      </div>
    </div>
  );
};
