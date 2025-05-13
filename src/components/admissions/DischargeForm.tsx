import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from '../ui/form';
import { 
  Calendar, 
  Clock, 
  FileText,
  DollarSign,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  User,
  Bed,
  Stethoscope
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useNotification } from '../../context/NotificationContext';
import { format, differenceInDays } from 'date-fns';
import { Admission } from '../../context/AdmissionContext';

// Define the form schema
const dischargeSchema = z.object({
  dischargeDate: z.string().min(1, 'Discharge date is required'),
  dischargeTime: z.string().min(1, 'Discharge time is required'),
  dischargeNotes: z.string().min(5, 'Discharge notes are required'),
  billAmount: z.coerce.number().min(0, 'Bill amount must be a positive number'),
  billPaid: z.boolean().default(false),
  paymentMethod: z.string().optional(),
  paymentReference: z.string().optional(),
});

type DischargeFormData = z.infer<typeof dischargeSchema>;

interface DischargeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: DischargeFormData) => void;
  patient: Admission;
}

const DischargeForm: React.FC<DischargeFormProps> = ({
  isOpen,
  onClose,
  onSave,
  patient
}) => {
  const { showToast } = useToast();
  const { showNotification } = useNotification();
  const [showPaymentFields, setShowPaymentFields] = useState(false);

  // Calculate stay duration
  const admissionDate = new Date(patient.admissionDate);
  const today = new Date();
  const stayDuration = differenceInDays(today, admissionDate);
  
  // Calculate estimated bill
  const dailyRate = patient.roomType === 'Executive' 
    ? 15000 
    : patient.roomType === 'Premium' 
      ? 10000 
      : patient.roomType === 'Basic' 
        ? 5000 
        : 2500; // Ward
  
  const estimatedBill = dailyRate * (stayDuration || 1);

  // Initialize form
  const form = useForm<DischargeFormData>({
    resolver: zodResolver(dischargeSchema),
    defaultValues: {
      dischargeDate: format(new Date(), 'yyyy-MM-dd'),
      dischargeTime: format(new Date(), 'HH:mm'),
      dischargeNotes: '',
      billAmount: estimatedBill,
      billPaid: false,
      paymentMethod: '',
      paymentReference: '',
    }
  });

  const billPaid = form.watch('billPaid');

  // Update payment fields visibility
  React.useEffect(() => {
    setShowPaymentFields(billPaid);
  }, [billPaid]);

  // Handle form submission
  const onSubmit = (data: DischargeFormData) => {
    try {
      // In a real app, this would be an API call
      onSave(data);
      
      // Show success notification
      showNotification('success', 'Patient Discharged', `${patient.patientName} has been discharged successfully`);
      
      // Close the form
      onClose();
    } catch (error) {
      console.error('Error saving discharge:', error);
      showToast('error', 'Failed to save discharge');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#2B4F60]">
            Discharge Patient: {patient.patientName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="text-sm font-medium mb-3 text-blue-800">Patient Information</h3>
            <div className="space-y-2">
              <div className="flex items-start">
                <User className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium">{patient.patientName}</div>
                  <div className="text-sm text-gray-600">{patient.patientId}</div>
                </div>
              </div>
              <div className="flex items-start">
                <Bed className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium">{patient.roomName}</div>
                  <div className="text-sm text-gray-600">{patient.roomType}</div>
                </div>
              </div>
              <div className="flex items-start">
                <Stethoscope className="h-5 w-5 mr-2 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium">{patient.doctorName}</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h3 className="text-sm font-medium mb-3 text-green-800">Admission Details</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                <div>
                  <div className="font-medium">Admission Date</div>
                  <div className="text-sm text-gray-600">{format(new Date(patient.admissionDate), 'dd MMM yyyy')}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-green-600" />
                <div>
                  <div className="font-medium">Duration of Stay</div>
                  <div className="text-sm text-gray-600">{stayDuration} {stayDuration === 1 ? 'day' : 'days'}</div>
                </div>
              </div>
              <div className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-green-600" />
                <div>
                  <div className="font-medium">Daily Rate</div>
                  <div className="text-sm text-gray-600">KSh {dailyRate.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Discharge Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium border-b pb-2">Discharge Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dischargeDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discharge Date</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              {...field} 
                              type="date" 
                              className="pl-10"
                            />
                            <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dischargeTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discharge Time</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              {...field} 
                              type="time" 
                              className="pl-10"
                            />
                            <Clock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="dischargeNotes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discharge Notes</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea 
                            {...field} 
                            placeholder="Enter discharge notes, instructions, and follow-up details" 
                            className="min-h-[120px] pl-10"
                          />
                          <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Billing Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium border-b pb-2">Billing Information</h3>
                
                <FormField
                  control={form.control}
                  name="billAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bill Amount (KSh)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            {...field} 
                            type="number" 
                            className="pl-10"
                          />
                          <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Estimated bill: KSh {estimatedBill.toLocaleString()} ({stayDuration} {stayDuration === 1 ? 'day' : 'days'} × KSh {dailyRate.toLocaleString()})
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="billPaid"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-3">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                      </FormControl>
                      <div className="flex items-center space-x-1">
                        {field.value ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-orange-500" />
                        )}
                        <FormLabel className="font-normal">
                          {field.value ? 'Bill Paid' : 'Mark as Paid'}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                {showPaymentFields && (
                  <div className="space-y-4 border rounded-md p-3 bg-green-50">
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Select payment method</option>
                              <option value="Cash">Cash</option>
                              <option value="M-Pesa">M-Pesa</option>
                              <option value="Credit Card">Credit Card</option>
                              <option value="Insurance">Insurance</option>
                              <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="paymentReference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Reference</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input 
                                {...field} 
                                placeholder="e.g., Receipt number, M-Pesa code" 
                                className="pl-10"
                              />
                              <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                {patient.insuranceCovered && (
                  <div className="rounded-md border border-blue-200 bg-blue-50 p-3">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">Insurance Information</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Provider:</span>
                        <span className="font-medium">{patient.insuranceProvider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Policy Number:</span>
                        <span className="font-medium">{patient.insurancePolicyNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approval Code:</span>
                        <span className="font-medium">{patient.insuranceApprovalCode}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Discharge Patient</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DischargeForm;
