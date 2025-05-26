/**
 * Test Helper Utilities
 *
 * This file contains helper functions for testing the patient flow
 * through the system with different user roles.
 */

import { User } from '../context/AuthContext';

// Database user credentials (for reference only, not used for authentication)
export const DB_USERS = {
  ADMIN: {
    email: 'superadmin@bristolpark.com',
    role: 'admin'
  },
  DOCTOR: {
    email: 'doctor@bristolpark.com',
    role: 'doctor'
  },
  TEST: {
    email: 'test@test.com',
    role: 'admin'
  }
};

// Sample patient data for testing - DO NOT USE IN PRODUCTION
// All patient data should come from the database API
export const TEST_PATIENT = {
  firstName: 'Test',
  lastName: 'Patient',
  gender: 'male',
  dateOfBirth: '1990-01-01',
  phone: '0700000000',
  email: 'test@example.com',
  idNumber: 'TEST123456',
  address: 'Test Address',
  city: 'Test City',
  insuranceProvider: 'TEST',
  insuranceNumber: 'TEST123456',
  emergencyContact: 'Test Contact',
  emergencyPhone: '0700000001'
};

// Warning: This is for testing only
console.warn('TEST_PATIENT is for testing only. Use real patient data from API in production.');

// Sample vitals data for testing
export const TEST_VITALS = {
  temperature: 37.2,
  bloodPressureSystolic: 120,
  bloodPressureDiastolic: 80,
  heartRate: 72,
  respiratoryRate: 16,
  oxygenSaturation: 98,
  weight: 70,
  height: 175,
  bmi: 22.9,
  notes: 'Patient appears healthy'
};

// Sample lab tests for testing
export const TEST_LAB_TESTS = [
  {
    name: 'Complete Blood Count (CBC)',
    category: 'hematology',
    priority: 'normal'
  },
  {
    name: 'Blood Glucose',
    category: 'biochemistry',
    priority: 'urgent'
  }
];

// Sample lab results for testing
export const TEST_LAB_RESULTS = {
  'Complete Blood Count (CBC)': [
    {
      parameter: 'WBC',
      value: '7.2',
      unit: 'x10^9/L',
      referenceRange: '4.0-11.0',
      flag: 'normal'
    },
    {
      parameter: 'RBC',
      value: '5.1',
      unit: 'x10^12/L',
      referenceRange: '4.5-5.5',
      flag: 'normal'
    },
    {
      parameter: 'Hemoglobin',
      value: '14.2',
      unit: 'g/dL',
      referenceRange: '13.5-17.5',
      flag: 'normal'
    }
  ],
  'Blood Glucose': [
    {
      parameter: 'Fasting Blood Glucose',
      value: '110',
      unit: 'mg/dL',
      referenceRange: '70-100',
      flag: 'high'
    }
  ]
};

// Sample diagnosis for testing
export const TEST_DIAGNOSIS = {
  description: 'Type 2 Diabetes Mellitus',
  type: 'provisional',
  icdCode: 'E11'
};

// Sample medications for testing
export const TEST_MEDICATIONS = [
  {
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    duration: '30 days',
    instructions: 'Take with meals'
  }
];

/**
 * Helper function to simulate a delay
 * @param ms Milliseconds to delay
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Helper function to log test steps
 * @param step Step description
 * @param details Additional details
 */
export const logTestStep = (step: string, details?: any) => {
  console.log(`%c[TEST] ${step}`, 'color: blue; font-weight: bold');
  if (details) {
    console.log(details);
  }
};

/**
 * Helper function to simulate a notification
 * @param title Notification title
 * @param message Notification message
 * @param type Notification type
 */
export const simulateNotification = (title: string, message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
  console.log(`%c[NOTIFICATION] ${type.toUpperCase()}: ${title}`, `color: ${type === 'success' ? 'green' : type === 'warning' ? 'orange' : type === 'error' ? 'red' : 'blue'}; font-weight: bold`);
  console.log(message);
};

// No longer needed - using database users instead
