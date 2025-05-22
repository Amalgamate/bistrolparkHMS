import React from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import {
  Users,
  Thermometer,
  Truck,
  FileText,
  Calendar,
  RefreshCw,
  Plus,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wrench
} from 'lucide-react';
import { useMortuary, BodyStatus, StorageType } from '../../context/MortuaryContext';
import { format, isToday, parseISO, differenceInDays } from 'date-fns';

const MortuaryDashboard: React.FC = () => {
  const {
    deceasedPersons,
    storageLocations,
    storageAssignments,
    mortuaryServices,
    releaseRecords,
    deathCertificates,
    getDeceasedPersonsByStatus,
    getStorageLocationsByType,
    getStorageLocationsByStatus,
    getAvailableStorageLocations
  } = useMortuary();

  // Calculate statistics
  const receivedBodies = getDeceasedPersonsByStatus('received').length;
  const inStorageBodies = getDeceasedPersonsByStatus('in_storage').length;
  const preparedBodies = getDeceasedPersonsByStatus('prepared').length;
  const releasedBodies = getDeceasedPersonsByStatus('released').length;

  const refrigeratedStorage = getStorageLocationsByType('refrigerated');
  const refrigeratedCapacity = refrigeratedStorage.reduce((total, location) => total + location.capacity, 0);
  const refrigeratedOccupancy = refrigeratedStorage.reduce((total, location) => total + location.currentOccupancy, 0);

  const frozenStorage = getStorageLocationsByType('frozen');
  const frozenCapacity = frozenStorage.reduce((total, location) => total + location.capacity, 0);
  const frozenOccupancy = frozenStorage.reduce((total, location) => total + location.currentOccupancy, 0);

  const availableStorageLocations = getAvailableStorageLocations();

  // Get recent admissions (last 5)
  const recentAdmissions = [...deceasedPersons]
    .sort((a, b) => {
      return new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime();
    })
    .filter(person => person.status === 'received' || person.status === 'in_storage')
    .slice(0, 5);

  // Get pending releases
  const pendingReleases = deceasedPersons
    .filter(person => person.status === 'prepared')
    .slice(0, 5);

  // Get storage alerts (bodies in storage for more than 7 days)
  const storageAlerts = storageAssignments
    .filter(assignment => {
      const assignmentDate = new Date(assignment.assignmentDate);
      const today = new Date();
      const daysInStorage = differenceInDays(today, assignmentDate);
      return assignment.status === 'active' && daysInStorage > 7;
    })
    .slice(0, 5);

  // Format date
  const formatDate = (date: string) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  // Get status badge
  const getStatusBadge = (status: BodyStatus) => {
    const statusConfig: Record<BodyStatus, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      received: { label: 'Received', variant: 'secondary' },
      in_storage: { label: 'In Storage', variant: 'default' },
      prepared: { label: 'Prepared', variant: 'outline' },
      released: { label: 'Released', variant: 'destructive' },
      transferred: { label: 'Transferred', variant: 'outline' }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Mortuary Dashboard</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-gray-800">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Bodies in Facility</h3>
              <p className="text-2xl font-bold mt-1">{inStorageBodies + receivedBodies + preparedBodies}</p>
            </div>
            <Users className="h-8 w-8 text-gray-800" />
          </div>
          <div className="mt-2 text-xs text-gray-600">
            {receivedBodies} received, {preparedBodies} prepared
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Storage Capacity</h3>
              <p className="text-2xl font-bold mt-1">{refrigeratedOccupancy + frozenOccupancy}/{refrigeratedCapacity + frozenCapacity}</p>
            </div>
            <Thermometer className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-blue-600">
            {availableStorageLocations.length} available locations
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Released Bodies</h3>
              <p className="text-2xl font-bold mt-1">{releasedBodies}</p>
            </div>
            <Truck className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-green-600">
            {releaseRecords.length} release records
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Death Certificates</h3>
              <p className="text-2xl font-bold mt-1">{deathCertificates.length}</p>
            </div>
            <FileText className="h-8 w-8 text-amber-500" />
          </div>
          <div className="mt-2 text-xs text-amber-600">
            {deathCertificates.filter(cert => cert.status === 'issued').length} issued
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <div className="p-4 border-b">
            <h3 className="font-medium">Recent Admissions</h3>
          </div>
          <div className="p-4">
            {recentAdmissions.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No recent admissions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentAdmissions.map(person => (
                  <div key={person.id} className="border rounded-md p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{person.firstName} {person.lastName}</h4>
                        <p className="text-sm text-gray-500">
                          {formatDate(person.dateOfDeath)} • {person.causeOfDeath}
                        </p>
                      </div>
                      {getStatusBadge(person.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Age:</span>
                          <span className="text-sm">
                            {differenceInDays(
                              new Date(person.dateOfDeath),
                              new Date(person.dateOfBirth)
                            ) / 365.25 | 0} years
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Gender:</span>
                          <span className="text-sm">{person.gender}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Physician:</span>
                          <span className="text-sm">{person.attendingPhysician}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Place of Death:</span>
                          <span className="text-sm">{person.placeOfDeath}</span>
                        </div>
                      </div>
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
                <Users className="h-4 w-4" />
                View All Deceased
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <Tabs defaultValue="pending">
            <div className="p-4 border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pending">Pending Releases</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pending" className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Bodies Ready for Release</h3>
              {pendingReleases.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No bodies pending release.</p>
              ) : (
                <div className="space-y-3">
                  {pendingReleases.map(person => (
                    <div key={person.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{person.firstName} {person.lastName}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(person.dateOfDeath)} • {person.causeOfDeath}
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Process</Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="alerts" className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Storage Alerts</h3>
              {storageAlerts.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No storage alerts.</p>
              ) : (
                <div className="space-y-3">
                  {storageAlerts.map(assignment => {
                    const person = deceasedPersons.find(p => p.id === assignment.deceasedPersonId);
                    const location = storageLocations.find(l => l.id === assignment.storageLocationId);
                    const daysInStorage = differenceInDays(new Date(), new Date(assignment.assignmentDate));

                    return person && location ? (
                      <div key={assignment.id} className="flex justify-between items-center p-2 rounded-md bg-red-50 hover:bg-red-100">
                        <div>
                          <p className="font-medium">{person.firstName} {person.lastName}</p>
                          <p className="text-xs text-gray-500">
                            {location.name} • {daysInStorage} days in storage
                          </p>
                        </div>
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Alert</span>
                        </Badge>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Users className="h-8 w-8 text-gray-800 mb-2" />
          <h3 className="font-medium">Register Deceased</h3>
          <p className="text-sm text-gray-500 mt-1">Register a new deceased person</p>
          <Button className="mt-3">Register</Button>
        </Card>

        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Thermometer className="h-8 w-8 text-blue-500 mb-2" />
          <h3 className="font-medium">Assign Storage</h3>
          <p className="text-sm text-gray-500 mt-1">Assign storage location to a body</p>
          <Button className="mt-3">Assign</Button>
        </Card>

        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Truck className="h-8 w-8 text-green-500 mb-2" />
          <h3 className="font-medium">Process Release</h3>
          <p className="text-sm text-gray-500 mt-1">Process body release</p>
          <Button className="mt-3">Process</Button>
        </Card>
      </div>
    </div>
  );
};

export default MortuaryDashboard;
