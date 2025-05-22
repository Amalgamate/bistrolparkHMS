import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import {
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  User,
  FileImage,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useRadiology, RadiologySchedule as RadiologyScheduleType } from '../../context/RadiologyContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

const RadiologySchedule: React.FC = () => {
  const { 
    radiologySchedules, 
    radiologyRequests,
    radiologyEquipment,
    scheduleRadiologyExam,
    updateScheduleStatus,
    getSchedulesByDate,
    getSchedulesByEquipment,
    checkEquipmentAvailability
  } = useRadiology();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEquipment, setSelectedEquipment] = useState<string | 'all'>('all');
  const [selectedSchedule, setSelectedSchedule] = useState<RadiologyScheduleType | null>(null);
  const [showScheduleDetailsDialog, setShowScheduleDetailsDialog] = useState(false);
  const [showAddScheduleDialog, setShowAddScheduleDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('day');
  
  // New schedule form state
  const [newSchedule, setNewSchedule] = useState({
    requestId: '',
    equipmentId: '',
    scheduledDate: format(new Date(), 'yyyy-MM-dd'),
    scheduledTime: '09:00',
    duration: 30,
    notes: ''
  });
  
  // Get week dates
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start from Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Get schedules for the selected date
  const dateSchedules = getSchedulesByDate(format(selectedDate, 'yyyy-MM-dd'));
  
  // Filter schedules based on selected equipment
  const filteredSchedules = selectedEquipment === 'all' 
    ? dateSchedules 
    : dateSchedules.filter(schedule => schedule.equipmentId === selectedEquipment);
  
  // Sort schedules by time
  const sortedSchedules = [...filteredSchedules].sort((a, b) => {
    return a.scheduledTime.localeCompare(b.scheduledTime);
  });
  
  // Get pending requests that can be scheduled
  const pendingRequests = radiologyRequests.filter(
    request => request.status === 'approved' && !request.scheduledDate
  );
  
  // Handle viewing schedule details
  const handleViewSchedule = (schedule: RadiologyScheduleType) => {
    setSelectedSchedule(schedule);
    setShowScheduleDetailsDialog(true);
  };
  
  // Handle adding a new schedule
  const handleAddSchedule = () => {
    const request = radiologyRequests.find(req => req.id === newSchedule.requestId);
    if (!request) return;
    
    scheduleRadiologyExam({
      requestId: newSchedule.requestId,
      patientId: request.patientId,
      patientName: request.patientName,
      examType: request.tests.map(t => t.testName).join(', '),
      scheduledDate: newSchedule.scheduledDate,
      scheduledTime: newSchedule.scheduledTime,
      duration: newSchedule.duration,
      equipmentId: newSchedule.equipmentId,
      status: 'scheduled',
      notes: newSchedule.notes
    });
    
    setShowAddScheduleDialog(false);
    setNewSchedule({
      requestId: '',
      equipmentId: '',
      scheduledDate: format(new Date(), 'yyyy-MM-dd'),
      scheduledTime: '09:00',
      duration: 30,
      notes: ''
    });
  };
  
  // Handle updating schedule status
  const handleUpdateStatus = (scheduleId: string, status: RadiologyScheduleType['status'], notes?: string) => {
    updateScheduleStatus(scheduleId, status, notes);
    
    // Update the selected schedule if it's the one being modified
    if (selectedSchedule && selectedSchedule.id === scheduleId) {
      setSelectedSchedule({ ...selectedSchedule, status });
    }
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
  const getStatusBadge = (status: RadiologyScheduleType['status']) => {
    const statusConfig: Record<RadiologyScheduleType['status'], { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      scheduled: { label: 'Scheduled', variant: 'outline' },
      checked_in: { label: 'Checked In', variant: 'secondary' },
      in_progress: { label: 'In Progress', variant: 'secondary' },
      completed: { label: 'Completed', variant: 'default' },
      no_show: { label: 'No Show', variant: 'destructive' },
      cancelled: { label: 'Cancelled', variant: 'destructive' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  // Check if time slot is available
  const isTimeSlotAvailable = (equipmentId: string, date: string, time: string, duration: number) => {
    return checkEquipmentAvailability(equipmentId, date, time, duration);
  };
  
  // Get equipment name by ID
  const getEquipmentName = (equipmentId: string) => {
    const equipment = radiologyEquipment.find(eq => eq.id === equipmentId);
    return equipment ? equipment.name : 'Unknown Equipment';
  };
  
  // Get request details by ID
  const getRequestDetails = (requestId: string) => {
    const request = radiologyRequests.find(req => req.id === requestId);
    return request ? {
      patientName: request.patientName,
      tests: request.tests.map(t => t.testName).join(', '),
      doctorName: request.doctorName
    } : null;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Radiology Schedule</h2>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowAddScheduleDialog(true)}
        >
          <Plus className="h-4 w-4" />
          Schedule Examination
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
          
          <Select value={selectedEquipment} onValueChange={(value: any) => setSelectedEquipment(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Equipment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Equipment</SelectItem>
              {radiologyEquipment.map(equipment => (
                <SelectItem key={equipment.id} value={equipment.id}>{equipment.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {activeTab === 'day' ? (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {sortedSchedules.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No examinations scheduled for this day</p>
                </div>
              ) : (
                sortedSchedules.map(schedule => (
                  <div 
                    key={schedule.id} 
                    className="border rounded-md p-4 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewSchedule(schedule)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="bg-blue-100 text-blue-800 p-2 rounded-md text-center min-w-[70px]">
                          <div className="text-sm font-medium">{formatTime(schedule.scheduledTime)}</div>
                          <div className="text-xs">{schedule.duration} min</div>
                        </div>
                        <div>
                          <h4 className="font-medium">{schedule.patientName}</h4>
                          <p className="text-sm text-gray-500">{schedule.examType}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Equipment: {getEquipmentName(schedule.equipmentId)}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(schedule.status)}
                    </div>
                  </div>
                ))
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
                    isSameDay(date, new Date()) ? 'bg-blue-50 text-blue-800' : ''
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
                  {getSchedulesByDate(format(date, 'yyyy-MM-dd')).length === 0 ? (
                    <p className="text-xs text-gray-400 text-center mt-4">No schedules</p>
                  ) : (
                    <div className="space-y-2">
                      {getSchedulesByDate(format(date, 'yyyy-MM-dd'))
                        .slice(0, 3)
                        .map(schedule => (
                          <div key={schedule.id} className="text-xs p-1 bg-blue-50 rounded">
                            <div className="font-medium truncate">{schedule.patientName}</div>
                            <div className="text-gray-500">{formatTime(schedule.scheduledTime)}</div>
                          </div>
                        ))
                      }
                      {getSchedulesByDate(format(date, 'yyyy-MM-dd')).length > 3 && (
                        <div className="text-xs text-center text-blue-600">
                          +{getSchedulesByDate(format(date, 'yyyy-MM-dd')).length - 3} more
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
      
      {/* Schedule Details Dialog */}
      <Dialog open={showScheduleDetailsDialog} onOpenChange={setShowScheduleDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Examination Schedule Details</DialogTitle>
          </DialogHeader>
          
          {selectedSchedule && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Patient Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex items-center gap-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <p className="font-medium">{selectedSchedule.patientName}</p>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Examination:</span>
                        <span className="text-sm">{selectedSchedule.examType}</span>
                      </div>
                      
                      {selectedSchedule.notes && (
                        <div className="mt-2">
                          <p className="text-sm font-medium">Notes:</p>
                          <p className="text-sm mt-1">{selectedSchedule.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-500">Schedule Information</h3>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-gray-400" />
                          <p className="font-medium">{format(new Date(selectedSchedule.scheduledDate), 'MMMM d, yyyy')}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <p className="text-sm">{formatTime(selectedSchedule.scheduledTime)} ({selectedSchedule.duration} min)</p>
                        </div>
                      </div>
                      {getStatusBadge(selectedSchedule.status)}
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Equipment:</span>
                        <span className="text-sm">{getEquipmentName(selectedSchedule.equipmentId)}</span>
                      </div>
                      
                      {selectedSchedule.technician && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Technician:</span>
                          <span className="text-sm">{selectedSchedule.technician}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setShowScheduleDetailsDialog(false)}>
                  Close
                </Button>
                
                {selectedSchedule.status === 'scheduled' && (
                  <>
                    <Button 
                      variant="outline" 
                      className="border-red-500 text-red-500"
                      onClick={() => handleUpdateStatus(selectedSchedule.id, 'cancelled', 'Cancelled by staff')}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => handleUpdateStatus(selectedSchedule.id, 'checked_in')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Check In
                    </Button>
                  </>
                )}
                
                {selectedSchedule.status === 'checked_in' && (
                  <Button 
                    onClick={() => handleUpdateStatus(selectedSchedule.id, 'in_progress')}
                  >
                    Start Examination
                  </Button>
                )}
                
                {selectedSchedule.status === 'in_progress' && (
                  <Button 
                    onClick={() => handleUpdateStatus(selectedSchedule.id, 'completed')}
                  >
                    Complete Examination
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add Schedule Dialog */}
      <Dialog open={showAddScheduleDialog} onOpenChange={setShowAddScheduleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Radiology Examination</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Request</label>
              <Select 
                value={newSchedule.requestId} 
                onValueChange={(value) => {
                  setNewSchedule({ ...newSchedule, requestId: value });
                  
                  // Set default duration based on the selected request
                  const request = radiologyRequests.find(req => req.id === value);
                  if (request) {
                    const totalDuration = request.tests.reduce((sum, test) => sum + (test.duration || 30), 0);
                    setNewSchedule(prev => ({ ...prev, duration: totalDuration }));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a pending request" />
                </SelectTrigger>
                <SelectContent>
                  {pendingRequests.length === 0 ? (
                    <SelectItem value="none" disabled>No pending requests</SelectItem>
                  ) : (
                    pendingRequests.map(request => (
                      <SelectItem key={request.id} value={request.id}>
                        {request.patientName} - {request.tests.map(t => t.testName).join(', ')}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            {newSchedule.requestId && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input 
                      type="date" 
                      value={newSchedule.scheduledDate}
                      onChange={(e) => setNewSchedule({ ...newSchedule, scheduledDate: e.target.value })}
                      min={format(new Date(), 'yyyy-MM-dd')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <Input 
                      type="time" 
                      value={newSchedule.scheduledTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, scheduledTime: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Equipment</label>
                    <Select 
                      value={newSchedule.equipmentId} 
                      onValueChange={(value) => setNewSchedule({ ...newSchedule, equipmentId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select equipment" />
                      </SelectTrigger>
                      <SelectContent>
                        {radiologyEquipment
                          .filter(eq => eq.status === 'operational')
                          .map(equipment => (
                            <SelectItem key={equipment.id} value={equipment.id}>
                              {equipment.name}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Duration (minutes)</label>
                    <Input 
                      type="number" 
                      value={newSchedule.duration}
                      onChange={(e) => setNewSchedule({ ...newSchedule, duration: parseInt(e.target.value) })}
                      min={15}
                      step={5}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notes</label>
                  <Input 
                    value={newSchedule.notes || ''}
                    onChange={(e) => setNewSchedule({ ...newSchedule, notes: e.target.value })}
                    placeholder="Any special instructions or notes"
                  />
                </div>
                
                {newSchedule.equipmentId && newSchedule.scheduledDate && newSchedule.scheduledTime && (
                  <div className="p-3 rounded-md bg-gray-50">
                    <p className="text-sm font-medium">Availability Check:</p>
                    {isTimeSlotAvailable(
                      newSchedule.equipmentId, 
                      newSchedule.scheduledDate, 
                      newSchedule.scheduledTime, 
                      newSchedule.duration
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
              </>
            )}
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddScheduleDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleAddSchedule}
                disabled={
                  !newSchedule.requestId || 
                  !newSchedule.equipmentId || 
                  !newSchedule.scheduledDate || 
                  !newSchedule.scheduledTime ||
                  !isTimeSlotAvailable(
                    newSchedule.equipmentId, 
                    newSchedule.scheduledDate, 
                    newSchedule.scheduledTime, 
                    newSchedule.duration
                  )
                }
              >
                Schedule Examination
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RadiologySchedule;
