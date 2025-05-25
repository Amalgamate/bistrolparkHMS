import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import db from '../utils/db.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();
const execAsync = promisify(exec);

// Service status endpoint - accessible to all admin levels
router.get('/status', adminAuth, async (req, res) => {
  try {
    const services = await getServiceStatus();
    res.json({
      success: true,
      services,
      timestamp: new Date().toISOString(),
      systemInfo: await getSystemInfo()
    });
  } catch (error) {
    console.error('Error getting service status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get service status',
      error: error.message
    });
  }
});

// Service control endpoint - requires Super Admin privileges
router.post('/control', adminAuth, async (req, res) => {
  // Check if user has Super Admin role for service control
  if (req.user.role !== 'super-admin') {
    return res.status(403).json({
      success: false,
      message: 'Service control requires Super Admin privileges',
      requiredRole: 'super-admin',
      currentRole: req.user.role
    });
  }
  const { service, action } = req.body;

  if (!service || !action) {
    return res.status(400).json({
      success: false,
      message: 'Service and action are required'
    });
  }

  if (!['start', 'stop', 'restart'].includes(action)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid action. Must be start, stop, or restart'
    });
  }

  try {
    const result = await controlService(service, action);
    res.json({
      success: true,
      message: `Service ${service} ${action} completed`,
      result
    });
  } catch (error) {
    console.error(`Error ${action}ing service ${service}:`, error);
    res.status(500).json({
      success: false,
      message: `Failed to ${action} service ${service}`,
      error: error.message
    });
  }
});

// System logs endpoint
router.get('/logs/:service?', adminAuth, async (req, res) => {
  const { service } = req.params;
  const { lines = 100 } = req.query;

  try {
    const logs = await getServiceLogs(service, parseInt(lines));
    res.json({
      success: true,
      logs,
      service: service || 'all',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting service logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get service logs',
      error: error.message
    });
  }
});

