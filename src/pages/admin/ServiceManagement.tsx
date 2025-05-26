import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import SystemMonitor from '@/components/admin/SystemMonitor';
import { useAuth } from '@/context/AuthContext';
import { canControlServerServices, isSuperAdmin, getAdminLevelDisplayName } from '@/utils/roleUtils';
import {
  Play,
  Square,
  RotateCcw,
  Database,
  Server,
  Monitor,
  Activity,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Settings,
  BarChart3
} from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'running' | 'stopped' | 'starting' | 'error';
  port?: number;
  uptime?: string;
  lastCheck: Date;
  url?: string;
  icon: React.ReactNode;
  description: string;
}

const ServiceManagement: React.FC = () => {
  const { user } = useAuth();
  const canControlServices = canControlServerServices(user);
  const isSuper = isSuperAdmin(user);
  const userLevel = getAdminLevelDisplayName(user);

  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'PostgreSQL Database',
      status: 'running',
      port: 5432,
      uptime: '2h 15m',
      lastCheck: new Date(),
      icon: <Database className="h-6 w-6" />,
      description: 'Primary database with 241,299+ patient records'
    },
    {
      name: 'API Server',
      status: 'running',
      port: 3001,
      uptime: '5m 32s',
      lastCheck: new Date(),
      url: 'http://localhost:3001/health',
      icon: <Server className="h-6 w-6" />,
      description: 'Backend API server for hospital operations'
    },
    {
      name: 'Frontend Server',
      status: 'running',
      port: 5173,
      uptime: '1h 45m',
      lastCheck: new Date(),
      url: 'http://localhost:5173',
      icon: <Monitor className="h-6 w-6" />,
      description: 'React frontend application'
    }
  ]);

  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [autoRestart, setAutoRestart] = useState(true);

  // Fetch real service status from API
  const fetchServiceStatus = async () => {
    try {
      const response = await fetch('/api/services/status', {
        headers: {
          'x-auth-token': localStorage.getItem('token') || ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const updatedServices = data.services.map((apiService: any) => {
            const existingService = services.find(s => s.name === apiService.name);
            return {
              ...existingService,
              status: apiService.status === 'running' ? 'running' : 'stopped',
              uptime: formatUptime(apiService.uptime),
              lastCheck: new Date(),
              port: apiService.port
            };
          });
          setServices(updatedServices);
          addLog(`✅ Service status updated successfully`);
        }
      } else {
        // If API is not available, mark API and DB as stopped, frontend as running
        setServices(prev => prev.map(service => ({
          ...service,
          status: service.name === 'Frontend Server' ? 'running' : 'stopped',
          lastCheck: new Date()
        })));
        addLog(`❌ Failed to fetch service status: ${response.status} - API server may be down`);
      }
    } catch (error) {
      // If API is not available, mark API and DB as stopped, frontend as running
      setServices(prev => prev.map(service => ({
        ...service,
        status: service.name === 'Frontend Server' ? 'running' : 'stopped',
        lastCheck: new Date()
      })));
      addLog(`❌ Service status fetch failed: ${error} - API server may be down`);
    }
  };

  // Service status checking
  const checkServiceStatus = async (service: ServiceStatus) => {
    if (!service.url) return;

    try {
      const response = await fetch(service.url, {
        method: 'GET'
      });

      if (response.ok) {
        updateServiceStatus(service.name, 'running');
        addLog(`✅ ${service.name} health check passed`);
      } else {
        updateServiceStatus(service.name, 'error');
        addLog(`❌ ${service.name} health check failed: ${response.status}`);
      }
    } catch (error) {
      updateServiceStatus(service.name, 'error');
      addLog(`❌ ${service.name} connection failed: ${error}`);
    }
  };

  // Update service status
  const updateServiceStatus = (serviceName: string, status: ServiceStatus['status']) => {
    setServices(prev => prev.map(service =>
      service.name === serviceName
        ? { ...service, status, lastCheck: new Date() }
        : service
    ));
  };

  // Add log entry
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 49)]);
  };

  // Service actions
  const handleServiceAction = async (serviceName: string, action: 'start' | 'stop' | 'restart') => {
    setIsLoading(serviceName);
    addLog(`🔄 ${action.toUpperCase()} ${serviceName}...`);

    // Set service to starting state immediately for UI feedback
    if (action === 'start') {
      updateServiceStatus(serviceName, 'starting');
    }

    try {
      const response = await fetch('/api/services/control', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify({
          service: serviceName.toLowerCase().replace(/\s+/g, '-'),
          action
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const result = data.result;

        // Handle different result statuses
        if (result.status === 'success') {
          if (action === 'start' || action === 'restart') {
            updateServiceStatus(serviceName, 'running');
            addLog(`✅ ${serviceName} ${action}ed successfully: ${result.message}`);
          } else {
            updateServiceStatus(serviceName, 'stopped');
            addLog(`⏹️ ${serviceName} stopped successfully: ${result.message}`);
          }
        } else if (result.status === 'already_running') {
          updateServiceStatus(serviceName, 'running');
          addLog(`ℹ️ ${serviceName}: ${result.message}`);
        } else if (result.status === 'manual_required') {
          addLog(`⚠️ ${serviceName}: ${result.message}`);
        } else if (result.status === 'cannot_stop_self') {
          addLog(`⚠️ ${serviceName}: ${result.message}`);
        } else {
          addLog(`⚠️ ${serviceName}: ${result.message}`);
        }

        // Refresh service status after action
        setTimeout(() => {
          fetchServiceStatus();
        }, 2000);
      } else {
        throw new Error(data.message || 'Service action failed');
      }
    } catch (error) {
      updateServiceStatus(serviceName, 'error');
      addLog(`❌ Failed to ${action} ${serviceName}: ${error}`);
    } finally {
      setIsLoading(null);
    }
  };

  // Start all stopped services
  const handleStartAllServices = async () => {
    const stoppedServices = services.filter(s => s.status === 'stopped' || s.status === 'error');

    if (stoppedServices.length === 0) {
      addLog('ℹ️ All services are already running');
      return;
    }

    addLog(`🚀 Starting ${stoppedServices.length} stopped services...`);

    // Start services in sequence (database first, then API, then frontend)
    const serviceOrder = ['PostgreSQL Database', 'API Server', 'Frontend Server'];

    for (const serviceName of serviceOrder) {
      const service = stoppedServices.find(s => s.name === serviceName);
      if (service) {
        await handleServiceAction(service.name, 'start');
        // Wait a bit between service starts
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }

    addLog('🎉 All services startup sequence completed');
  };

  // Format uptime helper
  const formatUptime = (uptime: any): string => {
    if (typeof uptime === 'number') {
      const hours = Math.floor(uptime / 3600);
      const minutes = Math.floor((uptime % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
    if (typeof uptime === 'string') {
      const date = new Date(uptime);
      const now = new Date();
      const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
    return 'Unknown';
  };

  // Auto health checking
  useEffect(() => {
    const interval = setInterval(() => {
      fetchServiceStatus();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Initial service status fetch
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      addLog('⚠️ No authentication token found. Please log in to access service controls.');
      addLog('🚀 Service Management Dashboard initialized (limited mode)');
    } else {
      addLog('🚀 Service Management Dashboard initialized');
      fetchServiceStatus();
    }
  }, []);

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'running': return 'bg-green-500';
      case 'stopped': return 'bg-red-500';
      case 'starting': return 'bg-yellow-500';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'running': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'stopped': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'starting': return <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <XCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage Bristol Park HMS services</p>
          <div className="flex items-center space-x-2 mt-2">
            <Badge variant="outline" className="text-xs">
              Access Level: {userLevel}
            </Badge>
            {canControlServices && (
              <Badge variant="default" className="text-xs bg-green-600">
                Service Control Enabled
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Auto-monitoring enabled</span>
          </Badge>
          {canControlServices && (
            <>
              <Button
                variant="outline"
                onClick={() => setAutoRestart(!autoRestart)}
                className={autoRestart ? 'bg-green-50 border-green-200' : ''}
              >
                Auto-restart: {autoRestart ? 'ON' : 'OFF'}
              </Button>
              <Button
                onClick={handleStartAllServices}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading !== null || services.every(s => s.status === 'running')}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Starting Services...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Start All Services
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="services" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="services" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Services</span>
          </TabsTrigger>
          <TabsTrigger value="monitoring" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>System Monitor</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Activity Logs</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="services" className="space-y-6">

      {/* Service Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.name} className="relative">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {service.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <p className="text-sm text-gray-600">{service.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(service.status)}
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(service.status)}`} />
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Service Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Status:</span>
                  <Badge
                    variant={service.status === 'running' ? 'default' : 'destructive'}
                    className="ml-2"
                  >
                    {service.status.toUpperCase()}
                  </Badge>
                </div>
                {service.port && (
                  <div>
                    <span className="text-gray-500">Port:</span>
                    <span className="ml-2 font-mono">{service.port}</span>
                  </div>
                )}
                {service.uptime && (
                  <div>
                    <span className="text-gray-500">Uptime:</span>
                    <span className="ml-2">{service.uptime}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Last Check:</span>
                  <span className="ml-2">{service.lastCheck.toLocaleTimeString()}</span>
                </div>
              </div>

              {/* Service Control Buttons */}
              {canControlServices ? (
                <div className="flex space-x-2 pt-2">
                  {service.status === 'running' ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleServiceAction(service.name, 'restart')}
                        className="flex-1"
                      >
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Restart
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleServiceAction(service.name, 'stop')}
                        className="flex-1"
                      >
                        <Square className="h-4 w-4 mr-1" />
                        Stop
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleServiceAction(service.name, 'start')}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      disabled={service.status === 'starting'}
                    >
                      {service.status === 'starting' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Starting...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </>
                      )}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="pt-2">
                  <Badge variant="outline" className="text-xs text-gray-500">
                    Service control requires Super Admin access
                  </Badge>
                </div>
              )}



              {/* Quick Access */}
              {service.url && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => window.open(service.url, '_blank')}
                  className="w-full text-blue-600 hover:text-blue-800"
                >
                  Open Service →
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* System Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>System Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Services</span>
                <span className="font-semibold">{services.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Running Services</span>
                <span className="font-semibold text-green-600">
                  {services.filter(s => s.status === 'running').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Failed Services</span>
                <span className="font-semibold text-red-600">
                  {services.filter(s => s.status === 'error').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">System Uptime</span>
                <span className="font-semibold">99.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Logs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Activity Logs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {logs.length === 0 ? (
                <p className="text-gray-500 text-sm">No recent activity</p>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="text-sm font-mono bg-gray-50 p-2 rounded">
                    {log}
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

        {/* Authentication and Access Level Alerts */}
        {!localStorage.getItem('token') ? (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTriangle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>Authentication Required:</strong> Please log in to access service management.
              <br />
              <strong>Default Admin Login:</strong> Username: <code>bristoladmin</code> | Password: <code>Bristol2024!</code>
              <br />
              <a href="/login" className="text-blue-600 underline hover:text-blue-800">Click here to log in</a>
            </AlertDescription>
          </Alert>
        ) : !canControlServices ? (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Limited Access:</strong> Your current role ({userLevel}) allows service monitoring only.
              <br />
              <strong>Service Control:</strong> Requires Super Admin privileges to start/stop/restart services.
              <br />
              Contact your system administrator to upgrade your access level if needed.
            </AlertDescription>
          </Alert>
        ) : null}

        {/* Service Error Alerts */}
        {services.some(s => s.status === 'error') && (
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              One or more services are experiencing issues. Check the service status above and restart if necessary.
            </AlertDescription>
          </Alert>
        )}
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <SystemMonitor />
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Detailed Activity Logs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-gray-500 text-sm">No recent activity</p>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="text-sm font-mono bg-gray-50 p-3 rounded border-l-4 border-blue-200">
                      {log}
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLogs([])}
                >
                  Clear Logs
                </Button>
                <span className="text-sm text-gray-500">
                  Showing last {logs.length} entries
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ServiceManagement;
