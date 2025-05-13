import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Search,
  Calendar,
  MoreHorizontal,
  Eye,
  Download,
  FileText
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { useLab } from '../../context/LabContext';
import { format, parseISO, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface InternalLabVisitsProps {
  branch: string;
}

const InternalLabVisits: React.FC<InternalLabVisitsProps> = ({ branch }) => {
  const { labRequests } = useLab();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [filteredVisits, setFilteredVisits] = useState(labRequests);

  // Apply filters when dependencies change
  useEffect(() => {
    let filtered = labRequests.filter(request => request.patientType === 'internal');

    // Apply branch filter
    if (branch !== 'all') {
      filtered = filtered.filter(request => request.branch.toLowerCase() === branch.toLowerCase());
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

    // Apply time filter
    if (timeFilter !== 'all') {
      filtered = filtered.filter(request => {
        const date = parseISO(request.createdAt);
        switch (timeFilter) {
          case 'today':
            return isToday(date);
          case 'yesterday':
            return isYesterday(date);
          case 'week':
            return isThisWeek(date);
          case 'month':
            return isThisMonth(date);
          default:
            return true;
        }
      });
    }

    setFilteredVisits(filtered);
  }, [labRequests, branch, searchQuery, timeFilter]);

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

  // Handle view details
  const handleViewDetails = (requestId: string) => {
    console.log(`View details for request ${requestId}`);
    // In a real app, this would navigate to a detailed view
  };

  // Handle download report
  const handleDownloadReport = (requestId: string) => {
    console.log(`Download report for request ${requestId}`);
    // In a real app, this would generate and download a PDF report
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Internal Patient Lab Visits</CardTitle>
            <CardDescription>View and manage lab visits for registered patients</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search by patient name, ID..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Tabs defaultValue="all" value={timeFilter} onValueChange={setTimeFilter}>
              <TabsList>
                <TabsTrigger value="all">All Time</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="yesterday">Yesterday</TabsTrigger>
                <TabsTrigger value="week">This Week</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Lab Visits Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visit ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Tests</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    No lab visits found
                  </TableCell>
                </TableRow>
              ) : (
                filteredVisits.map(visit => {
                  const completionPercentage = getCompletionStatus(visit);
                  return (
                    <TableRow key={visit.id}>
                      <TableCell className="font-medium">{visit.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{visit.patientName}</div>
                        <div className="text-sm text-gray-500">{visit.patientId}</div>
                      </TableCell>
                      <TableCell>{visit.doctorName || 'N/A'}</TableCell>
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
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDetails(visit.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {completionPercentage === 100 && (
                              <DropdownMenuItem onClick={() => handleDownloadReport(visit.id)}>
                                <Download className="mr-2 h-4 w-4" />
                                Download Report
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <FileText className="mr-2 h-4 w-4" />
                              View Invoice
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
      </CardContent>
    </Card>
  );
};

export default InternalLabVisits;
