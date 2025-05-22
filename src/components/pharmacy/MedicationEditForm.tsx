import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { usePharmacy, MedicationInventory } from '../../context/PharmacyContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Package, Save, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, { message: 'Medication name is required' }),
  genericName: z.string().min(1, { message: 'Generic name is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  dosageForm: z.string().min(1, { message: 'Dosage form is required' }),
  strength: z.string().min(1, { message: 'Strength is required' }),
  manufacturer: z.string().min(1, { message: 'Manufacturer is required' }),
  batchNumber: z.string().min(1, { message: 'Batch number is required' }),
  expiryDate: z.string().min(1, { message: 'Expiry date is required' }),
  quantity: z.number().int().min(0, { message: 'Quantity must be a non-negative integer' }),
  reorderLevel: z.number().int().min(1, { message: 'Reorder level must be a positive integer' }),
  unitPrice: z.number().positive({ message: 'Unit price must be positive' }),
  location: z.string().min(1, { message: 'Location is required' }),
  branch: z.string().min(1, { message: 'Branch is required' })
});

type FormValues = z.infer<typeof formSchema>;

const MedicationEditForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const { getMedication, editMedicationDetails, updateMedicationPrice } = usePharmacy();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [medication, setMedication] = useState<MedicationInventory | null>(null);

  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
      reorderLevel: 10,
      unitPrice: 0,
      location: '',
      branch: ''
    }
  });

  // Load medication data
  useEffect(() => {
    if (id) {
      const med = getMedication(id);
      if (med) {
        setMedication(med);
        
        // Format the date to YYYY-MM-DD for the input field
        const formattedDate = med.expiryDate.split('T')[0];
        
        form.reset({
          name: med.name,
          genericName: med.genericName,
          category: med.category,
          dosageForm: med.dosageForm,
          strength: med.strength,
          manufacturer: med.manufacturer,
          batchNumber: med.batchNumber,
          expiryDate: formattedDate,
          quantity: med.quantity,
          reorderLevel: med.reorderLevel,
          unitPrice: med.unitPrice,
          location: med.location,
          branch: med.branch
        });
      } else {
        showToast('error', 'Medication not found');
        navigate('/pharmacy/inventory');
      }
    } else {
      // If no ID is provided, we're creating a new medication
      form.reset({
        name: '',
        genericName: '',
        category: '',
        dosageForm: '',
        strength: '',
        manufacturer: '',
        batchNumber: '',
        expiryDate: format(new Date(), 'yyyy-MM-dd'),
        quantity: 0,
        reorderLevel: 10,
        unitPrice: 0,
        location: '',
        branch: ''
      });
    }
  }, [id, getMedication, form, navigate, showToast]);

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      if (id && medication) {
        // Update existing medication
        editMedicationDetails(id, {
          ...data,
          // Convert expiryDate to ISO string
          expiryDate: new Date(data.expiryDate).toISOString()
        });
        
        // If price changed, update it separately
        if (data.unitPrice !== medication.unitPrice) {
          updateMedicationPrice(id, data.unitPrice);
        }
        
        showToast('success', `${data.name} updated successfully`);
      } else {
        // This form is only for editing, not creating
        showToast('error', 'Cannot create new medication from this form');
      }
      
      navigate('/pharmacy/inventory');
    } catch (error) {
      console.error('Error updating medication:', error);
      showToast('error', 'Failed to update medication');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Categories for dropdown
  const categories = [
    'Antibiotics',
    'Analgesics',
    'Antihistamines',
    'Antihypertensives',
    'Antidiabetics',
    'Antidepressants',
    'Antipsychotics',
    'Antivirals',
    'Bronchodilators',
    'Corticosteroids',
    'Diuretics',
    'Gastrointestinals',
    'Hormones',
    'Immunosuppressants',
    'Lipid-lowering',
    'Muscle Relaxants',
    'NSAIDs',
    'Sedatives',
    'Vitamins',
    'Other'
  ];

  // Dosage forms for dropdown
  const dosageForms = [
    'Tablet',
    'Capsule',
    'Liquid',
    'Injection',
    'Cream',
    'Ointment',
    'Gel',
    'Patch',
    'Suppository',
    'Inhaler',
    'Drops',
    'Powder',
    'Spray',
    'Syrup',
    'Suspension'
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
          onClick={() => navigate('/pharmacy/inventory')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Inventory
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Medication Details</CardTitle>
          <CardDescription>
            Update information for {medication?.name || 'medication'}
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Medication Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                        <Input {...field} />
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
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
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
                          {dosageForms.map(form => (
                            <SelectItem key={form} value={form}>
                              {form}
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
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Inventory Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="batchNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Batch Number</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                  name="reorderLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reorder Level</FormLabel>
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
                  name="unitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit Price</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value))}
                        />
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
                          {branches.map(branch => (
                            <SelectItem key={branch} value={branch.toLowerCase()}>
                              {branch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/pharmacy/inventory')}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default MedicationEditForm;
