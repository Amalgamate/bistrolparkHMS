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
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { usePhysiotherapy, SessionStatus } from '../../context/PhysiotherapyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

const PhysiotherapySessions: React.FC = () => {
  const { 
    sessions,
    patients,
    therapists,
    scheduleSession,
    updateSessionStatus,
    completeSession,
    cancelSession,
    getSessionsByDate,
    getSessionsByTherapist,
    checkTherapistAvailability
  } = usePhysiotherapy();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTherapist, setSelectedTherapist] = useState<string | 'all'>('all');
  const [showScheduleSessionDialog, setShowScheduleSessionDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('day');
  
  // New session form state
  const [newSession, setNewSession] = useState({
    patientId: '',
    physiotherapyPatientId: '',
    sessionNumber: 1,
    scheduledDate: format(new Date(), 'yyyy-MM-dd'),
    scheduledTime: '09:00',
    duration: 60,
    therapistId: '',
    therapistName: '',
    status: 'scheduled' as SessionStatus
  });
  
  // Get week dates
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start from Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Get sessions for the selected date
  const dateSessionsAll = getSessionsByDate(format(selectedDate, 'yyyy-MM-dd'));
  
  // Filter sessions based on selected therapist
  const dateSessions = selectedTherapist === 'all' 
    ? dateSessionsAll 
    : dateSessionsAll.filter(session => session.therapistId === selectedTherapist);
  
  // Sort sessions by time
  const sortedSessions = [...dateSessions].sort((a, b) => {
    return a.scheduledTime.localeCompare(b.scheduledTime);
  });
  
  // Handle scheduling a new session
  const handleScheduleSession = () => {
    // Find the patient and therapist
    const patient = patients.find(p => p.id === newSession.physiotherapyPatientId);
    const therapist = therapists.find(t => t.id === newSession.therapistId);
    
    if (!patient || !therapist) return;
    
    // Get the number of existing sessions for this patient
    const patientSessions = sessions.filter(s => s.physiotherapyPatientId === patient.id);
    const sessionNumber = patientSessions.length + 1;
    
    scheduleSession({
      ...newSession,
      patientId: patient.patientId,
      sessionNumber,
      therapistName: therapist.name
    });
    
    setShowScheduleSessionDialog(false);
    setNewSession({
      patientId: '',
      physiotherapyPatientId: '',
      sessionNumber: 1,
      scheduledDate: format(new Date(), 'yyyy-MM-dd'),
      scheduledTime: '09:00',
      duration: 60,
      therapistId: '',
      therapistName: '',
      status: 'scheduled'
    });
  };
  
  // Navigate to previous day/week
  const handlePrevious = () => {
    if (activeTab === 'day') {
      const prevDay = subDays(currentDate, 1);
      setCurrentDate(prevDay);
      setSelectedDate(prevDay);
    } else {
      const prevWeekStart = subDays(weekStart, 7);
      setCurrentDate(prevWeekStart);
    }
  };
  
  // Navigate to next day/week
  const handleNext = () => {
    if (activeTab === 'day') {
      const nextDay = addDays(currentDate, 1);
      setCurrentDate(nextDay);
      setSelectedDate(nextDay);
    } else {
      const nextWeekStart = addDays(weekStart, 7);
      setCurrentDate(nextWeekStart);
    }
  };
  
  // Navigate to today
  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };
  
  // Format time
  const formatTime = (time: string) => {
    return format(new Date(`2000-01-01T${time}`), 'h:mm a');
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
  
  // Check if time slot is available
  const isTimeSlotAvailable = (therapistId: string, date: string, time: string, duration: number) => {
    return checkTherapistAvailability(therapistId, date, time, duration);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Physiotherapy Sessions</h2>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowScheduleSessionDialog(true)}
        >
          <Plus className="h-4 w-4" />
          Schedule Session
        </Button>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={handleToday}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h3 className="text-lg font-medium ml-2">
            {activeTab === 'day' 
              ? format(selectedDate, 'MMMM d, yyyy') 
              : `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`}
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <TabsList>
            <TabsTrigger 
              value="day" 
              onClick={() => setActiveTab('day')}
              className={activeTab === 'day' ? 'bg-primary text-primary-foreground' : ''}
            >
              Day
            </TabsTrigger>
            <TabsTrigger 
              value="week" 
              onClick={() => setActiveTab('week')}
              className={activeTab === 'week' ? 'bg-primary text-primary-foreground' : ''}
            >
              Week
            </TabsTrigger>
          </TabsList>
          
          <Select value={selectedTherapist} onValueChange={(value: any) => setSelectedTherapist(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Therapist" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Therapists</SelectItem>
              {therapists.map(therapist => (
                <SelectItem key={therapist.id} value={therapist.id}>{therapist.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {activeTab === 'day' ? (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {sortedSessions.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No sessions scheduled for this day</p>
                </div>
              ) : (
                sortedSessions.map(session => {
                  const patient = patients.find(p => p.id === session.physiotherapyPatientId);
                  const therapist = therapists.find(t => t.id === session.therapistId);
                  
                  return (
                    <div key={session.id} className="border rounded-md p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 text-green-800 p-2 rounded-md text-center min-w-[70px]">
                            <div className="text-sm font-medium">{formatTime(session.scheduledTime)}</div>
                            <div className="text-xs">{session.duration} min</div>
                          </div>
                          <div>
                            <h4 className="font-medium">{patient?.patientName || 'Unknown Patient'}</h4>
                            <p className="text-sm text-gray-500">Session #{session.sessionNumber}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Therapist: {therapist?.name || 'Unassigned'}
                            </p>
                          </div>
                        </div>
                        {getStatusBadge(session.status)}
                      </div>
                      
                      <div className="mt-3 flex justify-end gap-2">
                        {session.status === 'scheduled' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => updateSessionStatus(session.id, 'in_progress')}
                            >
                              Start Session
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-red-500 text-red-500"
                              onClick={() => updateSessionStatus(session.id, 'no_show')}
                            >
                              Mark No-Show
                            </Button>
                          </>
                        )}
                        
                        {session.status === 'in_progress' && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => updateSessionStatus(session.id, 'completed')}
                          >
                            Complete Session
                          </Button>
                        )}
                        
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4">
          <div className="grid grid-cols-7 gap-4">
            {weekDates.map(date => (
              <div key={date.toISOString()} className="border rounded-md">
                <div 
                  className={`p-2 text-center border-b ${
                    isSameDay(date, new Date()) ? 'bg-green-50 text-green-800' : ''
                  }`}
                >
                  <div className="text-sm font-medium">{format(date, 'EEE')}</div>
                  <div className="text-xs">{format(date, 'MMM d')}</div>
                </div>
                <div 
                  className="p-2 min-h-[150px] cursor-pointer"
                  onClick={() => {
                    setSelectedDate(date);
                    setActiveTab('day');
                  }}
                >
                  {getSessionsByDate(format(date, 'yyyy-MM-dd')).length === 0 ? (
                    <p className="text-xs text-gray-400 text-center mt-4">No sessions</p>
                  ) : (
                    <div className="space-y-2">
                      {getSessionsByDate(format(date, 'yyyy-MM-dd'))
                        .slice(0, 3)
                        .map(session => {
                          const patient = patients.find(p => p.id === session.physiotherapyPatientId);
                          
                          return (
                            <div key={session.id} className="text-xs p-1 bg-green-50 rounded">
                              <div className="font-medium truncate">{patient?.patientName || 'Unknown'}</div>
                              <div className="text-gray-500">{formatTime(session.scheduledTime)}</div>
                            </div>
                          );
                        })
                      }
                      {getSessionsByDate(format(date, 'yyyy-MM-dd')).length > 3 && (
                        <div className="text-xs text-center text-green-600">
                          +{getSessionsByDate(format(date, 'yyyy-MM-dd')).length - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
      
      {/* Schedule Session Dialog */}
      <Dialog open={showScheduleSessionDialog} onOpenChange={setShowScheduleSessionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Physiotherapy Session</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Patient</label>
              <Select 
                value={newSession.physiotherapyPatientId} 
                onValueChange={(value) => setNewSession({ ...newSession, physiotherapyPatientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a patient" />
                </SelectTrigger>
                <SelectContent>
                  {patients.length === 0 ? (
                    <SelectItem value="none" disabled>No patients available</SelectItem>
                  ) : (
                    patients
                      .filter(patient => patient.status === 'active')
                      .map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.patientName} - {patient.diagnosis}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date" 
                  value={newSession.scheduledDate}
                  onChange={(e) => setNewSession({ ...newSession, scheduledDate: e.target.value })}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input 
                  type="time" 
                  value={newSession.scheduledTime}
                  onChange={(e) => setNewSession({ ...newSession, scheduledTime: e.target.value })}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Therapist</label>
                <Select 
                  value={newSession.therapistId} 
                  onValueChange={(value) => setNewSession({ ...newSession, therapistId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select therapist" />
                  </SelectTrigger>
                  <SelectContent>
                    {therapists
                      .filter(therapist => therapist.status === 'active')
                      .map(therapist => (
                        <SelectItem key={therapist.id} value={therapist.id}>
                          {therapist.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (minutes)</label>
                <Select 
                  value={newSession.duration.toString()} 
                  onValueChange={(value) => setNewSession({ ...newSession, duration: parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">60 minutes</SelectItem>
                    <SelectItem value="90">90 minutes</SelectItem>
                    <SelectItem value="120">120 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {newSession.therapistId && newSession.scheduledDate && newSession.scheduledTime && (
              <div className="p-3 rounded-md bg-gray-50">
                <p className="text-sm font-medium">Availability Check:</p>
                {isTimeSlotAvailable(
                  newSession.therapistId, 
                  newSession.scheduledDate, 
                  newSession.scheduledTime, 
                  newSession.duration
                ) ? (
                  <div className="flex items-center gap-2 text-green-600 mt-1">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm">Time slot is available</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-600 mt-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">Time slot is not available. Please select another time.</span>
                  </div>
                )}
              </div>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowScheduleSessionDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleScheduleSession}
                disabled={
                  !newSession.physiotherapyPatientId || 
                  !newSession.therapistId || 
                  !newSession.scheduledDate || 
                  !newSession.scheduledTime ||
                  !isTimeSlotAvailable(
                    newSession.therapistId, 
                    newSession.scheduledDate, 
                    newSession.scheduledTime, 
                    newSession.duration
                  )
                }
              >
                Schedule Session
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhysiotherapySessions;
