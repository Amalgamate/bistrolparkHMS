import React, { useState, useEffect } from 'react';
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
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '../ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import {
  Stethoscope,
  Activity,
  Thermometer,
  Heart,
  Droplet,
  User,
  Clock,
  Search,
  PlusCircle,
  Pill,
  FlaskConical,
  FileText,
  ClipboardList,
  MoreHorizontal,
  CheckCircle2,
  Ticket,
  Calendar,
  Trash2
} from 'lucide-react';
import { useClinical, QueueEntry, PatientStatus, Medication } from '../../context/ClinicalContext';
import { useToast } from '../../context/ToastContext';
import { useRealTimeNotification } from '../../context/RealTimeNotificationContext';
import { format, formatDistanceToNow } from 'date-fns';
import MedicationForm from './MedicationForm';

interface DoctorConsultationProps {
  patientId: string | null;
  view: string;
  onChangeView: (view: string) => void;
  onSelectPatient: (patientId: string) => void;
}

const DoctorConsultation: React.FC<DoctorConsultationProps> = ({
  patientId,
  view,
  onChangeView,
  onSelectPatient
}) => {
  const { queue, getQueueEntry, assignDoctor, updatePatientStatus, prescribeMedications } = useClinical();
  const { showToast } = useToast();
  const { notifyPrescriptionReady } = useRealTimeNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<QueueEntry | null>(null);
  const [chiefComplaints, setChiefComplaints] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [treatmentNotes, setTreatmentNotes] = useState('');
  const [activeTab, setActiveTab] = useState('symptoms');
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isMedicationFormOpen, setIsMedicationFormOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | undefined>(undefined);

  // Get patients ready for consultation
  const patientsReadyForConsultation = queue.filter(entry =>
    entry.status === 'vitals_taken' || entry.status === 'lab_completed'
  );

  // Get patients currently with doctor
  const patientsWithDoctor = queue.filter(entry =>
    entry.status === 'with_doctor'
  );

  // Filter patients based on search query and view
  const filteredPatients = (view === 'waiting' ? patientsReadyForConsultation : patientsWithDoctor)
    .filter(entry =>
      searchQuery
        ? entry.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.tokenNumber.toString().includes(searchQuery)
        : true
    );

  // Sort patients by priority and then by token number
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    // First sort by priority
    const priorityOrder = { emergency: 0, urgent: 1, normal: 2 };
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;

    // Then sort by token number
    return a.tokenNumber - b.tokenNumber;
  });

  // Load patient data when patientId changes
  useEffect(() => {
    if (patientId) {
      const entry = getQueueEntry(patientId);
      if (entry) {
        setSelectedPatient(entry);

        // Load existing data if available
        setChiefComplaints(entry.chiefComplaints || '');
        setNotes(entry.notes || '');

        // If patient is not yet with doctor, assign them
        if (entry.status === 'vitals_taken' || entry.status === 'lab_completed') {
          assignDoctor(entry.id, 'D001', 'Dr. Current User'); // In a real app, this would be the current user
        }
      }
    } else {
      setSelectedPatient(null);
      resetForm();
    }
  }, [patientId, getQueueEntry, assignDoctor]);

  // Reset form
  const resetForm = () => {
    setChiefComplaints('');
    setDiagnosis('');
    setNotes('');
    setTreatmentNotes('');
    setMedications([]);
    setActiveTab('symptoms');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient) {
      showToast('error', 'No patient selected');
      return;
    }

    // In a real app, this would save the consultation data
    showToast('success', `Consultation data saved for ${selectedPatient.patientName}`);
  };

  // Handle sending patient to lab
  const handleSendToLab = () => {
    if (!selectedPatient) return;

    updatePatientStatus(selectedPatient.id, 'lab_ordered');
    showToast('success', `${selectedPatient.patientName} sent to laboratory`);

    // Reset form and selection
    resetForm();
    setSelectedPatient(null);
    onSelectPatient('');
  };

  // Handle sending patient to pharmacy
  const handleSendToPharmacy = () => {
    if (!selectedPatient) return;

    if (medications.length === 0) {
      showToast('error', 'Please add at least one medication before sending to pharmacy');
      return;
    }

    // Prescribe medications
    prescribeMedications(selectedPatient.id, medications);

    // Update patient status
    updatePatientStatus(selectedPatient.id, 'pharmacy');

    // Notify pharmacy
    notifyPrescriptionReady(
      selectedPatient.patientId,
      selectedPatient.patientName,
      selectedPatient.tokenNumber
    );

    showToast('success', `${selectedPatient.patientName} sent to pharmacy`);

    // Reset form and selection
    resetForm();
    setSelectedPatient(null);
    onSelectPatient('');
  };

  // Handle completing consultation
  const handleCompleteConsultation = () => {
    if (!selectedPatient) return;

    updatePatientStatus(selectedPatient.id, 'completed');
    showToast('success', `Consultation completed for ${selectedPatient.patientName}`);

    // Reset form and selection
    resetForm();
    setSelectedPatient(null);
    onSelectPatient('');
  };

  // Get priority badge variant
  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'emergency':
        return 'destructive';
      case 'urgent':
        return 'warning';
      case 'normal':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl">Doctor Consultation</CardTitle>
              <CardDescription>Conduct patient consultations and record findings</CardDescription>
            </div>
            <div className="flex gap-2">
              <Tabs value={view} onValueChange={onChangeView} className="w-[400px]">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="waiting">Waiting for Doctor</TabsTrigger>
                  <TabsTrigger value="active">Active Consultations</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={view} className="w-full">
            <TabsContent value="waiting" className="mt-0">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search patients..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Token</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Vitals</TableHead>
                    <TableHead>Wait Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No patients waiting for consultation
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedPatients.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-800">
                            {entry.tokenNumber}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                              <User className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium">{entry.patientName}</div>
                              <div className="text-xs text-gray-500">{entry.patientId}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getPriorityBadgeVariant(entry.priority)}>
                            {entry.priority.charAt(0).toUpperCase() + entry.priority.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {entry.vitals && (
                            <div className="text-xs space-y-1">
                              <div className="flex items-center">
                                <Thermometer className="h-3 w-3 mr-1 text-gray-500" />
                                <span>{entry.vitals.temperature}°C</span>
                              </div>
                              <div className="flex items-center">
                                <Droplet className="h-3 w-3 mr-1 text-gray-500" />
                                <span>{entry.vitals.bloodPressureSystolic}/{entry.vitals.bloodPressureDiastolic} mmHg</span>
                              </div>
                              <div className="flex items-center">
                                <Heart className="h-3 w-3 mr-1 text-gray-500" />
                                <span>{entry.vitals.pulseRate} bpm</span>
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-gray-500" />
                            <span className="text-sm">
                              {formatDistanceToNow(new Date(entry.registeredAt), { addSuffix: true })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              onSelectPatient(entry.id);
                              onChangeView('active');
                            }}
                          >
                            <Stethoscope className="h-4 w-4 mr-1" />
                            Start Consultation
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-0">
            {!selectedPatient ? (
              <div className="text-center py-12">
                <Stethoscope className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Patient Selected</h3>
                <p className="text-gray-500 mb-4">Please select a patient from the waiting list to start consultation.</p>
                <Button
                  variant="outline"
                  onClick={() => onChangeView('waiting')}
                >
                  View Waiting Patients
                </Button>
              </div>
            ) : (
              <div>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-800 mr-3">
                        <Ticket className="h-6 w-6" />
                        <span className="absolute text-xs font-bold">{selectedPatient.tokenNumber}</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{selectedPatient.patientName}</h3>
                        <p className="text-sm text-gray-600">{selectedPatient.patientId}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge variant={getPriorityBadgeVariant(selectedPatient.priority)} className="mb-1">
                        {selectedPatient.priority.charAt(0).toUpperCase() + selectedPatient.priority.slice(1)}
                      </Badge>
                      <div className="text-xs text-gray-500 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {format(new Date(selectedPatient.registeredAt), 'PPP')}
                      </div>
                    </div>
                  </div>

                  {selectedPatient.vitals && (
                    <div className="mt-4 grid grid-cols-5 gap-2 text-sm">
                      <div className="bg-white p-2 rounded border">
                        <div className="flex items-center text-gray-500 mb-1">
                          <Thermometer className="h-3 w-3 mr-1" />
                          <span>Temp</span>
                        </div>
                        <div className="font-medium">
                          {selectedPatient.vitals.temperature}°C
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <div className="flex items-center text-gray-500 mb-1">
                          <Droplet className="h-3 w-3 mr-1" />
                          <span>BP</span>
                        </div>
                        <div className="font-medium">
                          {selectedPatient.vitals.bloodPressureSystolic}/{selectedPatient.vitals.bloodPressureDiastolic}
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <div className="flex items-center text-gray-500 mb-1">
                          <Heart className="h-3 w-3 mr-1" />
                          <span>Pulse</span>
                        </div>
                        <div className="font-medium">
                          {selectedPatient.vitals.pulseRate} bpm
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <div className="flex items-center text-gray-500 mb-1">
                          <Stethoscope className="h-3 w-3 mr-1" />
                          <span>Resp</span>
                        </div>
                        <div className="font-medium">
                          {selectedPatient.vitals.respiratoryRate} br/min
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded border">
                        <div className="flex items-center text-gray-500 mb-1">
                          <Activity className="h-3 w-3 mr-1" />
                          <span>SpO2</span>
                        </div>
                        <div className="font-medium">
                          {selectedPatient.vitals.oxygenSaturation}%
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmit}>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="mb-4">
                      <TabsTrigger value="symptoms">
                        <ClipboardList className="h-4 w-4 mr-2" />
                        Symptoms & Findings
                      </TabsTrigger>
                      <TabsTrigger value="diagnosis">
                        <FileText className="h-4 w-4 mr-2" />
                        Diagnosis
                      </TabsTrigger>
                      <TabsTrigger value="treatment">
                        <Pill className="h-4 w-4 mr-2" />
                        Treatment
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="symptoms" className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Chief Complaints</label>
                        <Textarea
                          value={chiefComplaints}
                          onChange={(e) => setChiefComplaints(e.target.value)}
                          placeholder="Enter patient's chief complaints"
                          className="min-h-[100px]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Clinical Notes</label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Enter clinical notes, observations, and findings"
                          className="min-h-[150px]"
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="diagnosis" className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Diagnosis</label>
                        <Textarea
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                          placeholder="Enter diagnosis"
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="flex justify-between">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleSendToLab}
                        >
                          <FlaskConical className="h-4 w-4 mr-2" />
                          Order Lab Tests
                        </Button>

                        <Button
                          type="button"
                          onClick={() => setActiveTab('treatment')}
                        >
                          Continue to Treatment
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="treatment" className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="block text-sm font-medium">Medications</label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingMedication(undefined);
                              setIsMedicationFormOpen(true);
                            }}
                          >
                            <PlusCircle className="h-4 w-4 mr-1" />
                            Add Medication
                          </Button>
                        </div>

                        <div className="rounded-md border overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Medication</TableHead>
                                <TableHead>Dosage</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {medications.length === 0 ? (
                                <TableRow>
                                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                                    No medications added yet
                                  </TableCell>
                                </TableRow>
                              ) : (
                                medications.map((medication, index) => (
                                  <TableRow key={medication.id || index}>
                                    <TableCell className="font-medium">{medication.name}</TableCell>
                                    <TableCell>{medication.dosage}</TableCell>
                                    <TableCell>{medication.frequency}</TableCell>
                                    <TableCell>{medication.duration}</TableCell>
                                    <TableCell>{medication.quantity}</TableCell>
                                    <TableCell>
                                      <div className="flex gap-2">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => {
                                            setEditingMedication(medication);
                                            setIsMedicationFormOpen(true);
                                          }}
                                        >
                                          <PlusCircle className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => {
                                            setMedications(medications.filter((_, i) =>
                                              medication.id
                                                ? medication.id !== medications[i].id
                                                : i !== index
                                            ));
                                          }}
                                        >
                                          <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Treatment Notes</label>
                        <Textarea
                          value={treatmentNotes}
                          onChange={(e) => setTreatmentNotes(e.target.value)}
                          placeholder="Enter treatment notes and instructions"
                          className="min-h-[100px]"
                        />
                      </div>

                      {/* Medication Form Dialog */}
                      <MedicationForm
                        isOpen={isMedicationFormOpen}
                        onClose={() => setIsMedicationFormOpen(false)}
                        onSave={(medication) => {
                          if (editingMedication) {
                            // Update existing medication
                            setMedications(medications.map(med =>
                              med.id === editingMedication.id ? { ...medication, id: med.id } : med
                            ));
                          } else {
                            // Add new medication
                            setMedications([...medications, { ...medication, id: `med-${Date.now()}` }]);
                          }
                          setIsMedicationFormOpen(false);
                          setEditingMedication(undefined);
                        }}
                        editingMedication={editingMedication}
                      />
                    </TabsContent>
                  </Tabs>

                  <div className="flex justify-between mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSelectedPatient(null);
                        onSelectPatient('');
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>

                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            Actions
                            <MoreHorizontal className="h-4 w-4 ml-2" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={handleSendToLab}>
                            <FlaskConical className="h-4 w-4 mr-2" />
                            Send to Laboratory
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleSendToPharmacy}>
                            <Pill className="h-4 w-4 mr-2" />
                            Send to Pharmacy
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleCompleteConsultation}>
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Complete Consultation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <Button type="submit">
                        Save Consultation
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorConsultation;
