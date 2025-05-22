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
  ChevronRight,
  Scissors
} from 'lucide-react';
import { useProcedures, ProcedureStatus, ProcedureType, ProcedureCategory, ProcedureLocation, AnesthesiaType } from '../../context/ProceduresContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { format, addDays, subDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';

const ProceduresSchedule: React.FC = () => {
  const { 
    procedures,
    procedureTemplates,
    procedureRooms,
    addProcedure,
    updateProcedureStatus,
    cancelProcedure,
    getProceduresByDate,
    checkRoomAvailability
  } = useProcedures();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState<string | 'all'>('all');
  const [showScheduleProcedureDialog, setShowScheduleProcedureDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('day');
  
  // New procedure form state
  const [newProcedure, setNewProcedure] = useState({
    patientId: '',
    patientName: '',
    procedureName: '',
    procedureCode: '',
    type: 'surgical' as ProcedureType,
    category: 'minor' as ProcedureCategory,
    description: '',
    scheduledDate: format(new Date(), 'yyyy-MM-dd'),
    scheduledTime: '09:00',
    estimatedDuration: 60,
    location: 'procedure_room' as ProcedureLocation,
    primaryPhysician: '',
    assistingStaff: [] as string[],
    anesthesiaType: 'local' as AnesthesiaType,
    anesthesiologist: '',
    specialEquipment: [] as string[],
    preOpInstructions: '',
    postOpInstructions: '',
    consentObtained: false,
    riskLevel: 'low' as 'low' | 'moderate' | 'high',
    status: 'scheduled' as ProcedureStatus,
    notes: ''
  });
  
  // Get week dates
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }); // Start from Monday
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDates = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  // Get procedures for the selected date
  const dateProceduresAll = getProceduresByDate(format(selectedDate, 'yyyy-MM-dd'));
  
  // Filter procedures based on selected room
  const dateProcedures = selectedRoom === 'all' 
    ? dateProceduresAll 
    : dateProceduresAll.filter(procedure => procedure.location === selectedRoom);
  
  // Sort procedures by time
  const sortedProcedures = [...dateProcedures].sort((a, b) => {
    return a.scheduledTime.localeCompare(b.scheduledTime);
  });
  
  // Handle scheduling a new procedure
  const handleScheduleProcedure = () => {
    addProcedure(newProcedure);
    setShowScheduleProcedureDialog(false);
    setNewProcedure({
      patientId: '',
      patientName: '',
      procedureName: '',
      procedureCode: '',
      type: 'surgical',
      category: 'minor',
      description: '',
      scheduledDate: format(new Date(), 'yyyy-MM-dd'),
      scheduledTime: '09:00',
      estimatedDuration: 60,
      location: 'procedure_room',
      primaryPhysician: '',
      assistingStaff: [],
      anesthesiaType: 'local',
      anesthesiologist: '',
      specialEquipment: [],
      preOpInstructions: '',
      postOpInstructions: '',
      consentObtained: false,
      riskLevel: 'low',
      status: 'scheduled',
      notes: ''
    });
  };
  
  // Handle cancelling a procedure
  const handleCancelProcedure = (procedureId: string, reason: string) => {
    cancelProcedure(procedureId, reason);
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
  const getStatusBadge = (status: ProcedureStatus) => {
    const statusConfig: Record<ProcedureStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      scheduled: { label: 'Scheduled', variant: 'outline' },
      in_progress: { label: 'In Progress', variant: 'secondary' },
      completed: { label: 'Completed', variant: 'default' },
      cancelled: { label: 'Cancelled', variant: 'destructive' },
      postponed: { label: 'Postponed', variant: 'outline' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  // Get procedure type display name
  const getProcedureTypeDisplay = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
  };
  
  // Check if time slot is available
  const isTimeSlotAvailable = (roomId: string, date: string, time: string, duration: number) => {
    return checkRoomAvailability(roomId, date, time, duration);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Procedure Schedule</h2>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setShowScheduleProcedureDialog(true)}
        >
          <Plus className="h-4 w-4" />
          Schedule Procedure
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
          
          <Select value={selectedRoom} onValueChange={(value: any) => setSelectedRoom(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Room" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              <SelectItem value="operating_room">Operating Room</SelectItem>
              <SelectItem value="procedure_room">Procedure Room</SelectItem>
              <SelectItem value="bedside">Bedside</SelectItem>
              <SelectItem value="outpatient">Outpatient</SelectItem>
              <SelectItem value="emergency_room">Emergency Room</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {activeTab === 'day' ? (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {sortedProcedures.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">No procedures scheduled for this day</p>
                </div>
              ) : (
                sortedProcedures.map(procedure => (
                  <div key={procedure.id} className="border rounded-md p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-3">
                        <div className="bg-purple-100 text-purple-800 p-2 rounded-md text-center min-w-[70px]">
                          <div className="text-sm font-medium">{formatTime(procedure.scheduledTime)}</div>
                          <div className="text-xs">{procedure.estimatedDuration} min</div>
                        </div>
                        <div>
                          <h4 className="font-medium">{procedure.patientName}</h4>
                          <p className="text-sm text-gray-500">{procedure.procedureName}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {getProcedureTypeDisplay(procedure.type)} • {getProcedureTypeDisplay(procedure.category)}
                          </p>
                        </div>
                      </div>
                      {getStatusBadge(procedure.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Physician:</span>
                          <span className="text-sm">{procedure.primaryPhysician}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Location:</span>
                          <span className="text-sm">{getProcedureTypeDisplay(procedure.location)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Anesthesia:</span>
                          <span className="text-sm">{getProcedureTypeDisplay(procedure.anesthesiaType)}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Risk Level:</span>
                          <span className="text-sm">{procedure.riskLevel.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Consent:</span>
                          <span className="text-sm">{procedure.consentObtained ? 'Obtained' : 'Not Obtained'}</span>
                        </div>
                        {procedure.anesthesiologist && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Anesthesiologist:</span>
                            <span className="text-sm">{procedure.anesthesiologist}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 flex justify-end gap-2">
                      {procedure.status === 'scheduled' && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => updateProcedureStatus(procedure.id, 'in_progress')}
                          >
                            Start Procedure
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="border-red-500 text-red-500"
                            onClick={() => handleCancelProcedure(procedure.id, 'Cancelled by user')}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                      
                      {procedure.status === 'in_progress' && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => updateProcedureStatus(procedure.id, 'completed')}
                        >
                          Complete Procedure
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm">View Details</Button>
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
                    isSameDay(date, new Date()) ? 'bg-purple-50 text-purple-800' : ''
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
                  {getProceduresByDate(format(date, 'yyyy-MM-dd')).length === 0 ? (
                    <p className="text-xs text-gray-400 text-center mt-4">No procedures</p>
                  ) : (
                    <div className="space-y-2">
                      {getProceduresByDate(format(date, 'yyyy-MM-dd'))
                        .slice(0, 3)
                        .map(procedure => (
                          <div key={procedure.id} className="text-xs p-1 bg-purple-50 rounded">
                            <div className="font-medium truncate">{procedure.patientName}</div>
                            <div className="text-gray-500">{formatTime(procedure.scheduledTime)}</div>
                          </div>
                        ))
                      }
                      {getProceduresByDate(format(date, 'yyyy-MM-dd')).length > 3 && (
                        <div className="text-xs text-center text-purple-600">
                          +{getProceduresByDate(format(date, 'yyyy-MM-dd')).length - 3} more
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
      
      {/* Schedule Procedure Dialog */}
      <Dialog open={showScheduleProcedureDialog} onOpenChange={setShowScheduleProcedureDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Procedure</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Patient ID</label>
                <Input 
                  value={newProcedure.patientId} 
                  onChange={(e) => setNewProcedure({ ...newProcedure, patientId: e.target.value })}
                  placeholder="Enter patient ID"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Patient Name</label>
                <Input 
                  value={newProcedure.patientName} 
                  onChange={(e) => setNewProcedure({ ...newProcedure, patientName: e.target.value })}
                  placeholder="Enter patient name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Procedure Name</label>
                <Input 
                  value={newProcedure.procedureName} 
                  onChange={(e) => setNewProcedure({ ...newProcedure, procedureName: e.target.value })}
                  placeholder="Enter procedure name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Procedure Code (Optional)</label>
                <Input 
                  value={newProcedure.procedureCode} 
                  onChange={(e) => setNewProcedure({ ...newProcedure, procedureCode: e.target.value })}
                  placeholder="Enter procedure code"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Procedure Type</label>
                <Select 
                  value={newProcedure.type} 
                  onValueChange={(value: ProcedureType) => setNewProcedure({ ...newProcedure, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select procedure type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="surgical">Surgical</SelectItem>
                    <SelectItem value="diagnostic">Diagnostic</SelectItem>
                    <SelectItem value="therapeutic">Therapeutic</SelectItem>
                    <SelectItem value="preventive">Preventive</SelectItem>
                    <SelectItem value="cosmetic">Cosmetic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Procedure Category</label>
                <Select 
                  value={newProcedure.category} 
                  onValueChange={(value: ProcedureCategory) => setNewProcedure({ ...newProcedure, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select procedure category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Input 
                value={newProcedure.description} 
                onChange={(e) => setNewProcedure({ ...newProcedure, description: e.target.value })}
                placeholder="Enter procedure description"
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Date</label>
                <Input 
                  type="date" 
                  value={newProcedure.scheduledDate}
                  onChange={(e) => setNewProcedure({ ...newProcedure, scheduledDate: e.target.value })}
                  min={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Time</label>
                <Input 
                  type="time" 
                  value={newProcedure.scheduledTime}
                  onChange={(e) => setNewProcedure({ ...newProcedure, scheduledTime: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Duration (minutes)</label>
                <Input 
                  type="number" 
                  value={newProcedure.estimatedDuration}
                  onChange={(e) => setNewProcedure({ ...newProcedure, estimatedDuration: parseInt(e.target.value) })}
                  min={15}
                  step={15}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select 
                  value={newProcedure.location} 
                  onValueChange={(value: ProcedureLocation) => setNewProcedure({ ...newProcedure, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="operating_room">Operating Room</SelectItem>
                    <SelectItem value="procedure_room">Procedure Room</SelectItem>
                    <SelectItem value="bedside">Bedside</SelectItem>
                    <SelectItem value="outpatient">Outpatient</SelectItem>
                    <SelectItem value="emergency_room">Emergency Room</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Physician</label>
                <Input 
                  value={newProcedure.primaryPhysician} 
                  onChange={(e) => setNewProcedure({ ...newProcedure, primaryPhysician: e.target.value })}
                  placeholder="Enter physician name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Anesthesia Type</label>
                <Select 
                  value={newProcedure.anesthesiaType} 
                  onValueChange={(value: AnesthesiaType) => setNewProcedure({ ...newProcedure, anesthesiaType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select anesthesia type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    <SelectItem value="local">Local</SelectItem>
                    <SelectItem value="regional">Regional</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="sedation">Sedation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Risk Level</label>
                <Select 
                  value={newProcedure.riskLevel} 
                  onValueChange={(value: 'low' | 'moderate' | 'high') => setNewProcedure({ ...newProcedure, riskLevel: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes (Optional)</label>
              <Input 
                value={newProcedure.notes || ''} 
                onChange={(e) => setNewProcedure({ ...newProcedure, notes: e.target.value })}
                placeholder="Enter any additional notes"
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowScheduleProcedureDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleScheduleProcedure}
                disabled={
                  !newProcedure.patientId || 
                  !newProcedure.patientName || 
                  !newProcedure.procedureName || 
                  !newProcedure.description || 
                  !newProcedure.primaryPhysician
                }
              >
                Schedule Procedure
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProceduresSchedule;
