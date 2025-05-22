import React from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import {
  Droplets,
  Users,
  AlertTriangle,
  Calendar,
  Clock,
  FileText,
  RefreshCw,
  UserPlus,
  Plus,
  ArrowRight,
  Download
} from 'lucide-react';
import { useBloodBank, BloodType, BloodProductType } from '../../context/BloodBankContext';

const BloodBankDashboard: React.FC = () => {
  const { 
    bloodUnits, 
    donors, 
    bloodRequests,
    getBloodUnitsByStatus,
    getBloodInventorySummary,
    getDonorsByStatus,
    getBloodRequestsByStatus
  } = useBloodBank();
  
  // Calculate statistics
  const availableUnits = getBloodUnitsByStatus('available').length;
  const reservedUnits = getBloodUnitsByStatus('reserved').length;
  const crossmatchedUnits = getBloodUnitsByStatus('crossmatched').length;
  const expiredUnits = getBloodUnitsByStatus('expired').length;
  
  const activeDonors = getDonorsByStatus('active').length;
  const deferredDonors = getDonorsByStatus('deferred').length;
  
  const pendingRequests = getBloodRequestsByStatus('pending').length;
  const processingRequests = getBloodRequestsByStatus('processing').length;
  const readyRequests = getBloodRequestsByStatus('ready').length;
  
  // Get inventory summary
  const inventorySummary = getBloodInventorySummary();
  
  // Get critical inventory levels (less than 5 units)
  const criticalInventory = Object.entries(inventorySummary).flatMap(([bloodType, products]) => 
    Object.entries(products)
      .filter(([_, count]) => count < 5 && count > 0)
      .map(([productType, count]) => ({ 
        bloodType: bloodType as BloodType, 
        productType: productType as BloodProductType, 
        count 
      }))
  );
  
  // Get recent requests (last 5)
  const recentRequests = [...bloodRequests]
    .sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime())
    .slice(0, 5);
  
  // Get recent donors (last 5)
  const recentDonors = [...donors]
    .filter(donor => donor.lastDonationDate)
    .sort((a, b) => new Date(b.lastDonationDate!).getTime() - new Date(a.lastDonationDate!).getTime())
    .slice(0, 5);
  
  // Get blood type labels
  const getBloodTypeLabel = (bloodType: BloodType) => {
    return bloodType;
  };
  
  // Get product type labels
  const getProductTypeLabel = (productType: BloodProductType) => {
    const labels: Record<BloodProductType, string> = {
      whole_blood: 'Whole Blood',
      packed_red_cells: 'Packed Red Cells',
      platelets: 'Platelets',
      plasma: 'Plasma',
      cryoprecipitate: 'Cryoprecipitate'
    };
    
    return labels[productType];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Blood Bank Dashboard</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Blood Units</h3>
              <p className="text-2xl font-bold mt-1">{bloodUnits.length}</p>
            </div>
            <Droplets className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-2 text-xs text-red-600">
            {availableUnits} available, {reservedUnits} reserved, {crossmatchedUnits} crossmatched
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Donors</h3>
              <p className="text-2xl font-bold mt-1">{donors.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-blue-600">
            {activeDonors} active, {deferredDonors} deferred
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Requests</h3>
              <p className="text-2xl font-bold mt-1">{bloodRequests.length}</p>
            </div>
            <FileText className="h-8 w-8 text-amber-500" />
          </div>
          <div className="mt-2 text-xs text-amber-600">
            {pendingRequests} pending, {processingRequests} processing, {readyRequests} ready
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Expiring Soon</h3>
              <p className="text-2xl font-bold mt-1">{expiredUnits}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 text-xs text-purple-600">
            Units expiring in the next 7 days
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <div className="p-4 border-b">
            <h3 className="font-medium">Blood Inventory</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="col-span-1">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Blood Type</h4>
                <div className="space-y-2">
                  {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodType[]).map(bloodType => (
                    <div key={bloodType} className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-bold text-sm">
                        {bloodType}
                      </div>
                      <span className="ml-2 text-sm">{getBloodTypeLabel(bloodType)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="col-span-3">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Available Units</h4>
                <div className="space-y-4">
                  {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodType[]).map(bloodType => (
                    <div key={bloodType} className="space-y-1">
                      <div className="grid grid-cols-5 gap-2">
                        {(['whole_blood', 'packed_red_cells', 'platelets', 'plasma', 'cryoprecipitate'] as BloodProductType[]).map(productType => (
                          <div key={`${bloodType}-${productType}`} className="text-center">
                            <div className={`text-sm font-medium ${inventorySummary[bloodType][productType] < 5 ? 'text-red-600' : 'text-gray-700'}`}>
                              {inventorySummary[bloodType][productType]}
                            </div>
                            <div className="text-xs text-gray-500">{getProductTypeLabel(productType).split(' ')[0]}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Critical Inventory</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {criticalInventory.length > 0 ? (
                    criticalInventory.map(item => (
                      <Badge key={`${item.bloodType}-${item.productType}`} variant="outline" className="bg-red-50 text-red-800">
                        {item.bloodType} {getProductTypeLabel(item.productType).split(' ')[0]} ({item.count})
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">No critical inventory levels</span>
                  )}
                </div>
              </div>
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Inventory
              </Button>
            </div>
          </div>
        </Card>
        
        <Card>
          <Tabs defaultValue="requests">
            <div className="p-4 border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="requests">Requests</TabsTrigger>
                <TabsTrigger value="donors">Donors</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="requests" className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Requests</h3>
              {recentRequests.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No recent requests.</p>
              ) : (
                <div className="space-y-3">
                  {recentRequests.map(request => (
                    <div key={request.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{request.requestNumber}</p>
                        <p className="text-xs text-gray-500">
                          {request.department} - {request.patientName || 'No patient'}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={
                            request.urgency === 'emergency' ? 'destructive' : 
                            request.urgency === 'urgent' ? 'default' : 'outline'
                          }
                        >
                          {request.urgency}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(request.requestDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="donors" className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Donors</h3>
              {recentDonors.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No recent donors.</p>
              ) : (
                <div className="space-y-3">
                  {recentDonors.map(donor => (
                    <div key={donor.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{donor.name}</p>
                        <p className="text-xs text-gray-500">
                          {donor.donorNumber} - {donor.bloodType}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-bold text-xs">
                          {donor.bloodType}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {donor.lastDonationDate && new Date(donor.lastDonationDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <UserPlus className="h-8 w-8 text-blue-400 mb-2" />
          <h3 className="font-medium">Register Donor</h3>
          <p className="text-sm text-gray-500 mt-1">Add a new blood donor</p>
          <Button className="mt-3">Register Donor</Button>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Droplets className="h-8 w-8 text-red-400 mb-2" />
          <h3 className="font-medium">Record Donation</h3>
          <p className="text-sm text-gray-500 mt-1">Record a new blood donation</p>
          <Button className="mt-3">New Donation</Button>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <FileText className="h-8 w-8 text-amber-400 mb-2" />
          <h3 className="font-medium">Blood Request</h3>
          <p className="text-sm text-gray-500 mt-1">Create a new blood request</p>
          <Button className="mt-3">New Request</Button>
        </Card>
      </div>
    </div>
  );
};

export default BloodBankDashboard;
