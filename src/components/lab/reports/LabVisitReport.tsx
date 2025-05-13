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
import { Input } from '../../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/select';
import {
  Calendar,
  Download,
  FileText,
  Filter,
  Printer,
  Search
} from 'lucide-react';
import { useLab } from '../../../context/LabContext';
import { format, parseISO, isToday, isYesterday, isThisWeek, isThisMonth, subDays } from 'date-fns';
import { Badge } from '../../ui/badge';

interface LabVisitReportProps {
  branch: string;
}

const LabVisitReport: React.FC<LabVisitReportProps> = ({ branch }) => {
  const { labRequests, labTests } = useLab();
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<string>('today');
  const [patientType, setPatientType] = useState<'all' | 'internal' | 'external'>('all');
  const [filteredRequests, setFilteredRequests] = useState(labRequests);
  const [startDate, setStartDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  // Apply filters when dependencies change
  useEffect(() => {
    let filtered = labRequests;

    // Apply branch filter
    if (branch !== 'all') {
      filtered = filtered.filter(request => request.branch.toLowerCase() === branch.toLowerCase());
    }

    // Apply patient type filter
    if (patientType !== 'all') {
      filtered = filtered.filter(request => request.patientType === patientType);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(request => 
        request.patientName.toLowerCase().includes(query) ||
        request.id.toLowerCase().includes(query) ||
        request.patientId.toLowerCase().includes(query) ||
        (request.doctorName && request.doctorName.toLowerCase().includes(query))
      );
    }

    // Apply date filter
    filtered = filtered.filter(request => {
      const date = parseISO(request.createdAt);
      
      if (dateRange === 'custom') {
        const start = parseISO(`${startDate}T00:00:00`);
        const end = parseISO(`${endDate}T23:59:59`);
        return date >= start && date <= end;
      }
      
      switch (dateRange) {
        case 'today':
          return isToday(date);
        case 'yesterday':
          return isYesterday(date);
        case 'week':
          return isThisWeek(date);
        case 'month':
          return isThisMonth(date);
        case 'last7days':
          return date >= subDays(new Date(), 7);
        case 'last30days':
          return date >= subDays(new Date(), 30);
        default:
          return true;
      }
    });

    setFilteredRequests(filtered);
  }, [labRequests, branch, searchQuery, dateRange, patientType, startDate, endDate]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'dd MMM yyyy, h:mm a');
  };

  // Get completion status
  const getCompletionStatus = (request: typeof labRequests[0]) => {
    const totalTests = request.tests.length;
    const completedTests = request.tests.filter(test => test.status === 'completed').length;
    
    if (completedTests === 0) return 0;
    return Math.round((completedTests / totalTests) * 100);
  };

  // Get status badge
  const getStatusBadge = (percentage: number) => {
    if (percentage === 0) {
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    } else if (percentage === 100) {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
    } else {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Progress</Badge>;
    }
  };

  // Calculate total revenue
  const calculateTotalRevenue = () => {
    return filteredRequests.reduce((total, request) => {
      if (request.paymentStatus === 'complete') {
        return total + request.totalAmount;
      }
      return total;
    }, 0);
  };

  // Calculate pending revenue
  const calculatePendingRevenue = () => {
    return filteredRequests.reduce((total, request) => {
      if (request.paymentStatus !== 'complete') {
        return total + request.totalAmount;
      }
      return total;
    }, 0);
  };

  // Handle export to PDF
  const handleExportPDF = () => {
    console.log('Export to PDF');
    // In a real app, this would generate a PDF report
  };

  // Handle export to Excel
  const handleExportExcel = () => {
    console.log('Export to Excel');
    // In a real app, this would generate an Excel report
  };

  // Handle print
  const handlePrint = () => {
    console.log('Print report');
    // In a real app, this would print the report
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Lab Visit Report</CardTitle>
            <CardDescription>View and analyze laboratory visits and tests</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPDF}>
              <FileText className="mr-2 h-4 w-4" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportExcel}>
              <Download className="mr-2 h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger>
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          {dateRange === 'custom' && (
            <>
              <div>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </>
          )}
          
          <Select value={patientType} onValueChange={(value) => setPatientType(value as 'all' | 'internal' | 'external')}>
            <SelectTrigger>
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Patient type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients</SelectItem>
              <SelectItem value="internal">Internal Patients</SelectItem>
              <SelectItem value="external">External Patients</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{filteredRequests.length}</div>
              <p className="text-sm text-gray-500">Total Lab Visits</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">KES {calculateTotalRevenue().toLocaleString()}</div>
              <p className="text-sm text-gray-500">Total Revenue</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">KES {calculatePendingRevenue().toLocaleString()}</div>
              <p className="text-sm text-gray-500">Pending Revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Lab Visits Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visit ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Tests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    No lab visits found for the selected filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map(visit => {
                  const completionPercentage = getCompletionStatus(visit);
                  return (
                    <TableRow key={visit.id}>
                      <TableCell className="font-medium">{visit.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{visit.patientName}</div>
                        <div className="text-xs text-gray-500">{visit.patientId}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          visit.patientType === 'internal'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-purple-50 text-purple-700 border-purple-200'
                        }>
                          {visit.patientType === 'internal' ? 'Internal' : 'External'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(visit.createdAt)}</TableCell>
                      <TableCell>{visit.tests.length} test(s)</TableCell>
                      <TableCell>
                        {getStatusBadge(completionPercentage)}
                        {completionPercentage > 0 && completionPercentage < 100 && (
                          <div className="text-xs text-gray-500 mt-1">{completionPercentage}% complete</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={visit.paymentStatus === 'complete' ? 'outline' : 'secondary'} className={
                          visit.paymentStatus === 'complete' 
                            ? 'bg-green-50 text-green-700 border-green-200' 
                            : visit.paymentStatus === 'partial'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        }>
                          {visit.paymentStatus === 'complete' 
                            ? 'Paid' 
                            : visit.paymentStatus === 'partial'
                              ? 'Partial'
                              : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>KES {visit.totalAmount.toLocaleString()}</TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabVisitReport;
