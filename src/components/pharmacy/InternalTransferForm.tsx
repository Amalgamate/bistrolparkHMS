import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '../ui/card';
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useToast } from '../../context/ToastContext';
import { usePharmacy } from '../../context/PharmacyContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Box, Plus, Trash2, ArrowLeft, ArrowRight } from 'lucide-react';

// Define the form schema
const formSchema = z.object({
  transferType: z.enum(['internal', 'external']),
  fromLocation: z.string().min(1, { message: 'From location is required' }),
  toLocation: z.string().min(1, { message: 'To location is required' }),
  requestedBy: z.string().min(1, { message: 'Requested by is required' }),
  notes: z.string().optional(),
  medications: z.array(
    z.object({
      medicationId: z.string().min(1, { message: 'Medication is required' }),
      quantity: z.number().int().positive({ message: 'Quantity must be positive' })
    })
  ).min(1, { message: 'At least one medication is required' })
});

type FormValues = z.infer<typeof formSchema>;

const InternalTransferForm: React.FC = () => {
  const { showToast } = useToast();
  const { createMedicationTransfer, medicationInventory } = usePharmacy();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      transferType: 'internal',
      fromLocation: '',
      toLocation: '',
      requestedBy: '',
      notes: '',
      medications: [
        {
          medicationId: '',
          quantity: 1
        }
      ]
    }
  });

  // Add a new medication field
  const addMedication = () => {
    const medications = form.getValues('medications');
    form.setValue('medications', [
      ...medications,
      {
        medicationId: '',
        quantity: 1
      }
    ]);
  };

  // Remove a medication field
  const removeMedication = (index: number) => {
    const medications = form.getValues('medications');
    if (medications.length > 1) {
      form.setValue(
        'medications',
        medications.filter((_, i) => i !== index)
      );
    } else {
      showToast('error', 'At least one medication is required');
    }
  };

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    // Validate that from and to locations are different
    if (data.fromLocation === data.toLocation) {
      showToast('error', 'From and To locations cannot be the same');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Check if medications are available in sufficient quantity
      const unavailableMeds = data.medications.filter(med => {
        const inventoryItem = medicationInventory.find(item => item.id === med.medicationId);
        return !inventoryItem || inventoryItem.quantity < med.quantity;
      });
      
      if (unavailableMeds.length > 0) {
        const medNames = unavailableMeds.map(med => {
          const item = medicationInventory.find(item => item.id === med.medicationId);
          return item ? item.name : 'Unknown medication';
        }).join(', ');
        
        showToast('error', `Some medications are not available in sufficient quantity: ${medNames}`);
        setIsSubmitting(false);
        return;
      }
      
      // Add medication names to the transfer
      const medicationsWithNames = data.medications.map(med => {
        const item = medicationInventory.find(item => item.id === med.medicationId);
        return {
          ...med,
          medicationName: item ? item.name : 'Unknown medication'
        };
      });
      
      // Create transfer
      createMedicationTransfer({
        ...data,
        medications: medicationsWithNames
      });
      
      showToast('success', 'Transfer request created successfully');
      navigate('/pharmacy/transfers');
    } catch (error) {
      console.error('Error creating transfer:', error);
      showToast('error', 'Failed to create transfer request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Locations for dropdown
  const locations = [
    'Main Pharmacy',
    'Emergency Pharmacy',
    'Outpatient Pharmacy',
    'Inpatient Pharmacy',
    'Warehouse',
    'Shelf A1',
    'Shelf B2',
    'Shelf C3',
    'Cold Storage',
    'Controlled Substances Cabinet'
  ];

  // Branches for dropdown
  const branches = [
    'Fedha',
    'Utawala',
    'Machakos',
    'Tassia',
    'Kitengela'
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={() => navigate('/pharmacy/transfers')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Transfers
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Internal Transfer</CardTitle>
          <CardDescription>
            Transfer medications between locations or branches
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Transfer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="transferType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transfer Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transfer type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="internal">Internal (Same Branch)</SelectItem>
                          <SelectItem value="external">External (Between Branches)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requestedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requested By</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch('transferType') === 'internal' ? (
                  <>
                    <FormField
                      control={form.control}
                      name="fromLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Location</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select source location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {locations.map(location => (
                                <SelectItem key={location} value={location}>
                                  {location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="toLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To Location</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select destination location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {locations.map(location => (
                                <SelectItem key={location} value={location}>
                                  {location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="fromLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From Branch</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select source branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {branches.map(branch => (
                                <SelectItem key={branch} value={branch}>
                                  {branch}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="toLocation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To Branch</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select destination branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {branches.map(branch => (
                                <SelectItem key={branch} value={branch}>
                                  {branch}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </div>
              
              {/* Medications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Medications to Transfer</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addMedication}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" />
                    Add Medication
                  </Button>
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Medication</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {form.watch('medications').map((_, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`medications.${index}.medicationId`}
                              render={({ field }) => (
                                <FormItem className="m-0">
                                  <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select medication" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {medicationInventory.map(med => (
                                        <SelectItem key={med.id} value={med.id}>
                                          {med.name} ({med.strength}) - {med.quantity} in stock
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell className="text-right">
                            <FormField
                              control={form.control}
                              name={`medications.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem className="m-0">
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      className="w-20 ml-auto"
                                      {...field} 
                                      onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMedication(index)}
                              className="text-red-500 hover:text-red-700 p-0 h-8 w-8"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Additional notes or instructions"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/pharmacy/transfers')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                {isSubmitting ? 'Creating...' : 'Create Transfer'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default InternalTransferForm;
