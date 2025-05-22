import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
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
  Pill, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Package,
  FileText,
  Printer,
  X,
  ArrowLeft
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '../ui/dialog';
import { usePharmacy, Prescription, Medication, MedicationStatus } from '../../context/PharmacyContext';
import { useToast } from '../../context/ToastContext';
import { format } from 'date-fns';

interface PrescriptionDetailsProps {
  prescriptionId: string;
  onBack: () => void;
}

const PrescriptionDetails: React.FC<PrescriptionDetailsProps> = ({ prescriptionId, onBack }) => {
  const { 
    getPrescription, 
    dispenseMedication, 
    dispensePrescription, 
    updatePrescriptionStatus,
    checkMedicationAvailability
  } = usePharmacy();
  const { showToast } = useToast();
  const [notes, setNotes] = useState('');
  const [dispensingMedication, setDispensingMedication] = useState<string | null>(null);
  const [dispensingQuantity, setDispensingQuantity] = useState<number>(0);
  
  const prescription = getPrescription(prescriptionId);
  
  if (!prescription) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Prescription Not Found</h3>
        <p className="text-gray-500 mb-4">
          The prescription you are looking for does not exist or has been removed.
        </p>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }
  
  // Get status badge color
  const getStatusBadge = (status: MedicationStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'dispensed':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Dispensed</Badge>;
      case 'partially_dispensed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Partially Dispensed</Badge>;
      case 'out_of_stock':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Out of Stock</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Handle dispense medication
  const handleDispenseMedication = (medicationId: string) => {
    if (!dispensingQuantity || dispensingQuantity <= 0) {
      showToast('error', 'Please enter a valid quantity');
      return;
    }
    
    const medication = prescription.medications.find(med => med.id === medicationId);
    if (!medication) return;
    
    // Check if quantity is available in inventory
    const { available, currentStock } = checkMedicationAvailability(medication.name, dispensingQuantity);
    
    if (!available) {
      showToast('error', `Insufficient stock. Only ${currentStock} available.`);
      return;
    }
    
    // Check if dispensing more than prescribed
    const remainingToDispense = medication.quantity - (medication.dispensed || 0);
    if (dispensingQuantity > remainingToDispense) {
      showToast('error', `Cannot dispense more than prescribed. Only ${remainingToDispense} remaining.`);
      return;
    }
    
    // Dispense medication
    dispenseMedication(prescription.id, medicationId, dispensingQuantity);
    showToast('success', `Dispensed ${dispensingQuantity} units of ${medication.name}`);
    
    // Reset state
    setDispensingMedication(null);
    setDispensingQuantity(0);
  };
  
  // Handle complete dispensing
  const handleCompleteDispensing = () => {
    // Check if all medications are at least partially dispensed
    const allDispensed = prescription.medications.every(med => med.dispensed && med.dispensed > 0);
    
    if (!allDispensed) {
      showToast('error', 'Please dispense all medications before completing');
      return;
    }
    
    // Complete dispensing
    dispensePrescription(prescription.id, 'Pharmacist Name'); // In a real app, this would be the current user's name
    showToast('success', 'Prescription has been fully dispensed');
  };
  
  // Handle mark as out of stock
  const handleMarkOutOfStock = (medicationId: string) => {
    const medication = prescription.medications.find(med => med.id === medicationId);
    if (!medication) return;
    
    // Update medication status
    updatePrescriptionStatus(prescription.id, 'out_of_stock', 
      `${medication.name} is out of stock. Patient has been notified.`);
    
    showToast('info', `${medication.name} marked as out of stock`);
  };
  
  // Handle print prescription
  const handlePrintPrescription = () => {
    showToast('info', 'Printing prescription...');
    // In a real app, this would open a print dialog or generate a PDF
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-xl font-semibold">Prescription Details</h2>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">Patient Information</CardTitle>
              <CardDescription>Patient and prescription details</CardDescription>
            </div>
            <div className="flex items-center">
              <Badge className="mr-2">Token #{prescription.tokenNumber}</Badge>
              {getStatusBadge(prescription.status)}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Patient</p>
                  <p className="font-medium">{prescription.patientName}</p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <User className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium">{prescription.doctorName}</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex items-center mb-4">
                <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Prescribed Date</p>
                  <p className="font-medium">{format(new Date(prescription.createdAt), 'PPP')}</p>
                </div>
              </div>
              <div className="flex items-center mb-4">
                <Clock className="h-5 w-5 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Prescribed Time</p>
                  <p className="font-medium">{format(new Date(prescription.createdAt), 'p')}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Medications</CardTitle>
          <CardDescription>List of prescribed medications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Dispensed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescription.medications.map((medication) => (
                  <TableRow key={medication.id}>
                    <TableCell className="font-medium">{medication.name}</TableCell>
                    <TableCell>{medication.dosage}</TableCell>
                    <TableCell>{medication.frequency}</TableCell>
                    <TableCell>{medication.duration}</TableCell>
                    <TableCell>{medication.quantity}</TableCell>
                    <TableCell>{medication.dispensed || 0}</TableCell>
                    <TableCell>{getStatusBadge(medication.status || 'pending')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={medication.status === 'dispensed' || medication.status === 'out_of_stock'}
                            >
                              Dispense
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Dispense Medication</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="mb-4">
                                <p className="font-medium">{medication.name}</p>
                                <p className="text-sm text-gray-500">
                                  {medication.dosage} - {medication.frequency} - {medication.duration}
                                </p>
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Quantity to Dispense</label>
                                <Input 
                                  type="number" 
                                  value={dispensingQuantity || ''}
                                  onChange={(e) => setDispensingQuantity(parseInt(e.target.value) || 0)}
                                  max={medication.quantity - (medication.dispensed || 0)}
                                  min={1}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                  Prescribed: {medication.quantity}, 
                                  Already Dispensed: {medication.dispensed || 0}, 
                                  Remaining: {medication.quantity - (medication.dispensed || 0)}
                                </p>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button 
                                variant="outline" 
                                onClick={() => setDispensingQuantity(0)}
                              >
                                Cancel
                              </Button>
                              <Button 
                                onClick={() => handleDispenseMedication(medication.id)}
                              >
                                Dispense
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMarkOutOfStock(medication.id)}
                          disabled={medication.status === 'dispensed' || medication.status === 'out_of_stock'}
                        >
                          Out of Stock
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <Button 
              variant="outline" 
              onClick={handlePrintPrescription}
              className="mr-2"
            >
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
          </div>
          <div>
            <Button 
              variant="default" 
              onClick={handleCompleteDispensing}
              disabled={prescription.status === 'dispensed' || prescription.status === 'cancelled'}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Complete Dispensing
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {prescription.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{prescription.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PrescriptionDetails;
