import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

// Import database connection
import db from './utils/db.js';

// Import routes
import patientRoutes from './routes/patientRoutes.js';
// Temporarily comment out other routes to get the server running
// import userRoutes from './routes/userRoutes.js';
// import appointmentRoutes from './routes/appointmentRoutes.js';
// import medicationRoutes from './routes/medicationRoutes.js';
// import prescriptionRoutes from './routes/prescriptionRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API version endpoint
app.get('/api/version', (req, res) => {
  res.status(200).json({
    version: '1.0.0',
    name: 'Bristol Park HMIS API',
    environment: process.env.NODE_ENV
  });
});

// Test database connection endpoint
app.get('/api/db-test', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.status(200).json({
      status: 'ok',
      message: 'Database connection successful',
      serverTime: result.rows[0].now
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// API Routes
app.use('/api/patients', patientRoutes);
// Temporarily comment out other routes to get the server running
// app.use('/api/users', userRoutes);
// app.use('/api/appointments', appointmentRoutes);
// app.use('/api/medications', medicationRoutes);
// app.use('/api/prescriptions', prescriptionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API version: http://localhost:${PORT}/api/version`);
  console.log(`DB test: http://localhost:${PORT}/api/db-test`);
});
