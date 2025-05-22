import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Droplets,
  Download
} from 'lucide-react';
import { useBloodBank, BloodRequest, RequestStatus } from '../../context/BloodBankContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { format } from 'date-fns';

const BloodRequests: React.FC = () => {
  const { 
    bloodRequests, 
    updateRequestStatus,
    getBloodRequestsByStatus
  } = useBloodBank();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<RequestStatus | 'all'>('all');
  const [filterUrgency, setFilterUrgency] = useState<'all' | 'routine' | 'urgent' | 'emergency'>('all');
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [showRequestDetailsDialog, setShowRequestDetailsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter requests based on search term, status, and urgency
  const filteredRequests = bloodRequests.filter(request => {
    const matchesSearch = 
      request.requestNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.patientName && request.patientName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    const matchesUrgency = filterUrgency === 'all' || request.urgency === filterUrgency;
    
    // Filter based on active tab
    if (activeTab === 'all') {
      return matchesSearch && matchesStatus && matchesUrgency;
    } else if (activeTab === 'pending') {
      return matchesSearch && matchesUrgency && request.status === 'pending';
    } else if (activeTab === 'processing') {
      return matchesSearch && matchesUrgency && 
        (request.status === 'approved' || request.status === 'processing');
    } else if (activeTab === 'completed') {
      return matchesSearch && matchesUrgency && 
        (request.status === 'completed' || request.status === 'issued');
    } else if (activeTab === 'cancelled') {
      return matchesSearch && matchesUrgency && request.status === 'cancelled';
    }
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });
  
  // Sort requests by date (newest first) and then by urgency
  const sortedRequests = [...filteredRequests].sort((a, b) => {
    // First sort by urgency (emergency > urgent > routine)
    const urgencyOrder = { emergency: 0, urgent: 1, routine: 2 };
    const urgencyDiff = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    
    if (urgencyDiff !== 0) return urgencyDiff;
    
    // Then sort by date (newest first)
    return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime();
  });
  
  // Handle viewing request details
  const handleViewRequest = (request: BloodRequest) => {
    setSelectedRequest(request);
    setShowRequestDetailsDialog(true);
  };
  
  // Handle updating request status
  const handleUpdateStatus = (requestId: string, status: RequestStatus, options?: {
    approvedBy?: string,
    issuedBy?: string,
    notes?: string
  }) => {
    updateRequestStatus(requestId, status, options);
    
    // Update the selected request if it's the one being modified
    if (selectedRequest && selectedRequest.id === requestId) {
      setSelectedRequest({
        ...selectedRequest,
        status,
        ...(status === 'approved' && options?.approvedBy ? { 
          approvedBy: options.approvedBy,
          approvedAt: new Date().toISOString() 
        } : {}),
        ...(status === 'issued' && options?.issuedBy ? { 
          issuedBy: options.issuedBy,
          issuedAt: new Date().toISOString() 
        } : {}),
        ...(options?.notes ? { 
          notes: selectedRequest.notes ? `${selectedRequest.notes}\n${options.notes}` : options.notes 
        } : {})
      });
    }
  };
  
  // Get status badge for a request
  const getStatusBadge = (status: RequestStatus) => {
    const statusConfig: Record<RequestStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Pending', variant: 'outline' },
      approved: { label: 'Approved', variant: 'secondary' },
      processing: { label: 'Processing', variant: 'secondary' },
      ready: { label: 'Ready', variant: 'default' },
      issued: { label: 'Issued', variant: 'default' },
      completed: { label: 'Completed', variant: 'default' },
      cancelled: { label: 'Cancelled', variant: 'destructive' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  // Get urgency badge
  const getUrgencyBadge = (urgency: 'routine' | 'urgent' | 'emergency') => {
    const urgencyConfig: Record<string, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      routine: { label: 'Routine', variant: 'outline' },
      urgent: { label: 'Urgent', variant: 'secondary' },
      emergency: { label: 'Emergency', variant: 'destructive' }
    };
    
    const config = urgencyConfig[urgency];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  // Format date
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  };
  
  // Get product type label
  const getProductTypeLabel = (productType: string) => {
    const labels: Record<string, string> = {
      whole_blood: 'Whole Blood',
      packed_red_cells: 'Packed Red Cells',
      platelets: 'Platelets',
      plasma: 'Plasma',
      cryoprecipitate: 'Cryoprecipitate'
    };
    
    return labels[productType] || productType;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Blood Requests</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Blood Request
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Requests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
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
            
            <Select value={filterUrgency} onValueChange={(value: any) => setFilterUrgency(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value={activeTab} className="space-y-4">
          {sortedRequests.length === 0 ? (
            <Card className="p-6 text-center">
              <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No blood requests found matching your criteria.</p>
            </Card>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-7 gap-4 p-3 bg-gray-50 font-medium text-sm">
                <div>Request Number</div>
                <div>Department</div>
                <div>Patient</div>
                <div>Date Requested</div>
                <div>Urgency</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                {sortedRequests.map(request => (
                  <div key={request.id} className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                    <div className="font-medium">{request.requestNumber}</div>
                    <div className="text-sm">{request.department}</div>
                    <div className="text-sm">{request.patientName || 'No patient'}</div>
                    <div className="text-sm">{format(new Date(request.requestDate), 'MMM d, yyyy')}</div>
                    <div>{getUrgencyBadge(request.urgency)}</div>
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
                          onClick={() => handleUpdateStatus(request.id, 'approved', {
                            approvedBy: 'Current User', // In a real app, this would come from auth context
                            notes: 'Request approved'
                          })}
                        >
                          Approve
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
            <DialogTitle>Blood Request Details</DialogTitle>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Request Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-lg">{selectedRequest.requestNumber}</p>
                        <p className="text-sm text-gray-500">Department: {selectedRequest.department}</p>
                      </div>
                      {getUrgencyBadge(selectedRequest.urgency)}
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Date Requested:</span>
                        <span className="text-sm">{formatDate(selectedRequest.requestDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span>{getStatusBadge(selectedRequest.status)}</span>
                      </div>
                      {selectedRequest.approvedBy && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Approved By:</span>
                          <span className="text-sm">{selectedRequest.approvedBy} ({selectedRequest.approvedAt && formatDate(selectedRequest.approvedAt)})</span>
                        </div>
                      )}
                      {selectedRequest.issuedBy && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Issued By:</span>
                          <span className="text-sm">{selectedRequest.issuedBy} ({selectedRequest.issuedAt && formatDate(selectedRequest.issuedAt)})</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Patient Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {selectedRequest.patientName ? (
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{selectedRequest.patientName}</p>
                            {selectedRequest.patientId && (
                              <p className="text-sm text-gray-500">ID: {selectedRequest.patientId}</p>
                            )}
                          </div>
                          {selectedRequest.patientBloodType && (
                            <Badge variant="outline" className="bg-red-50 text-red-800">
                              {selectedRequest.patientBloodType}
                            </Badge>
                          )}
                        </div>
                        {selectedRequest.diagnosis && (
                          <div className="mt-2">
                            <p className="text-sm font-medium">Diagnosis:</p>
                            <p className="text-sm text-gray-700">{selectedRequest.diagnosis}</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No patient information provided.</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Request Actions</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="space-y-3">
                      {selectedRequest.status === 'pending' && (
                        <>
                          <Button 
                            className="w-full"
                            onClick={() => {
                              handleUpdateStatus(selectedRequest.id, 'approved', {
                                approvedBy: 'Current User', // In a real app, this would come from auth context
                                notes: 'Request approved'
                              });
                            }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve Request
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full text-red-600 border-red-600"
                            onClick={() => {
                              handleUpdateStatus(selectedRequest.id, 'cancelled', {
                                notes: 'Request cancelled'
                              });
                            }}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Request
                          </Button>
                        </>
                      )}
                      
                      {selectedRequest.status === 'approved' && (
                        <Button 
                          className="w-full"
                          onClick={() => {
                            handleUpdateStatus(selectedRequest.id, 'processing', {
                              notes: 'Processing request'
                            });
                          }}
                        >
                          <Droplets className="h-4 w-4 mr-2" />
                          Start Processing
                        </Button>
                      )}
                      
                      {selectedRequest.status === 'processing' && (
                        <Button 
                          className="w-full"
                          onClick={() => {
                            handleUpdateStatus(selectedRequest.id, 'ready', {
                              notes: 'Blood units ready for pickup'
                            });
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Ready
                        </Button>
                      )}
                      
                      {selectedRequest.status === 'ready' && (
                        <Button 
                          className="w-full"
                          onClick={() => {
                            handleUpdateStatus(selectedRequest.id, 'issued', {
                              issuedBy: 'Current User', // In a real app, this would come from auth context
                              notes: 'Blood units issued'
                            });
                          }}
                        >
                          <Droplets className="h-4 w-4 mr-2" />
                          Issue Blood Units
                        </Button>
                      )}
                      
                      {selectedRequest.status === 'issued' && (
                        <Button 
                          className="w-full"
                          onClick={() => {
                            handleUpdateStatus(selectedRequest.id, 'completed', {
                              notes: 'Request completed'
                            });
                          }}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Mark as Completed
                        </Button>
                      )}
                      
                      {['approved', 'processing', 'ready'].includes(selectedRequest.status) && (
                        <Button 
                          variant="outline" 
                          className="w-full text-red-600 border-red-600"
                          onClick={() => {
                            handleUpdateStatus(selectedRequest.id, 'cancelled', {
                              notes: 'Request cancelled'
                            });
                          }}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel Request
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Requested Products</h3>
                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 font-medium text-sm">
                    <div>Product Type</div>
                    <div>Blood Type</div>
                    <div>Quantity</div>
                    <div>Units Issued</div>
                  </div>
                  <div className="divide-y">
                    {selectedRequest.products.map((product, index) => (
                      <div key={index} className="grid grid-cols-4 gap-4 p-3 items-center">
                        <div>{getProductTypeLabel(product.productType)}</div>
                        <div>
                          <Badge variant="outline" className="bg-red-50 text-red-800">
                            {product.bloodType}
                          </Badge>
                        </div>
                        <div>{product.quantity}</div>
                        <div>
                          {product.unitsIssued.length > 0 ? (
                            <div className="flex items-center">
                              <span className="text-sm">{product.unitsIssued.length} units</span>
                              {product.unitsIssued.length < product.quantity && (
                                <AlertTriangle className="h-4 w-4 ml-2 text-amber-500" />
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-500">None</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {selectedRequest.crossmatchResults && selectedRequest.crossmatchResults.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Crossmatch Results</h3>
                  <div className="border rounded-md overflow-hidden">
                    <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 font-medium text-sm">
                      <div>Unit ID</div>
                      <div>Result</div>
                      <div>Performed By</div>
                      <div>Date</div>
                    </div>
                    <div className="divide-y">
                      {selectedRequest.crossmatchResults.map((result, index) => (
                        <div key={index} className="grid grid-cols-4 gap-4 p-3 items-center">
                          <div>{result.unitId}</div>
                          <div>
                            <Badge 
                              variant={result.result === 'compatible' ? 'default' : 'destructive'}
                            >
                              {result.result}
                            </Badge>
                          </div>
                          <div>{result.performedBy}</div>
                          <div className="text-sm">{formatDate(result.performedAt)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {selectedRequest.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm whitespace-pre-line">{selectedRequest.notes}</p>
                  </div>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowRequestDetailsDialog(false)}>
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BloodRequests;
