import React from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import {
  Users,
  Bed,
  Clock,
  AlertTriangle,
  Activity,
  UserCheck,
  UserPlus,
  ArrowRight,
  RefreshCw,
  Stethoscope,
  Clipboard,
  FileText,
  Download
} from 'lucide-react';
import { useEmergency, EmergencyPatient, TriageLevel } from '../../context/EmergencyContext';

const EmergencyDashboard: React.FC = () => {
  const { 
    patients, 
    beds, 
    getPatientsByStatus, 
    getPatientsByTriageLevel,
    getAvailableBeds
  } = useEmergency();
  
  // Calculate statistics
  const waitingForTriage = getPatientsByStatus('waiting_triage').length;
  const inTreatment = getPatientsByStatus('in_treatment').length;
  const triaged = getPatientsByStatus('triaged').length;
  const redPatients = getPatientsByTriageLevel('red').length;
  const orangePatients = getPatientsByTriageLevel('orange').length;
  const yellowPatients = getPatientsByTriageLevel('yellow').length;
  const greenPatients = getPatientsByTriageLevel('green').length;
  const bluePatients = getPatientsByTriageLevel('blue').length;
  
  const totalBeds = beds.length;
  const availableBeds = getAvailableBeds().length;
  const occupiedBeds = beds.filter(bed => bed.status === 'occupied').length;
  const cleaningBeds = beds.filter(bed => bed.status === 'cleaning').length;
  const maintenanceBeds = beds.filter(bed => bed.status === 'maintenance').length;
  
  const bedOccupancyRate = totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0;
  
  // Get average wait time for patients currently waiting
  const calculateAverageWaitTime = () => {
    const waitingPatients = [...getPatientsByStatus('waiting_triage'), ...getPatientsByStatus('triaged')];
    if (waitingPatients.length === 0) return 0;
    
    const totalWaitTimeMinutes = waitingPatients.reduce((total, patient) => {
      const arrivalTime = new Date(patient.arrivalTime).getTime();
      const now = new Date().getTime();
      const waitTimeMinutes = Math.floor((now - arrivalTime) / (1000 * 60));
      return total + waitTimeMinutes;
    }, 0);
    
    return Math.round(totalWaitTimeMinutes / waitingPatients.length);
  };
  
  const averageWaitTimeMinutes = calculateAverageWaitTime();
  
  // Get recent patients (last 5)
  const recentPatients = [...patients]
    .sort((a, b) => new Date(b.arrivalTime).getTime() - new Date(a.arrivalTime).getTime())
    .slice(0, 5);
  
  // Get critical patients (red and orange)
  const criticalPatients = [...getPatientsByTriageLevel('red'), ...getPatientsByTriageLevel('orange')]
    .sort((a, b) => {
      // Sort by triage level first (red before orange)
      if (a.triageAssessment?.level === 'red' && b.triageAssessment?.level === 'orange') return -1;
      if (a.triageAssessment?.level === 'orange' && b.triageAssessment?.level === 'red') return 1;
      
      // Then by arrival time (oldest first)
      return new Date(a.arrivalTime).getTime() - new Date(b.arrivalTime).getTime();
    })
    .slice(0, 5);
  
  const getTriageLevelBadge = (level: TriageLevel) => {
    const colors = {
      red: "bg-red-100 text-red-800",
      orange: "bg-orange-100 text-orange-800",
      yellow: "bg-yellow-100 text-yellow-800",
      green: "bg-green-100 text-green-800",
      blue: "bg-blue-100 text-blue-800"
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[level]}`}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Emergency Department Dashboard</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Patients</h3>
              <p className="text-2xl font-bold mt-1">{patients.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-blue-600">
            {waitingForTriage} waiting triage, {triaged} triaged, {inTreatment} in treatment
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Avg. Wait Time</h3>
              <p className="text-2xl font-bold mt-1">{averageWaitTimeMinutes} min</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500" />
          </div>
          <div className="mt-2 text-xs text-amber-600">
            For patients currently waiting
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Critical Patients</h3>
              <p className="text-2xl font-bold mt-1">{redPatients + orangePatients}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-2 text-xs text-red-600">
            {redPatients} red, {orangePatients} orange
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Available Beds</h3>
              <p className="text-2xl font-bold mt-1">{availableBeds}/{totalBeds}</p>
            </div>
            <Bed className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2">
            <Progress value={bedOccupancyRate} className="h-2" />
            <p className="text-xs text-green-600 mt-1">
              {occupiedBeds} occupied, {cleaningBeds} cleaning, {maintenanceBeds} maintenance
            </p>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <div className="p-4 border-b">
            <h3 className="font-medium">Triage Status</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-5 gap-4 mb-4">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-bold text-xl">
                  {redPatients}
                </div>
                <p className="text-sm font-medium mt-2">Red</p>
                <p className="text-xs text-gray-500">Immediate</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-800 font-bold text-xl">
                  {orangePatients}
                </div>
                <p className="text-sm font-medium mt-2">Orange</p>
                <p className="text-xs text-gray-500">Very Urgent</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-800 font-bold text-xl">
                  {yellowPatients}
                </div>
                <p className="text-sm font-medium mt-2">Yellow</p>
                <p className="text-xs text-gray-500">Urgent</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-bold text-xl">
                  {greenPatients}
                </div>
                <p className="text-sm font-medium mt-2">Green</p>
                <p className="text-xs text-gray-500">Standard</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xl">
                  {bluePatients}
                </div>
                <p className="text-sm font-medium mt-2">Blue</p>
                <p className="text-xs text-gray-500">Non-urgent</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <div className="space-y-1">
                <p className="text-sm font-medium">Waiting for Triage: {waitingForTriage}</p>
                <p className="text-sm font-medium">Triaged: {triaged}</p>
                <p className="text-sm font-medium">In Treatment: {inTreatment}</p>
              </div>
              <Button className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                View All Patients
              </Button>
            </div>
          </div>
        </Card>
        
        <Card>
          <Tabs defaultValue="critical">
            <div className="p-4 border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="critical">Critical</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="critical" className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Critical Patients</h3>
              {criticalPatients.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No critical patients at this time.</p>
              ) : (
                <div className="space-y-3">
                  {criticalPatients.map(patient => (
                    <div key={patient.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                      <div>
                        <div className="flex items-center">
                          <p className="font-medium">{patient.patientName}</p>
                          <div className="ml-2">
                            {getTriageLevelBadge(patient.triageAssessment!.level)}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">
                          {patient.triageAssessment?.chiefComplaint.substring(0, 30)}
                          {patient.triageAssessment?.chiefComplaint.length! > 30 ? '...' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs">{getWaitTimeDisplay(patient)}</p>
                        <Badge variant={patient.status === 'in_treatment' ? 'default' : 'outline'} className="mt-1">
                          {patient.status === 'in_treatment' ? 'In Treatment' : 'Waiting'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recent" className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Arrivals</h3>
              {recentPatients.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No recent patients.</p>
              ) : (
                <div className="space-y-3">
                  {recentPatients.map(patient => (
                    <div key={patient.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{patient.patientName}</p>
                        <p className="text-xs text-gray-500">
                          Arrived: {new Date(patient.arrivalTime).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        {patient.triageAssessment ? (
                          getTriageLevelBadge(patient.triageAssessment.level)
                        ) : (
                          <Badge variant="outline">Waiting Triage</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Stethoscope className="h-8 w-8 text-blue-400 mb-2" />
          <h3 className="font-medium">Start Triage</h3>
          <p className="text-sm text-gray-500 mt-1">Process new arrivals</p>
          <Button className="mt-3">Go to Triage</Button>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Clipboard className="h-8 w-8 text-green-400 mb-2" />
          <h3 className="font-medium">Manage Patients</h3>
          <p className="text-sm text-gray-500 mt-1">View and update patient status</p>
          <Button className="mt-3">View Patients</Button>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <FileText className="h-8 w-8 text-purple-400 mb-2" />
          <h3 className="font-medium">Department Reports</h3>
          <p className="text-sm text-gray-500 mt-1">View statistics and reports</p>
          <Button className="mt-3">View Reports</Button>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyDashboard;
