import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  Users,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  UserPlus,
  Clipboard
} from 'lucide-react';
import { usePhysiotherapy, PhysiotherapyPatient, PatientStatus } from '../../context/PhysiotherapyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { format } from 'date-fns';

const PhysiotherapyPatients: React.FC = () => {
  const { 
    patients, 
    addPatient,
    updatePatient,
    updatePatientStatus,
    dischargePatient,
    getPatientsByStatus,
    getSessionsByPatient,
    getAssessmentsByPatient
  } = usePhysiotherapy();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<PatientStatus | 'all'>('all');
  const [selectedPatient, setSelectedPatient] = useState<PhysiotherapyPatient | null>(null);
  const [showPatientDetailsDialog, setShowPatientDetailsDialog] = useState(false);
  const [showAddPatientDialog, setShowAddPatientDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // New patient form state
  const [newPatient, setNewPatient] = useState<Omit<PhysiotherapyPatient, 'id' | 'lastUpdatedAt'>>({
    patientId: '',
    patientName: '',
    age: 0,
    gender: 'male',
    diagnosis: '',
    chiefComplaint: '',
    status: 'active'
  });
  
  // Filter patients based on search term and status
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (patient.diagnosis && patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === 'all' || patient.status === filterStatus;
    
    // Filter based on active tab
    if (activeTab === 'all') {
      return matchesSearch && matchesStatus;
    } else if (activeTab === 'active') {
      return matchesSearch && patient.status === 'active';
    } else if (activeTab === 'completed') {
      return matchesSearch && patient.status === 'completed';
    } else if (activeTab === 'on_hold') {
      return matchesSearch && patient.status === 'on_hold';
    } else if (activeTab === 'discharged') {
      return matchesSearch && patient.status === 'discharged';
    }
    
    return matchesSearch && matchesStatus;
  });
  
  // Sort patients by name
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    return a.patientName.localeCompare(b.patientName);
  });
  
  // Handle viewing patient details
  const handleViewPatient = (patient: PhysiotherapyPatient) => {
    setSelectedPatient(patient);
    setShowPatientDetailsDialog(true);
  };
  
  // Handle adding a new patient
  const handleAddPatient = () => {
    addPatient(newPatient);
    setShowAddPatientDialog(false);
    setNewPatient({
      patientId: '',
      patientName: '',
      age: 0,
      gender: 'male',
      diagnosis: '',
      chiefComplaint: '',
      status: 'active'
    });
  };
  
  // Handle updating patient status
  const handleUpdateStatus = (patientId: string, status: PatientStatus) => {
    updatePatientStatus(patientId, status);
    
    // Update the selected patient if it's the one being modified
    if (selectedPatient && selectedPatient.id === patientId) {
      setSelectedPatient({ ...selectedPatient, status });
    }
  };
  
  // Format date
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };
  
  // Get status badge
  const getStatusBadge = (status: PatientStatus) => {
    const statusConfig: Record<PatientStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      active: { label: 'Active', variant: 'default' },
      completed: { label: 'Completed', variant: 'secondary' },
      on_hold: { label: 'On Hold', variant: 'outline' },
      discharged: { label: 'Discharged', variant: 'destructive' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Physiotherapy Patients</h2>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowAddPatientDialog(true)}
        >
          <Plus className="h-4 w-4" />
          Register New Patient
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Patients</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="on_hold">On Hold</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="discharged">Discharged</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2 ml-4">
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
      </div>
      
      <TabsContent value={activeTab} className="space-y-4 mt-0">
        {sortedPatients.length === 0 ? (
          <Card className="p-6 text-center">
            <Users className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No patients found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setShowAddPatientDialog(true)}
            >
              Register New Patient
            </Button>
          </Card>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <div className="grid grid-cols-7 gap-4 p-3 bg-gray-50 font-medium text-sm">
              <div>Patient Name</div>
              <div>ID</div>
              <div>Age/Gender</div>
              <div>Diagnosis</div>
              <div>Chief Complaint</div>
              <div>Status</div>
              <div>Actions</div>
            </div>
            <div className="divide-y">
              {sortedPatients.map(patient => (
                <div key={patient.id} className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div className="font-medium">{patient.patientName}</div>
                  <div className="text-sm">{patient.patientId}</div>
                  <div className="text-sm">{patient.age} / {patient.gender.charAt(0).toUpperCase()}</div>
                  <div className="text-sm truncate max-w-[200px]">{patient.diagnosis}</div>
                  <div className="text-sm truncate max-w-[200px]">{patient.chiefComplaint}</div>
                  <div>{getStatusBadge(patient.status)}</div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewPatient(patient)}
                    >
                      View
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleViewPatient(patient)}
                    >
                      {patient.status === 'active' ? 'Manage' : 
                       patient.status === 'on_hold' ? 'Resume' : 
                       patient.status === 'completed' ? 'Reactivate' : 'View History'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </TabsContent>
      
      {/* Patient Details Dialog */}
      <Dialog open={showPatientDetailsDialog} onOpenChange={setShowPatientDetailsDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Patient Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-lg">{selectedPatient.patientName}</p>
                        <p className="text-sm text-gray-500">ID: {selectedPatient.patientId}</p>
                      </div>
                      {getStatusBadge(selectedPatient.status)}
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Age:</span>
                        <span className="text-sm">{selectedPatient.age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Gender:</span>
                        <span className="text-sm">{selectedPatient.gender.charAt(0).toUpperCase() + selectedPatient.gender.slice(1)}</span>
                      </div>
                      {selectedPatient.contactNumber && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Contact:</span>
                          <span className="text-sm">{selectedPatient.contactNumber}</span>
                        </div>
                      )}
                      {selectedPatient.email && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Email:</span>
                          <span className="text-sm">{selectedPatient.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Clinical Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm font-medium">Diagnosis:</p>
                        <p className="text-sm">{selectedPatient.diagnosis}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Chief Complaint:</p>
                        <p className="text-sm">{selectedPatient.chiefComplaint}</p>
                      </div>
                      {selectedPatient.referringPhysician && (
                        <div>
                          <p className="text-sm font-medium">Referring Physician:</p>
                          <p className="text-sm">{selectedPatient.referringPhysician}</p>
                        </div>
                      )}
                      {selectedPatient.referralDate && (
                        <div>
                          <p className="text-sm font-medium">Referral Date:</p>
                          <p className="text-sm">{formatDate(selectedPatient.referralDate)}</p>
                        </div>
                      )}
                    </div>
                    
                    {selectedPatient.medicalHistory && selectedPatient.medicalHistory.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium">Medical History:</p>
                        <ul className="text-sm mt-1 list-disc list-inside">
                          {selectedPatient.medicalHistory.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Treatment Plan</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {selectedPatient.treatmentPlan ? (
                      <div>
                        <p className="text-sm">{selectedPatient.treatmentPlan}</p>
                        
                        {selectedPatient.goals && selectedPatient.goals.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium">Goals:</p>
                            <ul className="text-sm mt-1 list-disc list-inside">
                              {selectedPatient.goals.map((goal, index) => (
                                <li key={index}>{goal}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm text-gray-500">No treatment plan defined yet.</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="mt-2"
                        >
                          Create Treatment Plan
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Assessments</h3>
                  <div className="border rounded-md overflow-hidden">
                    <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 font-medium text-sm">
                      <div>Date</div>
                      <div>Therapist</div>
                      <div>Actions</div>
                    </div>
                    <div className="divide-y">
                      {getAssessmentsByPatient(selectedPatient.id).length === 0 ? (
                        <div className="p-4 text-center">
                          <p className="text-sm text-gray-500">No assessments recorded yet.</p>
                        </div>
                      ) : (
                        getAssessmentsByPatient(selectedPatient.id).map(assessment => (
                          <div key={assessment.id} className="grid grid-cols-3 gap-4 p-3 items-center hover:bg-gray-50">
                            <div className="text-sm">{formatDate(assessment.assessmentDate)}</div>
                            <div className="text-sm">{assessment.therapistName}</div>
                            <div>
                              <Button variant="outline" size="sm">View</Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" className="flex items-center gap-2">
                      <Clipboard className="h-4 w-4" />
                      New Assessment
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Sessions</h3>
                  <div className="border rounded-md overflow-hidden">
                    <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 font-medium text-sm">
                      <div>Date</div>
                      <div>Therapist</div>
                      <div>Status</div>
                      <div>Actions</div>
                    </div>
                    <div className="divide-y">
                      {getSessionsByPatient(selectedPatient.id).length === 0 ? (
                        <div className="p-4 text-center">
                          <p className="text-sm text-gray-500">No sessions recorded yet.</p>
                        </div>
                      ) : (
                        getSessionsByPatient(selectedPatient.id).map(session => (
                          <div key={session.id} className="grid grid-cols-4 gap-4 p-3 items-center hover:bg-gray-50">
                            <div className="text-sm">{formatDate(session.scheduledDate)}</div>
                            <div className="text-sm">{session.therapistName}</div>
                            <div>{getStatusBadge(session.status)}</div>
                            <div>
                              <Button variant="outline" size="sm">View</Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Schedule Session
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowPatientDetailsDialog(false)}>
                  Close
                </Button>
                
                {selectedPatient.status === 'active' && (
                  <>
                    <Button 
                      variant="outline" 
                      className="border-amber-500 text-amber-500"
                      onClick={() => handleUpdateStatus(selectedPatient.id, 'on_hold')}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Put On Hold
                    </Button>
                    <Button 
                      variant="outline" 
                      className="border-green-500 text-green-500"
                      onClick={() => handleUpdateStatus(selectedPatient.id, 'completed')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                    <Button 
                      variant="destructive"
                      onClick={() => handleUpdateStatus(selectedPatient.id, 'discharged')}
                    >
                      Discharge Patient
                    </Button>
                  </>
                )}
                
                {selectedPatient.status === 'on_hold' && (
                  <Button 
                    variant="default"
                    onClick={() => handleUpdateStatus(selectedPatient.id, 'active')}
                  >
                    Resume Treatment
                  </Button>
                )}
                
                {selectedPatient.status === 'completed' && (
                  <Button 
                    variant="default"
                    onClick={() => handleUpdateStatus(selectedPatient.id, 'active')}
                  >
                    Reactivate Patient
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add Patient Dialog */}
      <Dialog open={showAddPatientDialog} onOpenChange={setShowAddPatientDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Register New Patient</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Patient ID</label>
                <Input 
                  value={newPatient.patientId} 
                  onChange={(e) => setNewPatient({ ...newPatient, patientId: e.target.value })}
                  placeholder="Enter patient ID"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Patient Name</label>
                <Input 
                  value={newPatient.patientName} 
                  onChange={(e) => setNewPatient({ ...newPatient, patientName: e.target.value })}
                  placeholder="Enter patient name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Age</label>
                <Input 
                  type="number" 
                  value={newPatient.age} 
                  onChange={(e) => setNewPatient({ ...newPatient, age: parseInt(e.target.value) })}
                  placeholder="Enter age"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <Select 
                  value={newPatient.gender} 
                  onValueChange={(value: 'male' | 'female' | 'other') => setNewPatient({ ...newPatient, gender: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Diagnosis</label>
              <Input 
                value={newPatient.diagnosis} 
                onChange={(e) => setNewPatient({ ...newPatient, diagnosis: e.target.value })}
                placeholder="Enter diagnosis"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Chief Complaint</label>
              <Input 
                value={newPatient.chiefComplaint} 
                onChange={(e) => setNewPatient({ ...newPatient, chiefComplaint: e.target.value })}
                placeholder="Enter chief complaint"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Number (Optional)</label>
                <Input 
                  value={newPatient.contactNumber || ''} 
                  onChange={(e) => setNewPatient({ ...newPatient, contactNumber: e.target.value })}
                  placeholder="Enter contact number"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email (Optional)</label>
                <Input 
                  value={newPatient.email || ''} 
                  onChange={(e) => setNewPatient({ ...newPatient, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddPatientDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddPatient}
                disabled={!newPatient.patientId || !newPatient.patientName || newPatient.age <= 0 || !newPatient.diagnosis || !newPatient.chiefComplaint}
              >
                Register Patient
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhysiotherapyPatients;
