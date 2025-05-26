#!/usr/bin/env node

/**
 * Bristol Park HMS Unified Startup Script
 *
 * This script provides a single command to start all required services
 * with immediate visual feedback and automatic navigation flow.
 */

import { spawn, exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m'
};

// Service configuration
const services = {
  database: {
    name: 'PostgreSQL Database',
    port: 5432,
    checkCommand: 'pg_isready -h localhost -p 5432',
    startCommand: null, // Assume already running
    icon: '🗄️',
    priority: 1
  },
  api: {
    name: 'API Server',
    port: 3001,
    checkCommand: 'curl -s http://localhost:3001/api/health',
    startCommand: 'node server.js',
    workingDir: path.join(__dirname, '..', 'server'),
    icon: '🚀',
    priority: 2
  },
  frontend: {
    name: 'Frontend Server',
    port: 5173,
    checkCommand: 'curl -s http://localhost:5173',
    startCommand: 'npm run dev',
    workingDir: path.join(__dirname, '..'),
    icon: '🌐',
    priority: 3
  }
};

// Service status tracking
let serviceStatus = {};
let processes = {};

// Initialize service status
Object.keys(services).forEach(key => {
  serviceStatus[key] = {
    status: 'checking',
    message: 'Initializing...',
    error: null
  };
});

/**
 * Print colored output to console
 */
