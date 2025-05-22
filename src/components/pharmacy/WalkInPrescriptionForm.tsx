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
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { useToast } from '../../context/ToastContext';
import { usePharmacy, Medication } from '../../context/PharmacyContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pill, Plus, Trash2, ArrowLeft } from 'lucide-react';

// Define the form schema
const formSchema = z.object({
  patientName: z.string().min(3, { message: 'Patient name is required' }),
  patientId: z.string().optional(),
  tokenNumber: z.number().int().positive(),
  doctorName: z.string().min(3, { message: 'Doctor name is required' }),
  medications: z.array(
    z.object({
      name: z.string().min(1, { message: 'Medication name is required' }),
      dosage: z.string().min(1, { message: 'Dosage is required' }),
      frequency: z.string().min(1, { message: 'Frequency is required' }),
      duration: z.string().min(1, { message: 'Duration is required' }),
      instructions: z.string().optional(),
      quantity: z.number().int().positive({ message: 'Quantity must be positive' })
    })
  ).min(1, { message: 'At least one medication is required' }),
  notes: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

const WalkInPrescriptionForm: React.FC = () => {
  const { showToast } = useToast();
  const { createWalkInPrescription, medicationInventory } = usePharmacy();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: '',
      patientId: '',
      tokenNumber: Math.floor(Math.random() * 900) + 100, // Random 3-digit number
      doctorName: 'Walk-in Pharmacist',
      medications: [
        {
          name: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
          quantity: 1
        }
      ],
      notes: ''
    }
  });

  // Add a new medication field
  const addMedication = () => {
    const medications = form.getValues('medications');
    form.setValue('medications', [
      ...medications,
      {
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
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
    setIsSubmitting(true);
    
    try {
      // Check if medications are in inventory
      const unavailableMeds = data.medications.filter(med => {
        const inventoryItem = medicationInventory.find(item => item.name === med.name);
        return !inventoryItem || inventoryItem.quantity < med.quantity;
      });
      
      if (unavailableMeds.length > 0) {
        showToast('error', `Some medications are not available in sufficient quantity: ${unavailableMeds.map(med => med.name).join(', ')}`);
        setIsSubmitting(false);
        return;
      }
      
      // Create prescription with unique IDs for medications
      const prescriptionWithIds = {
        ...data,
        medications: data.medications.map(med => ({
          ...med,
          id: `M${Math.random().toString(36).substring(2, 10)}`,
        }))
      };
      
      createWalkInPrescription(prescriptionWithIds);
      showToast('success', 'Walk-in prescription created successfully');
      navigate('/pharmacy/queue');
    } catch (error) {
      console.error('Error creating walk-in prescription:', error);
      showToast('error', 'Failed to create walk-in prescription');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={() => navigate('/pharmacy')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Walk-in Prescription</CardTitle>
          <CardDescription>
            Create a new prescription for a walk-in patient
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Patient Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient ID (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient ID if available" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tokenNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token Number</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="doctorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pharmacist/Doctor Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Medications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Medications</h3>
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
                
                {form.watch('medications').map((_, index) => (
                  <div key={index} className="border rounded-md p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Medication {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedication(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name={`medications.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medication Name</FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select medication" />
                                </SelectTrigger>
                                <SelectContent>
                                  {medicationInventory.map(med => (
                                    <SelectItem key={med.id} value={med.name}>
                                      {med.name} ({med.strength}) - {med.quantity} in stock
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`medications.${index}.dosage`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Dosage</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 500mg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`medications.${index}.frequency`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequency</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Twice daily" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`medications.${index}.duration`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 7 days" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`medications.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                {...field} 
                                onChange={e => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`medications.${index}.instructions`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Take after meals" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
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
                onClick={() => navigate('/pharmacy')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Pill className="h-4 w-4" />
                {isSubmitting ? 'Creating...' : 'Create Prescription'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default WalkInPrescriptionForm;
