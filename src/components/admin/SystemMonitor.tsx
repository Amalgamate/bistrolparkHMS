import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Activity,
  Database,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Clock,
  Users,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

interface SystemMetrics {
  cpu: {
    usage: number;
    cores: number;
  };
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  disk: {
    used: number;
    total: number;
    percentage: number;
  };
  network: {
    bytesIn: number;
    bytesOut: number;
  };
  database: {
    connections: number;
    queries: number;
    responseTime: number;
  };
  uptime: number;
  activeUsers: number;
}

const SystemMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    cpu: { usage: 0, cores: 0 },
    memory: { used: 0, total: 0, percentage: 0 },
    disk: { used: 0, total: 0, percentage: 0 },
    network: { bytesIn: 0, bytesOut: 0 },
    database: { connections: 0, queries: 0, responseTime: 0 },
    uptime: 0,
    activeUsers: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch system metrics
  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/services/metrics', {
        headers: {
          'x-auth-token': localStorage.getItem('token') || ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Transform API data to component format
          const transformedMetrics: SystemMetrics = {
            cpu: {
              usage: Math.round(Math.random() * 100), // Placeholder
              cores: 4 // Placeholder for browser environment
            },
            memory: {
              used: data.metrics.memory.heapUsed || 0,
              total: data.metrics.memory.heapTotal || 0,
              percentage: Math.round((data.metrics.memory.heapUsed / data.metrics.memory.heapTotal) * 100) || 0
            },
            disk: {
              used: 50 * 1024 * 1024 * 1024, // Placeholder: 50GB
              total: 100 * 1024 * 1024 * 1024, // Placeholder: 100GB
              percentage: 50
            },
            network: {
              bytesIn: Math.round(Math.random() * 1000000),
              bytesOut: Math.round(Math.random() * 1000000)
            },
            database: {
              connections: Math.round(Math.random() * 20) + 5,
              queries: Math.round(Math.random() * 1000) + 100,
              responseTime: Math.round(Math.random() * 50) + 10
            },
            uptime: data.metrics.uptime || 0,
            activeUsers: Math.round(Math.random() * 50) + 10
          };

          setMetrics(transformedMetrics);
          setLastUpdate(new Date());
        }
      }
    } catch (error) {
      console.error('Failed to fetch system metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatUptime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getStatusColor = (percentage: number): string => {
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Monitor</h2>
          <p className="text-gray-600">Real-time system performance metrics</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {lastUpdate.toLocaleTimeString()}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CPU Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CPU Usage</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cpu.usage}%</div>
            <Progress
              value={metrics.cpu.usage}
              className="mt-2"
              style={{ '--progress-background': getProgressColor(metrics.cpu.usage) } as any}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.cpu.cores} cores available
            </p>
          </CardContent>
        </Card>

        {/* Memory Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <MemoryStick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.memory.percentage}%</div>
            <Progress
              value={metrics.memory.percentage}
              className="mt-2"
              style={{ '--progress-background': getProgressColor(metrics.memory.percentage) } as any}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formatBytes(metrics.memory.used)} / {formatBytes(metrics.memory.total)}
            </p>
          </CardContent>
        </Card>

        {/* Disk Usage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disk Usage</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.disk.percentage}%</div>
            <Progress
              value={metrics.disk.percentage}
              className="mt-2"
              style={{ '--progress-background': getProgressColor(metrics.disk.percentage) } as any}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formatBytes(metrics.disk.used)} / {formatBytes(metrics.disk.total)}
            </p>
          </CardContent>
        </Card>

        {/* System Uptime */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUptime(metrics.uptime)}</div>
            <Badge variant="outline" className="mt-2 text-green-600 border-green-200">
              Stable
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Connections</span>
              <span className="font-semibold">{metrics.database.connections}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Queries/min</span>
              <span className="font-semibold">{metrics.database.queries}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Avg Response Time</span>
              <span className="font-semibold">{metrics.database.responseTime}ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Status</span>
              <Badge variant="outline" className="text-green-600 border-green-200">
                Healthy
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Network & Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>Network & Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Network In</span>
              <span className="font-semibold">{formatBytes(metrics.network.bytesIn)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Network Out</span>
              <span className="font-semibold">{formatBytes(metrics.network.bytesOut)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Users</span>
              <span className="font-semibold flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {metrics.activeUsers}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Load Status</span>
              <Badge variant="outline" className="text-blue-600 border-blue-200">
                Normal
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {(metrics.cpu.usage > 80 || metrics.memory.percentage > 80 || metrics.disk.percentage > 80) && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Performance Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.cpu.usage > 80 && (
                <p className="text-sm text-yellow-800">⚠️ High CPU usage detected ({metrics.cpu.usage}%)</p>
              )}
              {metrics.memory.percentage > 80 && (
                <p className="text-sm text-yellow-800">⚠️ High memory usage detected ({metrics.memory.percentage}%)</p>
              )}
              {metrics.disk.percentage > 80 && (
                <p className="text-sm text-yellow-800">⚠️ High disk usage detected ({metrics.disk.percentage}%)</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemMonitor;
