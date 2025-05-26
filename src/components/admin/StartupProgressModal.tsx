import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';

interface ServiceStatus {
  name: string;
  port: number;
  status: 'checking' | 'starting' | 'running' | 'ready' | 'error' | 'failed';
  message: string;
  icon: string;
  error?: string;
}

interface StartupProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const StartupProgressModal: React.FC<StartupProgressModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [services, setServices] = useState<ServiceStatus[]>([
    {
      name: 'PostgreSQL Database',
      port: 5432,
      status: 'checking',
      message: 'Checking database connection...',
      icon: '🗄️'
    },
    {
      name: 'API Server',
      port: 3001,
      status: 'checking',
      message: 'Checking API server...',
      icon: '🚀'
    },
    {
      name: 'Frontend Server',
      port: 5173,
      status: 'checking',
      message: 'Checking frontend server...',
      icon: '🌐'
    }
  ]);

  const [overallStatus, setOverallStatus] = useState<'starting' | 'ready' | 'error'>('starting');
  const [showRetry, setShowRetry] = useState(false);

  // Check service health
  const checkService = async (port: number): Promise<boolean> => {
    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`http://localhost:${port}/api/health`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      // For frontend, just check if it responds
      if (port === 5173) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const response = await fetch(`http://localhost:${port}`, {
            method: 'GET',
            signal: controller.signal
          });

          clearTimeout(timeoutId);
          return true; // Any response means it's running
        } catch {
          return false;
        }
      }
      return false;
    }
  };

  // Update service status
  const updateServiceStatus = (index: number, updates: Partial<ServiceStatus>) => {
    setServices(prev => prev.map((service, i) =>
      i === index ? { ...service, ...updates } : service
    ));
  };

  // Check all services
  const checkAllServices = async () => {
    setOverallStatus('starting');
    setShowRetry(false);

    for (let i = 0; i < services.length; i++) {
      const service = services[i];

      updateServiceStatus(i, {
        status: 'checking',
        message: `Checking ${service.name.toLowerCase()}...`
      });

      const isRunning = await checkService(service.port);

      if (isRunning) {
        updateServiceStatus(i, {
          status: 'ready',
          message: 'Service is running and responding'
        });
      } else {
        updateServiceStatus(i, {
          status: 'error',
          message: 'Service is not responding',
          error: `Cannot connect to port ${service.port}`
        });
      }

      // Small delay between checks
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // Check overall status
    const currentServices = services;
    const allReady = currentServices.every(s => s.status === 'ready');
    const anyError = currentServices.some(s => s.status === 'error' || s.status === 'failed');

    if (allReady) {
      setOverallStatus('ready');
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else if (anyError) {
      setOverallStatus('error');
      setShowRetry(true);
    }
  };

  // Start checking when modal opens
  useEffect(() => {
    if (isOpen) {
      checkAllServices();
    }
  }, [isOpen]);

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'starting':
        return <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />;
      case 'running':
      case 'ready':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-gray-500" />;
    }
  };

  const getStatusColor = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'ready':
        return 'text-green-600';
      case 'error':
      case 'failed':
        return 'text-red-600';
      case 'starting':
        return 'text-yellow-600';
      default:
        return 'text-blue-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center">
            <div className="text-2xl mr-3">🏥</div>
            <div>
              <h2 className="text-lg font-semibold">Bristol Park HMS</h2>
              <p className="text-sm text-gray-600">Service Startup Progress</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="text-xl">{service.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{service.name}</span>
                    {getStatusIcon(service.status)}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={getStatusColor(service.status)}>
                      {service.message}
                    </span>
                    <span className="text-gray-500">:{service.port}</span>
                  </div>
                  {service.error && (
                    <p className="text-xs text-red-500 mt-1">{service.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {overallStatus === 'ready' && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-800 font-medium">All services are ready!</span>
              </div>
              <p className="text-green-700 text-sm mt-1">
                Redirecting to login screen...
              </p>
            </div>
          )}

          {overallStatus === 'error' && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-800 font-medium">Some services failed to start</span>
              </div>
              <p className="text-red-700 text-sm mt-1">
                Please check the service management dashboard for details.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-6 border-t bg-gray-50">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Quick Access:</span>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              App <ExternalLink className="h-3 w-3 ml-1" />
            </a>
            <span className="mx-2">•</span>
            <a
              href="http://localhost:5173/admin/services"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              Dashboard <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>

          <div className="flex space-x-2">
            {showRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={checkAllServices}
              >
                Retry
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={onComplete}
              disabled={overallStatus === 'starting'}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupProgressModal;
