import React, { useState } from 'react';
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
  Package, 
  Search, 
  Filter, 
  Plus, 
  AlertTriangle,
  RefreshCw,
  Edit,
  Trash2
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '../ui/dialog';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import { usePharmacy, MedicationInventory as MedicationInventoryType } from '../../context/PharmacyContext';
import { useToast } from '../../context/ToastContext';
import { format, isBefore } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define form schema for adding/editing medication
const medicationSchema = z.object({
  name: z.string().min(1, 'Medication name is required'),
  genericName: z.string().min(1, 'Generic name is required'),
  category: z.string().min(1, 'Category is required'),
  dosageForm: z.string().min(1, 'Dosage form is required'),
  strength: z.string().min(1, 'Strength is required'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  batchNumber: z.string().min(1, 'Batch number is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
  quantity: z.coerce.number().min(0, 'Quantity must be a positive number'),
  reorderLevel: z.coerce.number().min(0, 'Reorder level must be a positive number'),
  unitPrice: z.coerce.number().min(0, 'Unit price must be a positive number'),
  location: z.string().min(1, 'Location is required'),
  branch: z.string().min(1, 'Branch is required')
});

type MedicationFormData = z.infer<typeof medicationSchema>;

const MedicationInventory: React.FC = () => {
  const { medicationInventory, addMedicationToInventory, updateMedicationInventory } = usePharmacy();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<MedicationInventoryType | null>(null);
  
  // Initialize form
  const form = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: '',
      genericName: '',
      category: '',
      dosageForm: '',
      strength: '',
      manufacturer: '',
      batchNumber: '',
      expiryDate: '',
      quantity: 0,
      reorderLevel: 0,
      unitPrice: 0,
      location: '',
      branch: 'Fedha' // Default branch
    }
  });
  
  // Get unique categories for filtering
  const categories = Array.from(new Set(medicationInventory.map(med => med.category)));
  
  // Filter medications by category and search query
  const filteredMedications = medicationInventory
    .filter(med => categoryFilter === 'all' || med.category === categoryFilter)
    .filter(med => 
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
  // Check if medication is expiring soon (within 90 days)
  const isExpiringSoon = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const ninetyDaysFromNow = new Date();
    ninetyDaysFromNow.setDate(today.getDate() + 90);
    
    return isBefore(expiry, ninetyDaysFromNow) && isBefore(today, expiry);
  };
  
  // Check if medication is expired
  const isExpired = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    
    return isBefore(expiry, today);
  };
  
  // Check if medication is low in stock
  const isLowStock = (quantity: number, reorderLevel: number) => {
    return quantity <= reorderLevel;
  };
  
  // Handle form submission for adding/editing medication
  const onSubmit = (data: MedicationFormData) => {
    if (editingMedication) {
      // Update existing medication
      updateMedicationInventory(editingMedication.id, data);
      showToast('success', `${data.name} updated successfully`);
    } else {
      // Add new medication
      addMedicationToInventory(data);
      showToast('success', `${data.name} added to inventory`);
    }
    
    // Reset form and close dialog
    form.reset();
    setIsAddDialogOpen(false);
    setEditingMedication(null);
  };
  
  // Handle edit medication
  const handleEditMedication = (medication: MedicationInventoryType) => {
    setEditingMedication(medication);
    
    // Set form values
    form.reset({
      name: medication.name,
      genericName: medication.genericName,
      category: medication.category,
      dosageForm: medication.dosageForm,
      strength: medication.strength,
      manufacturer: medication.manufacturer,
      batchNumber: medication.batchNumber,
      expiryDate: medication.expiryDate.split('T')[0], // Format date for input
      quantity: medication.quantity,
      reorderLevel: medication.reorderLevel,
      unitPrice: medication.unitPrice,
      location: medication.location,
      branch: medication.branch
    });
    
    setIsAddDialogOpen(true);
  };
  
  // Handle refresh
  const handleRefresh = () => {
    // In a real app, this would fetch the latest data from the server
    showToast('info', 'Refreshed medication inventory');
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Medication Inventory</CardTitle>
              <CardDescription>Manage medication stock and inventory</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search medications..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setCategoryFilter('all')}>
                    All Categories
                  </DropdownMenuItem>
                  {categories.map(category => (
                    <DropdownMenuItem 
                      key={category} 
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="icon" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Medication
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>
                      {editingMedication ? 'Edit Medication' : 'Add New Medication'}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Medication Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Amoxicillin" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="genericName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Generic Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Amoxicillin" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                                  <SelectItem value="Analgesics">Analgesics</SelectItem>
                                  <SelectItem value="Antihypertensives">Antihypertensives</SelectItem>
                                  <SelectItem value="Antidiabetics">Antidiabetics</SelectItem>
                                  <SelectItem value="Antihistamines">Antihistamines</SelectItem>
                                  <SelectItem value="Antidepressants">Antidepressants</SelectItem>
                                  <SelectItem value="Vitamins">Vitamins</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dosageForm"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dosage Form</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select dosage form" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Tablet">Tablet</SelectItem>
                                  <SelectItem value="Capsule">Capsule</SelectItem>
                                  <SelectItem value="Syrup">Syrup</SelectItem>
                                  <SelectItem value="Injection">Injection</SelectItem>
                                  <SelectItem value="Cream">Cream</SelectItem>
                                  <SelectItem value="Ointment">Ointment</SelectItem>
                                  <SelectItem value="Drops">Drops</SelectItem>
                                  <SelectItem value="Inhaler">Inhaler</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="strength"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Strength</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 500mg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="manufacturer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Manufacturer</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., ABC Pharmaceuticals" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="batchNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Batch Number</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., B12345" {...field} />
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
                        <FormField
                          control={form.control}
                          name="quantity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantity</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="reorderLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Reorder Level</FormLabel>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="unitPrice"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit Price</FormLabel>
                              <FormControl>
                                <Input type="number" step="0.01" {...field} />
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
                                <Input placeholder="e.g., Shelf A1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="branch"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Branch</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select branch" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Fedha">Fedha</SelectItem>
                                  <SelectItem value="Utawala">Utawala</SelectItem>
                                  <SelectItem value="Machakos">Machakos</SelectItem>
                                  <SelectItem value="Tassia">Tassia</SelectItem>
                                  <SelectItem value="Kitengela">Kitengela</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <DialogFooter>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            form.reset();
                            setIsAddDialogOpen(false);
                            setEditingMedication(null);
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingMedication ? 'Update Medication' : 'Add Medication'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredMedications.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Medications</h3>
              <p className="text-gray-500 mb-4">
                There are no medications matching your filters.
              </p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Dosage Form</TableHead>
                    <TableHead>Strength</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Expiry Date</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMedications.map((medication) => (
                    <TableRow key={medication.id}>
                      <TableCell className="font-medium">{medication.name}</TableCell>
                      <TableCell>{medication.category}</TableCell>
                      <TableCell>{medication.dosageForm}</TableCell>
                      <TableCell>{medication.strength}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={isLowStock(medication.quantity, medication.reorderLevel) ? 'text-red-600 font-medium' : ''}>
                            {medication.quantity}
                          </span>
                          {isLowStock(medication.quantity, medication.reorderLevel) && (
                            <AlertTriangle className="h-4 w-4 ml-1 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={
                            isExpired(medication.expiryDate) 
                              ? 'text-red-600 font-medium' 
                              : isExpiringSoon(medication.expiryDate) 
                                ? 'text-yellow-600 font-medium' 
                                : ''
                          }>
                            {format(new Date(medication.expiryDate), 'dd/MM/yyyy')}
                          </span>
                          {isExpired(medication.expiryDate) && (
                            <AlertTriangle className="h-4 w-4 ml-1 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{medication.unitPrice.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditMedication(medication)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationInventory;
