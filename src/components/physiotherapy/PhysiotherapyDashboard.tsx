import React from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import {
  Users,
  Calendar,
  Clock,
  FileText,
  RefreshCw,
  Plus,
  ArrowRight,
  Clipboard,
  Dumbbell,
  Activity,
  CheckCircle,
  XCircle,
  UserPlus
} from 'lucide-react';
import { usePhysiotherapy, SessionStatus } from '../../context/PhysiotherapyContext';
import { format, isToday, parseISO } from 'date-fns';

const PhysiotherapyDashboard: React.FC = () => {
  const { 
    patients, 
    sessions,
    therapists,
    getPatientsByStatus,
    getSessionsByStatus,
    getSessionsByDate
  } = usePhysiotherapy();
  
  // Calculate statistics
  const activePatients = getPatientsByStatus('active').length;
  const scheduledSessions = getSessionsByStatus('scheduled').length;
  const completedSessions = getSessionsByStatus('completed').length;
  
  const totalPatients = patients.length;
  const todaySessions = getSessionsByDate(format(new Date(), 'yyyy-MM-dd')).length;
  
  // Get upcoming sessions (scheduled for today)
  const todaySessionsList = getSessionsByDate(format(new Date(), 'yyyy-MM-dd'))
    .filter(session => session.status === 'scheduled')
    .sort((a, b) => {
      return a.scheduledTime.localeCompare(b.scheduledTime);
    });
  
  // Get recent sessions (last 5 completed)
  const recentSessions = [...sessions]
    .filter(session => session.status === 'completed')
    .sort((a, b) => {
      const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
      const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);
  
  // Format date
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };
  
  // Format time
  const formatTime = (time: string) => {
    return format(new Date(`2000-01-01T${time}`), 'h:mm a');
  };
  
  // Format date and time
  const formatDateTime = (date: string, time: string) => {
    return format(new Date(`${date}T${time}`), 'MMM d, yyyy h:mm a');
  };
  
  // Get status badge
  const getStatusBadge = (status: SessionStatus) => {
    const statusConfig: Record<SessionStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      scheduled: { label: 'Scheduled', variant: 'outline' },
      in_progress: { label: 'In Progress', variant: 'secondary' },
      completed: { label: 'Completed', variant: 'default' },
      cancelled: { label: 'Cancelled', variant: 'destructive' },
      no_show: { label: 'No Show', variant: 'destructive' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Physiotherapy Dashboard</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Active Patients</h3>
              <p className="text-2xl font-bold mt-1">{activePatients}</p>
            </div>
            <Users className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-green-600">
            {totalPatients} total patients
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Today's Sessions</h3>
              <p className="text-2xl font-bold mt-1">{todaySessions}</p>
            </div>
            <Calendar className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-blue-600">
            {scheduledSessions} upcoming sessions
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Therapists</h3>
              <p className="text-2xl font-bold mt-1">{therapists.length}</p>
            </div>
            <UserPlus className="h-8 w-8 text-amber-500" />
          </div>
          <div className="mt-2 text-xs text-amber-600">
            {therapists.filter(t => t.status === 'active').length} active therapists
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Completed Sessions</h3>
              <p className="text-2xl font-bold mt-1">{completedSessions}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 text-xs text-purple-600">
            {getSessionsByStatus('no_show').length} no-shows
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <div className="p-4 border-b">
            <h3 className="font-medium">Today's Sessions</h3>
          </div>
          <div className="p-4">
            {todaySessionsList.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No sessions scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todaySessionsList.map(session => {
                  const patient = patients.find(p => p.id === session.physiotherapyPatientId);
                  const therapist = therapists.find(t => t.id === session.therapistId);
                  
                  return (
                    <div key={session.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{patient?.patientName || 'Unknown Patient'}</h4>
                          <p className="text-sm text-gray-500">
                            Session #{session.sessionNumber} • {formatTime(session.scheduledTime)}
                          </p>
                        </div>
                        {getStatusBadge(session.status)}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Therapist:</span>
                          <span className="text-sm">{therapist?.name || 'Unassigned'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Duration:</span>
                          <span className="text-sm">{session.duration} minutes</span>
                        </div>
                        {session.treatmentsProvided && session.treatmentsProvided.length > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Treatments:</span>
                            <span className="text-sm">
                              {session.treatmentsProvided.map(t => t.type.replace('_', ' ')).join(', ')}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-3 flex justify-end">
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="mt-4 flex justify-end">
              <Button className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                View All Sessions
              </Button>
            </div>
          </div>
        </Card>
        
        <Card>
          <Tabs defaultValue="recent">
            <div className="p-4 border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recent">Recent Sessions</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="recent" className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Recently Completed</h3>
              {recentSessions.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No completed sessions yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentSessions.map(session => {
                    const patient = patients.find(p => p.id === session.physiotherapyPatientId);
                    
                    return (
                      <div key={session.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                        <div>
                          <p className="font-medium">{patient?.patientName || 'Unknown Patient'}</p>
                          <p className="text-xs text-gray-500">
                            Session #{session.sessionNumber} • {formatDate(session.scheduledDate)}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">View</Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="stats" className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Session Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Completed</span>
                    <span className="text-sm font-medium">{completedSessions}</span>
                  </div>
                  <Progress value={completedSessions / (sessions.length || 1) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Scheduled</span>
                    <span className="text-sm font-medium">{scheduledSessions}</span>
                  </div>
                  <Progress value={scheduledSessions / (sessions.length || 1) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Cancelled</span>
                    <span className="text-sm font-medium">{getSessionsByStatus('cancelled').length}</span>
                  </div>
                  <Progress value={getSessionsByStatus('cancelled').length / (sessions.length || 1) * 100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">No-Show</span>
                    <span className="text-sm font-medium">{getSessionsByStatus('no_show').length}</span>
                  </div>
                  <Progress value={getSessionsByStatus('no_show').length / (sessions.length || 1) * 100} className="h-2" />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <UserPlus className="h-8 w-8 text-green-400 mb-2" />
          <h3 className="font-medium">New Patient</h3>
          <p className="text-sm text-gray-500 mt-1">Register a new physiotherapy patient</p>
          <Button className="mt-3">Register Patient</Button>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Calendar className="h-8 w-8 text-blue-400 mb-2" />
          <h3 className="font-medium">Schedule Session</h3>
          <p className="text-sm text-gray-500 mt-1">Schedule a new therapy session</p>
          <Button className="mt-3">Schedule</Button>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Clipboard className="h-8 w-8 text-amber-400 mb-2" />
          <h3 className="font-medium">New Assessment</h3>
          <p className="text-sm text-gray-500 mt-1">Perform a new patient assessment</p>
          <Button className="mt-3">Start Assessment</Button>
        </Card>
      </div>
    </div>
  );
};

export default PhysiotherapyDashboard;