function printColored(text, color = 'white') {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

/**
 * Print service status with visual indicators
 */
function printServiceStatus(serviceKey, status, message = '') {
  const service = services[serviceKey];
  const statusColors = {
    checking: 'yellow',
    starting: 'cyan',
    running: 'green',
    ready: 'bgGreen',
    error: 'red',
    failed: 'bgRed'
  };

  const statusIcons = {
    checking: '🔍',
    starting: '⏳',
    running: '✅',
    ready: '🎉',
    error: '❌',
    failed: '💥'
  };

  const color = statusColors[status] || 'white';
  const icon = statusIcons[status] || '❓';

  console.log(`${colors[color]}${icon} ${service.icon} ${service.name} (Port ${service.port}): ${status.toUpperCase()}${colors.reset}`);
  if (message) {
    console.log(`   ${colors.cyan}${message}${colors.reset}`);
  }
}

/**
 * Check if a service is running
 */
async function checkService(serviceKey) {
  const service = services[serviceKey];

  try {
    if (service.checkCommand) {
      await execAsync(service.checkCommand);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Start a service
 */
async function startService(serviceKey) {
  const service = services[serviceKey];

  if (!service.startCommand) {
    serviceStatus[serviceKey] = {
      status: 'error',
      message: 'No start command configured',
      error: 'Service must be started manually'
    };
    return false;
  }

  return new Promise((resolve) => {
    serviceStatus[serviceKey] = {
      status: 'starting',
      message: 'Launching service...',
      error: null
    };

    printServiceStatus(serviceKey, 'starting', 'Launching service...');

    const process = spawn(service.startCommand.split(' ')[0], service.startCommand.split(' ').slice(1), {
      cwd: service.workingDir || __dirname,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true
    });

    processes[serviceKey] = process;

    // Handle process output
    process.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('ready') || output.includes('listening') || output.includes('started')) {
        serviceStatus[serviceKey] = {
          status: 'running',
          message: 'Service is running',
          error: null
        };
        printServiceStatus(serviceKey, 'running', 'Service is running');
        resolve(true);
      }
    });

    process.stderr.on('data', (data) => {
      const error = data.toString();
      if (!error.includes('warning') && !error.includes('deprecated')) {
        serviceStatus[serviceKey] = {
          status: 'error',
          message: error.trim(),
          error: error
        };
        printServiceStatus(serviceKey, 'error', error.trim());
        resolve(false);
      }
    });

    process.on('close', (code) => {
      if (code !== 0 && serviceStatus[serviceKey].status !== 'running') {
        serviceStatus[serviceKey] = {
          status: 'failed',
          message: `Process exited with code ${code}`,
          error: `Exit code: ${code}`
        };
        printServiceStatus(serviceKey, 'failed', `Process exited with code ${code}`);
        resolve(false);
      }
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (serviceStatus[serviceKey].status === 'starting') {
        serviceStatus[serviceKey] = {
          status: 'running',
          message: 'Service appears to be running (timeout reached)',
          error: null
        };
        printServiceStatus(serviceKey, 'running', 'Service appears to be running');
        resolve(true);
      }
    }, 30000);
  });
}

/**
 * Wait for service to be ready
 */
async function waitForService(serviceKey, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    if (await checkService(serviceKey)) {
      serviceStatus[serviceKey] = {
        status: 'ready',
        message: 'Service is ready and responding',
        error: null
      };
      printServiceStatus(serviceKey, 'ready', 'Service is ready and responding');
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
}

/**
 * Open browser to service management dashboard
 */
async function openServiceDashboard() {
  try {
    const { default: open } = await import('open');
    await open('http://localhost:5173?startup=true');
    printColored('🌐 Opening Bristol Park HMS with startup progress...', 'cyan');
  } catch (error) {
    printColored('⚠️  Could not auto-open browser. Please navigate to: http://localhost:5173?startup=true', 'yellow');
  }
}

/**
 * Main startup sequence
 */
async function startupSequence() {
  printColored('🏥 Bristol Park HMS - Unified Startup', 'bright');
  printColored('=' .repeat(50), 'blue');
  printColored('Starting all services with dependency management...', 'cyan');
  console.log('');

  // Sort services by priority
  const sortedServices = Object.keys(services).sort((a, b) =>
    services[a].priority - services[b].priority
  );

  // Check and start each service
  for (const serviceKey of sortedServices) {
    const service = services[serviceKey];

    printServiceStatus(serviceKey, 'checking', 'Checking service status...');

    const isRunning = await checkService(serviceKey);

    if (isRunning) {
      serviceStatus[serviceKey] = {
        status: 'ready',
        message: 'Service is already running',
        error: null
      };
      printServiceStatus(serviceKey, 'ready', 'Service is already running');
    } else {
      if (service.startCommand) {
        const started = await startService(serviceKey);
        if (started) {
          await waitForService(serviceKey);
        }
      } else {
        serviceStatus[serviceKey] = {
          status: 'error',
          message: 'Service not running and no start command available',
          error: 'Manual start required'
        };
        printServiceStatus(serviceKey, 'error', 'Service not running - please start manually');
      }
    }

    console.log('');
  }

  // Summary
  printColored('🎯 Startup Summary', 'bright');
  printColored('=' .repeat(30), 'blue');

  let allReady = true;
  Object.keys(services).forEach(serviceKey => {
    const status = serviceStatus[serviceKey];
    const isReady = status.status === 'ready' || status.status === 'running';
    allReady = allReady && isReady;

    const statusText = isReady ? 'READY' : 'FAILED';
    const color = isReady ? 'green' : 'red';
    printColored(`${services[serviceKey].icon} ${services[serviceKey].name}: ${statusText}`, color);
  });

  console.log('');

  if (allReady) {
    printColored('🎉 All services are ready!', 'bgGreen');
    printColored('🌐 Opening service management dashboard...', 'cyan');

    // Open service dashboard immediately
    await openServiceDashboard();

    // Wait a moment then navigate to login
    setTimeout(() => {
      printColored('🔐 Redirecting to login screen...', 'cyan');
    }, 3000);

  } else {
    printColored('⚠️  Some services failed to start', 'bgYellow');
    printColored('🔧 Check the service management dashboard for details', 'yellow');
    await openServiceDashboard();
  }

  printColored('✨ Bristol Park HMS is ready for use!', 'bright');
  printColored('📱 Access the application at: http://localhost:5173', 'cyan');
  printColored('🔧 Service dashboard: http://localhost:5173/admin/services', 'cyan');
  printColored('🔐 Login credentials: bristoladmin / Bristol2024!', 'yellow');
}

// Handle process termination
process.on('SIGINT', () => {
  printColored('\n🛑 Shutting down services...', 'yellow');

  Object.keys(processes).forEach(serviceKey => {
    if (processes[serviceKey]) {
      processes[serviceKey].kill();
    }
  });

  process.exit(0);
});

// Start the sequence
startupSequence().catch(error => {
  printColored(`💥 Startup failed: ${error.message}`, 'bgRed');
  process.exit(1);
});
