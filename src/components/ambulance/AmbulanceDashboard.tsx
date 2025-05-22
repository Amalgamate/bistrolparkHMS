import React from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import {
  Truck,
  Users,
  AlertTriangle,
  Calendar,
  Clock,
  FileText,
  RefreshCw,
  PhoneCall,
  Plus,
  ArrowRight,
  MapPin,
  Wrench,
  Activity
} from 'lucide-react';
import { useAmbulance, AmbulanceStatus, CallStatus, CallPriority } from '../../context/AmbulanceContext';
import { format, differenceInMinutes } from 'date-fns';

const AmbulanceDashboard: React.FC = () => {
  const {
    ambulances,
    crewMembers,
    calls,
    maintenanceRecords,
    getAmbulancesByStatus,
    getCrewMembersByStatus,
    getCallsByStatus,
    getCallsByPriority,
    getActiveCallsCount,
    getUpcomingMaintenance
  } = useAmbulance();

  // Calculate statistics
  const availableAmbulances = getAmbulancesByStatus('available').length;
  const dispatchedAmbulances = getAmbulancesByStatus('dispatched').length +
                              getAmbulancesByStatus('en_route').length +
                              getAmbulancesByStatus('at_scene').length +
                              getAmbulancesByStatus('transporting').length;
  const outOfServiceAmbulances = getAmbulancesByStatus('out_of_service').length;

  const onDutyCrew = getCrewMembersByStatus('on_duty').length;
  const offDutyCrew = getCrewMembersByStatus('off_duty').length;
  const onLeaveCrew = getCrewMembersByStatus('on_leave').length;

  const pendingCalls = getCallsByStatus('pending').length;
  const activeCalls = getActiveCallsCount();
  const emergencyCalls = getCallsByPriority('emergency').length;

  const upcomingMaintenance = getUpcomingMaintenance().length;

  // Get recent calls (last 5)
  const recentCalls = [...calls]
    .sort((a, b) => new Date(b.callTime).getTime() - new Date(a.callTime).getTime())
    .slice(0, 5);

  // Get active ambulances (dispatched, en route, at scene, transporting)
  const activeAmbulances = ambulances.filter(ambulance =>
    ['dispatched', 'en_route', 'at_scene', 'transporting', 'at_hospital'].includes(ambulance.status)
  ).slice(0, 5);

  // Format date
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy h:mm a');
  };

  // Format time elapsed
  const getTimeElapsed = (startTime: string) => {
    const minutes = differenceInMinutes(new Date(), new Date(startTime));
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
  };

  // Get status badge for ambulance
  const getAmbulanceStatusBadge = (status: AmbulanceStatus) => {
    const statusConfig: Record<AmbulanceStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      available: { label: 'Available', variant: 'default' },
      dispatched: { label: 'Dispatched', variant: 'secondary' },
      en_route: { label: 'En Route', variant: 'secondary' },
      at_scene: { label: 'At Scene', variant: 'secondary' },
      transporting: { label: 'Transporting', variant: 'secondary' },
      at_hospital: { label: 'At Hospital', variant: 'secondary' },
      returning: { label: 'Returning', variant: 'outline' },
      out_of_service: { label: 'Out of Service', variant: 'destructive' },
      standby: { label: 'Standby', variant: 'outline' }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Get status badge for call
  const getCallStatusBadge = (status: CallStatus) => {
    const statusConfig: Record<CallStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Pending', variant: 'outline' },
      dispatched: { label: 'Dispatched', variant: 'secondary' },
      en_route: { label: 'En Route', variant: 'secondary' },
      at_scene: { label: 'At Scene', variant: 'secondary' },
      transporting: { label: 'Transporting', variant: 'secondary' },
      at_hospital: { label: 'At Hospital', variant: 'secondary' },
      completed: { label: 'Completed', variant: 'default' },
      cancelled: { label: 'Cancelled', variant: 'destructive' }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Get priority badge for call
  const getCallPriorityBadge = (priority: CallPriority) => {
    const priorityConfig: Record<CallPriority, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      emergency: { label: 'Emergency', variant: 'destructive' },
      urgent: { label: 'Urgent', variant: 'secondary' },
      non_urgent: { label: 'Non-Urgent', variant: 'outline' },
      scheduled: { label: 'Scheduled', variant: 'default' }
    };

    const config = priorityConfig[priority];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Ambulance Dashboard</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ambulances</h3>
              <p className="text-2xl font-bold mt-1">{ambulances.length}</p>
            </div>
            <Truck className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-green-600">
            {availableAmbulances} available, {dispatchedAmbulances} dispatched, {outOfServiceAmbulances} out of service
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Crew Members</h3>
              <p className="text-2xl font-bold mt-1">{crewMembers.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-blue-600">
            {onDutyCrew} on duty, {offDutyCrew} off duty, {onLeaveCrew} on leave
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Active Calls</h3>
              <p className="text-2xl font-bold mt-1">{activeCalls}</p>
            </div>
            <PhoneCall className="h-8 w-8 text-amber-500" />
          </div>
          <div className="mt-2 text-xs text-amber-600">
            {pendingCalls} pending, {emergencyCalls} emergency
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Maintenance</h3>
              <p className="text-2xl font-bold mt-1">{upcomingMaintenance}</p>
            </div>
            <Wrench className="h-8 w-8 text-purple-500" />
          </div>
          <div className="mt-2 text-xs text-purple-600">
            Upcoming scheduled maintenance
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <div className="p-4 border-b">
            <h3 className="font-medium">Active Ambulances</h3>
          </div>
          <div className="p-4">
            {activeAmbulances.length === 0 ? (
              <div className="text-center py-8">
                <Truck className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No active ambulances at the moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeAmbulances.map(ambulance => {
                  const call = calls.find(c => c.id === ambulance.currentCall);

                  return (
                    <div key={ambulance.id} className="border rounded-md p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{ambulance.vehicleNumber}</h4>
                          <p className="text-sm text-gray-500">{ambulance.make} {ambulance.model}</p>
                        </div>
                        {getAmbulanceStatusBadge(ambulance.status)}
                      </div>

                      {call && (
                        <div className="mt-2 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Call:</span>
                            <span className="text-sm">{call.callNumber}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Priority:</span>
                            {getCallPriorityBadge(call.priority)}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">Location:</span>
                            <span className="text-sm truncate max-w-[200px]">{call.location.address}</span>
                          </div>
                          {call.dispatchTime && (
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Time Elapsed:</span>
                              <span className="text-sm">{getTimeElapsed(call.dispatchTime)}</span>
                            </div>
                          )}
                        </div>
                      )}

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
                <Truck className="h-4 w-4" />
                View All Ambulances
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <Tabs defaultValue="calls">
            <div className="p-4 border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calls">Recent Calls</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="calls" className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Recent Emergency Calls</h3>
              {recentCalls.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No recent calls.</p>
              ) : (
                <div className="space-y-3">
                  {recentCalls.map(call => (
                    <div key={call.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{call.callNumber}</p>
                        <p className="text-xs text-gray-500">
                          {call.location.address.substring(0, 30)}
                          {call.location.address.length > 30 ? '...' : ''}
                        </p>
                      </div>
                      <div className="text-right">
                        {getCallPriorityBadge(call.priority)}
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(call.callTime)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4" />
                  View All Calls
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Upcoming Maintenance</h3>
              {upcomingMaintenance === 0 ? (
                <p className="text-center text-gray-500 py-4">No upcoming maintenance.</p>
              ) : (
                <div className="space-y-3">
                  {getUpcomingMaintenance().slice(0, 5).map(maintenance => {
                    const ambulance = ambulances.find(a => a.id === maintenance.ambulanceId);

                    return (
                      <div key={maintenance.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                        <div>
                          <p className="font-medium">{ambulance?.vehicleNumber || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">
                            {maintenance.type.charAt(0).toUpperCase() + maintenance.type.slice(1)}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="outline" className="bg-purple-50 text-purple-800">
                            {format(new Date(maintenance.scheduledDate), 'MMM d')}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {maintenance.description.substring(0, 20)}
                            {maintenance.description.length > 20 ? '...' : ''}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  View All Maintenance
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <PhoneCall className="h-8 w-8 text-amber-400 mb-2" />
          <h3 className="font-medium">New Emergency Call</h3>
          <p className="text-sm text-gray-500 mt-1">Create a new emergency call</p>
          <Button className="mt-3">New Call</Button>
        </Card>

        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Truck className="h-8 w-8 text-green-400 mb-2" />
          <h3 className="font-medium">Dispatch Ambulance</h3>
          <p className="text-sm text-gray-500 mt-1">Dispatch an ambulance to a call</p>
          <Button className="mt-3">Dispatch</Button>
        </Card>

        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Activity className="h-8 w-8 text-blue-400 mb-2" />
          <h3 className="font-medium">Call Status</h3>
          <p className="text-sm text-gray-500 mt-1">Update emergency call status</p>
          <Button className="mt-3">Update Status</Button>
        </Card>
      </div>
    </div>
  );
};

export default AmbulanceDashboard;