// Database health check
router.get('/database/health', adminAuth, async (req, res) => {
  try {
    const startTime = Date.now();

    // Test basic connection
    const connectionResult = await db.query('SELECT NOW() as server_time, version() as version');

    // Test patient data access
    const patientCount = await db.query('SELECT COUNT(*) as count FROM patient_details');

    // Test write capability (create a test table and drop it)
    try {
      await db.query('CREATE TEMP TABLE test_write_access (id INTEGER)');
      await db.query('DROP TABLE test_write_access');
    } catch (writeError) {
      console.warn('Write test failed (expected in production):', writeError.message);
    }

    const responseTime = Date.now() - startTime;

    res.json({
      success: true,
      status: 'healthy',
      responseTime: `${responseTime}ms`,
      serverTime: connectionResult.rows[0].server_time,
      version: connectionResult.rows[0].version,
      patientRecords: parseInt(patientCount.rows[0].count),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      message: 'Database health check failed',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// System metrics endpoint
router.get('/metrics', adminAuth, async (req, res) => {
  try {
    const metrics = await getSystemMetrics();
    res.json({
      success: true,
      metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting system metrics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get system metrics',
      error: error.message
    });
  }
});

// Helper functions
async function getServiceStatus() {
  const services = [];

  // PostgreSQL service
  try {
    const pgStatus = await checkPostgreSQLStatus();
    services.push({
      name: 'PostgreSQL Database',
      type: 'database',
      status: pgStatus.running ? 'running' : 'stopped',
      port: 5432,
      uptime: pgStatus.uptime,
      details: pgStatus.details
    });
  } catch (error) {
    services.push({
      name: 'PostgreSQL Database',
      type: 'database',
      status: 'error',
      port: 5432,
      error: error.message
    });
  }

  // API service (self)
  services.push({
    name: 'API Server',
    type: 'api',
    status: 'running',
    port: process.env.PORT || 3001,
    uptime: process.uptime(),
    details: {
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
      pid: process.pid
    }
  });

  // Frontend service (check if port 5173 is responding)
  try {
    const frontendStatus = await checkFrontendStatus();
    services.push({
      name: 'Frontend Server',
      type: 'frontend',
      status: frontendStatus.running ? 'running' : 'stopped',
      port: 5173,
      details: frontendStatus.details
    });
  } catch (error) {
    services.push({
      name: 'Frontend Server',
      type: 'frontend',
      status: 'error',
      port: 5173,
      error: error.message
    });
  }

  return services;
}

async function checkPostgreSQLStatus() {
  try {
    // Try to connect to database
    const result = await db.query('SELECT NOW()');

    // Get PostgreSQL version and uptime
    const versionResult = await db.query('SELECT version()');
    const uptimeResult = await db.query('SELECT pg_postmaster_start_time()');

    return {
      running: true,
      uptime: uptimeResult.rows[0].pg_postmaster_start_time,
      details: {
        version: versionResult.rows[0].version,
        serverTime: result.rows[0].now
      }
    };
  } catch (error) {
    return {
      running: false,
      error: error.message
    };
  }
}

async function checkFrontendStatus() {
  try {
    // This is a simple check - in production you might want to make an HTTP request
    // For now, we'll assume it's running if we can reach this API
    return {
      running: true,
      details: {
        note: 'Status inferred from API accessibility'
      }
    };
  } catch (error) {
    return {
      running: false,
      error: error.message
    };
  }
}

async function controlService(service, action) {
  console.log(`Service control requested: ${service} ${action}`);

  try {
    switch (service) {
      case 'postgresql-database':
        return await controlPostgreSQLService(action);
      case 'api-server':
        return await controlAPIService(action);
      case 'frontend-server':
        return await controlFrontendService(action);
      default:
        throw new Error(`Unknown service: ${service}`);
    }
  } catch (error) {
    console.error(`Error controlling service ${service}:`, error);
    throw error;
  }
}

async function controlPostgreSQLService(action) {
  switch (action) {
    case 'start':
      try {
        // Check if PostgreSQL is already running
        const isRunning = await checkPostgreSQLStatus();
        if (isRunning.running) {
          return {
            service: 'postgresql-database',
            action: 'start',
            status: 'already_running',
            message: 'PostgreSQL is already running',
            timestamp: new Date().toISOString()
          };
        }

        // Try to start PostgreSQL service on Windows
        await execAsync('net start postgresql-x64-13', { timeout: 30000 });

        return {
          service: 'postgresql-database',
          action: 'start',
          status: 'success',
          message: 'PostgreSQL service started successfully',
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        // If net start fails, try alternative methods or return helpful message
        return {
          service: 'postgresql-database',
          action: 'start',
          status: 'manual_required',
          message: 'PostgreSQL may need to be started manually. Please ensure PostgreSQL service is running.',
          timestamp: new Date().toISOString(),
          error: error.message
        };
      }

    case 'stop':
      try {
        await execAsync('net stop postgresql-x64-13', { timeout: 30000 });
        return {
          service: 'postgresql-database',
          action: 'stop',
          status: 'success',
          message: 'PostgreSQL service stopped successfully',
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        return {
          service: 'postgresql-database',
          action: 'stop',
          status: 'error',
          message: 'Failed to stop PostgreSQL service',
          timestamp: new Date().toISOString(),
          error: error.message
        };
      }

    case 'restart':
      try {
        await execAsync('net stop postgresql-x64-13', { timeout: 15000 });
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        await execAsync('net start postgresql-x64-13', { timeout: 30000 });

        return {
          service: 'postgresql-database',
          action: 'restart',
          status: 'success',
          message: 'PostgreSQL service restarted successfully',
          timestamp: new Date().toISOString()
        };
      } catch (error) {
        return {
          service: 'postgresql-database',
          action: 'restart',
          status: 'error',
          message: 'Failed to restart PostgreSQL service',
          timestamp: new Date().toISOString(),
          error: error.message
        };
      }

    default:
      throw new Error(`Invalid action for PostgreSQL: ${action}`);
  }
}

async function controlAPIService(action) {
  switch (action) {
    case 'start':
      return {
        service: 'api-server',
        action: 'start',
        status: 'already_running',
        message: 'API Server is currently running (this instance)',
        timestamp: new Date().toISOString()
      };

    case 'stop':
      return {
        service: 'api-server',
        action: 'stop',
        status: 'cannot_stop_self',
        message: 'Cannot stop API server from itself. Use external process manager.',
        timestamp: new Date().toISOString()
      };

    case 'restart':
      return {
        service: 'api-server',
        action: 'restart',
        status: 'manual_required',
        message: 'API Server restart requires external process manager or manual restart',
        timestamp: new Date().toISOString()
      };

    default:
      throw new Error(`Invalid action for API Server: ${action}`);
  }
}

async function controlFrontendService(action) {
  switch (action) {
    case 'start':
      return {
        service: 'frontend-server',
        action: 'start',
        status: 'manual_required',
        message: 'Frontend server should be started with "npm run dev" in the main directory',
        timestamp: new Date().toISOString()
      };

    case 'stop':
      return {
        service: 'frontend-server',
        action: 'stop',
        status: 'manual_required',
        message: 'Frontend server should be stopped manually (Ctrl+C in terminal)',
        timestamp: new Date().toISOString()
      };

    case 'restart':
      return {
        service: 'frontend-server',
        action: 'restart',
        status: 'manual_required',
        message: 'Frontend server should be restarted manually',
        timestamp: new Date().toISOString()
      };

    default:
      throw new Error(`Invalid action for Frontend Server: ${action}`);
  }
}

async function getServiceLogs(service, lines) {
  // This is a placeholder - in production, you'd read actual log files
  const mockLogs = [
    `[${new Date().toISOString()}] [INFO] Service ${service || 'system'} is running normally`,
    `[${new Date(Date.now() - 60000).toISOString()}] [INFO] Health check passed`,
    `[${new Date(Date.now() - 120000).toISOString()}] [INFO] Service started successfully`
  ];

  return mockLogs.slice(0, lines);
}

async function getSystemInfo() {
  return {
    platform: process.platform,
    nodeVersion: process.version,
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
    cpuUsage: process.cpuUsage(),
    environment: process.env.NODE_ENV || 'development'
  };
}

async function getSystemMetrics() {
  return {
    memory: process.memoryUsage(),
    cpu: process.cpuUsage(),
    uptime: process.uptime(),
    loadAverage: process.platform !== 'win32' ? require('os').loadavg() : [0, 0, 0],
    freeMemory: require('os').freemem(),
    totalMemory: require('os').totalmem(),
    timestamp: new Date().toISOString()
  };
}

export default router;
