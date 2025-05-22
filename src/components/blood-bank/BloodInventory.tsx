import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  Droplets,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  AlertTriangle,
  Calendar,
  Clock,
  Download
} from 'lucide-react';
import { useBloodBank, BloodUnit, BloodType, BloodProductType, BloodUnitStatus } from '../../context/BloodBankContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form';
import { format, addDays } from 'date-fns';

// Define the form schema for adding a new blood unit
const bloodUnitFormSchema = z.object({
  unitNumber: z.string().min(1, {
    message: "Unit number is required.",
  }),
  bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const),
  productType: z.enum(['whole_blood', 'packed_red_cells', 'platelets', 'plasma', 'cryoprecipitate'] as const),
  donationDate: z.string().min(1, {
    message: "Donation date is required.",
  }),
  expiryDate: z.string().min(1, {
    message: "Expiry date is required.",
  }),
  volume: z.string().min(1, {
    message: "Volume is required.",
  }),
  location: z.string().min(1, {
    message: "Storage location is required.",
  }),
  donorId: z.string().optional(),
  notes: z.string().optional(),
});

type BloodUnitFormValues = z.infer<typeof bloodUnitFormSchema>;

const BloodInventory: React.FC = () => {
  const { 
    bloodUnits, 
    addBloodUnit, 
    updateBloodUnitStatus, 
    discardBloodUnit,
    donors
  } = useBloodBank();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodType, setFilterBloodType] = useState<BloodType | 'all'>('all');
  const [filterProductType, setFilterProductType] = useState<BloodProductType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<BloodUnitStatus | 'all'>('all');
  const [showAddUnitDialog, setShowAddUnitDialog] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState<BloodUnit | null>(null);
  const [showUnitDetailsDialog, setShowUnitDetailsDialog] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [discardReason, setDiscardReason] = useState('');
  
  // Setup form for adding a new blood unit
  const form = useForm<BloodUnitFormValues>({
    resolver: zodResolver(bloodUnitFormSchema),
    defaultValues: {
      unitNumber: '',
      bloodType: 'O+',
      productType: 'whole_blood',
      donationDate: format(new Date(), 'yyyy-MM-dd'),
      expiryDate: format(addDays(new Date(), 35), 'yyyy-MM-dd'), // Default 35 days for whole blood
      volume: '450',
      location: 'Main Storage',
      donorId: '',
      notes: '',
    },
  });
  
  // Watch product type to update expiry date
  const watchProductType = form.watch('productType');
  const watchDonationDate = form.watch('donationDate');
  
  // Update expiry date when product type changes
  React.useEffect(() => {
    if (watchDonationDate) {
      const donationDate = new Date(watchDonationDate);
      let expiryDays = 35; // Default for whole blood
      
      switch (watchProductType) {
        case 'whole_blood':
          expiryDays = 35;
          break;
        case 'packed_red_cells':
          expiryDays = 42;
          break;
        case 'platelets':
          expiryDays = 5;
          break;
        case 'plasma':
          expiryDays = 365;
          break;
        case 'cryoprecipitate':
          expiryDays = 365;
          break;
      }
      
      const expiryDate = addDays(donationDate, expiryDays);
      form.setValue('expiryDate', format(expiryDate, 'yyyy-MM-dd'));
    }
  }, [watchProductType, watchDonationDate, form]);
  
  // Filter blood units based on search term, blood type, product type, and status
  const filteredUnits = bloodUnits.filter(unit => {
    const matchesSearch = 
      unit.unitNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (unit.donorId && unit.donorId.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesBloodType = filterBloodType === 'all' || unit.bloodType === filterBloodType;
    const matchesProductType = filterProductType === 'all' || unit.productType === filterProductType;
    const matchesStatus = filterStatus === 'all' || unit.status === filterStatus;
    return matchesSearch && matchesBloodType && matchesProductType && matchesStatus;
  });
  
  // Sort units by donation date (newest first)
  const sortedUnits = [...filteredUnits].sort((a, b) => 
    new Date(b.donationDate).getTime() - new Date(a.donationDate).getTime()
  );
  
  // Handle form submission for adding a new blood unit
  const onSubmit = (data: BloodUnitFormValues) => {
    addBloodUnit({
      unitNumber: data.unitNumber,
      bloodType: data.bloodType,
      productType: data.productType,
      donationDate: data.donationDate,
      expiryDate: data.expiryDate,
      volume: parseFloat(data.volume),
      status: 'available',
      location: data.location,
      donorId: data.donorId || undefined,
      notes: data.notes || undefined
    });
    
    setShowAddUnitDialog(false);
    form.reset();
  };
  
  // Handle viewing unit details
  const handleViewUnit = (unit: BloodUnit) => {
    setSelectedUnit(unit);
    setShowUnitDetailsDialog(true);
  };
  
  // Handle discarding a unit
  const handleDiscardUnit = () => {
    if (selectedUnit && discardReason) {
      discardBloodUnit(selectedUnit.id, discardReason);
      setShowDiscardDialog(false);
      setDiscardReason('');
      // Update the selected unit
      setSelectedUnit({
        ...selectedUnit,
        status: 'discarded',
        notes: selectedUnit.notes 
          ? `${selectedUnit.notes}\nDiscarded: ${discardReason}` 
          : `Discarded: ${discardReason}`
      });
    }
  };
  
  // Get status badge for a blood unit
  const getStatusBadge = (status: BloodUnitStatus) => {
    const statusConfig: Record<BloodUnitStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      available: { label: 'Available', variant: 'default' },
      reserved: { label: 'Reserved', variant: 'secondary' },
      crossmatched: { label: 'Crossmatched', variant: 'secondary' },
      issued: { label: 'Issued', variant: 'secondary' },
      transfused: { label: 'Transfused', variant: 'default' },
      expired: { label: 'Expired', variant: 'destructive' },
      discarded: { label: 'Discarded', variant: 'destructive' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  // Get product type label
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
  
  // Check if a unit is expiring soon (within 7 days)
  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0;
  };
  
  // Get donor name by ID
  const getDonorName = (donorId?: string) => {
    if (!donorId) return '-';
    const donor = donors.find(d => d.id === donorId);
    return donor ? donor.name : donorId;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Blood Inventory</h2>
        <Button onClick={() => setShowAddUnitDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Blood Unit
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search units..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
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
          
          <Select value={filterProductType} onValueChange={(value: any) => setFilterProductType(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Product Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="whole_blood">Whole Blood</SelectItem>
              <SelectItem value="packed_red_cells">Packed Red Cells</SelectItem>
              <SelectItem value="platelets">Platelets</SelectItem>
              <SelectItem value="plasma">Plasma</SelectItem>
              <SelectItem value="cryoprecipitate">Cryoprecipitate</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
              <SelectItem value="crossmatched">Crossmatched</SelectItem>
              <SelectItem value="issued">Issued</SelectItem>
              <SelectItem value="transfused">Transfused</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="discarded">Discarded</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      
      {sortedUnits.length === 0 ? (
        <Card className="p-6 text-center">
          <Droplets className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No blood units found matching your criteria.</p>
        </Card>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-8 gap-4 p-3 bg-gray-50 font-medium text-sm">
            <div>Unit Number</div>
            <div>Blood Type</div>
            <div>Product</div>
            <div>Donation Date</div>
            <div>Expiry Date</div>
            <div>Status</div>
            <div>Donor</div>
            <div>Actions</div>
          </div>
          <div className="divide-y">
            {sortedUnits.map(unit => (
              <div key={unit.id} className="grid grid-cols-8 gap-4 p-3 items-center hover:bg-gray-50">
                <div className="font-medium">{unit.unitNumber}</div>
                <div>
                  <Badge variant="outline" className="bg-red-50 text-red-800">
                    {unit.bloodType}
                  </Badge>
                </div>
                <div>{getProductTypeLabel(unit.productType)}</div>
                <div className="text-sm">{new Date(unit.donationDate).toLocaleDateString()}</div>
                <div className="text-sm">
                  <span className={isExpiringSoon(unit.expiryDate) ? 'text-red-600 font-medium' : ''}>
                    {new Date(unit.expiryDate).toLocaleDateString()}
                  </span>
                  {isExpiringSoon(unit.expiryDate) && (
                    <AlertTriangle className="h-4 w-4 inline-block ml-1 text-red-600" />
                  )}
                </div>
                <div>{getStatusBadge(unit.status)}</div>
                <div className="truncate">{getDonorName(unit.donorId)}</div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewUnit(unit)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Add Blood Unit Dialog */}
      <Dialog open={showAddUnitDialog} onOpenChange={setShowAddUnitDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Blood Unit</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="unitNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., BU-2023-12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blood Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="productType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="whole_blood">Whole Blood</SelectItem>
                          <SelectItem value="packed_red_cells">Packed Red Cells</SelectItem>
                          <SelectItem value="platelets">Platelets</SelectItem>
                          <SelectItem value="plasma">Plasma</SelectItem>
                          <SelectItem value="cryoprecipitate">Cryoprecipitate</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="donationDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Donation Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="volume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Volume (mL)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Storage Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Main Storage" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="donorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donor ID (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Donor ID if available" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Any additional notes" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddUnitDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Unit</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Blood Unit Details Dialog */}
      <Dialog open={showUnitDetailsDialog} onOpenChange={setShowUnitDetailsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Blood Unit Details</DialogTitle>
          </DialogHeader>
          
          {selectedUnit && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Unit Number</h3>
                  <p className="text-lg font-semibold">{selectedUnit.unitNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Blood Type</h3>
                  <Badge variant="outline" className="bg-red-50 text-red-800 mt-1">
                    {selectedUnit.bloodType}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Product Type</h3>
                  <p>{getProductTypeLabel(selectedUnit.productType)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Volume</h3>
                  <p>{selectedUnit.volume} mL</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Donation Date</h3>
                  <p>{new Date(selectedUnit.donationDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Expiry Date</h3>
                  <p className={isExpiringSoon(selectedUnit.expiryDate) ? 'text-red-600 font-medium' : ''}>
                    {new Date(selectedUnit.expiryDate).toLocaleDateString()}
                    {isExpiringSoon(selectedUnit.expiryDate) && (
                      <AlertTriangle className="h-4 w-4 inline-block ml-1 text-red-600" />
                    )}
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <div className="mt-1">{getStatusBadge(selectedUnit.status)}</div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Storage Location</h3>
                <p>{selectedUnit.location}</p>
              </div>
              
              {selectedUnit.donorId && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Donor</h3>
                  <p>{getDonorName(selectedUnit.donorId)}</p>
                </div>
              )}
              
              {(selectedUnit.crossmatchedFor || selectedUnit.reservedFor || selectedUnit.issuedTo) && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                  {selectedUnit.crossmatchedFor && <p>Crossmatched for: {selectedUnit.crossmatchedFor}</p>}
                  {selectedUnit.reservedFor && <p>Reserved for: {selectedUnit.reservedFor}</p>}
                  {selectedUnit.issuedTo && <p>Issued to: {selectedUnit.issuedTo}</p>}
                </div>
              )}
              
              {selectedUnit.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                  <p className="text-sm whitespace-pre-line">{selectedUnit.notes}</p>
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowUnitDetailsDialog(false)}
                >
                  Close
                </Button>
                
                {selectedUnit.status === 'available' && (
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      setShowDiscardDialog(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Discard Unit
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Discard Confirmation Dialog */}
      <Dialog open={showDiscardDialog} onOpenChange={setShowDiscardDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Discard Blood Unit</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p>Are you sure you want to discard this blood unit? This action cannot be undone.</p>
            
            <div>
              <Label htmlFor="discardReason">Reason for Discarding</Label>
              <Input
                id="discardReason"
                value={discardReason}
                onChange={(e) => setDiscardReason(e.target.value)}
                placeholder="Enter reason for discarding this unit"
                className="mt-1"
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowDiscardDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                type="button" 
                variant="destructive"
                onClick={handleDiscardUnit}
                disabled={!discardReason}
              >
                Discard Unit
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BloodInventory;
