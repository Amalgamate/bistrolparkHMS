import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '../../ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '../../ui/table';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { 
  Calendar, 
  Download, 
  Printer, 
  Filter, 
  ChevronDown,
  Bed,
  User,
  DollarSign,
  FileText,
  Stethoscope
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu';
import { useAdmission } from '../../../context/AdmissionContext';
import { format, differenceInDays } from 'date-fns';

interface AdmissionsReportViewProps {
  reportType: string;
}

const AdmissionsReportView: React.FC<AdmissionsReportViewProps> = ({ reportType }) => {
  const { admittedPatients, dischargedPatients, rooms } = useAdmission();
  const [dateRange, setDateRange] = useState<'all' | '7days' | '30days' | '90days'>('all');
  const [reportData, setReportData] = useState<any[]>([]);
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  
  // Generate report based on type
  useEffect(() => {
    const today = new Date();
    let filteredData: any[] = [];
    
    const filterByDateRange = (date: string) => {
      const itemDate = new Date(date);
      const diffDays = differenceInDays(today, itemDate);
      
      if (dateRange === 'all') return true;
      if (dateRange === '7days') return diffDays <= 7;
      if (dateRange === '30days') return diffDays <= 30;
      if (dateRange === '90days') return diffDays <= 90;
      
      return true;
    };
    
    switch (reportType) {
      case 'discharge-report':
        setReportTitle('Discharged Patients Report');
        setReportDescription('Detailed report of all discharged patients');
        filteredData = dischargedPatients
          .filter(patient => filterByDateRange(patient.dischargeDate || ''))
          .map(patient => ({
            ...patient,
            stayDuration: differenceInDays(
              new Date(patient.dischargeDate || today),
              new Date(patient.admissionDate)
            )
          }));
        break;
        
      case 'admissions-report':
        setReportTitle('Admissions Report');
        setReportDescription('Detailed report of all patient admissions');
        filteredData = [...admittedPatients, ...dischargedPatients]
          .filter(patient => filterByDateRange(patient.admissionDate))
          .map(patient => ({
            ...patient,
            stayDuration: patient.status === 'discharged'
              ? differenceInDays(
                  new Date(patient.dischargeDate || today),
                  new Date(patient.admissionDate)
                )
              : differenceInDays(today, new Date(patient.admissionDate))
          }));
        break;
        
      case 'doctor-admissions-report':
        setReportTitle('Admissions By Doctor Report');
        setReportDescription('Patient admissions grouped by attending doctor');
        
        // Group by doctor
        const doctorGroups: Record<string, any> = {};
        
        [...admittedPatients, ...dischargedPatients]
          .filter(patient => filterByDateRange(patient.admissionDate))
          .forEach(patient => {
            if (!doctorGroups[patient.doctorId]) {
              doctorGroups[patient.doctorId] = {
                doctorId: patient.doctorId,
                doctorName: patient.doctorName,
                patients: []
              };
            }
            
            doctorGroups[patient.doctorId].patients.push({
              ...patient,
              stayDuration: patient.status === 'discharged'
                ? differenceInDays(
                    new Date(patient.dischargeDate || today),
                    new Date(patient.admissionDate)
                  )
                : differenceInDays(today, new Date(patient.admissionDate))
            });
          });
          
        filteredData = Object.values(doctorGroups);
        break;
        
      case 'current-admissions-report':
        setReportTitle('Currently Admitted Patients Report');
        setReportDescription('Report of all patients currently admitted');
        filteredData = admittedPatients
          .filter(patient => filterByDateRange(patient.admissionDate))
          .map(patient => ({
            ...patient,
            stayDuration: differenceInDays(today, new Date(patient.admissionDate))
          }));
        break;
        
      case 'balances-report':
        setReportTitle('Admitted Patients Balances Report');
        setReportDescription('Financial report of balances for admitted patients');
        filteredData = admittedPatients
          .filter(patient => !patient.billPaid)
          .map(patient => {
            const stayDuration = differenceInDays(today, new Date(patient.admissionDate));
            const dailyRate = patient.roomType === 'Executive' 
              ? 15000 
              : patient.roomType === 'Premium' 
                ? 10000 
                : patient.roomType === 'Basic' 
                  ? 5000 
                  : 2500; // Ward
            
            return {
              ...patient,
              stayDuration,
              dailyRate,
              estimatedBill: dailyRate * (stayDuration || 1)
            };
          });
        break;
        
      case 'unoccupied-beds-report':
        setReportTitle('Unoccupied Beds Report');
        setReportDescription('Report of all available beds and rooms');
        filteredData = rooms
          .filter(room => room.status === 'Available')
          .map(room => ({
            ...room,
            availableBeds: room.beds?.filter(bed => bed.status === 'Available').length || 0,
            totalBeds: room.beds?.length || 0
          }));
        break;
        
      default:
        setReportTitle('Report');
        setReportDescription('Select a report type');
        filteredData = [];
    }
    
    setReportData(filteredData);
  }, [reportType, dateRange, admittedPatients, dischargedPatients, rooms]);
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'dd MMM yyyy');
    } catch (error) {
      return dateString;
    }
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting ${reportTitle} in ${format} format`);
    // In a real app, you would generate and download the export file
  };
  
  // Render different report views based on type
  const renderReportContent = () => {
    switch (reportType) {
      case 'discharge-report':
      case 'admissions-report':
      case 'current-admissions-report':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Admission Date</TableHead>
                {(reportType === 'discharge-report') && (
                  <TableHead>Discharge Date</TableHead>
                )}
                <TableHead>Room</TableHead>
                <TableHead>Doctor</TableHead>
                <TableHead>Stay Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No data available for this report
                  </TableCell>
                </TableRow>
              ) : (
                reportData.map((patient, index) => (
                  <TableRow key={patient.id}>
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
                    <TableCell>{formatDate(patient.admissionDate)}</TableCell>
                    {(reportType === 'discharge-report') && (
                      <TableCell>{formatDate(patient.dischargeDate)}</TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{patient.roomName}</span>
                      </div>
                    </TableCell>
                    <TableCell>{patient.doctorName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {patient.stayDuration} {patient.stayDuration === 1 ? 'day' : 'days'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={patient.status === 'admitted' ? 'secondary' : 'default'}>
                        {patient.status === 'admitted' ? 'Admitted' : 'Discharged'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        );
        
      case 'doctor-admissions-report':
        return (
          <div className="space-y-6">
            {reportData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No data available for this report
              </div>
            ) : (
              reportData.map((doctorGroup) => (
                <Card key={doctorGroup.doctorId} className="overflow-hidden">
                  <CardHeader className="bg-blue-50 pb-3">
                    <div className="flex items-center">
                      <Stethoscope className="h-5 w-5 mr-2 text-blue-700" />
                      <CardTitle className="text-lg">{doctorGroup.doctorName}</CardTitle>
                    </div>
                    <CardDescription>
                      {doctorGroup.patients.length} {doctorGroup.patients.length === 1 ? 'patient' : 'patients'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">#</TableHead>
                          <TableHead>Patient</TableHead>
                          <TableHead>Admission Date</TableHead>
                          <TableHead>Room</TableHead>
                          <TableHead>Stay Duration</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {doctorGroup.patients.map((patient: any, index: number) => (
                          <TableRow key={patient.id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{patient.patientName}</div>
                                <div className="text-xs text-gray-500">{patient.patientId}</div>
                              </div>
                            </TableCell>
                            <TableCell>{formatDate(patient.admissionDate)}</TableCell>
                            <TableCell>{patient.roomName}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">
                                {patient.stayDuration} {patient.stayDuration === 1 ? 'day' : 'days'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant={patient.status === 'admitted' ? 'secondary' : 'default'}>
                                {patient.status === 'admitted' ? 'Admitted' : 'Discharged'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        );
        
      case 'balances-report':
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Admission Date</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Stay Duration</TableHead>
                <TableHead>Daily Rate</TableHead>
                <TableHead>Estimated Bill</TableHead>
                <TableHead>Insurance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reportData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No unpaid balances found
                  </TableCell>
                </TableRow>
              ) : (
                reportData.map((patient, index) => (
                  <TableRow key={patient.id}>
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
                    <TableCell>{formatDate(patient.admissionDate)}</TableCell>
                    <TableCell>{patient.roomName}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {patient.stayDuration} {patient.stayDuration === 1 ? 'day' : 'days'}
                      </Badge>
                    </TableCell>
                    <TableCell>KSh {patient.dailyRate.toLocaleString()}</TableCell>
                    <TableCell className="font-medium">
                      KSh {patient.estimatedBill.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={patient.insuranceCovered ? "success" : "destructive"}>
                        {patient.insuranceCovered ? 'Covered' : 'Not Covered'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        );
        
      case 'unoccupied-beds-report':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportData.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-gray-500">
                No available rooms found
              </div>
            ) : (
              reportData.map((room) => (
                <Card key={room.id} className="overflow-hidden">
                  <CardHeader className={`
                    pb-3
                    ${room.type === 'Executive' ? 'bg-blue-50' : 
                      room.type === 'Premium' ? 'bg-indigo-50' : 
                      room.type === 'Basic' ? 'bg-purple-50' : 'bg-teal-50'}
                  `}>
                    <div className="flex items-center">
                      <Bed className={`
                        h-5 w-5 mr-2
                        ${room.type === 'Executive' ? 'text-blue-700' : 
                          room.type === 'Premium' ? 'text-indigo-700' : 
                          room.type === 'Basic' ? 'text-purple-700' : 'text-teal-700'}
                      `} />
                      <CardTitle className="text-lg">{room.name}</CardTitle>
                    </div>
                    <CardDescription>
                      {room.type} • {room.floor} • {room.wing}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Daily Rate:</span>
                        <span className="font-medium">KSh {room.dailyRate.toLocaleString()}</span>
                      </div>
                      
                      {room.type === 'Ward' && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Available Beds:</span>
                          <span className="font-medium">{room.availableBeds} of {room.totalBeds}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Features:</span>
                        <span className="text-sm">{room.features?.join(', ')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Select a report type to view data
          </div>
        );
    }
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">{reportTitle}</CardTitle>
              <CardDescription>{reportDescription}</CardDescription>
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    {dateRange === 'all' ? 'All Time' : 
                      dateRange === '7days' ? 'Last 7 Days' : 
                      dateRange === '30days' ? 'Last 30 Days' : 'Last 90 Days'}
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setDateRange('all')}>
                    All Time
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateRange('7days')}>
                    Last 7 Days
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateRange('30days')}>
                    Last 30 Days
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDateRange('90days')}>
                    Last 90 Days
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              
              <Button variant="outline" size="sm" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {renderReportContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdmissionsReportView;
