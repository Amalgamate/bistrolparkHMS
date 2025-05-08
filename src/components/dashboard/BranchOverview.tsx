import React from 'react';
import { Building, MapPin, Phone, Users, Calendar, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export const BranchOverview: React.FC = () => {
  const { user } = useAuth();
  const { branches } = useSettings();

  // Get current branch data
  const branchId = user?.branch || 'fedha';
  const branch = branches.find(b => b.id === branchId) || branches[0];

  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      <div className="p-4 bg-blue-700 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Building className="w-5 h-5 mr-2" />
            <h2 className="text-lg font-bold">{branch.name}</h2>
          </div>
          {branch.location && (
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${branch.location.latitude},${branch.location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded flex items-center hover:bg-opacity-30"
            >
              <MapPin className="w-3 h-3 mr-1" />
              View on Map
            </a>
          )}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4 space-y-3">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 text-gray-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Address</p>
              <p className="text-sm font-medium">{branch.address || '45 Utawala Road,'}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Phone className="w-4 h-4 text-gray-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Contact</p>
              <p className="text-sm font-medium">{branch.phone || '+254 722 334 567'}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 text-gray-500 mr-2" />
            <div>
              <p className="text-xs text-gray-500">Hours</p>
              <p className="text-sm font-medium">{branch.operatingHours || '8:00 AM - 6:00 PM'}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center p-3 bg-blue-50 rounded-lg">
            <Users className="w-6 h-6 text-blue-500 mb-1" />
            <p className="text-xs text-gray-500 mb-1">Staff</p>
            <p className="text-lg font-semibold text-blue-700">{branch.staffCount || '24'}</p>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-green-50 rounded-lg">
            <Users className="w-6 h-6 text-green-500 mb-1" />
            <p className="text-xs text-gray-500 mb-1">Patients/day</p>
            <p className="text-lg font-semibold text-green-700">~{branch.dailyPatients || '45'}</p>
          </div>

          <div className="flex flex-col items-center justify-center p-3 bg-purple-50 rounded-lg">
            <Calendar className="w-6 h-6 text-purple-500 mb-1" />
            <p className="text-xs text-gray-500 mb-1">Appointments</p>
            <p className="text-lg font-semibold text-purple-700">{branch.appointmentsToday || '12'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
