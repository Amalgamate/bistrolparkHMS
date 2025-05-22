import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Eye,
  FileText,
  UserMinus,
  MoreHorizontal,
  Calendar,
  Clock,
  Bed,
  User,
  Stethoscope,
  LucideIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Admission } from '../../context/AdmissionContext';
import { format } from 'date-fns';
import { ColoredIcon } from '../ui/colored-icon';
import { ColorVariant } from '../ui/colored-icon-button';

interface AdmittedPatientsListProps {
  patients: Admission[];
  onDischarge: (patient: Admission) => void;
  onView: (patient: Admission) => void;
}

const AdmittedPatientsList: React.FC<AdmittedPatientsListProps> = ({
  patients,
  onDischarge,
  onView
}) => {
  const [sortField, setSortField] = useState<keyof Admission>('admissionDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Admission) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedPatients = [...patients].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const calculateDaysAdmitted = (admissionDate: string) => {
    const admissionDateTime = new Date(admissionDate).getTime();
    const currentTime = new Date().getTime();
    const differenceInDays = Math.floor((currentTime - admissionDateTime) / (1000 * 3600 * 24));
    return differenceInDays;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Currently Admitted Patients</h3>
        <p className="text-sm text-gray-500">
          {patients.length} {patients.length === 1 ? 'patient' : 'patients'} currently admitted
        </p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('patientName')}
              >
                Patient
                {sortField === 'patientName' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('admissionDate')}
              >
                Admission Date
                {sortField === 'admissionDate' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead>Room</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('diagnosis')}
              >
                Diagnosis
                {sortField === 'diagnosis' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('doctorName')}
              >
                Doctor
                {sortField === 'doctorName' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No admitted patients found
                </TableCell>
              </TableRow>
            ) : (
              sortedPatients.map((patient, index) => {
                const daysAdmitted = calculateDaysAdmitted(patient.admissionDate);

                return (
                  <TableRow
                    key={patient.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onView(patient)}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="mr-2">
                          <ColoredIcon icon={User} color="blue" size="sm" variant="outline" />
                        </div>
                        <div>
                          <div className="font-medium">{patient.patientName}</div>
                          <div className="text-xs text-gray-500">{patient.patientId}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <ColoredIcon icon={Calendar} color="indigo" size="xs" variant="text" className="mr-1" />
                          <span>{formatDate(patient.admissionDate)}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <ColoredIcon icon={Clock} color="gray" size="xs" variant="text" className="mr-1" />
                          <span>{patient.admissionTime}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ColoredIcon icon={Bed} color="blue" size="xs" variant="text" className="mr-1" />
                        <div>
                          <div>{patient.roomName}</div>
                          <div className="text-xs text-gray-500">{patient.roomType}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate" title={patient.diagnosis}>
                        {patient.diagnosis}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ColoredIcon icon={Stethoscope} color="purple" size="xs" variant="text" className="mr-1" />
                        <span>{patient.doctorName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={daysAdmitted > 7 ? "destructive" : daysAdmitted > 3 ? "warning" : "secondary"}>
                        {daysAdmitted} {daysAdmitted === 1 ? 'day' : 'days'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={patient.billPaid ? "success" : "outline"}>
                        {patient.billPaid ? 'Paid' : 'Unpaid'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onView(patient);
                          }}>
                            <ColoredIcon icon={Eye} color="blue" size="xs" variant="text" className="mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            // Handle view medical records
                            console.log('View medical records for', patient.patientName);
                          }}>
                            <ColoredIcon icon={FileText} color="indigo" size="xs" variant="text" className="mr-2" />
                            Medical Records
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            onDischarge(patient);
                          }}>
                            <ColoredIcon icon={UserMinus} color="red" size="xs" variant="text" className="mr-2" />
                            Discharge Patient
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 border-t border-gray-200 text-sm text-gray-500">
        Showing {patients.length} of {patients.length} admitted patients
      </div>
    </div>
  );
};

export default AdmittedPatientsList;
