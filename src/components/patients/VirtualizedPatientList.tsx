import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Eye, Edit, Trash2, Phone, Calendar, Clock, User } from 'lucide-react';
import { generatePastelColor, isLightColor } from '../../utils/colorUtils';

interface Patient {
  id: number | string;
  firstName?: string;
  lastName?: string;
  first_name?: string;
  last_name?: string;
  gender?: string;
  dateOfBirth?: string;
  date_of_birth?: string;
  phone?: string;
  nationalId?: string;
  national_id?: string;
  bloodGroup?: string;
  blood_type?: string;
  lastVisit?: string;
  last_visit?: string;
  status?: string;
  isAdmitted?: boolean;
  isCleared?: boolean;
  vitals?: any[];
  mrn?: string;
  email?: string;
  address?: string;
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

  // Handle potentially undefined patient
  if (!patient) {
    console.error('Patient is undefined at index', index);
    return null;
  }

  // Get first and last name from either naming convention
  const firstName = patient.firstName || patient.first_name || '';
  const lastName = patient.lastName || patient.last_name || '';

  // Log patient data for debugging
  if (index === 0) {
    console.log('Patient data structure:', patient);
  }

  // Generate a pastel color based on the patient's name
  const avatarColor = useMemo(() => {
    const fullName = `${firstName} ${lastName}`;
    return generatePastelColor(fullName);
  }, [firstName, lastName]);

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
            {firstName.charAt(0)}{lastName.charAt(0)}
          </div>
          <div>
            <div className="font-semibold">{firstName} {lastName}</div>
            <div className="text-sm text-muted">
              {patient.gender || 'Unknown'}, {calculateAge(patient.dateOfBirth || patient.date_of_birth || '')} years
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4">
        <div className="flex flex-col">
          <div className="flex items-center">
            <Phone className="w-4 h-4 mr-1 text-gray-400" />
            <span>{patient.phone || patient.mrn || 'N/A'}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ID: {patient.nationalId || patient.national_id || patient.mrn || 'N/A'}
          </div>
        </div>
      </div>

      <div className="w-24 p-4 flex items-center justify-center">
        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
          {patient.bloodGroup || patient.blood_type || 'Unknown'}
        </span>
      </div>

      <div className="flex-1 p-4">
        <div className="flex flex-col">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
            <span>{patient.lastVisit || patient.last_visit || 'Never'}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>Last: {patient.vitals && patient.vitals.length > 0 ? 'Check-up' : 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="w-24 p-4 flex items-center justify-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          (patient.status === 'Active' || !patient.status)
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
              : patient.status || 'Active'}
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
