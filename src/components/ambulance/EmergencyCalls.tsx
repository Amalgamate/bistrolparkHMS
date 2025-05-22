import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  PhoneCall,
  Plus,
  Search,
  Filter,
  Clock,
  MapPin,
  Truck,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAmbulance, AmbulanceCall, CallStatus, CallPriority } from '../../context/AmbulanceContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { format, differenceInMinutes } from 'date-fns';

const EmergencyCalls: React.FC = () => {
  const { 
    calls, 
    ambulances,
    crewMembers,
    getCallById,
    getCallsByStatus,
    getCallsByPriority,
    updateCallStatus
  } = useAmbulance();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<CallStatus | 'all'>('all');
  const [filterPriority, setFilterPriority] = useState<CallPriority | 'all'>('all');
  const [selectedCall, setSelectedCall] = useState<AmbulanceCall | null>(null);
  const [showCallDetailsDialog, setShowCallDetailsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter calls based on search term, status, and priority
  const filteredCalls = calls.filter(call => {
    const matchesSearch = 
      call.callNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (call.patient?.name && call.patient.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      call.location.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || call.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || call.priority === filterPriority;
    
    // Filter based on active tab
    if (activeTab === 'all') {
      return matchesSearch && matchesStatus && matchesPriority;
    } else if (activeTab === 'pending') {
      return matchesSearch && matchesPriority && call.status === 'pending';
    } else if (activeTab === 'active') {
      return matchesSearch && matchesPriority && 
        ['dispatched', 'en_route', 'at_scene', 'transporting', 'at_hospital'].includes(call.status);
    } else if (activeTab === 'completed') {
      return matchesSearch && matchesPriority && 
        (call.status === 'completed' || call.status === 'cancelled');
    }
    
    return matchesSearch && matchesStatus && matchesPriority;
  });
  
  // Sort calls by priority and time
  const sortedCalls = [...filteredCalls].sort((a, b) => {
    // First sort by status (pending first, then active, then completed)
    const statusOrder = {
      pending: 0,
      dispatched: 1,
      en_route: 1,
      at_scene: 1,
      transporting: 1,
      at_hospital: 1,
      completed: 2,
      cancelled: 2
    };
    
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    
    // Then sort by priority (emergency first, then urgent, etc.)
    const priorityOrder = {
      emergency: 0,
      urgent: 1,
      non_urgent: 2,
      scheduled: 3
    };
    
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    
    // Finally sort by time (newest first)
    return new Date(b.callTime).getTime() - new Date(a.callTime).getTime();
  });
  
  // Handle viewing call details
  const handleViewCall = (call: AmbulanceCall) => {
    setSelectedCall(call);
    setShowCallDetailsDialog(true);
  };
  
  // Handle updating call status
  const handleUpdateStatus = (callId: string, status: CallStatus, options?: {
    dispatchedAmbulance?: string;
    dispatchedCrew?: string[];
  }) => {
    updateCallStatus(callId, status, options);
    
    // Update the selected call if it's the one being modified
    if (selectedCall && selectedCall.id === callId) {
      const updatedCall = getCallById(callId);
      if (updatedCall) {
        setSelectedCall(updatedCall);
      }
    }
  };
  
  // Get status badge for a call
  const getStatusBadge = (status: CallStatus) => {
    const statusConfig: Record<CallStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Pending', variant: 'outline' },
      dispatched: { label: 'Dispatched', variant: 'secondary' },
      en_route: { label: 'En Route', variant: 'secondary' },
      at_scene: { label: 'At Scene', variant: 'secondary' },
      transporting: { label: 'Transporting', variant: 'secondary' },
      at_hospital: { label: 'At Hospital', variant: 'secondary' },
      completed: { label: 'Completed', variant: 'default' },
      cancelled: { label: 'Cancelled', variant: 'destructive' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  // Get priority badge for a call
  const getPriorityBadge = (priority: CallPriority) => {
    const priorityConfig: Record<CallPriority, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      emergency: { label: 'Emergency', variant: 'destructive' },
      urgent: { label: 'Urgent', variant: 'secondary' },
      non_urgent: { label: 'Non-Urgent', variant: 'outline' },
      scheduled: { label: 'Scheduled', variant: 'default' }
    };
    
    const config = priorityConfig[priority];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  // Format date
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  };
  
  // Format time elapsed
  const getTimeElapsed = (startTime: string) => {
    const minutes = differenceInMinutes(new Date(), new Date(startTime));
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
  };
  
  // Get ambulance details
  const getAmbulanceDetails = (ambulanceId?: string) => {
    if (!ambulanceId) return 'Not assigned';
    
    const ambulance = ambulances.find(a => a.id === ambulanceId);
    return ambulance ? `${ambulance.vehicleNumber} (${ambulance.make} ${ambulance.model})` : 'Unknown';
  };
  
  // Get crew details
  const getCrewDetails = (crewIds?: string[]) => {
    if (!crewIds || crewIds.length === 0) return 'Not assigned';
    
    return crewIds.map(id => {
      const crewMember = crewMembers.find(cm => cm.id === id);
      return crewMember ? `${crewMember.name} (${crewMember.role})` : 'Unknown';
    }).join(', ');
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Emergency Calls</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Emergency Call
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Calls</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search calls..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="non_urgent">Non-Urgent</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value={activeTab} className="space-y-4">
          {sortedCalls.length === 0 ? (
            <Card className="p-6 text-center">
              <PhoneCall className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No emergency calls found matching your criteria.</p>
            </Card>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-7 gap-4 p-3 bg-gray-50 font-medium text-sm">
                <div>Call Number</div>
                <div>Time</div>
                <div>Location</div>
                <div>Patient</div>
                <div>Priority</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                {sortedCalls.map(call => (
                  <div key={call.id} className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                    <div className="font-medium">{call.callNumber}</div>
                    <div className="text-sm">
                      {formatDate(call.callTime)}
                      <div className="text-xs text-gray-500">
                        {getTimeElapsed(call.callTime)} ago
                      </div>
                    </div>
                    <div className="text-sm truncate max-w-[200px]">{call.location.address}</div>
                    <div className="text-sm">{call.patient?.name || 'No patient info'}</div>
                    <div>{getPriorityBadge(call.priority)}</div>
                    <div>{getStatusBadge(call.status)}</div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewCall(call)}
                      >
                        View
                      </Button>
                      {call.status === 'pending' && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleViewCall(call)}
                        >
                          Dispatch
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
      
      {/* Call Details Dialog */}
      <Dialog open={showCallDetailsDialog} onOpenChange={setShowCallDetailsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Emergency Call Details</DialogTitle>
          </DialogHeader>
          
          {selectedCall && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Call Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-lg">{selectedCall.callNumber}</p>
                        <p className="text-sm text-gray-500">{formatDate(selectedCall.callTime)}</p>
                      </div>
                      {getPriorityBadge(selectedCall.priority)}
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status:</span>
                        <span>{getStatusBadge(selectedCall.status)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Caller:</span>
                        <span className="text-sm">{selectedCall.caller.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Contact:</span>
                        <span className="text-sm">{selectedCall.caller.contactNumber}</span>
                      </div>
                      {selectedCall.caller.relationship && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Relationship:</span>
                          <span className="text-sm">{selectedCall.caller.relationship}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Location & Destination</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div>
                      <p className="font-medium">Pickup Location</p>
                      <p className="text-sm mt-1">{selectedCall.location.address}</p>
                      {selectedCall.location.notes && (
                        <p className="text-xs text-gray-500 mt-1">{selectedCall.location.notes}</p>
                      )}
                    </div>
                    
                    {selectedCall.destination && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="font-medium">Destination</p>
                        <p className="text-sm mt-1">{selectedCall.destination.name}</p>
                        <p className="text-sm">{selectedCall.destination.address}</p>
                        {selectedCall.destination.notes && (
                          <p className="text-xs text-gray-500 mt-1">{selectedCall.destination.notes}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Patient Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {selectedCall.patient ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Name:</span>
                          <span className="text-sm">{selectedCall.patient.name}</span>
                        </div>
                        {selectedCall.patient.age !== undefined && (
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Age:</span>
                            <span className="text-sm">{selectedCall.patient.age} years</span>
                          </div>
                        )}
                        {selectedCall.patient.gender && (
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">Gender:</span>
                            <span className="text-sm">
                              {selectedCall.patient.gender.charAt(0).toUpperCase() + selectedCall.patient.gender.slice(1)}
                            </span>
                          </div>
                        )}
                        {selectedCall.patient.chiefComplaint && (
                          <div>
                            <p className="text-sm font-medium">Chief Complaint:</p>
                            <p className="text-sm">{selectedCall.patient.chiefComplaint}</p>
                          </div>
                        )}
                        {selectedCall.patient.medicalHistory && selectedCall.patient.medicalHistory.length > 0 && (
                          <div>
                            <p className="text-sm font-medium">Medical History:</p>
                            <ul className="text-sm list-disc list-inside">
                              {selectedCall.patient.medicalHistory.map((item, index) => (
                                <li key={index}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No patient information available.</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Dispatch Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Ambulance:</span>
                        <span className="text-sm">{getAmbulanceDetails(selectedCall.dispatchedAmbulance)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Crew:</span>
                        <span className="text-sm truncate max-w-[250px]">{getCrewDetails(selectedCall.dispatchedCrew)}</span>
                      </div>
                      
                      {selectedCall.dispatchTime && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Dispatch Time:</span>
                          <span className="text-sm">{formatDate(selectedCall.dispatchTime)}</span>
                        </div>
                      )}
                      
                      {selectedCall.arrivalTime && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Arrival Time:</span>
                          <span className="text-sm">{formatDate(selectedCall.arrivalTime)}</span>
                        </div>
                      )}
                      
                      {selectedCall.departureTime && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Departure Time:</span>
                          <span className="text-sm">{formatDate(selectedCall.departureTime)}</span>
                        </div>
                      )}
                      
                      {selectedCall.hospitalArrivalTime && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Hospital Arrival:</span>
                          <span className="text-sm">{formatDate(selectedCall.hospitalArrivalTime)}</span>
                        </div>
                      )}
                      
                      {selectedCall.completionTime && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Completion Time:</span>
                          <span className="text-sm">{formatDate(selectedCall.completionTime)}</span>
                        </div>
                      )}
                    </div>
                    
                    {selectedCall.status === 'pending' && (
                      <div className="mt-4">
                        <Button className="w-full">
                          <Truck className="h-4 w-4 mr-2" />
                          Dispatch Ambulance
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Call Timeline</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                          <PhoneCall className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Call Received</p>
                          <p className="text-xs text-gray-500">{formatDate(selectedCall.callTime)}</p>
                        </div>
                      </div>
                      
                      {selectedCall.dispatchTime && (
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mr-3">
                            <Truck className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Ambulance Dispatched</p>
                            <p className="text-xs text-gray-500">{formatDate(selectedCall.dispatchTime)}</p>
                          </div>
                        </div>
                      )}
                      
                      {selectedCall.arrivalTime && (
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Arrived at Scene</p>
                            <p className="text-xs text-gray-500">{formatDate(selectedCall.arrivalTime)}</p>
                          </div>
                        </div>
                      )}
                      
                      {selectedCall.departureTime && (
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3">
                            <Truck className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Departed Scene</p>
                            <p className="text-xs text-gray-500">{formatDate(selectedCall.departureTime)}</p>
                          </div>
                        </div>
                      )}
                      
                      {selectedCall.hospitalArrivalTime && (
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mr-3">
                            <MapPin className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Arrived at Hospital</p>
                            <p className="text-xs text-gray-500">{formatDate(selectedCall.hospitalArrivalTime)}</p>
                          </div>
                        </div>
                      )}
                      
                      {selectedCall.completionTime && (
                        <div className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {selectedCall.status === 'completed' ? 'Call Completed' : 'Call Cancelled'}
                            </p>
                            <p className="text-xs text-gray-500">{formatDate(selectedCall.completionTime)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedCall.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm">{selectedCall.notes}</p>
                  </div>
                </div>
              )}
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowCallDetailsDialog(false)}>
                  Close
                </Button>
                
                {selectedCall.status === 'pending' && (
                  <>
                    <Button variant="outline" className="border-red-500 text-red-500" onClick={() => 
                      handleUpdateStatus(selectedCall.id, 'cancelled')
                    }>
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Call
                    </Button>
                    <Button onClick={() => handleViewCall(selectedCall)}>
                      <Truck className="h-4 w-4 mr-2" />
                      Dispatch Ambulance
                    </Button>
                  </>
                )}
                
                {selectedCall.status === 'dispatched' && (
                  <Button onClick={() => 
                    handleUpdateStatus(selectedCall.id, 'en_route')
                  }>
                    Mark En Route
                  </Button>
                )}
                
                {selectedCall.status === 'en_route' && (
                  <Button onClick={() => 
                    handleUpdateStatus(selectedCall.id, 'at_scene')
                  }>
                    Mark Arrived at Scene
                  </Button>
                )}
                
                {selectedCall.status === 'at_scene' && (
                  <Button onClick={() => 
                    handleUpdateStatus(selectedCall.id, 'transporting')
                  }>
                    Mark Transporting
                  </Button>
                )}
                
                {selectedCall.status === 'transporting' && (
                  <Button onClick={() => 
                    handleUpdateStatus(selectedCall.id, 'at_hospital')
                  }>
                    Mark Arrived at Hospital
                  </Button>
                )}
                
                {selectedCall.status === 'at_hospital' && (
                  <Button onClick={() => 
                    handleUpdateStatus(selectedCall.id, 'completed')
                  }>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Call
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencyCalls;
