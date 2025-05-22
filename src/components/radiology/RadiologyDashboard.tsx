import React from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';
import {
  FileImage,
  Users,
  Calendar,
  Clock,
  FileText,
  RefreshCw,
  Plus,
  ArrowRight,
  Zap,
  Clipboard,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useRadiology } from '../../context/RadiologyContext';
import { format } from 'date-fns';

const RadiologyDashboard: React.FC = () => {
  const { 
    radiologyRequests, 
    radiologyTests,
    getRadiologyRequestsByStatus
  } = useRadiology();
  
  // Calculate statistics
  const pendingRequests = getRadiologyRequestsByStatus('pending').length;
  const inProgressRequests = getRadiologyRequestsByStatus('in_progress').length;
  const completedRequests = getRadiologyRequestsByStatus('completed').length;
  const cancelledRequests = getRadiologyRequestsByStatus('cancelled').length;
  
  const totalRequests = radiologyRequests.length;
  const todayRequests = radiologyRequests.filter(
    req => req.requestDate === format(new Date(), 'yyyy-MM-dd')
  ).length;
  
  // Get urgent requests
  const urgentRequests = radiologyRequests.filter(
    req => req.priority === 'urgent' || req.priority === 'emergency'
  );
  
  // Get recent requests (last 5)
  const recentRequests = [...radiologyRequests]
    .sort((a, b) => {
      const dateA = new Date(`${a.requestDate}T${a.requestTime}`);
      const dateB = new Date(`${b.requestDate}T${b.requestTime}`);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5);
  
  // Get test categories and count
  const testCategories = [...new Set(radiologyTests.map(test => test.category))];
  const testCategoryCounts = testCategories.map(category => ({
    category,
    count: radiologyTests.filter(test => test.category === category).length
  }));
  
  // Format date
  const formatDate = (date: string, time: string) => {
    return format(new Date(`${date}T${time}`), 'MMM d, yyyy h:mm a');
  };
  
  // Get priority badge
  const getPriorityBadge = (priority: 'normal' | 'urgent' | 'emergency') => {
    const priorityConfig: Record<string, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      normal: { label: 'Normal', variant: 'outline' },
      urgent: { label: 'Urgent', variant: 'secondary' },
      emergency: { label: 'Emergency', variant: 'destructive' }
    };
    
    const config = priorityConfig[priority];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };
  
  // Get status badge
  const getStatusBadge = (status: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    const statusConfig: Record<string, { label: string, variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      pending: { label: 'Pending', variant: 'outline' },
      in_progress: { label: 'In Progress', variant: 'secondary' },
      completed: { label: 'Completed', variant: 'default' },
      cancelled: { label: 'Cancelled', variant: 'destructive' }
    };
    
    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Radiology Dashboard</h2>
        <Button variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Requests</h3>
              <p className="text-2xl font-bold mt-1">{totalRequests}</p>
            </div>
            <FileImage className="h-8 w-8 text-blue-500" />
          </div>
          <div className="mt-2 text-xs text-blue-600">
            {todayRequests} new requests today
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="text-2xl font-bold mt-1">{completedRequests}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <div className="mt-2 text-xs text-green-600">
            {Math.round((completedRequests / totalRequests) * 100) || 0}% completion rate
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-amber-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">In Progress</h3>
              <p className="text-2xl font-bold mt-1">{inProgressRequests}</p>
            </div>
            <Clock className="h-8 w-8 text-amber-500" />
          </div>
          <div className="mt-2 text-xs text-amber-600">
            {pendingRequests} pending requests
          </div>
        </Card>
        
        <Card className="p-4 border-l-4 border-red-500">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Urgent</h3>
              <p className="text-2xl font-bold mt-1">{urgentRequests.length}</p>
            </div>
            <Zap className="h-8 w-8 text-red-500" />
          </div>
          <div className="mt-2 text-xs text-red-600">
            {urgentRequests.filter(req => req.status === 'pending').length} pending urgent requests
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <div className="p-4 border-b">
            <h3 className="font-medium">Recent Radiology Requests</h3>
          </div>
          <div className="p-4">
            {recentRequests.length === 0 ? (
              <div className="text-center py-8">
                <FileImage className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                <p className="text-gray-500">No recent radiology requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentRequests.map(request => (
                  <div key={request.id} className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium">{request.patientName}</h4>
                        <p className="text-sm text-gray-500">
                          {request.patientType === 'inpatient' ? 'Inpatient' : 
                           request.patientType === 'outpatient' ? 'Outpatient' : 'Walk-in'}
                        </p>
                      </div>
                      {getPriorityBadge(request.priority)}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Tests:</span>
                        <span className="text-sm">{request.tests.map(t => t.testName).join(', ')}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Requested by:</span>
                        <span className="text-sm">{request.doctorName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Date:</span>
                        <span className="text-sm">{formatDate(request.requestDate, request.requestTime)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Status:</span>
                        {getStatusBadge(request.status)}
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
                <FileText className="h-4 w-4" />
                View All Requests
              </Button>
            </div>
          </div>
        </Card>
        
        <Card>
          <Tabs defaultValue="categories">
            <div className="p-4 border-b">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="categories">Test Categories</TabsTrigger>
                <TabsTrigger value="urgent">Urgent Requests</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="categories" className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Available Test Categories</h3>
              {testCategoryCounts.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No test categories available.</p>
              ) : (
                <div className="space-y-3">
                  {testCategoryCounts.map(({ category, count }) => (
                    <div key={category} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{category}</p>
                        <p className="text-xs text-gray-500">
                          {count} {count === 1 ? 'test' : 'tests'} available
                        </p>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Test
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="urgent" className="p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Urgent Requests</h3>
              {urgentRequests.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No urgent requests.</p>
              ) : (
                <div className="space-y-3">
                  {urgentRequests.slice(0, 5).map(request => (
                    <div key={request.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                      <div>
                        <p className="font-medium">{request.patientName}</p>
                        <p className="text-xs text-gray-500">
                          {request.tests.map(t => t.testName).join(', ')}
                        </p>
                      </div>
                      <div className="text-right">
                        {getPriorityBadge(request.priority)}
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(request.requestDate, request.requestTime)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  View All Urgent
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Clipboard className="h-8 w-8 text-blue-400 mb-2" />
          <h3 className="font-medium">New Request</h3>
          <p className="text-sm text-gray-500 mt-1">Create a new radiology request</p>
          <Button className="mt-3">New Request</Button>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <Calendar className="h-8 w-8 text-green-400 mb-2" />
          <h3 className="font-medium">Schedule Examination</h3>
          <p className="text-sm text-gray-500 mt-1">Schedule a radiology examination</p>
          <Button className="mt-3">Schedule</Button>
        </Card>
        
        <Card className="p-4 flex flex-col items-center justify-center text-center">
          <FileText className="h-8 w-8 text-amber-400 mb-2" />
          <h3 className="font-medium">Create Report</h3>
          <p className="text-sm text-gray-500 mt-1">Create a new radiology report</p>
          <Button className="mt-3">New Report</Button>
        </Card>
      </div>
    </div>
  );
};

export default RadiologyDashboard;
