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
  Droplets,
  AlertTriangle,
  UserCheck,
  UserX,
  Download
} from 'lucide-react';
import { useBloodBank, Donor, BloodType, DonorStatus } from '../../context/BloodBankContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { format, differenceInYears } from 'date-fns';

const DonorManagement: React.FC = () => {
  const { 
    donors, 
    addDonor, 
    updateDonorStatus,
    recordDonation
  } = useBloodBank();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodType, setFilterBloodType] = useState<BloodType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<DonorStatus | 'all'>('all');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showDonorDetailsDialog, setShowDonorDetailsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter donors based on search term, blood type, and status
  const filteredDonors = donors.filter(donor => {
    const matchesSearch = 
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.donorNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (donor.contactNumber && donor.contactNumber.includes(searchTerm));
    
    const matchesBloodType = filterBloodType === 'all' || donor.bloodType === filterBloodType;
    const matchesStatus = filterStatus === 'all' || donor.status === filterStatus;
    
    // Filter based on active tab
    if (activeTab === 'all') {
      return matchesSearch && matchesBloodType && matchesStatus;
    } else if (activeTab === 'active') {
      return matchesSearch && matchesBloodType && donor.status === 'active';
    } else if (activeTab === 'deferred') {
      return matchesSearch && matchesBloodType && (donor.status === 'deferred' || donor.status === 'permanent_deferral');
    } else if (activeTab === 'recent') {
      // Recent donors (donated in the last 3 months)
      const isRecent = donor.lastDonationDate && 
        (new Date().getTime() - new Date(donor.lastDonationDate).getTime()) < (90 * 24 * 60 * 60 * 1000);
      return matchesSearch && matchesBloodType && matchesStatus && isRecent;
    }
    
    return matchesSearch && matchesBloodType && matchesStatus;
  });
  
  // Sort donors by name
  const sortedDonors = [...filteredDonors].sort((a, b) => a.name.localeCompare(b.name));
  
  // Handle viewing donor details
  const handleViewDonor = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowDonorDetailsDialog(true);
  };
  
  // Get status badge for a donor
  const getStatusBadge = (status: DonorStatus) => {
    const statusConfig: Record<DonorStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      active: { label: 'Active', variant: 'default' },
      deferred: { label: 'Deferred', variant: 'secondary' },
      permanent_deferral: { label: 'Permanent Deferral', variant: 'destructive' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  // Calculate age from date of birth
  const calculateAge = (dateOfBirth: string) => {
    return differenceInYears(new Date(), new Date(dateOfBirth));
  };
  
  // Format donation date
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy');
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
        <h2 className="text-xl font-semibold">Donor Management</h2>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Register New Donor
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All Donors</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="deferred">Deferred</TabsTrigger>
            <TabsTrigger value="recent">Recent Donors</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search donors..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filterBloodType} onValueChange={(value: any) => setFilterBloodType(value)}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Blood Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="A+">A+</SelectItem>
                <SelectItem value="A-">A-</SelectItem>
                <SelectItem value="B+">B+</SelectItem>
                <SelectItem value="B-">B-</SelectItem>
                <SelectItem value="AB+">AB+</SelectItem>
                <SelectItem value="AB-">AB-</SelectItem>
                <SelectItem value="O+">O+</SelectItem>
                <SelectItem value="O-">O-</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value={activeTab} className="space-y-4">
          {sortedDonors.length === 0 ? (
            <Card className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No donors found matching your criteria.</p>
            </Card>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-7 gap-4 p-3 bg-gray-50 font-medium text-sm">
                <div>Donor Name</div>
                <div>Donor ID</div>
                <div>Blood Type</div>
                <div>Gender/Age</div>
                <div>Last Donation</div>
                <div>Status</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                {sortedDonors.map(donor => (
                  <div key={donor.id} className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                    <div className="font-medium">{donor.name}</div>
                    <div className="text-sm">{donor.donorNumber}</div>
                    <div>
                      <Badge variant="outline" className="bg-red-50 text-red-800">
                        {donor.bloodType}
                      </Badge>
                    </div>
                    <div className="text-sm">
                      {donor.gender.charAt(0).toUpperCase() + donor.gender.slice(1)}, {calculateAge(donor.dateOfBirth)}
                    </div>
                    <div className="text-sm">
                      {donor.lastDonationDate ? formatDate(donor.lastDonationDate) : 'Never donated'}
                    </div>
                    <div>{getStatusBadge(donor.status)}</div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDonor(donor)}
                      >
                        View
                      </Button>
                      {donor.status === 'active' && (
                        <Button 
                          variant="default" 
                          size="sm"
                        >
                          Donate
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
      
      {/* Donor Details Dialog */}
      <Dialog open={showDonorDetailsDialog} onOpenChange={setShowDonorDetailsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Donor Details</DialogTitle>
          </DialogHeader>
          
          {selectedDonor && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Personal Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-lg">{selectedDonor.name}</p>
                        <p className="text-sm text-gray-500">ID: {selectedDonor.donorNumber}</p>
                      </div>
                      <Badge variant="outline" className="bg-red-50 text-red-800">
                        {selectedDonor.bloodType}
                      </Badge>
                    </div>
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Gender:</span>
                        <span className="text-sm">{selectedDonor.gender.charAt(0).toUpperCase() + selectedDonor.gender.slice(1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Date of Birth:</span>
                        <span className="text-sm">{format(new Date(selectedDonor.dateOfBirth), 'MMM d, yyyy')} ({calculateAge(selectedDonor.dateOfBirth)} years)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Contact:</span>
                        <span className="text-sm">{selectedDonor.contactNumber}</span>
                      </div>
                      {selectedDonor.email && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Email:</span>
                          <span className="text-sm">{selectedDonor.email}</span>
                        </div>
                      )}
                      {selectedDonor.address && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Address:</span>
                          <span className="text-sm">{selectedDonor.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Donation Status</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium">Current Status</p>
                        <p className="text-sm text-gray-500">Eligibility for donation</p>
                      </div>
                      {getStatusBadge(selectedDonor.status)}
                    </div>
                    
                    {selectedDonor.status !== 'active' && (
                      <div className="mt-2 space-y-2">
                        {selectedDonor.deferralReason && (
                          <div>
                            <p className="text-sm font-medium">Deferral Reason:</p>
                            <p className="text-sm text-gray-700">{selectedDonor.deferralReason}</p>
                          </div>
                        )}
                        {selectedDonor.deferralUntil && (
                          <div>
                            <p className="text-sm font-medium">Deferred Until:</p>
                            <p className="text-sm text-gray-700">{format(new Date(selectedDonor.deferralUntil), 'MMM d, yyyy')}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-4">
                      <p className="text-sm font-medium">Donation History:</p>
                      <p className="text-sm text-gray-700">
                        Total Donations: <span className="font-medium">{selectedDonor.donations.length}</span>
                      </p>
                      {selectedDonor.lastDonationDate && (
                        <p className="text-sm text-gray-700">
                          Last Donation: <span className="font-medium">{formatDate(selectedDonor.lastDonationDate)}</span>
                        </p>
                      )}
                    </div>
                    
                    {selectedDonor.status === 'active' && (
                      <Button className="w-full mt-4">
                        <Droplets className="h-4 w-4 mr-2" />
                        Record New Donation
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Medical Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {selectedDonor.medicalHistory && selectedDonor.medicalHistory.length > 0 ? (
                      <div>
                        <p className="font-medium mb-2">Medical History</p>
                        <ul className="list-disc list-inside space-y-1">
                          {selectedDonor.medicalHistory.map((item, index) => (
                            <li key={index} className="text-sm text-gray-700">{item}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No medical history recorded.</p>
                    )}
                    
                    {selectedDonor.notes && (
                      <div className="mt-4">
                        <p className="font-medium mb-1">Notes</p>
                        <p className="text-sm text-gray-700">{selectedDonor.notes}</p>
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-between">
                      {selectedDonor.status === 'active' ? (
                        <Button variant="outline" className="text-amber-600 border-amber-600">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Defer Donor
                        </Button>
                      ) : selectedDonor.status === 'deferred' && (
                        <Button variant="outline" className="text-green-600 border-green-600">
                          <UserCheck className="h-4 w-4 mr-2" />
                          Reactivate
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Donation History</h3>
                {selectedDonor.donations.length === 0 ? (
                  <p className="text-sm text-gray-500">No donation history available.</p>
                ) : (
                  <div className="border rounded-md overflow-hidden">
                    <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 font-medium text-sm">
                      <div>Date</div>
                      <div>Product Type</div>
                      <div>Unit ID</div>
                      <div>Notes</div>
                    </div>
                    <div className="divide-y">
                      {[...selectedDonor.donations]
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map(donation => (
                          <div key={donation.id} className="grid grid-cols-4 gap-4 p-3 items-center">
                            <div>{formatDate(donation.date)}</div>
                            <div>{getProductTypeLabel(donation.productType)}</div>
                            <div>{donation.unitId}</div>
                            <div className="text-sm text-gray-700">{donation.notes || '-'}</div>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDonorDetailsDialog(false)}>
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

export default DonorManagement;
