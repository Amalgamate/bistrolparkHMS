import React, { useState, useEffect } from 'react';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '../ui/form';
import {
  User,
  Calendar,
  Clock,
  Bed,
  Stethoscope,
  FileText,
  Search,
  CreditCard,
  Shield
} from 'lucide-react';
import { useAdmission } from '../../context/AdmissionContext';
import { useToast } from '../../context/ToastContext';
import { useNotification } from '../../context/NotificationContext';
import { format } from 'date-fns';
import apiClient from '../../services/apiClient';

// Define the form schema
const admissionSchema = z.object({
  patientId: z.string().min(1, 'Patient ID is required'),
  patientName: z.string().min(1, 'Patient name is required'),
  admissionDate: z.string().min(1, 'Admission date is required'),
  admissionTime: z.string().min(1, 'Admission time is required'),
  roomType: z.string().min(1, 'Room type is required'),
  roomId: z.string().min(1, 'Room is required'),
  diagnosis: z.string().min(5, 'Diagnosis is required'),
  doctorId: z.string().min(1, 'Doctor is required'),
  doctorName: z.string().min(1, 'Doctor name is required'),
  notes: z.string().optional(),
  insuranceCovered: z.boolean().optional(),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  insuranceApprovalCode: z.string().optional(),
});

type AdmissionFormData = z.infer<typeof admissionSchema>;

interface AdmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AdmissionFormData) => void;
  patient?: any;
}

// Insurance providers
const insuranceProviders = [
  { id: 'INS001', name: 'SHA' },
  { id: 'INS002', name: 'Jubilee' },
  { id: 'INS003', name: 'AAR' },
  { id: 'INS004', name: 'Britam' },
  { id: 'INS005', name: 'Madison' },
];

