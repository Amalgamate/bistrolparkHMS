import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  FileImage,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Zap,
  User
} from 'lucide-react';
import { useRadiology, RadiologyRequest, RadiologyStatus } from '../../context/RadiologyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { format } from 'date-fns';

const RadiologyRequests: React.FC = () => {
  const { 
    radiologyRequests, 
    radiologyTests,
    getRadiologyRequestsByStatus,
    updateRadiologyRequest,
    cancelRadiologyRequest,
    startProcessing,
    addTestResults
  } = useRadiology();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<RadiologyStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'normal' | 'urgent' | 'emergency'>('all');
  const [selectedRequest, setSelectedRequest] = useState<RadiologyRequest | null>(null);
  const [showRequestDetailsDialog, setShowRequestDetailsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter requests based on search term, status, and priority
  const filteredRequests = radiologyRequests.filter(request => {
    const matchesSearch = 
      request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.tests.some(test => test.testName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;
    
    // Filter based on active tab
    if (activeTab === 'all') {
      return matchesSearch && matchesStatus && matchesPriority;
    } else if (activeTab === 'pending') {
      return matchesSearch && matchesPriority && request.status === 'pending';
    } else if (activeTab === 'in_progress') {
      return matchesSearch && matchesPriority && request.status === 'in_progress';
    } else if (activeTab === 'completed') {
      return matchesSearch && matchesPriority && request.status === 'completed';
    } else if (activeTab === 'urgent') {
      return matchesSearch && matchesStatus && (request.priority === 'urgent' || request.priority === 'emergency');
    }
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  // Sort requests by priority and date
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    // First sort by priority (emergency first, then urgent, then normal)
    const priorityOrder = { emergency: 0, urgent: 1, normal: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    
    if (priorityDiff !== 0) return priorityDiff;
    
    // Then sort by date (newest first)
    const dateA = new Date(`${a.requestDate}T${a.requestTime}`);
    const dateB = new Date(`${b.requestDate}T${b.requestTime}`);
    return dateB.getTime() - dateA.getTime();
  });
  
  // Handle viewing request details
  const handleViewRequest = (request: RadiologyRequest) => {
    setSelectedRequest(request);
    setShowRequestDetailsDialog(true);
  };
  
  // Handle starting test processing
  const handleStartProcessing = (requestId: string, testId: string) => {
    startProcessing(requestId, testId);
    
    // Update the selected request if it's the one being modified
    if (selectedRequest && selectedRequest.id === requestId) {
      const updatedRequest = { ...selectedRequest };
      updatedRequest.status = 'in_progress';
      updatedRequest.tests = updatedRequest.tests.map(test => 
        test.id === testId ? { ...test, status: 'in_progress' } : test
      );
      setSelectedRequest(updatedRequest);
    }
  };
  
  // Handle cancelling a request
  const handleCancelRequest = (requestId: string) => {
    cancelRadiologyRequest(requestId);
    
    // Update the selected request if it's the one being modified
    if (selectedRequest && selectedRequest.id === requestId) {
      const updatedRequest = { ...selectedRequest, status: 'cancelled' };
      setSelectedRequest(updatedRequest);
    }
  };
  
  // Format date
  const formatDate = (date: string, time: string) => {
    return format(new Date(`${date}T${time}`), 'MMM d, yyyy h:mm a');
  };
  
  // Get priority badge
  const getPriorityBadge = (priority: 'normal' | 'urgent' | 'emergency') => {
    const priorityConfig: Record<string, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      normal: { label: 'Normal', variant: 'outline' },
      urgent: { label: 'Urgent', variant: 'secondary' },
      emergency: { label: 'Emergency', variant: 'destructive' }
    };
    
    const config = priorityConfig[priority];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  // Get status badge
  const getStatusBadge = (status: RadiologyStatus) => {
    const statusConfig: Record<RadiologyStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Pending', variant: 'outline' },
      in_progress: { label: 'In Progress', variant: 'secondary' },
      completed: { label: 'Completed', variant: 'default' },
      cancelled: { label: 'Cancelled', variant: 'destructive' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  // Get patient type label
  const getPatientTypeLabel = (type: 'inpatient' | 'outpatient' | 'walkin') => {
    const typeLabels: Record<string, string> = {
      inpatient: 'Inpatient',
      outpatient: 'Outpatient',
      walkin: 'Walk-in'
    };
    
    return typeLabels[type];
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Radiology Requests</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="urgent">Urgent</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search requests..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value={activeTab} className="space-y-4">
          {sortedRequests.length === 0 ? (
            <Card className="p-6 text-center">
              <FileImage className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No radiology requests found matching your criteria.</p>
            </Card>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-7 gap-4 p-3 bg-gray-50 font-medium text-sm">
                <div>Patient</div>
                <div>Tests</div>
                <div>Requested By</div>
                <div>Date</div>
                <div>Priority</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                {sortedRequests.map(request => (
                  <div key={request.id} className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                    <div>
                      <div className="font-medium">{request.patientName}</div>
                      <div className="text-xs text-gray-500">{getPatientTypeLabel(request.patientType)}</div>
                    </div>
                    <div className="text-sm">
                      {request.tests.map(test => test.testName).join(', ')}
                    </div>
                    <div className="text-sm">{request.doctorName}</div>
                    <div className="text-sm">{formatDate(request.requestDate, request.requestTime)}</div>
                    <div>{getPriorityBadge(request.priority)}</div>
                    <div>{getStatusBadge(request.status)}</div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewRequest(request)}
                      >
                        View
                      </Button>
                      {request.status === 'pending' && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleViewRequest(request)}
                        >
                          Process
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Request Details Dialog */}
      <Dialog open={showRequestDetailsDialog} onOpenChange={setShowRequestDetailsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Radiology Request Details</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Patient Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-lg">{selectedRequest.patientName}</p>
                        <p className="text-sm text-gray-500">ID: {selectedRequest.patientId}</p>
                      </div>
                      <Badge variant="outline">
                        {getPatientTypeLabel(selectedRequest.patientType)}
                      </Badge>
                    </div>
                    
                    {selectedRequest.clinicalNotes && (
                      <div className="mt-4">
                        <p className="text-sm font-medium">Clinical Notes:</p>
                        <p className="text-sm mt-1">{selectedRequest.clinicalNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Request Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Request Details</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(selectedRequest.requestDate, selectedRequest.requestTime)}
                        </p>
                      </div>
                      {getPriorityBadge(selectedRequest.priority)}
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Requested By:</span>
                        <span className="text-sm">{selectedRequest.doctorName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status:</span>
                        {getStatusBadge(selectedRequest.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Payment:</span>
                        <Badge variant="outline">
                          {selectedRequest.paymentStatus === 'pending' ? 'Pending Payment' :
                           selectedRequest.paymentStatus === 'paid' ? 'Paid' : 'Insurance'}
                        </Badge>
                      </div>
                      {selectedRequest.insuranceProvider && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Insurance:</span>
                          <span className="text-sm">{selectedRequest.insuranceProvider}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Schedule Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {selectedRequest.scheduledDate && selectedRequest.scheduledTime ? (
                      <div>
                        <p className="font-medium">Scheduled For</p>
                        <p className="text-lg mt-1">
                          {format(new Date(`${selectedRequest.scheduledDate}T${selectedRequest.scheduledTime}`), 'MMM d, yyyy h:mm a')}
                        </p>
                        
                        <div className="mt-4 flex justify-between">
                          <Button variant="outline" size="sm" className="w-full">
                            <Calendar className="h-4 w-4 mr-2" />
                            Reschedule
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500 mb-4">This request has not been scheduled yet.</p>
                        
                        <Button className="w-full">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Examination
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Requested Tests</h3>
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-5 gap-4 p-3 bg-gray-50 font-medium text-sm">
                    <div>Test Name</div>
                    <div>Status</div>
                    <div>Report</div>
                    <div>Completed By</div>
                    <div>Actions</div>
                  </div>
                  <div className="divide-y">
                    {selectedRequest.tests.map(test => (
                      <div key={test.id} className="grid grid-cols-5 gap-4 p-3 items-center">
                        <div className="font-medium">{test.testName}</div>
                        <div>{getStatusBadge(test.status)}</div>
                        <div className="text-sm">
                          {test.reportText ? (
                            <span className="text-green-600">Report Available</span>
                          ) : (
                            <span className="text-gray-500">No Report</span>
                          )}
                        </div>
                        <div className="text-sm">{test.completedBy || '-'}</div>
                        <div className="flex gap-2">
                          {test.status === 'pending' && (
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleStartProcessing(selectedRequest.id, test.id)}
                            >
                              Start Processing
                            </Button>
                          )}
                          {test.status === 'in_progress' && (
                            <Button 
                              variant="default" 
                              size="sm"
                            >
                              Complete Test
                            </Button>
                          )}
                          {test.status === 'completed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                            >
                              View Report
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowRequestDetailsDialog(false)}>
                  Close
                </Button>
                
                {selectedRequest.status === 'pending' && (
                  <>
                    <Button variant="outline" className="border-red-500 text-red-500" onClick={() => 
                      handleCancelRequest(selectedRequest.id)
                    }>
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Request
                    </Button>
                    <Button>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Process Request
                    </Button>
                  </>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RadiologyRequests;
