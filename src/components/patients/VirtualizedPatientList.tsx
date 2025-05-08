import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Eye, Edit, Trash2, Phone, Calendar, Clock, User } from 'lucide-react';
import { generatePastelColor, isLightColor } from '../../utils/colorUtils';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  gender: string;
  dateOfBirth: string;
  phone: string;
  nationalId?: string;
  bloodGroup?: string;
  lastVisit?: string;
  status: string;
  isAdmitted?: boolean;
  isCleared?: boolean;
  vitals?: any[];
}

interface VirtualizedPatientListProps {
  patients: Patient[];
  calculateAge: (dateOfBirth: string) => number;
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
}

// Row component defined outside the main component
const Row = ({
  index,
  style,
  data
}: {
  index: number;
  style: React.CSSProperties;
  data: {
    patients: Patient[];
    calculateAge: (dateOfBirth: string) => number;
    onView: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
  }
}) => {
  const { patients, calculateAge, onView, onEdit, onDelete } = data;
  const patient = patients[index];

  // Generate a pastel color based on the patient's name
  const avatarColor = useMemo(() => {
    const fullName = `${patient.firstName} ${patient.lastName}`;
    return generatePastelColor(fullName);
  }, [patient.firstName, patient.lastName]);

  // Determine if text should be dark or light based on background color
  const textColor = useMemo(() => {
    return isLightColor(avatarColor) ? '#000000' : '#FFFFFF';
  }, [avatarColor]);

  return (
    <div style={style} className={`flex border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100`}>
      <div className="flex-1 p-4 flex items-center">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-full w-10 h-10 font-semibold"
            style={{ backgroundColor: avatarColor, color: textColor }}
          >
            {patient.firstName.charAt(0)}{patient.lastName.charAt(0)}
          </div>
          <div>
            <div className="font-semibold">{patient.firstName} {patient.lastName}</div>
            <div className="text-sm text-muted">
              {patient.gender}, {calculateAge(patient.dateOfBirth)} years
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="flex flex-col">
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-1 text-gray-400" />
            <span>{patient.phone}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ID: {patient.nationalId || 'N/A'}
          </div>
        </div>
      </div>

      <div className="w-24 p-4 flex items-center justify-center">
        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
          {patient.bloodGroup || 'Unknown'}
        </span>
      </div>

      <div className="flex-1 p-4">
        <div className="flex flex-col">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
            <span>{patient.lastVisit || 'Never'}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>Last: {patient.vitals && patient.vitals.length > 0 ? 'Check-up' : 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="w-24 p-4 flex items-center justify-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          patient.status === 'Active'
            ? patient.isAdmitted
              ? 'bg-blue-50 text-blue-700'
              : patient.isCleared
                ? 'bg-purple-50 text-purple-700'
                : 'bg-green-50 text-green-700'
            : 'bg-yellow-50 text-yellow-700'
        }`}>
          {patient.isAdmitted
            ? 'Admitted'
            : patient.isCleared
              ? 'Cleared'
              : patient.status}
        </span>
      </div>

      <div className="w-32 p-4">
        <div className="flex items-center gap-2 justify-center">
          <button
            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
            onClick={() => onView(patient.id)}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-1 text-green-600 hover:bg-green-50 rounded"
            onClick={() => onEdit(patient.id)}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            className="p-1 text-red-600 hover:bg-red-50 rounded"
            onClick={() => onDelete(patient.id)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Memoize the Row component
const MemoizedRow = React.memo(Row);

// Empty list component
const EmptyList = () => (
  <div className="text-center py-8">
    <div className="flex flex-col items-center">
      <User className="w-12 h-12 text-gray-300 mb-2" />
      <p className="text-gray-500 mb-4">No patients found</p>
    </div>
  </div>
);

const VirtualizedPatientList: React.FC<VirtualizedPatientListProps> = ({
  patients,
  calculateAge,
  onView,
  onEdit,
  onDelete
}) => {

  if (patients.length === 0) {
    return <EmptyList />;
  }

  return (
    <div className="h-[calc(100vh-300px)] min-h-[400px]">
      <div className="flex font-semibold text-sm text-gray-600 border-b bg-gray-50">
        <div className="flex-1 p-4">Patient</div>
        <div className="flex-1 p-4">Contact</div>
        <div className="w-24 p-4 text-center">Blood Group</div>
        <div className="flex-1 p-4">Last Visit</div>
        <div className="w-24 p-4 text-center">Status</div>
        <div className="w-32 p-4 text-center">Actions</div>
      </div>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            width={width}
            itemCount={patients.length}
            itemSize={80}
            itemData={{
              patients,
              calculateAge,
              onView,
              onEdit,
              onDelete
            }}
          >
            {MemoizedRow}
          </List>
        )}
      </AutoSizer>
    </div>
  );
};

export default VirtualizedPatientList;
