/**
 * Test Initialization Script
 * 
 * This script initializes the test environment for the patient flow test.
 * It sets up the necessary data and configurations for testing.
 */

import { setupTestUsers, TEST_USERS } from './testHelpers';

/**
 * Initialize the test environment
 */
export const initTestEnvironment = () => {
  // Set up test users
  setupTestUsers();
  
  // Log initialization message
  console.log('%c[TEST] Test environment initialized', 'color: green; font-weight: bold');
  console.log('%c[TEST] Available test users:', 'color: blue; font-weight: bold');
  Object.entries(TEST_USERS).forEach(([role, user]) => {
    console.log(`%c${role}: ${user.email} / ${user.password}`, 'color: blue');
  });
  
  // Log test instructions
  console.log('%c[TEST] To test the patient flow:', 'color: green; font-weight: bold');
  console.log('1. Open 4 different browsers or incognito windows');
  console.log('2. Log in as Front Office, Nurse, Doctor, and Lab Technician in separate windows');
  console.log('3. Follow the steps in the testing-flow.md document');
  
  return true;
};

/**
 * Check if we're in a development environment
 */
const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

/**
 * Auto-initialize test environment in development mode
 */
if (isDevelopment()) {
  // Wait for DOM to be ready
  if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
      initTestEnvironment();
    });
  }
}

export default initTestEnvironment;
