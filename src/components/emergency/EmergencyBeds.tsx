import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  Bed,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Users
} from 'lucide-react';
import { useEmergency, EmergencyBed } from '../../context/EmergencyContext';
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

// Define the form schema for adding a new bed
const bedFormSchema = z.object({
  name: z.string().min(1, {
    message: "Bed name is required.",
  }),
  type: z.enum(['regular', 'trauma', 'isolation', 'pediatric', 'resuscitation'] as const),
});

type BedFormValues = z.infer<typeof bedFormSchema>;

const EmergencyBeds: React.FC = () => {
  const { beds, addBed, updateBedStatus, getPatientById } = useEmergency();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<EmergencyBed['type'] | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<EmergencyBed['status'] | 'all'>('all');
  const [showAddBedDialog, setShowAddBedDialog] = useState(false);
  const [selectedBed, setSelectedBed] = useState<EmergencyBed | null>(null);
  const [showBedDetailsDialog, setShowBedDetailsDialog] = useState(false);
  
  // Setup form for adding a new bed
  const form = useForm<BedFormValues>({
    resolver: zodResolver(bedFormSchema),
    defaultValues: {
      name: '',
      type: 'regular',
    },
  });
  
  // Filter beds based on search term, type, and status
  const filteredBeds = beds.filter(bed => {
    const matchesSearch = bed.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || bed.type === filterType;
    const matchesStatus = filterStatus === 'all' || bed.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });
  
  // Group beds by type for the visual layout
  const bedsByType: Record<EmergencyBed['type'], EmergencyBed[]> = {
    regular: [],
    trauma: [],
    isolation: [],
    pediatric: [],
    resuscitation: []
  };
  
  filteredBeds.forEach(bed => {
    bedsByType[bed.type].push(bed);
  });
  
  // Handle form submission for adding a new bed
  const onSubmit = (data: BedFormValues) => {
    addBed(data.name, data.type);
    setShowAddBedDialog(false);
    form.reset();
  };
  
  // Handle bed status change
  const handleStatusChange = (bedId: string, status: EmergencyBed['status']) => {
    updateBedStatus(bedId, status);
    if (selectedBed && selectedBed.id === bedId) {
      setSelectedBed({...selectedBed, status});
    }
  };
  
  // Handle viewing bed details
  const handleViewBed = (bed: EmergencyBed) => {
    setSelectedBed(bed);
    setShowBedDetailsDialog(true);
  };
  
  // Get status badge for a bed
  const getBedStatusBadge = (status: EmergencyBed['status']) => {
    const statusConfig: Record<EmergencyBed['status'], { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      available: { label: 'Available', variant: 'default' },
      occupied: { label: 'Occupied', variant: 'destructive' },
      cleaning: { label: 'Cleaning', variant: 'secondary' },
      maintenance: { label: 'Maintenance', variant: 'outline' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  // Get type label for a bed
  const getBedTypeLabel = (type: EmergencyBed['type']) => {
    const typeLabels: Record<EmergencyBed['type'], string> = {
      regular: 'Regular',
      trauma: 'Trauma',
      isolation: 'Isolation',
      pediatric: 'Pediatric',
      resuscitation: 'Resuscitation'
    };
    
    return typeLabels[type];
  };
  
  // Get color for bed card based on status
  const getBedCardColor = (status: EmergencyBed['status']) => {
    const colors: Record<EmergencyBed['status'], string> = {
      available: 'border-green-500 bg-green-50',
      occupied: 'border-red-500 bg-red-50',
      cleaning: 'border-blue-500 bg-blue-50',
      maintenance: 'border-gray-500 bg-gray-50'
    };
    
    return colors[status];
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Emergency Beds</h2>
        <Button onClick={() => setShowAddBedDialog(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Bed
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search beds..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="trauma">Trauma</SelectItem>
              <SelectItem value="isolation">Isolation</SelectItem>
              <SelectItem value="pediatric">Pediatric</SelectItem>
              <SelectItem value="resuscitation">Resuscitation</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <Badge variant="outline" className="bg-green-50">
            <div className="w-2 h-2 rounded-full bg-green-600 mr-1"></div>
            <span className="text-xs">{beds.filter(b => b.status === 'available').length} Available</span>
          </Badge>
          <Badge variant="outline" className="bg-red-50">
            <div className="w-2 h-2 rounded-full bg-red-600 mr-1"></div>
            <span className="text-xs">{beds.filter(b => b.status === 'occupied').length} Occupied</span>
          </Badge>
        </div>
      </div>
      
      <Tabs defaultValue="visual">
        <TabsList>
          <TabsTrigger value="visual">Visual Layout</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visual" className="space-y-6 mt-4">
          {Object.entries(bedsByType).map(([type, typeBeds]) => (
            typeBeds.length > 0 && (
              <div key={type} className="space-y-2">
                <h3 className="text-md font-medium">{getBedTypeLabel(type as EmergencyBed['type'])} Beds</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {typeBeds.map(bed => (
                    <div
                      key={bed.id}
                      className={`border-l-4 ${getBedCardColor(bed.status)} p-3 rounded-md cursor-pointer hover:shadow-md transition-shadow`}
                      onClick={() => handleViewBed(bed)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">{bed.name}</h4>
                        {getBedStatusBadge(bed.status)}
                      </div>
                      {bed.status === 'occupied' && bed.patientId && (
                        <p className="text-xs text-gray-500 mt-1">
                          Patient ID: {bed.patientId}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-1">
                        Last updated: {new Date(bed.lastUpdatedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
          
          {filteredBeds.length === 0 && (
            <Card className="p-6 text-center">
              <Bed className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No beds found matching your criteria.</p>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="list" className="mt-4">
          {filteredBeds.length === 0 ? (
            <Card className="p-6 text-center">
              <Bed className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No beds found matching your criteria.</p>
            </Card>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-6 gap-4 p-3 bg-gray-50 font-medium text-sm">
                <div>Bed Name</div>
                <div>Type</div>
                <div>Status</div>
                <div>Patient</div>
                <div>Last Updated</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                {filteredBeds.map(bed => (
                  <div key={bed.id} className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
                    <div className="font-medium">{bed.name}</div>
                    <div>{getBedTypeLabel(bed.type)}</div>
                    <div>{getBedStatusBadge(bed.status)}</div>
                    <div>{bed.patientId || '-'}</div>
                    <div className="text-sm">{new Date(bed.lastUpdatedAt).toLocaleString()}</div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewBed(bed)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Add Bed Dialog */}
      <Dialog open={showAddBedDialog} onOpenChange={setShowAddBedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Bed</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ER-01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a unique identifier for this bed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bed type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="trauma">Trauma</SelectItem>
                        <SelectItem value="isolation">Isolation</SelectItem>
                        <SelectItem value="pediatric">Pediatric</SelectItem>
                        <SelectItem value="resuscitation">Resuscitation</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the type of bed and its capabilities.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowAddBedDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Bed</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Bed Details Dialog */}
      <Dialog open={showBedDetailsDialog} onOpenChange={setShowBedDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bed Details</DialogTitle>
          </DialogHeader>
          
          {selectedBed && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Bed Name</h3>
                  <p className="text-lg font-semibold">{selectedBed.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Type</h3>
                  <p className="text-lg font-semibold">{getBedTypeLabel(selectedBed.type)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <div className="mt-1">{getBedStatusBadge(selectedBed.status)}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Last updated: {new Date(selectedBed.lastUpdatedAt).toLocaleString()}
                </p>
              </div>
              
              {selectedBed.status === 'occupied' && selectedBed.patientId && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Assigned Patient</h3>
                  <p className="font-medium">{selectedBed.patientId}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={selectedBed.status === 'available' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleStatusChange(selectedBed.id, 'available')}
                    disabled={selectedBed.status === 'occupied'}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Available
                  </Button>
                  <Button 
                    variant={selectedBed.status === 'cleaning' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleStatusChange(selectedBed.id, 'cleaning')}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Cleaning
                  </Button>
                  <Button 
                    variant={selectedBed.status === 'maintenance' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleStatusChange(selectedBed.id, 'maintenance')}
                  >
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Maintenance
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencyBeds;
