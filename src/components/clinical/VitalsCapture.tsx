import React, { useState, useEffect } from 'react';
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
  Activity,
  Thermometer,
  Heart,
  Stethoscope,
  Droplet,
  Ruler,
  Weight,
  AlertTriangle,
  CheckCircle2,
  User,
  Clock,
  Ticket,
  ArrowRight,
  Search
} from 'lucide-react';
import { useClinical, QueueEntry, Vitals } from '../../context/ClinicalContext';
import { useToast } from '../../context/ToastContext';
import { format, formatDistanceToNow } from 'date-fns';

interface VitalsCaptureProps {
  patientId: string | null;
  view: string;
  onChangeView: (view: string) => void;
  onSelectPatient: (patientId: string) => void;
}

const VitalsCapture: React.FC<VitalsCaptureProps> = ({
  patientId,
  view,
  onChangeView,
  onSelectPatient
}) => {
  const { queue, getQueueEntry, recordVitals, updatePatientStatus } = useClinical();
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<QueueEntry | null>(null);

  // Form state for vitals
  const [temperature, setTemperature] = useState<number | ''>('');
  const [systolic, setSystolic] = useState<number | ''>('');
  const [diastolic, setDiastolic] = useState<number | ''>('');
  const [pulse, setPulse] = useState<number | ''>('');
  const [respiratory, setRespiratory] = useState<number | ''>('');
  const [oxygen, setOxygen] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [weight, setWeight] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  // Calculate BMI
  const bmi = height && weight ? Math.round((weight / ((height / 100) ** 2)) * 10) / 10 : null;

  // Get patients waiting for vitals
  const patientsWaitingForVitals = queue.filter(entry =>
    entry.status === 'waiting_vitals' || entry.status === 'registered'
  );

  // Filter patients based on search query
  const filteredPatients = patientsWaitingForVitals.filter(entry =>
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

        // If patient already has vitals, load them
        if (entry.vitals) {
          setTemperature(entry.vitals.temperature);
          setSystolic(entry.vitals.bloodPressureSystolic);
          setDiastolic(entry.vitals.bloodPressureDiastolic);
          setPulse(entry.vitals.pulseRate);
          setRespiratory(entry.vitals.respiratoryRate);
          setOxygen(entry.vitals.oxygenSaturation);
          setHeight(entry.vitals.height || '');
          setWeight(entry.vitals.weight || '');
          setNotes(entry.vitals.notes || '');
        } else {
          // Reset form
          resetForm();
        }
      }
    } else {
      setSelectedPatient(null);
      resetForm();
    }
  }, [patientId, getQueueEntry]);

  // Reset form
  const resetForm = () => {
    setTemperature('');
    setSystolic('');
    setDiastolic('');
    setPulse('');
    setRespiratory('');
    setOxygen('');
    setHeight('');
    setWeight('');
    setNotes('');
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPatient) {
      showToast('error', 'No patient selected');
      return;
    }

    // Validate required fields
    if (temperature === '' || systolic === '' || diastolic === '' || pulse === '' || respiratory === '' || oxygen === '') {
      showToast('error', 'Please fill in all required vitals');
      return;
    }

    // Create vitals object
    const vitalsData: Vitals = {
      temperature: Number(temperature),
      bloodPressureSystolic: Number(systolic),
      bloodPressureDiastolic: Number(diastolic),
      pulseRate: Number(pulse),
      respiratoryRate: Number(respiratory),
      oxygenSaturation: Number(oxygen),
      ...(height !== '' && { height: Number(height) }),
      ...(weight !== '' && { weight: Number(weight) }),
      ...(bmi && { bmi }),
      ...(notes && { notes }),
      recordedBy: 'Current User', // In a real app, this would be the current user
      recordedAt: new Date().toISOString()
    };

    // Record vitals
    recordVitals(selectedPatient.id, vitalsData);

    // Show success message
    showToast('success', `Vitals recorded for ${selectedPatient.patientName}`);

    // Reset form and selection
    resetForm();
    setSelectedPatient(null);
    onSelectPatient('');
  };

  // Check if a vital sign is abnormal
  const isAbnormal = (type: string, value: number | ''): boolean => {
    if (value === '') return false;

    switch (type) {
      case 'temperature':
        return value < 36 || value > 38;
      case 'systolic':
        return value < 90 || value > 140;
      case 'diastolic':
        return value < 60 || value > 90;
      case 'pulse':
        return value < 60 || value > 100;
      case 'respiratory':
        return value < 12 || value > 20;
      case 'oxygen':
        return value < 95;
      case 'bmi':
        return value < 18.5 || value > 25;
      default:
        return false;
    }
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
              <CardTitle className="text-xl">Vitals Capture</CardTitle>
              <CardDescription>Record patient vital signs</CardDescription>
            </div>
            <div className="flex gap-2">
              <Tabs value={view} onValueChange={onChangeView} className="w-[400px]">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="waiting">Waiting for Vitals</TabsTrigger>
                  <TabsTrigger value="capture">Capture Vitals</TabsTrigger>
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
                    <TableHead>Wait Time</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPatients.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        No patients waiting for vitals
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
                              onChangeView('capture');
                            }}
                          >
                            <Activity className="h-4 w-4 mr-1" />
                            Capture Vitals
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="capture" className="mt-0">
            {!selectedPatient ? (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No Patient Selected</h3>
                <p className="text-gray-500 mb-4">Please select a patient from the waiting list to capture vitals.</p>
                <Button
                  variant="outline"
                  onClick={() => onChangeView('waiting')}
                >
                  View Waiting Patients
                </Button>
              </div>
            ) : (
              <div>
                <div className="bg-blue-50 p-4 rounded-lg mb-6 flex justify-between items-center">
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
                  <Badge variant={getPriorityBadgeVariant(selectedPatient.priority)}>
                    {selectedPatient.priority.charAt(0).toUpperCase() + selectedPatient.priority.slice(1)}
                  </Badge>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-sm font-medium mb-4 flex items-center text-blue-700">
                        <Activity className="h-4 w-4 mr-2" />
                        Required Vitals
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 flex items-center">
                            <Thermometer className="h-4 w-4 mr-1 text-gray-500" />
                            Temperature (°C) <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Input
                            type="number"
                            step="0.1"
                            value={temperature}
                            onChange={(e) => setTemperature(e.target.value ? Number(e.target.value) : '')}
                            className={isAbnormal('temperature', temperature) ? 'border-red-300 bg-red-50' : ''}
                            required
                          />
                          {isAbnormal('temperature', temperature) && (
                            <p className="text-xs text-red-500 mt-1 flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Abnormal value (normal range: 36-38°C)
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 flex items-center">
                            <Droplet className="h-4 w-4 mr-1 text-gray-500" />
                            Blood Pressure (mmHg) <span className="text-red-500 ml-1">*</span>
                          </label>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <Input
                                type="number"
                                placeholder="Systolic"
                                value={systolic}
                                onChange={(e) => setSystolic(e.target.value ? Number(e.target.value) : '')}
                                className={isAbnormal('systolic', systolic) ? 'border-red-300 bg-red-50' : ''}
                                required
                              />
                              {isAbnormal('systolic', systolic) && (
                                <p className="text-xs text-red-500 mt-1">Abnormal (90-140)</p>
                              )}
                            </div>
                            <span className="text-gray-500 self-center">/</span>
                            <div className="flex-1">
                              <Input
                                type="number"
                                placeholder="Diastolic"
                                value={diastolic}
                                onChange={(e) => setDiastolic(e.target.value ? Number(e.target.value) : '')}
                                className={isAbnormal('diastolic', diastolic) ? 'border-red-300 bg-red-50' : ''}
                                required
                              />
                              {isAbnormal('diastolic', diastolic) && (
                                <p className="text-xs text-red-500 mt-1">Abnormal (60-90)</p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 flex items-center">
                            <Heart className="h-4 w-4 mr-1 text-gray-500" />
                            Pulse Rate (bpm) <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Input
                            type="number"
                            value={pulse}
                            onChange={(e) => setPulse(e.target.value ? Number(e.target.value) : '')}
                            className={isAbnormal('pulse', pulse) ? 'border-red-300 bg-red-50' : ''}
                            required
                          />
                          {isAbnormal('pulse', pulse) && (
                            <p className="text-xs text-red-500 mt-1 flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Abnormal value (normal range: 60-100 bpm)
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 flex items-center">
                            <Stethoscope className="h-4 w-4 mr-1 text-gray-500" />
                            Respiratory Rate (breaths/min) <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Input
                            type="number"
                            value={respiratory}
                            onChange={(e) => setRespiratory(e.target.value ? Number(e.target.value) : '')}
                            className={isAbnormal('respiratory', respiratory) ? 'border-red-300 bg-red-50' : ''}
                            required
                          />
                          {isAbnormal('respiratory', respiratory) && (
                            <p className="text-xs text-red-500 mt-1 flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Abnormal value (normal range: 12-20 breaths/min)
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 flex items-center">
                            <Activity className="h-4 w-4 mr-1 text-gray-500" />
                            Oxygen Saturation (SpO2 %) <span className="text-red-500 ml-1">*</span>
                          </label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={oxygen}
                            onChange={(e) => setOxygen(e.target.value ? Number(e.target.value) : '')}
                            className={isAbnormal('oxygen', oxygen) ? 'border-red-300 bg-red-50' : ''}
                            required
                          />
                          {isAbnormal('oxygen', oxygen) && (
                            <p className="text-xs text-red-500 mt-1 flex items-center">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Abnormal value (normal range: ≥95%)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-4 flex items-center text-blue-700">
                        <Activity className="h-4 w-4 mr-2" />
                        Additional Measurements
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1 flex items-center">
                            <Ruler className="h-4 w-4 mr-1 text-gray-500" />
                            Height (cm)
                          </label>
                          <Input
                            type="number"
                            value={height}
                            onChange={(e) => setHeight(e.target.value ? Number(e.target.value) : '')}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1 flex items-center">
                            <Weight className="h-4 w-4 mr-1 text-gray-500" />
                            Weight (kg)
                          </label>
                          <Input
                            type="number"
                            step="0.1"
                            value={weight}
                            onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : '')}
                          />
                        </div>

                        {height && weight && (
                          <div className="p-3 rounded-md bg-gray-50 border">
                            <label className="block text-sm font-medium mb-1">BMI</label>
                            <div className="text-lg font-medium flex items-center">
                              {bmi}
                              {isAbnormal('bmi', bmi || 0) ? (
                                <Badge variant="warning" className="ml-2">
                                  {bmi && bmi < 18.5 ? 'Underweight' : bmi > 25 ? 'Overweight' : 'Normal'}
                                </Badge>
                              ) : (
                                <Badge variant="success" className="ml-2">Normal</Badge>
                              )}
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium mb-1">Notes</label>
                          <Textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Any additional observations or notes"
                            className="min-h-[120px]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between">
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
                    <Button type="submit">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Save Vitals & Send to Doctor
                    </Button>
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

export default VitalsCapture;
