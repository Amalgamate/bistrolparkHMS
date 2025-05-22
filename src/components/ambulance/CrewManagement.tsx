import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Calendar,
  Clock,
  Truck,
  Phone,
  Mail,
  Award,
  AlertTriangle
} from 'lucide-react';
import { useAmbulance, CrewMember, CrewRole } from '../../context/AmbulanceContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { format, isAfter, isBefore } from 'date-fns';

const CrewManagement: React.FC = () => {
  const { 
    crewMembers, 
    ambulances,
    getCrewMemberById,
    getCrewMembersByStatus,
    getCrewMembersByRole,
    updateCrewStatus,
    assignShiftToCrew
  } = useAmbulance();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<CrewMember['status'] | 'all'>('all');
  const [filterRole, setFilterRole] = useState<CrewRole | 'all'>('all');
  const [selectedCrewMember, setSelectedCrewMember] = useState<CrewMember | null>(null);
  const [showCrewDetailsDialog, setShowCrewDetailsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter crew members based on search term, status, and role
  const filteredCrewMembers = crewMembers.filter(crewMember => {
    const matchesSearch = 
      crewMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crewMember.staffId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      crewMember.contactNumber.includes(searchTerm);
    
    const matchesStatus = filterStatus === 'all' || crewMember.status === filterStatus;
    const matchesRole = filterRole === 'all' || crewMember.role === filterRole;
    
    // Filter based on active tab
    if (activeTab === 'all') {
      return matchesSearch && matchesStatus && matchesRole;
    } else if (activeTab === 'on_duty') {
      return matchesSearch && matchesRole && crewMember.status === 'on_duty';
    } else if (activeTab === 'off_duty') {
      return matchesSearch && matchesRole && crewMember.status === 'off_duty';
    } else if (activeTab === 'on_leave') {
      return matchesSearch && matchesRole && crewMember.status === 'on_leave';
    }
    
    return matchesSearch && matchesStatus && matchesRole;
  });
  
  // Sort crew members by role and name
  const sortedCrewMembers = [...filteredCrewMembers].sort((a, b) => {
    // First sort by role (doctor first, then paramedic, etc.)
    const roleOrder = {
      doctor: 0,
      paramedic: 1,
      nurse: 2,
      emt: 3,
      driver: 4
    };
    
    const roleDiff = roleOrder[a.role] - roleOrder[b.role];
    if (roleDiff !== 0) return roleDiff;
    
    // Then sort by name
    return a.name.localeCompare(b.name);
  });
  
  // Handle viewing crew member details
  const handleViewCrewMember = (crewMember: CrewMember) => {
    setSelectedCrewMember(crewMember);
    setShowCrewDetailsDialog(true);
  };
  
  // Handle updating crew status
  const handleUpdateStatus = (crewId: string, status: CrewMember['status']) => {
    updateCrewStatus(crewId, status);
    
    // Update the selected crew member if it's the one being modified
    if (selectedCrewMember && selectedCrewMember.id === crewId) {
      const updatedCrewMember = getCrewMemberById(crewId);
      if (updatedCrewMember) {
        setSelectedCrewMember(updatedCrewMember);
      }
    }
  };
  
  // Get status badge for a crew member
  const getStatusBadge = (status: CrewMember['status']) => {
    const statusConfig: Record<CrewMember['status'], { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      on_duty: { label: 'On Duty', variant: 'default' },
      off_duty: { label: 'Off Duty', variant: 'outline' },
      on_leave: { label: 'On Leave', variant: 'secondary' },
      standby: { label: 'Standby', variant: 'secondary' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  // Get role label
  const getRoleLabel = (role: CrewRole) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };
  
  // Format date
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };
  
  // Check if certification is expired
  const isCertificationExpired = (expiryDate: string) => {
    return isBefore(new Date(expiryDate), new Date());
  };
  
  // Check if certification is expiring soon (within 30 days)
  const isCertificationExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);
    
    return isAfter(expiry, today) && isBefore(expiry, thirtyDaysFromNow);
  };
  
  // Get assigned ambulance details
  const getAssignedAmbulance = (ambulanceId?: string) => {
    if (!ambulanceId) return 'Not assigned';
    
    const ambulance = ambulances.find(a => a.id === ambulanceId);
    return ambulance ? `${ambulance.vehicleNumber} (${ambulance.make} ${ambulance.model})` : 'Unknown';
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Crew Management</h2>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Crew Member
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Crew</TabsTrigger>
            <TabsTrigger value="on_duty">On Duty</TabsTrigger>
            <TabsTrigger value="off_duty">Off Duty</TabsTrigger>
            <TabsTrigger value="on_leave">On Leave</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search crew members..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filterRole} onValueChange={(value: any) => setFilterRole(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="doctor">Doctor</SelectItem>
                <SelectItem value="paramedic">Paramedic</SelectItem>
                <SelectItem value="nurse">Nurse</SelectItem>
                <SelectItem value="emt">EMT</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value={activeTab} className="space-y-4">
          {sortedCrewMembers.length === 0 ? (
            <Card className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No crew members found matching your criteria.</p>
            </Card>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-7 gap-4 p-3 bg-gray-50 font-medium text-sm">
                <div>Name</div>
                <div>Staff ID</div>
                <div>Role</div>
                <div>Qualification</div>
                <div>Contact</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                {sortedCrewMembers.map(crewMember => (
                  <div key={crewMember.id} className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                    <div className="font-medium">{crewMember.name}</div>
                    <div className="text-sm">{crewMember.staffId}</div>
                    <div className="text-sm">{getRoleLabel(crewMember.role)}</div>
                    <div className="text-sm truncate max-w-[150px]">{crewMember.qualification}</div>
                    <div className="text-sm">{crewMember.contactNumber}</div>
                    <div>{getStatusBadge(crewMember.status)}</div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewCrewMember(crewMember)}
                      >
                        View
                      </Button>
                      {crewMember.status === 'off_duty' && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleUpdateStatus(crewMember.id, 'on_duty')}
                        >
                          Start Shift
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
      
      {/* Crew Member Details Dialog */}
      <Dialog open={showCrewDetailsDialog} onOpenChange={setShowCrewDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Crew Member Details</DialogTitle>
          </DialogHeader>
          
          {selectedCrewMember && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Personal Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-lg">{selectedCrewMember.name}</p>
                        <p className="text-sm text-gray-500">ID: {selectedCrewMember.staffId}</p>
                      </div>
                      {getStatusBadge(selectedCrewMember.status)}
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Role:</span>
                        <span className="text-sm">{getRoleLabel(selectedCrewMember.role)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Qualification:</span>
                        <span className="text-sm">{selectedCrewMember.qualification}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Contact:</span>
                        <span className="text-sm flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {selectedCrewMember.contactNumber}
                        </span>
                      </div>
                      {selectedCrewMember.email && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Email:</span>
                          <span className="text-sm flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {selectedCrewMember.email}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Current Assignment</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Status:</span>
                        {getStatusBadge(selectedCrewMember.status)}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Ambulance:</span>
                        <span className="text-sm">{getAssignedAmbulance(selectedCrewMember.currentAmbulance)}</span>
                      </div>
                      
                      {selectedCrewMember.currentShift && (
                        <div>
                          <p className="text-sm font-medium">Current Shift:</p>
                          <div className="flex justify-between mt-1">
                            <span className="text-sm text-gray-500">Start:</span>
                            <span className="text-sm">{format(new Date(selectedCrewMember.currentShift.start), 'MMM d, h:mm a')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">End:</span>
                            <span className="text-sm">{format(new Date(selectedCrewMember.currentShift.end), 'MMM d, h:mm a')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      {selectedCrewMember.status === 'off_duty' && (
                        <Button 
                          className="w-full"
                          onClick={() => handleUpdateStatus(selectedCrewMember.id, 'on_duty')}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Start Shift
                        </Button>
                      )}
                      
                      {selectedCrewMember.status === 'on_duty' && (
                        <Button 
                          className="w-full"
                          onClick={() => handleUpdateStatus(selectedCrewMember.id, 'off_duty')}
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          End Shift
                        </Button>
                      )}
                      
                      {selectedCrewMember.status !== 'on_leave' && (
                        <Button 
                          variant="outline"
                          className="w-full"
                          onClick={() => handleUpdateStatus(selectedCrewMember.id, 'on_leave')}
                        >
                          <Calendar className="h-4 w-4 mr-2" />
                          Mark On Leave
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Certifications</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {selectedCrewMember.certifications.length > 0 ? (
                      <div className="space-y-3">
                        {selectedCrewMember.certifications.map((cert, index) => (
                          <div key={index} className="p-2 border rounded-md">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-medium">{cert.name}</p>
                              {cert.isValid ? (
                                isCertificationExpiringSoon(cert.expiryDate) ? (
                                  <Badge variant="outline" className="bg-amber-50 text-amber-800">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Expiring Soon
                                  </Badge>
                                ) : (
                                  <Badge variant="outline" className="bg-green-50 text-green-800">
                                    Valid
                                  </Badge>
                                )
                              ) : (
                                <Badge variant="destructive">
                                  Expired
                                </Badge>
                              )}
                            </div>
                            <div className="mt-1 flex justify-between text-xs text-gray-500">
                              <span>Issued: {formatDate(cert.issuedDate)}</span>
                              <span>Expires: {formatDate(cert.expiryDate)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No certifications recorded.</p>
                    )}
                    
                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        <Award className="h-4 w-4 mr-2" />
                        Add Certification
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedCrewMember.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm">{selectedCrewMember.notes}</p>
                  </div>
                </div>
              )}
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowCrewDetailsDialog(false)}>
                  Close
                </Button>
                
                {!selectedCrewMember.currentAmbulance && selectedCrewMember.status === 'on_duty' && (
                  <Button>
                    <Truck className="h-4 w-4 mr-2" />
                    Assign to Ambulance
                  </Button>
                )}
                
                <Button variant="default">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Shift
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrewManagement;
