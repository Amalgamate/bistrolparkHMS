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
  MoreHorizontal,
  Calendar,
  Clock,
  Bed,
  User,
  Stethoscope,
  FileCheck
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Admission } from '../../context/AdmissionContext';
import { format, differenceInDays } from 'date-fns';

interface DischargedPatientsListProps {
  patients: Admission[];
  onView: (patient: Admission) => void;
}

const DischargedPatientsList: React.FC<DischargedPatientsListProps> = ({
  patients,
  onView
}) => {
  const [sortField, setSortField] = useState<keyof Admission>('dischargeDate');
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

  const calculateStayDuration = (admissionDate: string, dischargeDate?: string) => {
    if (!dischargeDate) return 'N/A';
    
    const admissionDateTime = new Date(admissionDate);
    const dischargeDateTime = new Date(dischargeDate);
    const days = differenceInDays(dischargeDateTime, admissionDateTime);
    
    return `${days} ${days === 1 ? 'day' : 'days'}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Discharged Patients</h3>
        <p className="text-sm text-gray-500">
          {patients.length} {patients.length === 1 ? 'patient' : 'patients'} discharged
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
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('dischargeDate')}
              >
                Discharge Date
                {sortField === 'dischargeDate' && (
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
              <TableHead>Stay Duration</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedPatients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                  No discharged patients found
                </TableCell>
              </TableRow>
            ) : (
              sortedPatients.map((patient, index) => {
                const stayDuration = calculateStayDuration(patient.admissionDate, patient.dischargeDate);
                
                return (
                  <TableRow 
                    key={patient.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => onView(patient)}
                  >
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                          <User className="h-4 w-4 text-blue-700" />
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
                          <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                          <span>{formatDate(patient.admissionDate)}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{patient.admissionTime}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                          <span>{patient.dischargeDate ? formatDate(patient.dischargeDate) : 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{patient.dischargeTime || 'N/A'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1 text-gray-500" />
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
                      <Badge variant="secondary">
                        {stayDuration}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={patient.billPaid ? "success" : "destructive"}>
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
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            // Handle view medical records
                            console.log('View medical records for', patient.patientName);
                          }}>
                            <FileText className="h-4 w-4 mr-2" />
                            Medical Records
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            // Handle view discharge summary
                            console.log('View discharge summary for', patient.patientName);
                          }}>
                            <FileCheck className="h-4 w-4 mr-2" />
                            Discharge Summary
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
        Showing {patients.length} of {patients.length} discharged patients
      </div>
    </div>
  );
};

export default DischargedPatientsList;
