import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Input } from '../../components/ui/input';
import {
  AlertTriangle,
  Search,
  Clock,
  UserPlus,
  Filter,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Activity
} from 'lucide-react';
import { useEmergency, EmergencyPatient, TriageLevel } from '../../context/EmergencyContext';
import TriageAssessmentForm from './TriageAssessmentForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';

const EmergencyTriage: React.FC = () => {
  const { patients, registerPatient, getPatientsByStatus } = useEmergency();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [showTriageForm, setShowTriageForm] = useState(false);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<'all' | 'waiting_triage' | 'triaged'>('all');
  
  // Get patients waiting for triage
  const waitingForTriage = getPatientsByStatus('waiting_triage');
  const triaged = getPatientsByStatus('triaged');
  
  // Filter and sort patients
  const filteredPatients = (() => {
    let result = filterStatus === 'all' 
      ? [...waitingForTriage, ...triaged]
      : filterStatus === 'waiting_triage' 
        ? waitingForTriage 
        : triaged;
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(patient => 
        patient.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.includes(searchTerm)
      );
    }
    
    // Sort by arrival time
    result.sort((a, b) => {
      const timeA = new Date(a.arrivalTime).getTime();
      const timeB = new Date(b.arrivalTime).getTime();
      return sortDirection === 'asc' ? timeA - timeB : timeB - timeA;
    });
    
    return result;
  })();

  const handleNewPatient = () => {
    // In a real app, this would open a form to select an existing patient
    // or register a new one. For now, we'll create a dummy patient.
    const patientId = `P${Math.floor(Math.random() * 10000)}`;
    const patientName = `Test Patient ${Math.floor(Math.random() * 100)}`;
    
    const newPatient = registerPatient(
      patientId,
      patientName,
      Math.random() > 0.7 ? 'ambulance' : 'walk_in'
    );
    
    setSelectedPatientId(newPatient.id);
    setShowTriageForm(true);
  };

  const handleTriageComplete = () => {
    setShowTriageForm(false);
    setSelectedPatientId(null);
  };

  const handleTriageCancel = () => {
    setShowTriageForm(false);
    setSelectedPatientId(null);
  };

  const handleSelectPatient = (patientId: string) => {
    setSelectedPatientId(patientId);
    setShowTriageForm(true);
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Emergency Triage</h2>
        <Button onClick={handleNewPatient} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          New Patient
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search patients..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Patients</SelectItem>
              <SelectItem value="waiting_triage">Waiting for Triage</SelectItem>
              <SelectItem value="triaged">Triaged</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            <Clock className="h-4 w-4" />
            {sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          <Badge variant="outline" className="bg-red-50">
            <div className="w-2 h-2 rounded-full bg-red-600 mr-1"></div>
            <span className="text-xs">{getPatientsByStatus('waiting_triage').length} Waiting</span>
          </Badge>
          <Badge variant="outline" className="bg-green-50">
            <div className="w-2 h-2 rounded-full bg-green-600 mr-1"></div>
            <span className="text-xs">{getPatientsByStatus('triaged').length} Triaged</span>
          </Badge>
        </div>
      </div>
      
      {filteredPatients.length === 0 ? (
        <Card className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No patients found matching your criteria.</p>
        </Card>
      ) : (
        <div className="border rounded-md overflow-hidden">
          <div className="grid grid-cols-7 gap-4 p-3 bg-gray-50 font-medium text-sm">
            <div>Patient</div>
            <div>Arrival</div>
            <div>Method</div>
            <div>Wait Time</div>
            <div>Status</div>
            <div>Triage Level</div>
            <div>Actions</div>
          </div>
          <div className="divide-y">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="grid grid-cols-7 gap-4 p-3 items-center hover:bg-gray-50">
                <div className="font-medium">{patient.patientName}</div>
                <div className="text-sm">{new Date(patient.arrivalTime).toLocaleTimeString()}</div>
                <div>
                  <Badge variant={patient.arrivalMethod === 'ambulance' ? 'destructive' : 'default'}>
                    {patient.arrivalMethod === 'ambulance' ? 'Ambulance' : 
                     patient.arrivalMethod === 'walk_in' ? 'Walk-in' : 'Transfer'}
                  </Badge>
                </div>
                <div>{getWaitTimeDisplay(patient)}</div>
                <div>
                  <Badge variant={patient.status === 'waiting_triage' ? 'outline' : 'secondary'}>
                    {patient.status === 'waiting_triage' ? 'Waiting' : 'Triaged'}
                  </Badge>
                </div>
                <div>
                  {patient.triageAssessment ? getTriageLevelBadge(patient.triageAssessment.level) : '-'}
                </div>
                <div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSelectPatient(patient.id)}
                  >
                    {patient.status === 'waiting_triage' ? 'Triage' : 'View/Edit'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <Dialog open={showTriageForm} onOpenChange={setShowTriageForm}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Triage Assessment</DialogTitle>
          </DialogHeader>
          {selectedPatientId && (
            <TriageAssessmentForm
              patientId={selectedPatientId}
              onComplete={handleTriageComplete}
              onCancel={handleTriageCancel}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmergencyTriage;
