import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  Truck,
  Plus,
  Search,
  Filter,
  Wrench,
  AlertTriangle,
  Users,
  MapPin,
  Fuel,
  Gauge
} from 'lucide-react';
import { useAmbulance, Ambulance, AmbulanceStatus, AmbulanceType } from '../../context/AmbulanceContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Progress } from '../../components/ui/progress';

const AmbulanceFleet: React.FC = () => {
  const {
    ambulances,
    getAmbulanceById,
    getAmbulancesByStatus,
    getAmbulancesByType,
    crewMembers
  } = useAmbulance();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<AmbulanceStatus | 'all'>('all');
  const [filterType, setFilterType] = useState<AmbulanceType | 'all'>('all');
  const [selectedAmbulance, setSelectedAmbulance] = useState<Ambulance | null>(null);
  const [showAmbulanceDetailsDialog, setShowAmbulanceDetailsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Filter ambulances based on search term, status, and type
  const filteredAmbulances = ambulances.filter(ambulance => {
    const matchesSearch =
      ambulance.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambulance.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambulance.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ambulance.model.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || ambulance.status === filterStatus;
    const matchesType = filterType === 'all' || ambulance.type === filterType;

    // Filter based on active tab
    if (activeTab === 'all') {
      return matchesSearch && matchesStatus && matchesType;
    } else if (activeTab === 'available') {
      return matchesSearch && matchesType && ambulance.status === 'available';
    } else if (activeTab === 'active') {
      return matchesSearch && matchesType &&
        ['dispatched', 'en_route', 'at_scene', 'transporting', 'at_hospital'].includes(ambulance.status);
    } else if (activeTab === 'out_of_service') {
      return matchesSearch && matchesType && ambulance.status === 'out_of_service';
    }

    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort ambulances by status (available first, then active, then out of service)
  const sortedAmbulances = [...filteredAmbulances].sort((a, b) => {
    const statusOrder = {
      available: 0,
      dispatched: 1,
      en_route: 1,
      at_scene: 1,
      transporting: 1,
      at_hospital: 1,
      returning: 1,
      standby: 2,
      out_of_service: 3
    };

    return statusOrder[a.status] - statusOrder[b.status];
  });

  // Handle viewing ambulance details
  const handleViewAmbulance = (ambulance: Ambulance) => {
    setSelectedAmbulance(ambulance);
    setShowAmbulanceDetailsDialog(true);
  };

  // Get status badge for an ambulance
  const getStatusBadge = (status: AmbulanceStatus) => {
    const statusConfig: Record<AmbulanceStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      available: { label: 'Available', variant: 'default' },
      dispatched: { label: 'Dispatched', variant: 'secondary' },
      en_route: { label: 'En Route', variant: 'secondary' },
      at_scene: { label: 'At Scene', variant: 'secondary' },
      transporting: { label: 'Transporting', variant: 'secondary' },
      at_hospital: { label: 'At Hospital', variant: 'secondary' },
      returning: { label: 'Returning', variant: 'outline' },
      out_of_service: { label: 'Out of Service', variant: 'destructive' },
      standby: { label: 'Standby', variant: 'outline' }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Get type label for an ambulance
  const getTypeLabel = (type: AmbulanceType) => {
    const typeLabels: Record<AmbulanceType, string> = {
      basic: 'Basic Life Support',
      advanced: 'Advanced Life Support',
      critical: 'Critical Care',
      neonatal: 'Neonatal',
      bariatric: 'Bariatric'
    };

    return typeLabels[type];
  };

  // Get crew names for an ambulance
  const getCrewNames = (crewIds?: string[]) => {
    if (!crewIds || crewIds.length === 0) return 'No crew assigned';

    return crewIds.map(id => {
      const crewMember = crewMembers.find(cm => cm.id === id);
      return crewMember ? crewMember.name : 'Unknown';
    }).join(', ');
  };

  // Check if equipment needs attention
  const needsEquipmentAttention = (ambulance: Ambulance) => {
    const { equipmentStatus } = ambulance;
    return !equipmentStatus.oxygen ||
           !equipmentStatus.stretcher ||
           !equipmentStatus.defibrillator ||
           !equipmentStatus.firstAidKit ||
           !equipmentStatus.medications;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Ambulance Fleet</h2>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Ambulance
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Ambulances</TabsTrigger>
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="out_of_service">Out of Service</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search ambulances..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Ambulance Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="basic">Basic Life Support</SelectItem>
                <SelectItem value="advanced">Advanced Life Support</SelectItem>
                <SelectItem value="critical">Critical Care</SelectItem>
                <SelectItem value="neonatal">Neonatal</SelectItem>
                <SelectItem value="bariatric">Bariatric</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value={activeTab} className="space-y-4">
          {sortedAmbulances.length === 0 ? (
            <Card className="p-6 text-center">
              <Truck className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No ambulances found matching your criteria.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedAmbulances.map(ambulance => (
                <Card key={ambulance.id} className="overflow-hidden">
                  <div className={`p-4 border-b ${
                    ambulance.status === 'available' ? 'bg-green-50' :
                    ambulance.status === 'out_of_service' ? 'bg-red-50' :
                    'bg-blue-50'
                  }`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{ambulance.vehicleNumber}</h3>
                        <p className="text-sm text-gray-500">{ambulance.make} {ambulance.model} ({ambulance.year})</p>
                      </div>
                      {getStatusBadge(ambulance.status)}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Type:</span>
                      <span className="text-sm font-medium">{getTypeLabel(ambulance.type)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">License Plate:</span>
                      <span className="text-sm">{ambulance.licensePlate}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Base Location:</span>
                      <span className="text-sm">{ambulance.baseLocation}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Fuel Level:</span>
                      <div className="flex items-center gap-2">
                        <Progress value={ambulance.fuelLevel} className="h-2 w-20" />
                        <span className="text-sm">{ambulance.fuelLevel}%</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Equipment:</span>
                      {needsEquipmentAttention(ambulance) ? (
                        <Badge variant="outline" className="bg-amber-50 text-amber-800">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Needs Attention
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-800">
                          Complete
                        </Badge>
                      )}
                    </div>

                    {ambulance.crew && ambulance.crew.length > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Crew:</span>
                        <span className="text-sm truncate max-w-[180px]">{getCrewNames(ambulance.crew)}</span>
                      </div>
                    )}

                    <div className="pt-2">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleViewAmbulance(ambulance)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Ambulance Details Dialog */}
      <Dialog open={showAmbulanceDetailsDialog} onOpenChange={setShowAmbulanceDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Ambulance Details</DialogTitle>
          </DialogHeader>

          {selectedAmbulance && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Vehicle Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-lg">{selectedAmbulance.vehicleNumber}</p>
                        <p className="text-sm text-gray-500">License: {selectedAmbulance.licensePlate}</p>
                      </div>
                      {getStatusBadge(selectedAmbulance.status)}
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Make/Model:</span>
                        <span className="text-sm">{selectedAmbulance.make} {selectedAmbulance.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Year:</span>
                        <span className="text-sm">{selectedAmbulance.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Type:</span>
                        <span className="text-sm">{getTypeLabel(selectedAmbulance.type)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Mileage:</span>
                        <span className="text-sm">{selectedAmbulance.mileage.toLocaleString()} km</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Current Status</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">Status</p>
                        <p className="text-sm text-gray-500">Current operational status</p>
                      </div>
                      {getStatusBadge(selectedAmbulance.status)}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Base Location:</span>
                        <span className="text-sm">{selectedAmbulance.baseLocation}</span>
                      </div>

                      {selectedAmbulance.currentLocation && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Current Location:</span>
                          <span className="text-sm">
                            {selectedAmbulance.currentLocation.address ||
                             `${selectedAmbulance.currentLocation.latitude}, ${selectedAmbulance.currentLocation.longitude}`}
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Fuel Level:</span>
                        <div className="flex items-center gap-2">
                          <Progress value={selectedAmbulance.fuelLevel} className="h-2 w-20" />
                          <span className="text-sm">{selectedAmbulance.fuelLevel}%</span>
                        </div>
                      </div>

                      {selectedAmbulance.currentCall && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-500">Current Call:</span>
                          <span className="text-sm">{selectedAmbulance.currentCall}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Equipment Status</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Oxygen:</span>
                        <Badge variant={selectedAmbulance.equipmentStatus.oxygen ? 'default' : 'destructive'}>
                          {selectedAmbulance.equipmentStatus.oxygen ? 'OK' : 'Needs Attention'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Stretcher:</span>
                        <Badge variant={selectedAmbulance.equipmentStatus.stretcher ? 'default' : 'destructive'}>
                          {selectedAmbulance.equipmentStatus.stretcher ? 'OK' : 'Needs Attention'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Defibrillator:</span>
                        <Badge variant={selectedAmbulance.equipmentStatus.defibrillator ? 'default' : 'destructive'}>
                          {selectedAmbulance.equipmentStatus.defibrillator ? 'OK' : 'Needs Attention'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">First Aid Kit:</span>
                        <Badge variant={selectedAmbulance.equipmentStatus.firstAidKit ? 'default' : 'destructive'}>
                          {selectedAmbulance.equipmentStatus.firstAidKit ? 'OK' : 'Needs Attention'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Medications:</span>
                        <Badge variant={selectedAmbulance.equipmentStatus.medications ? 'default' : 'destructive'}>
                          {selectedAmbulance.equipmentStatus.medications ? 'OK' : 'Needs Attention'}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="w-full">
                        <Wrench className="h-4 w-4 mr-2" />
                        Update Equipment Status
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Assigned Crew</h3>
                {selectedAmbulance.crew && selectedAmbulance.crew.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 font-medium text-sm">
                      <div>Name</div>
                      <div>Role</div>
                      <div>Qualification</div>
                      <div>Contact</div>
                    </div>
                    <div className="divide-y">
                      {selectedAmbulance.crew.map(crewId => {
                        const crewMember = crewMembers.find(cm => cm.id === crewId);

                        return crewMember ? (
                          <div key={crewId} className="grid grid-cols-4 gap-4 p-3 items-center">
                            <div className="font-medium">{crewMember.name}</div>
                            <div>{crewMember.role.charAt(0).toUpperCase() + crewMember.role.slice(1)}</div>
                            <div>{crewMember.qualification}</div>
                            <div>{crewMember.contactNumber}</div>
                          </div>
                        ) : (
                          <div key={crewId} className="grid grid-cols-4 gap-4 p-3 items-center">
                            <div className="font-medium text-gray-500">Unknown Crew Member</div>
                            <div>-</div>
                            <div>-</div>
                            <div>-</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No crew members assigned to this ambulance.</p>
                )}
              </div>

              {selectedAmbulance.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-sm">{selectedAmbulance.notes}</p>
                  </div>
                </div>
              )}

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowAmbulanceDetailsDialog(false)}>
                  Close
                </Button>
                <Button variant="outline" className="border-amber-500 text-amber-500">
                  <Wrench className="h-4 w-4 mr-2" />
                  Schedule Maintenance
                </Button>
                <Button>
                  <Truck className="h-4 w-4 mr-2" />
                  Update Status
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AmbulanceFleet;