const AdmissionForm: React.FC<AdmissionFormProps> = ({
  isOpen,
  onClose,
  onSave,
  patient
}) => {
  const { getAvailableRooms } = useAdmission();
  const { showToast } = useToast();
  const { showNotification } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(patient || null);
  const [availableRooms, setAvailableRooms] = useState<any[]>([]);
  const [showInsuranceFields, setShowInsuranceFields] = useState(false);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Initialize form
  const form = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      patientId: patient?.id || '',
      patientName: patient?.name || '',
      admissionDate: format(new Date(), 'yyyy-MM-dd'),
      admissionTime: format(new Date(), 'HH:mm'),
      roomType: '',
      roomId: '',
      diagnosis: '',
      doctorId: '',
      doctorName: '',
      notes: '',
      insuranceCovered: false,
      insuranceProvider: '',
      insurancePolicyNumber: '',
      insuranceApprovalCode: '',
    }
  });

  const roomType = form.watch('roomType');
  const insuranceCovered = form.watch('insuranceCovered');

  // Update available rooms when room type changes
  useEffect(() => {
    if (roomType) {
      const rooms = getAvailableRooms(roomType);
      setAvailableRooms(rooms);
    } else {
      setAvailableRooms([]);
    }
  }, [roomType, getAvailableRooms]);

  // Update insurance fields visibility
  useEffect(() => {
    setShowInsuranceFields(insuranceCovered || false);
  }, [insuranceCovered]);

  // Set form values when patient is selected
  useEffect(() => {
    if (selectedPatient) {
      form.setValue('patientId', selectedPatient.id);
      form.setValue('patientName', selectedPatient.name);
    }
  }, [selectedPatient, form]);

  // Fetch doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/users?role=doctor');
        if (response.data && Array.isArray(response.data)) {
          const formattedDoctors = response.data.map(doctor => ({
            id: doctor.id,
            name: `Dr. ${doctor.first_name} ${doctor.last_name}`,
            specialty: doctor.specialty || 'General'
          }));
          setDoctors(formattedDoctors);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        showToast('error', 'Failed to load doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [showToast]);

  // Handle patient search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      showToast('warning', 'Please enter a search term');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.get(`/patients?search=${encodeURIComponent(searchQuery)}`);

      if (response.data && Array.isArray(response.data)) {
        const results = response.data.map(p => ({
          id: p.id || p.mrn,
          name: `${p.first_name} ${p.last_name}`
        }));

        setSearchResults(results);

        if (results.length === 0) {
          showToast('warning', 'No patients found matching your search');
        }
      } else {
        setSearchResults([]);
        showToast('warning', 'No patients found');
      }
    } catch (error) {
      console.error('Error searching for patients:', error);
      showToast('error', 'Failed to search for patients');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const onSubmit = (data: AdmissionFormData) => {
    try {
      // In a real app, this would be an API call
      onSave(data);

      // Show success notification
      showNotification('success', 'Patient Admitted', `${data.patientName} has been admitted to ${data.roomType} room`);

      // Close the form
      onClose();
    } catch (error) {
      console.error('Error saving admission:', error);
      showToast('error', 'Failed to save admission');
    }
  };

  // Handle doctor selection
  const handleDoctorChange = (doctorId: string) => {
    const doctor = doctors.find(d => d.id === doctorId);
    if (doctor) {
      form.setValue('doctorName', doctor.name);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#2B4F60]">
            {selectedPatient ? `Admit Patient: ${selectedPatient.name}` : 'New Patient Admission'}
          </DialogTitle>
        </DialogHeader>

        {!selectedPatient && (
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Search for Patient</h3>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <Input
                  placeholder="Search by patient ID or name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <Button onClick={handleSearch}>Search</Button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-2 border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Patient ID</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((patient) => (
                      <tr key={patient.id} className="border-t">
                        <td className="px-4 py-2">{patient.id}</td>
                        <td className="px-4 py-2">{patient.name}</td>
                        <td className="px-4 py-2 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPatient(patient)}
                          >
                            Select
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium border-b pb-2">Patient Information</h3>

                <FormField
                  control={form.control}
                  name="patientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient ID</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="e.g., BP10023456"
                            className="pl-10"
                            disabled={!!selectedPatient}
                          />
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="patientName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Patient Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Full name"
                          disabled={!!selectedPatient}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnosis</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            {...field}
                            placeholder="Enter initial diagnosis"
                            className="min-h-[80px] pl-10"
                          />
                          <FileText className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
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
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Any additional notes or instructions"
                          className="min-h-[80px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Admission Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium border-b pb-2">Admission Details</h3>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="admissionDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admission Date</FormLabel>
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
                    name="admissionTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Admission Time</FormLabel>
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
                  name="roomType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="pl-10 relative">
                            <Bed className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Executive">Executive Suite</SelectItem>
                          <SelectItem value="Premium">Premium Room</SelectItem>
                          <SelectItem value="Basic">Basic Room</SelectItem>
                          <SelectItem value="Ward">Ward</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roomId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Room</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={!roomType || availableRooms.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={
                              !roomType
                                ? "Select room type first"
                                : availableRooms.length === 0
                                  ? "No available rooms"
                                  : "Select room"
                            } />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableRooms.map(room => (
                            <SelectItem key={room.id} value={room.id}>
                              {room.name} ({room.type})
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
                  name="doctorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attending Doctor</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          handleDoctorChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="pl-10 relative">
                            <Stethoscope className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            <SelectValue placeholder="Select doctor" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loading ? (
                            <div className="flex items-center justify-center p-4">
                              <span className="text-sm text-gray-500">Loading doctors...</span>
                            </div>
                          ) : doctors.length > 0 ? (
                            doctors.map(doctor => (
                              <SelectItem key={doctor.id} value={doctor.id}>
                                {doctor.name} ({doctor.specialty})
                              </SelectItem>
                            ))
                          ) : (
                            <div className="flex items-center justify-center p-4">
                              <span className="text-sm text-gray-500">No doctors found</span>
                            </div>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="insuranceCovered"
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
                        <Shield className="h-5 w-5 text-blue-600" />
                        <FormLabel className="font-normal">Covered by Insurance</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {showInsuranceFields && (
                  <div className="space-y-4 border rounded-md p-3 bg-blue-50">
                    <FormField
                      control={form.control}
                      name="insuranceProvider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance Provider</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select provider" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {insuranceProviders.map(provider => (
                                <SelectItem key={provider.id} value={provider.name}>
                                  {provider.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="insurancePolicyNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Policy Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  {...field}
                                  placeholder="e.g., SHA12345678"
                                  className="pl-10"
                                />
                                <CreditCard className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="insuranceApprovalCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Approval Code</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="e.g., AP12345"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Admit Patient</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AdmissionForm;
