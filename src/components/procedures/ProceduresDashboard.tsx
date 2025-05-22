import React from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import {
  Calendar,
  Clock,
  FileText,
  RefreshCw,
  Plus,
  ArrowRight,
  Scissors,
  CheckSquare,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Briefcase
} from 'lucide-react';
import { useProcedures, ProcedureStatus } from '../../context/ProceduresContext';
import { format, isToday, parseISO } from 'date-fns';

const ProceduresDashboard: React.FC = () => {
  const { 
    procedures, 
    procedureRooms,
    getProceduresByStatus,
    getProceduresByDate,
    getProcedureRoomsByStatus
  } = useProcedures();
  
  // Calculate statistics
  const scheduledProcedures = getProceduresByStatus('scheduled').length;
  const completedProcedures = getProceduresByStatus('completed').length;
  const cancelledProcedures = getProceduresByStatus('cancelled').length;
  
  const totalProcedures = procedures.length;
  const todayProcedures = getProceduresByDate(format(new Date(), 'yyyy-MM-dd')).length;
  
  // Get upcoming procedures (scheduled for today)
  const todayProceduresList = getProceduresByDate(format(new Date(), 'yyyy-MM-dd'))
    .filter(procedure => procedure.status === 'scheduled')
    .sort((a, b) => {
      return a.scheduledTime.localeCompare(b.scheduledTime);
    });
  
  // Get recent procedures (last 5 completed)
  const recentProcedures = [...procedures]
    .filter(procedure => procedure.status === 'completed')
    .sort((a, b) => {
      const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`);
      const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);
  
  // Get room availability
  const availableRooms = getProcedureRoomsByStatus('available').length;
  const totalRooms = procedureRooms.length;
  
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Procedures Dashboard</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Today's Procedures</h3>
              <p className="text-2xl font-bold mt-1">{todayProcedures}</p>
            </div>
            <Calendar className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 text-xs text-purple-600">
            {scheduledProcedures} scheduled procedures
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Room Availability</h3>
              <p className="text-2xl font-bold mt-1">{availableRooms}/{totalRooms}</p>
            </div>
            <Briefcase className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-blue-600">
            {getProcedureRoomsByStatus('occupied').length} rooms in use
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="text-2xl font-bold mt-1">{completedProcedures}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-green-600">
            {completedProcedures > 0 ? Math.round((completedProcedures / totalProcedures) * 100) : 0}% completion rate
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Cancelled</h3>
              <p className="text-2xl font-bold mt-1">{cancelledProcedures}</p>
            </div>
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-2 text-xs text-red-600">
            {cancelledProcedures > 0 ? Math.round((cancelledProcedures / totalProcedures) * 100) : 0}% cancellation rate
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <div className="p-4 border-b">
            <h3 className="font-medium">Today's Procedures</h3>
          </div>
          <div className="p-4">
            {todayProceduresList.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No procedures scheduled for today</p>
              </div>
            ) : (
              <div className="space-y-4">
                {todayProceduresList.map(procedure => (
                  <div key={procedure.id} className="border rounded-md p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
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
                    
                    <div className="mt-3 flex justify-end gap-2">
                      {procedure.status === 'scheduled' && (
                        <Button variant="outline" size="sm">
                          Start Procedure
                        </Button>
                      )}
                      <Button variant="outline" size="sm">View Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-4 flex justify-end">
              <Button className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                View All Procedures
              </Button>
            </div>
          </div>
        </Card>
        
        <Card>
          <Tabs defaultValue="recent">
            <div className="p-4 border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="recent">Recent Procedures</TabsTrigger>
                <TabsTrigger value="rooms">Room Status</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="recent" className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Recently Completed</h3>
              {recentProcedures.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No completed procedures yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentProcedures.map(procedure => (
                    <div key={procedure.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{procedure.patientName}</p>
                        <p className="text-xs text-gray-500">
                          {procedure.procedureName} • {formatDate(procedure.scheduledDate)}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="rooms" className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Procedure Rooms</h3>
              {procedureRooms.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No procedure rooms configured.</p>
              ) : (
                <div className="space-y-3">
                  {procedureRooms.map(room => (
                    <div key={room.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{room.name}</p>
                        <p className="text-xs text-gray-500">
                          {getProcedureTypeDisplay(room.type)} • {room.location}
                        </p>
                      </div>
                      <Badge 
                        variant={
                          room.status === 'available' ? 'default' : 
                          room.status === 'occupied' ? 'secondary' : 
                          room.status === 'maintenance' ? 'destructive' : 'outline'
                        }
                      >
                        {getProcedureTypeDisplay(room.status)}
                      </Badge>
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
          <Calendar className="h-8 w-8 text-purple-400 mb-2" />
          <h3 className="font-medium">Schedule Procedure</h3>
          <p className="text-sm text-gray-500 mt-1">Schedule a new medical procedure</p>
          <Button className="mt-3">Schedule</Button>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Scissors className="h-8 w-8 text-blue-400 mb-2" />
          <h3 className="font-medium">View Procedures</h3>
          <p className="text-sm text-gray-500 mt-1">View all scheduled procedures</p>
          <Button className="mt-3">View All</Button>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <CheckSquare className="h-8 w-8 text-green-400 mb-2" />
          <h3 className="font-medium">Consent Forms</h3>
          <p className="text-sm text-gray-500 mt-1">Manage procedure consent forms</p>
          <Button className="mt-3">Manage Forms</Button>
        </Card>
      </div>
    </div>
  );
};

export default ProceduresDashboard;
