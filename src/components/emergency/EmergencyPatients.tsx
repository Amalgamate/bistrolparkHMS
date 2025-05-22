import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import {
  Search,
  Filter,
  Users,
  UserCheck,
  UserX,
  Clock,
  Stethoscope,
  Clipboard,
  FileText,
  Pill,
  Bed,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import { useEmergency, EmergencyPatient, TriageLevel } from '../../context/EmergencyContext';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Separator } from '../../components/ui/separator';
import { Progress } from '../../components/ui/progress';

const EmergencyPatients: React.FC = () => {
  const { 
    patients, 
    getPatientsByStatus, 
    getPatientsByTriageLevel,
    updatePatientStatus,
    assignDoctor,
    assignBed,
    beds
  } = useEmergency();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<EmergencyPatient | null>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  
  // Filter patients based on active tab and search term
  const filteredPatients = (() => {
    let result: EmergencyPatient[] = [];
    
    switch (activeTab) {
      case 'all':
        result = patients;
        break;
      case 'in_treatment':
        result = getPatientsByStatus('in_treatment');
        break;
      case 'triaged':
        result = getPatientsByStatus('triaged');
        break;
      case 'red':
        result = getPatientsByTriageLevel('red');
        break;
      case 'orange':
        result = getPatientsByTriageLevel('orange');
        break;
      case 'yellow':
        result = getPatientsByTriageLevel('yellow');
        break;
      case 'green':
        result = getPatientsByTriageLevel('green');
        break;
      case 'blue':
        result = getPatientsByTriageLevel('blue');
        break;
      default:
        result = patients;
    }
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(patient => 
        patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.includes(searchTerm) ||
        (patient.assignedDoctor && patient.assignedDoctor.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Sort by triage level priority and then by arrival time
    result.sort((a, b) => {
      // First sort by triage level priority
      const levelPriority: Record<TriageLevel, number> = {
        red: 1,
        orange: 2,
        yellow: 3,
        green: 4,
        blue: 5
      };
      
      const levelA = a.triageAssessment?.level ? levelPriority[a.triageAssessment.level] : 999;
      const levelB = b.triageAssessment?.level ? levelPriority[b.triageAssessment.level] : 999;
      
      if (levelA !== levelB) {
        return levelA - levelB;
      }
      
      // If same level, sort by arrival time (oldest first)
      return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
    });
    
    return result;
  })();

  const handleViewPatient = (patient: EmergencyPatient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const handleStartTreatment = (patientId: string) => {
    // In a real app, this would open a form to assign a doctor
    // For now, we'll just assign a dummy doctor and update status
    assignDoctor(patientId, 'D123', 'Dr. John Smith');
    updatePatientStatus(patientId, 'in_treatment');
  };

  const handleAssignBed = (patientId: string, bedId: string) => {
    assignBed(patientId, bedId);
  };

  const getTriageLevelBadge = (level?: TriageLevel) => {
    if (!level) return null;
    
    const colors = {
      red: "bg-red-100 text-red-800",
      orange: "bg-orange-100 text-orange-800",
      yellow: "bg-yellow-100 text-yellow-800",
      green: "bg-green-100 text-green-800",
      blue: "bg-blue-100 text-blue-800"
    };
    
    const labels = {
      red: "Immediate",
      orange: "Very Urgent",
      yellow: "Urgent",
      green: "Standard",
      blue: "Non-urgent"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level]}`}>
        {labels[level]}
      </span>
    );
  };

  const getWaitTimeDisplay = (patient: EmergencyPatient) => {
    const arrivalTime = new Date(patient.arrivalTime).getTime();
    const now = new Date().getTime();
    const waitTimeMinutes = Math.floor((now - arrivalTime) / (1000 * 60));
    
    let color = "text-gray-500";
    if (waitTimeMinutes > 60) color = "text-red-500";
    else if (waitTimeMinutes > 30) color = "text-orange-500";
    else if (waitTimeMinutes > 15) color = "text-yellow-500";
    
    return <span className={color}>{waitTimeMinutes} min</span>;
  };

  const getStatusBadge = (status: EmergencyPatientStatus) => {
    const statusConfig: Record<EmergencyPatientStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      waiting_triage: { label: 'Waiting Triage', variant: 'outline' },
      triaged: { label: 'Triaged', variant: 'secondary' },
      in_treatment: { label: 'In Treatment', variant: 'default' },
      awaiting_results: { label: 'Awaiting Results', variant: 'outline' },
      awaiting_decision: { label: 'Awaiting Decision', variant: 'outline' },
      admitted: { label: 'Admitted', variant: 'default' },
      discharged: { label: 'Discharged', variant: 'default' },
      transferred: { label: 'Transferred', variant: 'default' },
      deceased: { label: 'Deceased', variant: 'destructive' },
      left: { label: 'Left', variant: 'outline' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Emergency Patients</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-red-50">
            <div className="w-2 h-2 rounded-full bg-red-600 mr-1"></div>
            <span className="text-xs">{getPatientsByTriageLevel('red').length} Red</span>
          </Badge>
          <Badge variant="outline" className="bg-orange-50">
            <div className="w-2 h-2 rounded-full bg-orange-500 mr-1"></div>
            <span className="text-xs">{getPatientsByTriageLevel('orange').length} Orange</span>
          </Badge>
          <Badge variant="outline" className="bg-yellow-50">
            <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
            <span className="text-xs">{getPatientsByTriageLevel('yellow').length} Yellow</span>
          </Badge>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="in_treatment">In Treatment</TabsTrigger>
            <TabsTrigger value="triaged">Triaged</TabsTrigger>
            <TabsTrigger value="red">Red</TabsTrigger>
            <TabsTrigger value="orange">Orange</TabsTrigger>
            <TabsTrigger value="yellow">Yellow</TabsTrigger>
          </TabsList>
          
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search patients..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <TabsContent value={activeTab} className="space-y-4">
          {filteredPatients.length === 0 ? (
            <Card className="p-6 text-center">
              <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No patients found matching your criteria.</p>
            </Card>
          ) : (
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-8 gap-4 p-3 bg-gray-50 font-medium text-sm">
                <div>Patient</div>
                <div>Arrival</div>
                <div>Wait Time</div>
                <div>Triage Level</div>
                <div>Status</div>
                <div>Doctor</div>
                <div>Bed</div>
                <div>Actions</div>
              </div>
              <div className="divide-y">
                {filteredPatients.map((patient) => (
                  <div key={patient.id} className="grid grid-cols-8 gap-4 p-3 items-center hover:bg-gray-50">
                    <div className="font-medium">{patient.patientName}</div>
                    <div className="text-sm">{new Date(patient.arrivalTime).toLocaleTimeString()}</div>
                    <div>{getWaitTimeDisplay(patient)}</div>
                    <div>
                      {patient.triageAssessment ? getTriageLevelBadge(patient.triageAssessment.level) : '-'}
                    </div>
                    <div>
                      {getStatusBadge(patient.status)}
                    </div>
                    <div>{patient.assignedDoctor || '-'}</div>
                    <div>{patient.assignedBed || '-'}</div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewPatient(patient)}
                      >
                        View
                      </Button>
                      {patient.status === 'triaged' && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleStartTreatment(patient.id)}
                        >
                          Treat
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Patient Details Dialog */}
      <Dialog open={showPatientDetails} onOpenChange={setShowPatientDetails}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Patient</h3>
                  <p className="text-lg font-semibold">{selectedPatient.patientName}</p>
                  <p className="text-sm text-gray-500">ID: {selectedPatient.patientId}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Arrival</h3>
                  <p className="text-lg font-semibold">{new Date(selectedPatient.arrivalTime).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">
                    Method: {selectedPatient.arrivalMethod === 'ambulance' ? 'Ambulance' : 
                            selectedPatient.arrivalMethod === 'walk_in' ? 'Walk-in' : 'Transfer'}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-md font-medium mb-2">Triage Assessment</h3>
                {selectedPatient.triageAssessment ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Level</h4>
                      <div className="mt-1">{getTriageLevelBadge(selectedPatient.triageAssessment.level)}</div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Assessed By</h4>
                      <p>{selectedPatient.triageAssessment.assessedBy}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(selectedPatient.triageAssessment.assessedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium text-gray-500">Chief Complaint</h4>
                      <p>{selectedPatient.triageAssessment.chiefComplaint}</p>
                    </div>
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium text-gray-500">Vital Signs</h4>
                      <div className="grid grid-cols-3 gap-2 mt-1">
                        {selectedPatient.triageAssessment.vitalSigns.temperature && (
                          <div className="p-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">Temperature</p>
                            <p className="font-medium">{selectedPatient.triageAssessment.vitalSigns.temperature} °C</p>
                          </div>
                        )}
                        {selectedPatient.triageAssessment.vitalSigns.heartRate && (
                          <div className="p-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">Heart Rate</p>
                            <p className="font-medium">{selectedPatient.triageAssessment.vitalSigns.heartRate} bpm</p>
                          </div>
                        )}
                        {selectedPatient.triageAssessment.vitalSigns.respiratoryRate && (
                          <div className="p-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">Respiratory Rate</p>
                            <p className="font-medium">{selectedPatient.triageAssessment.vitalSigns.respiratoryRate} /min</p>
                          </div>
                        )}
                        {(selectedPatient.triageAssessment.vitalSigns.bloodPressureSystolic && 
                          selectedPatient.triageAssessment.vitalSigns.bloodPressureDiastolic) && (
                          <div className="p-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">Blood Pressure</p>
                            <p className="font-medium">
                              {selectedPatient.triageAssessment.vitalSigns.bloodPressureSystolic}/
                              {selectedPatient.triageAssessment.vitalSigns.bloodPressureDiastolic} mmHg
                            </p>
                          </div>
                        )}
                        {selectedPatient.triageAssessment.vitalSigns.oxygenSaturation && (
                          <div className="p-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">O₂ Saturation</p>
                            <p className="font-medium">{selectedPatient.triageAssessment.vitalSigns.oxygenSaturation}%</p>
                          </div>
                        )}
                        {selectedPatient.triageAssessment.vitalSigns.painScore !== undefined && (
                          <div className="p-2 bg-gray-50 rounded">
                            <p className="text-xs text-gray-500">Pain Score</p>
                            <p className="font-medium">{selectedPatient.triageAssessment.vitalSigns.painScore}/10</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {selectedPatient.triageAssessment.notes && (
                      <div className="col-span-2">
                        <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                        <p className="text-sm">{selectedPatient.triageAssessment.notes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">No triage assessment performed yet.</p>
                )}
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-md font-medium mb-2">Treatment</h3>
                  {selectedPatient.status === 'triaged' ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-500">Patient is waiting to be seen by a doctor.</p>
                      <Button 
                        onClick={() => {
                          handleStartTreatment(selectedPatient.id);
                          setShowPatientDetails(false);
                        }}
                        className="w-full"
                      >
                        <Stethoscope className="h-4 w-4 mr-2" />
                        Start Treatment
                      </Button>
                    </div>
                  ) : selectedPatient.status === 'in_treatment' ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">Doctor</p>
                        <p>{selectedPatient.assignedDoctor || 'Not assigned'}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm font-medium">Bed</p>
                        <p>{selectedPatient.assignedBed || 'Not assigned'}</p>
                      </div>
                      {!selectedPatient.assignedBed && (
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Assign a bed:</p>
                          <Select onValueChange={(bedId) => handleAssignBed(selectedPatient.id, bedId)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a bed" />
                            </SelectTrigger>
                            <SelectContent>
                              {beds
                                .filter(bed => bed.status === 'available')
                                .map(bed => (
                                  <SelectItem key={bed.id} value={bed.id}>
                                    {bed.name} ({bed.type})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">Patient status: {selectedPatient.status}</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-md font-medium mb-2">Tests & Treatments</h3>
                  <div className="space-y-2">
                    {selectedPatient.tests.length === 0 && selectedPatient.treatments.length === 0 ? (
                      <p className="text-gray-500">No tests or treatments ordered yet.</p>
                    ) : (
                      <>
                        {selectedPatient.tests.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Tests</h4>
                            <div className="space-y-1">
                              {selectedPatient.tests.map(test => (
                                <div key={test.id} className="flex justify-between items-center text-sm">
                                  <span>{test.name}</span>
                                  <Badge variant={
                                    test.status === 'completed' ? 'default' : 
                                    test.status === 'in_progress' ? 'secondary' : 'outline'
                                  }>
                                    {test.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {selectedPatient.treatments.length > 0 && (
                          <div className="mt-2">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Treatments</h4>
                            <div className="space-y-1">
                              {selectedPatient.treatments.map(treatment => (
                                <div key={treatment.id} className="flex justify-between items-center text-sm">
                                  <span>{treatment.name}</span>
                                  <Badge variant={
                                    treatment.status === 'completed' ? 'default' : 
                                    treatment.status === 'in_progress' ? 'secondary' : 'outline'
                                  }>
                                    {treatment.status}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencyPatients;
