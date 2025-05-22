import React from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import {
  Baby,
  Users,
  Calendar,
  Clock,
  FileText,
  RefreshCw,
  Plus,
  ArrowRight,
  Bed,
  Clipboard,
  Heart,
  AlertTriangle,
  UserPlus,
  Stethoscope
} from 'lucide-react';
import { useMaternity, PregnancyStatus, NewbornStatus } from '../../context/MaternityContext';
import { format, differenceInDays, differenceInWeeks, addDays } from 'date-fns';

const MaternityDashboard: React.FC = () => {
  const { 
    patients, 
    deliveries,
    newborns,
    getPatientsByStatus,
    getNewbornsByStatus
  } = useMaternity();
  
  // Calculate statistics
  const prenatalPatients = getPatientsByStatus('prenatal').length;
  const laborPatients = getPatientsByStatus('labor').length;
  const deliveredPatients = getPatientsByStatus('delivered').length;
  const postpartumPatients = getPatientsByStatus('postpartum').length;
  
  const totalPatients = patients.length;
  const todayAdmissions = patients.filter(
    patient => patient.admissionDate === format(new Date(), 'yyyy-MM-dd')
  ).length;
  
  const todayDeliveries = deliveries.filter(
    delivery => delivery.deliveryDate === format(new Date(), 'yyyy-MM-dd')
  ).length;
  
  // Get patients in labor
  const patientsInLabor = getPatientsByStatus('labor');
  
  // Get newborns by status
  const healthyNewborns = getNewbornsByStatus('healthy').length;
  const observationNewborns = getNewbornsByStatus('observation').length;
  const nicuNewborns = getNewbornsByStatus('nicu').length;
  
  // Get upcoming due dates (next 7 days)
  const today = new Date();
  const upcomingDueDates = patients.filter(patient => {
    if (!patient.edd) return false;
    const dueDate = new Date(patient.edd);
    const daysUntilDue = differenceInDays(dueDate, today);
    return daysUntilDue >= 0 && daysUntilDue <= 7;
  }).sort((a, b) => {
    if (!a.edd || !b.edd) return 0;
    return new Date(a.edd).getTime() - new Date(b.edd).getTime();
  });
  
  // Get recent deliveries (last 5)
  const recentDeliveries = [...deliveries]
    .sort((a, b) => {
      const dateA = new Date(`${a.deliveryDate}T${a.deliveryTime}`);
      const dateB = new Date(`${b.deliveryDate}T${b.deliveryTime}`);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);
  
  // Format date
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };
  
  // Format date and time
  const formatDateTime = (date: string, time: string) => {
    return format(new Date(`${date}T${time}`), 'MMM d, yyyy h:mm a');
  };
  
  // Calculate days until due
  const getDaysUntilDue = (edd: string) => {
    const dueDate = new Date(edd);
    const today = new Date();
    return differenceInDays(dueDate, today);
  };
  
  // Get status badge
  const getStatusBadge = (status: PregnancyStatus) => {
    const statusConfig: Record<PregnancyStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      prenatal: { label: 'Prenatal', variant: 'outline' },
      labor: { label: 'In Labor', variant: 'secondary' },
      delivered: { label: 'Delivered', variant: 'default' },
      postpartum: { label: 'Postpartum', variant: 'secondary' },
      discharged: { label: 'Discharged', variant: 'outline' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  // Get newborn status badge
  const getNewbornStatusBadge = (status: NewbornStatus) => {
    const statusConfig: Record<NewbornStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      healthy: { label: 'Healthy', variant: 'default' },
      observation: { label: 'Observation', variant: 'secondary' },
      nicu: { label: 'NICU', variant: 'destructive' },
      deceased: { label: 'Deceased', variant: 'outline' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Maternity Dashboard</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-pink-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Patients</h3>
              <p className="text-2xl font-bold mt-1">{totalPatients}</p>
            </div>
            <Users className="h-8 w-8 text-pink-500" />
          </div>
          <div className="mt-2 text-xs text-pink-600">
            {todayAdmissions} new admissions today
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">In Labor</h3>
              <p className="text-2xl font-bold mt-1">{laborPatients}</p>
            </div>
            <Bed className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-blue-600">
            {todayDeliveries} deliveries today
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Newborns</h3>
              <p className="text-2xl font-bold mt-1">{newborns.length}</p>
            </div>
            <Baby className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 text-xs text-purple-600">
            {nicuNewborns} in NICU
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Upcoming Due Dates</h3>
              <p className="text-2xl font-bold mt-1">{upcomingDueDates.length}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-green-600">
            In the next 7 days
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <div className="p-4 border-b">
            <h3 className="font-medium">Patients in Labor</h3>
          </div>
          <div className="p-4">
            {patientsInLabor.length === 0 ? (
              <div className="text-center py-8">
                <Bed className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No patients currently in labor</p>
              </div>
            ) : (
              <div className="space-y-4">
                {patientsInLabor.map(patient => (
                  <div key={patient.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{patient.patientName}</h4>
                        <p className="text-sm text-gray-500">
                          {patient.age} years • {patient.gestationalAge} weeks
                        </p>
                      </div>
                      {getStatusBadge(patient.pregnancyStatus)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Admitted:</span>
                        <span className="text-sm">
                          {patient.admissionDate && patient.admissionTime 
                            ? formatDateTime(patient.admissionDate, patient.admissionTime)
                            : 'Not recorded'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Room:</span>
                        <span className="text-sm">{patient.assignedRoom || 'Not assigned'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Physician:</span>
                        <span className="text-sm">{patient.attendingPhysician || 'Not assigned'}</span>
                      </div>
                      {patient.midwife && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Midwife:</span>
                          <span className="text-sm">{patient.midwife}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 flex justify-end">
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 flex justify-end">
              <Button className="flex items-center gap-2">
                <Bed className="h-4 w-4" />
                View All Labor Patients
              </Button>
            </div>
          </div>
        </Card>
        
        <Card>
          <Tabs defaultValue="due-dates">
            <div className="p-4 border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="due-dates">Due Dates</TabsTrigger>
                <TabsTrigger value="newborns">Newborns</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="due-dates" className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Upcoming Due Dates</h3>
              {upcomingDueDates.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No upcoming due dates in the next 7 days.</p>
              ) : (
                <div className="space-y-3">
                  {upcomingDueDates.map(patient => (
                    <div key={patient.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{patient.patientName}</p>
                        <p className="text-xs text-gray-500">
                          {patient.edd ? formatDate(patient.edd) : 'No EDD recorded'}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="bg-green-50 text-green-800">
                          {patient.edd ? `${getDaysUntilDue(patient.edd)} days` : 'Unknown'}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          G{patient.gravida}P{patient.para}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  View All Due Dates
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="newborns" className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Newborns</h3>
              {newborns.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No newborns recorded.</p>
              ) : (
                <div className="space-y-3">
                  {newborns.slice(0, 5).map(newborn => (
                    <div key={newborn.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                      <div>
                        <p className="font-medium">
                          {newborn.firstName && newborn.lastName 
                            ? `${newborn.firstName} ${newborn.lastName}`
                            : 'Baby ' + newborn.motherPatientId.substring(0, 4)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(newborn.dateOfBirth)} • {newborn.gender.charAt(0).toUpperCase() + newborn.gender.slice(1)}
                        </p>
                      </div>
                      <div className="text-right">
                        {getNewbornStatusBadge(newborn.status)}
                        <p className="text-xs text-gray-500 mt-1">
                          {newborn.weight}g • {newborn.length}cm
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Baby className="h-4 w-4" />
                  View All Newborns
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <UserPlus className="h-8 w-8 text-pink-400 mb-2" />
          <h3 className="font-medium">Register Patient</h3>
          <p className="text-sm text-gray-500 mt-1">Register a new maternity patient</p>
          <Button className="mt-3">Register Patient</Button>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Stethoscope className="h-8 w-8 text-blue-400 mb-2" />
          <h3 className="font-medium">Record Prenatal Visit</h3>
          <p className="text-sm text-gray-500 mt-1">Record a new prenatal checkup</p>
          <Button className="mt-3">Record Visit</Button>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Baby className="h-8 w-8 text-purple-400 mb-2" />
          <h3 className="font-medium">Record Delivery</h3>
          <p className="text-sm text-gray-500 mt-1">Record a new delivery</p>
          <Button className="mt-3">Record Delivery</Button>
        </Card>
      </div>
      
      <Card>
        <div className="p-4 border-b">
          <h3 className="font-medium">Recent Deliveries</h3>
        </div>
        <div className="p-4">
          {recentDeliveries.length === 0 ? (
            <div className="text-center py-8">
              <Baby className="h-12 w-12 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">No recent deliveries</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="px-4 py-2">Patient</th>
                    <th className="px-4 py-2">Date & Time</th>
                    <th className="px-4 py-2">Method</th>
                    <th className="px-4 py-2">Newborns</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {recentDeliveries.map(delivery => {
                    const patient = patients.find(p => p.id === delivery.maternityPatientId);
                    return (
                      <tr key={delivery.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-medium">{patient?.patientName || 'Unknown'}</div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {formatDateTime(delivery.deliveryDate, delivery.deliveryTime)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {delivery.deliveryMethod.charAt(0).toUpperCase() + delivery.deliveryMethod.slice(1)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {delivery.newborns.length}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={delivery.status === 'completed' ? 'default' : 'secondary'}>
                            {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button variant="outline" size="sm">View</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              View All Deliveries
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MaternityDashboard;
