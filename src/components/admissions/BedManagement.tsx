import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Bed,
  User,
  Calendar,
  PlusCircle,
  Settings,
  Info,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  LucideIcon
} from 'lucide-react';
import { Room, Bed as BedType } from '../../context/AdmissionContext';
import { format } from 'date-fns';
import { ColoredIcon } from '../ui/colored-icon';
import { ColorVariant } from '../ui/colored-icon-button';

interface BedManagementProps {
  rooms: Room[];
  onAdmitPatient: () => void;
}

const BedManagement: React.FC<BedManagementProps> = ({
  rooms,
  onAdmitPatient
}) => {
  const [activeTab, setActiveTab] = useState('all');

  // Filter rooms based on active tab
  const filteredRooms = activeTab === 'all'
    ? rooms
    : rooms.filter(room => room.type.toLowerCase() === activeTab.toLowerCase());

  // Count rooms by type and status
  const roomCounts = {
    executive: {
      total: rooms.filter(room => room.type === 'Executive').length,
      available: rooms.filter(room => room.type === 'Executive' && room.status === 'Available').length,
      occupied: rooms.filter(room => room.type === 'Executive' && room.status === 'Occupied').length,
      maintenance: rooms.filter(room => room.type === 'Executive' && room.status === 'Maintenance').length
    },
    premium: {
      total: rooms.filter(room => room.type === 'Premium').length,
      available: rooms.filter(room => room.type === 'Premium' && room.status === 'Available').length,
      occupied: rooms.filter(room => room.type === 'Premium' && room.status === 'Occupied').length,
      maintenance: rooms.filter(room => room.type === 'Premium' && room.status === 'Maintenance').length
    },
    basic: {
      total: rooms.filter(room => room.type === 'Basic').length,
      available: rooms.filter(room => room.type === 'Basic' && room.status === 'Available').length,
      occupied: rooms.filter(room => room.type === 'Basic' && room.status === 'Occupied').length,
      maintenance: rooms.filter(room => room.type === 'Basic' && room.status === 'Maintenance').length
    },
    ward: {
      total: rooms.filter(room => room.type === 'Ward').length,
      available: rooms.filter(room => room.type === 'Ward' && room.status === 'Available').length,
      occupied: rooms.filter(room => room.type === 'Ward' && room.status === 'Occupied').length,
      maintenance: rooms.filter(room => room.type === 'Ward' && room.status === 'Maintenance').length
    }
  };

  // Count total beds in wards
  const bedCounts = {
    total: rooms
      .filter(room => room.type === 'Ward')
      .reduce((acc, room) => acc + (room.beds?.length || 0), 0),
    available: rooms
      .filter(room => room.type === 'Ward')
      .reduce((acc, room) => acc + (room.beds?.filter(bed => bed.status === 'Available').length || 0), 0),
    occupied: rooms
      .filter(room => room.type === 'Ward')
      .reduce((acc, room) => acc + (room.beds?.filter(bed => bed.status === 'Occupied').length || 0), 0),
    maintenance: rooms
      .filter(room => room.type === 'Ward')
      .reduce((acc, room) => acc + (room.beds?.filter(bed => bed.status === 'Maintenance').length || 0), 0)
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return dateString;
    }
  };

  // Render a room row
  const renderRoomRow = (room: Room) => {
    const isWard = room.type === 'Ward';

    return (
      <div
        key={room.id}
        className={`
          border-b last:border-b-0 py-3 px-4 hover:bg-gray-50 transition-colors
        `}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <ColoredIcon
              icon={Bed}
              color={room.status === 'Available' ? 'green' :
                     room.status === 'Maintenance' ? 'orange' : 'blue'}
              size="sm"
              variant="outline"
              className="mr-3"
            />
            <div>
              <h3 className="font-medium">{room.name}</h3>
              <p className="text-xs text-gray-500">{room.type} • {room.floor} • {room.wing}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm mr-2">
              <span className="font-medium">KSh {room.dailyRate.toLocaleString()}</span>
              <span className="text-gray-500 text-xs"> / day</span>
            </div>

            <Badge variant={
              room.status === 'Available' ? 'success' :
              room.status === 'Maintenance' ? 'warning' : 'secondary'
            }>
              {room.status}
            </Badge>

            {room.status === 'Available' && (
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 border-green-200 hover:bg-green-50"
                onClick={onAdmitPatient}
              >
                <ColoredIcon icon={PlusCircle} color="green" size="xs" variant="text" className="mr-1" />
                Admit
              </Button>
            )}
            {room.status === 'Maintenance' && (
              <Button
                variant="outline"
                size="sm"
                className="text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <ColoredIcon icon={Settings} color="orange" size="xs" variant="text" className="mr-1" />
                Maintenance
              </Button>
            )}
            {room.status === 'Occupied' && (
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                <ColoredIcon icon={Info} color="blue" size="xs" variant="text" className="mr-1" />
                Details
              </Button>
            )}
          </div>
        </div>

        {room.status === 'Occupied' && !isWard && (
          <div className="mt-2 ml-9 flex items-center text-sm">
            <ColoredIcon icon={User} color="blue" size="xs" variant="text" className="mr-1" />
            <span className="font-medium mr-2">{room.patientName}</span>
            <ColoredIcon icon={Calendar} color="indigo" size="xs" variant="text" className="mr-1" />
            <span className="text-gray-600">Since {formatDate(room.admissionDate)}</span>
          </div>
        )}

        {isWard && room.beds && (
          <div className="mt-2 ml-9">
            <div className="flex flex-wrap gap-2 mt-1">
              {room.beds.map(bed => (
                <div
                  key={bed.id}
                  className={`
                    inline-flex items-center px-2 py-1 rounded-full text-xs
                    ${bed.status === 'Available' ? 'bg-green-50 text-green-700 border border-green-200' :
                      bed.status === 'Maintenance' ? 'bg-orange-50 text-orange-700 border border-orange-200' :
                      'bg-blue-50 text-blue-700 border border-blue-200'}
                  `}
                >
                  {bed.status === 'Available' ? (
                    <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                  ) : bed.status === 'Maintenance' ? (
                    <AlertTriangle className="h-3 w-3 mr-1 text-orange-500" />
                  ) : (
                    <User className="h-3 w-3 mr-1 text-blue-500" />
                  )}
                  <span className="font-medium mr-1">Bed {bed.number}</span>
                  {bed.status === 'Occupied' && bed.patientName && (
                    <span className="text-gray-600">({bed.patientName})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Bed Occupancy Overview</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Executive Rooms</h4>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-blue-700">{roomCounts.executive.total}</div>
              <div className="text-sm">
                <div className="flex items-center">
                  <ColoredIcon icon={CheckCircle2} color="green" size="xs" variant="text" className="mr-1" />
                  <span className="text-green-600">{roomCounts.executive.available} Available</span>
                </div>
                <div className="flex items-center">
                  <ColoredIcon icon={User} color="blue" size="xs" variant="text" className="mr-1" />
                  <span className="text-blue-600">{roomCounts.executive.occupied} Occupied</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Premium Rooms</h4>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-indigo-700">{roomCounts.premium.total}</div>
              <div className="text-sm">
                <div className="flex items-center">
                  <ColoredIcon icon={CheckCircle2} color="green" size="xs" variant="text" className="mr-1" />
                  <span className="text-green-600">{roomCounts.premium.available} Available</span>
                </div>
                <div className="flex items-center">
                  <ColoredIcon icon={User} color="indigo" size="xs" variant="text" className="mr-1" />
                  <span className="text-indigo-600">{roomCounts.premium.occupied} Occupied</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-100 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Basic Rooms</h4>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-purple-700">{roomCounts.basic.total}</div>
              <div className="text-sm">
                <div className="flex items-center">
                  <ColoredIcon icon={CheckCircle2} color="green" size="xs" variant="text" className="mr-1" />
                  <span className="text-green-600">{roomCounts.basic.available} Available</span>
                </div>
                <div className="flex items-center">
                  <ColoredIcon icon={User} color="purple" size="xs" variant="text" className="mr-1" />
                  <span className="text-purple-600">{roomCounts.basic.occupied} Occupied</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-teal-50 border border-teal-100 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Ward Beds</h4>
            <div className="flex justify-between items-center">
              <div className="text-2xl font-bold text-teal-700">{bedCounts.total}</div>
              <div className="text-sm">
                <div className="flex items-center">
                  <ColoredIcon icon={CheckCircle2} color="green" size="xs" variant="text" className="mr-1" />
                  <span className="text-green-600">{bedCounts.available} Available</span>
                </div>
                <div className="flex items-center">
                  <ColoredIcon icon={User} color="teal" size="xs" variant="text" className="mr-1" />
                  <span className="text-teal-600">{bedCounts.occupied} Occupied</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="px-4 pt-4">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="all">All Rooms</TabsTrigger>
              <TabsTrigger value="executive">Executive</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="ward">Ward</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="p-0">
            <div className="border rounded-lg overflow-hidden">
              {filteredRooms.map(room => renderRoomRow(room))}
            </div>
          </TabsContent>

          <TabsContent value="executive" className="p-0">
            <div className="border rounded-lg overflow-hidden">
              {filteredRooms.map(room => renderRoomRow(room))}
            </div>
          </TabsContent>

          <TabsContent value="premium" className="p-0">
            <div className="border rounded-lg overflow-hidden">
              {filteredRooms.map(room => renderRoomRow(room))}
            </div>
          </TabsContent>

          <TabsContent value="basic" className="p-0">
            <div className="border rounded-lg overflow-hidden">
              {filteredRooms.map(room => renderRoomRow(room))}
            </div>
          </TabsContent>

          <TabsContent value="ward" className="p-0">
            <div className="border rounded-lg overflow-hidden">
              {filteredRooms.map(room => renderRoomRow(room))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BedManagement;
