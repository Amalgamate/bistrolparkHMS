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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Search,
  Filter,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FlaskConical,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { useLab, LabRequestStatus } from '../../context/LabContext';
import { format, parseISO } from 'date-fns';

interface LabRequestsProps {
  branch: string;
}

const LabRequests: React.FC<LabRequestsProps> = ({ branch }) => {
  const { labRequests, collectSample, startProcessing, addTestResults } = useLab();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LabRequestStatus | 'all'>('all');
  const [filteredRequests, setFilteredRequests] = useState(labRequests);

  // Apply filters when dependencies change
  useEffect(() => {
    let filtered = labRequests;

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

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => 
        request.tests.some(test => test.status === statusFilter)
      );
    }

    setFilteredRequests(filtered);
  }, [labRequests, branch, searchQuery, statusFilter]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'dd MMM yyyy, h:mm a');
  };

  // Get status badge color
  const getStatusBadge = (status: LabRequestStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'sample_collected':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Sample Collected</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Processing</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Handle sample collection
  const handleCollectSample = (requestId: string, testId: string) => {
    collectSample(requestId, testId, 'Lab Technician'); // In a real app, use the current user's name
  };

  // Handle start processing
  const handleStartProcessing = (requestId: string, testId: string) => {
    startProcessing(requestId, testId);
  };

  // Handle add results (simplified for demo)
  const handleAddResults = (requestId: string, testId: string) => {
    // In a real app, this would open a modal to enter detailed results
    const mockResults = [
      {
        parameter: 'WBC',
        value: '7.2',
        unit: 'x10^9/L',
        referenceRange: '4.0-11.0',
        flag: 'normal' as const
      },
      {
        parameter: 'RBC',
        value: '4.8',
        unit: 'x10^12/L',
        referenceRange: '4.5-5.5',
        flag: 'normal' as const
      }
    ];
    
    addTestResults(requestId, testId, mockResults);
  };

  // Handle view results
  const handleViewResults = (requestId: string, testId: string) => {
    console.log(`View results for request ${requestId}, test ${testId}`);
    // In a real app, this would open a modal to view detailed results
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Lab Requests</CardTitle>
            <CardDescription>Manage laboratory test requests and results</CardDescription>
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
            <Tabs defaultValue="all" value={statusFilter} onValueChange={(value) => setStatusFilter(value as LabRequestStatus | 'all')}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="sample_collected">Collected</TabsTrigger>
                <TabsTrigger value="processing">Processing</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Lab Requests Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Patient</TableHead>
                <TableHead>Test</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                    No lab requests found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.flatMap(request => 
                  request.tests.map(test => (
                    <TableRow key={`${request.id}-${test.id}`}>
                      <TableCell className="font-medium">{request.id}</TableCell>
                      <TableCell>
                        <div className="font-medium">{request.patientName}</div>
                        <div className="text-sm text-gray-500">{request.patientId}</div>
                      </TableCell>
                      <TableCell>{test.testName}</TableCell>
                      <TableCell>{request.doctorName || 'N/A'}</TableCell>
                      <TableCell>{formatDate(test.requestedAt)}</TableCell>
                      <TableCell>{getStatusBadge(test.status)}</TableCell>
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
                            
                            {test.status === 'pending' && (
                              <DropdownMenuItem onClick={() => handleCollectSample(request.id, test.id)}>
                                <FlaskConical className="mr-2 h-4 w-4" />
                                Collect Sample
                              </DropdownMenuItem>
                            )}
                            
                            {test.status === 'sample_collected' && (
                              <DropdownMenuItem onClick={() => handleStartProcessing(request.id, test.id)}>
                                <Clock className="mr-2 h-4 w-4" />
                                Start Processing
                              </DropdownMenuItem>
                            )}
                            
                            {test.status === 'processing' && (
                              <DropdownMenuItem onClick={() => handleAddResults(request.id, test.id)}>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Add Results
                              </DropdownMenuItem>
                            )}
                            
                            {test.status === 'completed' && (
                              <DropdownMenuItem onClick={() => handleViewResults(request.id, test.id)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Results
                              </DropdownMenuItem>
                            )}
                            
                            {test.status === 'completed' && (
                              <DropdownMenuItem>
                                <Download className="mr-2 h-4 w-4" />
                                Download Report
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabRequests;
