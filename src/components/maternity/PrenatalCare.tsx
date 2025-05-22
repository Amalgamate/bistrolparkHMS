import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  Heart,
  AlertTriangle,
  CheckCircle,
  XCircle,
  CalendarDays
} from 'lucide-react';
import { useMaternity, MaternityPatient } from '../../context/MaternityContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { format, differenceInWeeks, addWeeks } from 'date-fns';

const PrenatalCare: React.FC = () => {
  const { 
    patients, 
    addPatient,
    addPrenatalVisit,
    getPatientsByStatus
  } = useMaternity();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<MaternityPatient | null>(null);
  const [showPatientDetailsDialog, setShowPatientDetailsDialog] = useState(false);
  const [showAddPatientDialog, setShowAddPatientDialog] = useState(false);
  const [showAddVisitDialog, setShowAddVisitDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // New patient form state
  const [newPatient, setNewPatient] = useState<Omit<MaternityPatient, 'id' | 'lastUpdatedAt'>>({
    patientId: '',
    patientName: '',
    age: 0,
    dateOfBirth: '',
    pregnancyStatus: 'prenatal',
    gravida: 1,
    para: 0,
    gestationalAge: 0,
    lmp: '',
    edd: ''
  });
  
  // New visit form state
  const [newVisit, setNewVisit] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    gestationalAge: 0,
    weight: 0,
    bloodPressure: '',
    fetalHeartRate: 0,
    notes: '',
    nextAppointment: '',
    provider: ''
  });
  
  // Get prenatal patients
  const prenatalPatients = getPatientsByStatus('prenatal');
  
  // Filter patients based on search term
  const filteredPatients = prenatalPatients.filter(patient => {
    const matchesSearch = 
      patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });
  
  // Sort patients by EDD
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (!a.edd && !b.edd) return 0;
    if (!a.edd) return 1;
    if (!b.edd) return -1;
    
    return new Date(a.edd).getTime() - new Date(b.edd).getTime();
  });
  
  // Handle viewing patient details
  const handleViewPatient = (patient: MaternityPatient) => {
    setSelectedPatient(patient);
    setShowPatientDetailsDialog(true);
  };
  
  // Handle adding a new patient
  const handleAddPatient = () => {
    // Calculate EDD from LMP if provided
    let calculatedEDD = '';
    if (newPatient.lmp) {
      calculatedEDD = format(addWeeks(new Date(newPatient.lmp), 40), 'yyyy-MM-dd');
    }
    
    // Calculate gestational age from LMP if provided
    let calculatedGestationalAge = 0;
    if (newPatient.lmp) {
      calculatedGestationalAge = differenceInWeeks(new Date(), new Date(newPatient.lmp));
    }
    
    const patientToAdd = {
      ...newPatient,
      edd: calculatedEDD || newPatient.edd,
      gestationalAge: calculatedGestationalAge || newPatient.gestationalAge
    };
    
    addPatient(patientToAdd);
    setShowAddPatientDialog(false);
    setNewPatient({
      patientId: '',
      patientName: '',
      age: 0,
      dateOfBirth: '',
      pregnancyStatus: 'prenatal',
      gravida: 1,
      para: 0,
      gestationalAge: 0,
      lmp: '',
      edd: ''
    });
  };
  
  // Handle adding a new prenatal visit
  const handleAddVisit = () => {
    if (selectedPatient) {
      addPrenatalVisit(selectedPatient.id, newVisit);
      setShowAddVisitDialog(false);
      setNewVisit({
        date: format(new Date(), 'yyyy-MM-dd'),
        gestationalAge: selectedPatient.gestationalAge || 0,
        weight: 0,
        bloodPressure: '',
        fetalHeartRate: 0,
        notes: '',
        nextAppointment: '',
        provider: ''
      });
    }
  };
  
  // Format date
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };
  
  // Calculate weeks until EDD
  const getWeeksUntilEDD = (edd: string) => {
    const dueDate = new Date(edd);
    const today = new Date();
    const weeks = differenceInWeeks(dueDate, today);
    return weeks > 0 ? weeks : 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Prenatal Care</h2>
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
            <TabsTrigger value="first-trimester">First Trimester</TabsTrigger>
            <TabsTrigger value="second-trimester">Second Trimester</TabsTrigger>
            <TabsTrigger value="third-trimester">Third Trimester</TabsTrigger>
            <TabsTrigger value="high-risk">High Risk</TabsTrigger>
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
            <User className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No prenatal patients found.</p>
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
              <div>Age</div>
              <div>G/P</div>
              <div>Gestational Age</div>
              <div>EDD</div>
              <div>Actions</div>
            </div>
            <div className="divide-y">
              {sortedPatients.map(patient => (
                <div key={patient.id} className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                  <div className="font-medium">{patient.patientName}</div>
                  <div className="text-sm">{patient.patientId}</div>
                  <div className="text-sm">{patient.age} years</div>
                  <div className="text-sm">G{patient.gravida}P{patient.para}</div>
                  <div className="text-sm">
                    {patient.gestationalAge ? `${patient.gestationalAge} weeks` : 'Not recorded'}
                  </div>
                  <div className="text-sm">
                    {patient.edd ? (
                      <>
                        {formatDate(patient.edd)}
                        <span className="text-xs text-gray-500 block">
                          {getWeeksUntilEDD(patient.edd)} weeks left
                        </span>
                      </>
                    ) : (
                      'Not recorded'
                    )}
                  </div>
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
                      onClick={() => {
                        setSelectedPatient(patient);
                        setNewVisit({
                          date: format(new Date(), 'yyyy-MM-dd'),
                          gestationalAge: patient.gestationalAge || 0,
                          weight: 0,
                          bloodPressure: '',
                          fetalHeartRate: 0,
                          notes: '',
                          nextAppointment: '',
                          provider: ''
                        });
                        setShowAddVisitDialog(true);
                      }}
                    >
                      Add Visit
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
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Age:</span>
                        <span className="text-sm">{selectedPatient.age} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Date of Birth:</span>
                        <span className="text-sm">
                          {selectedPatient.dateOfBirth ? formatDate(selectedPatient.dateOfBirth) : 'Not recorded'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Blood Type:</span>
                        <span className="text-sm">
                          {selectedPatient.bloodType ? 
                            `${selectedPatient.bloodType}${selectedPatient.rhFactor || ''}` : 
                            'Not recorded'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Pregnancy Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Gravida/Para:</span>
                        <span className="text-sm">G{selectedPatient.gravida}P{selectedPatient.para}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">LMP:</span>
                        <span className="text-sm">
                          {selectedPatient.lmp ? formatDate(selectedPatient.lmp) : 'Not recorded'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">EDD:</span>
                        <span className="text-sm">
                          {selectedPatient.edd ? formatDate(selectedPatient.edd) : 'Not recorded'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Gestational Age:</span>
                        <span className="text-sm">
                          {selectedPatient.gestationalAge ? `${selectedPatient.gestationalAge} weeks` : 'Not recorded'}
                        </span>
                      </div>
                    </div>
                    
                    {selectedPatient.riskFactors && selectedPatient.riskFactors.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium">Risk Factors:</p>
                        <ul className="text-sm mt-1 list-disc list-inside">
                          {selectedPatient.riskFactors.map((risk, index) => (
                            <li key={index}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Next Appointment</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {selectedPatient.prenatalVisits && selectedPatient.prenatalVisits.length > 0 && 
                     selectedPatient.prenatalVisits[selectedPatient.prenatalVisits.length - 1].nextAppointment ? (
                      <div>
                        <p className="font-medium">
                          {formatDate(selectedPatient.prenatalVisits[selectedPatient.prenatalVisits.length - 1].nextAppointment)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Scheduled at last visit on {formatDate(selectedPatient.prenatalVisits[selectedPatient.prenatalVisits.length - 1].date)}
                        </p>
                        
                        <Button className="w-full mt-4" onClick={() => {
                          setNewVisit({
                            date: format(new Date(), 'yyyy-MM-dd'),
                            gestationalAge: selectedPatient.gestationalAge || 0,
                            weight: 0,
                            bloodPressure: '',
                            fetalHeartRate: 0,
                            notes: '',
                            nextAppointment: '',
                            provider: ''
                          });
                          setShowAddVisitDialog(true);
                        }}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Record Visit
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm text-gray-500 mb-4">No upcoming appointment scheduled.</p>
                        
                        <Button className="w-full" onClick={() => {
                          setNewVisit({
                            date: format(new Date(), 'yyyy-MM-dd'),
                            gestationalAge: selectedPatient.gestationalAge || 0,
                            weight: 0,
                            bloodPressure: '',
                            fetalHeartRate: 0,
                            notes: '',
                            nextAppointment: '',
                            provider: ''
                          });
                          setShowAddVisitDialog(true);
                        }}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Appointment
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Prenatal Visits</h3>
                {selectedPatient.prenatalVisits && selectedPatient.prenatalVisits.length > 0 ? (
                  <div className="border rounded-md overflow-hidden">
                    <div className="grid grid-cols-7 gap-4 p-3 bg-gray-50 font-medium text-sm">
                      <div>Date</div>
                      <div>Gestational Age</div>
                      <div>Weight</div>
                      <div>Blood Pressure</div>
                      <div>Fetal Heart Rate</div>
                      <div>Provider</div>
                      <div>Next Appointment</div>
                    </div>
                    <div className="divide-y">
                      {[...selectedPatient.prenatalVisits].reverse().map(visit => (
                        <div key={visit.id} className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                          <div className="font-medium">{formatDate(visit.date)}</div>
                          <div className="text-sm">{visit.gestationalAge} weeks</div>
                          <div className="text-sm">{visit.weight} kg</div>
                          <div className="text-sm">{visit.bloodPressure}</div>
                          <div className="text-sm">
                            {visit.fetalHeartRate ? `${visit.fetalHeartRate} bpm` : 'Not recorded'}
                          </div>
                          <div className="text-sm">{visit.provider}</div>
                          <div className="text-sm">
                            {visit.nextAppointment ? formatDate(visit.nextAppointment) : 'Not scheduled'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card className="p-6 text-center">
                    <CalendarDays className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No prenatal visits recorded yet.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setNewVisit({
                          date: format(new Date(), 'yyyy-MM-dd'),
                          gestationalAge: selectedPatient.gestationalAge || 0,
                          weight: 0,
                          bloodPressure: '',
                          fetalHeartRate: 0,
                          notes: '',
                          nextAppointment: '',
                          provider: ''
                        });
                        setShowAddVisitDialog(true);
                      }}
                    >
                      Record First Visit
                    </Button>
                  </Card>
                )}
              </div>
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowPatientDetailsDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => {
                  setNewVisit({
                    date: format(new Date(), 'yyyy-MM-dd'),
                    gestationalAge: selectedPatient.gestationalAge || 0,
                    weight: 0,
                    bloodPressure: '',
                    fetalHeartRate: 0,
                    notes: '',
                    nextAppointment: '',
                    provider: ''
                  });
                  setShowAddVisitDialog(true);
                }}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Record Visit
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add Patient Dialog */}
      <Dialog open={showAddPatientDialog} onOpenChange={setShowAddPatientDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Register New Prenatal Patient</DialogTitle>
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
                <label className="text-sm font-medium">Date of Birth</label>
                <Input 
                  type="date" 
                  value={newPatient.dateOfBirth} 
                  onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Menstrual Period (LMP)</label>
                <Input 
                  type="date" 
                  value={newPatient.lmp || ''} 
                  onChange={(e) => setNewPatient({ ...newPatient, lmp: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Estimated Due Date (EDD)</label>
                <Input 
                  type="date" 
                  value={newPatient.edd || ''} 
                  onChange={(e) => setNewPatient({ ...newPatient, edd: e.target.value })}
                  disabled={!!newPatient.lmp}
                />
                {newPatient.lmp && (
                  <p className="text-xs text-gray-500">
                    EDD will be calculated from LMP
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Gravida (Number of Pregnancies)</label>
                <Input 
                  type="number" 
                  value={newPatient.gravida} 
                  onChange={(e) => setNewPatient({ ...newPatient, gravida: parseInt(e.target.value) })}
                  min={1}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Para (Number of Births)</label>
                <Input 
                  type="number" 
                  value={newPatient.para} 
                  onChange={(e) => setNewPatient({ ...newPatient, para: parseInt(e.target.value) })}
                  min={0}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddPatientDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddPatient}
                disabled={!newPatient.patientId || !newPatient.patientName || newPatient.age <= 0}
              >
                Register Patient
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Add Visit Dialog */}
      <Dialog open={showAddVisitDialog} onOpenChange={setShowAddVisitDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record Prenatal Visit</DialogTitle>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium">{selectedPatient.patientName}</p>
                <p className="text-sm text-gray-500">
                  {selectedPatient.gestationalAge ? `${selectedPatient.gestationalAge} weeks gestation` : 'Gestational age not recorded'}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Visit Date</label>
                  <Input 
                    type="date" 
                    value={newVisit.date} 
                    onChange={(e) => setNewVisit({ ...newVisit, date: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gestational Age (weeks)</label>
                  <Input 
                    type="number" 
                    value={newVisit.gestationalAge} 
                    onChange={(e) => setNewVisit({ ...newVisit, gestationalAge: parseInt(e.target.value) })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Weight (kg)</label>
                  <Input 
                    type="number" 
                    value={newVisit.weight} 
                    onChange={(e) => setNewVisit({ ...newVisit, weight: parseFloat(e.target.value) })}
                    step="0.1"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Blood Pressure</label>
                  <Input 
                    value={newVisit.bloodPressure} 
                    onChange={(e) => setNewVisit({ ...newVisit, bloodPressure: e.target.value })}
                    placeholder="e.g., 120/80"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fetal Heart Rate (bpm)</label>
                  <Input 
                    type="number" 
                    value={newVisit.fetalHeartRate} 
                    onChange={(e) => setNewVisit({ ...newVisit, fetalHeartRate: parseInt(e.target.value) })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Provider</label>
                  <Input 
                    value={newVisit.provider} 
                    onChange={(e) => setNewVisit({ ...newVisit, provider: e.target.value })}
                    placeholder="Enter provider name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Input 
                  value={newVisit.notes} 
                  onChange={(e) => setNewVisit({ ...newVisit, notes: e.target.value })}
                  placeholder="Enter any notes from the visit"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Next Appointment</label>
                <Input 
                  type="date" 
                  value={newVisit.nextAppointment} 
                  onChange={(e) => setNewVisit({ ...newVisit, nextAppointment: e.target.value })}
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddVisitDialog(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddVisit}
                  disabled={!newVisit.date || newVisit.weight <= 0 || !newVisit.bloodPressure || !newVisit.provider}
                >
                  Save Visit
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrenatalCare;
