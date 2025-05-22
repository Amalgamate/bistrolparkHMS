const User = require('../models/user.model');
const db = require('../utils/db');
require('dotenv').config();

/**
 * Initialize database with default users
 */
async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    
    // Create default users
    const defaultUsers = [
      {
        username: 'admin',
        password: 'admin123',
        email: 'admin@bristolpark.com',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        department: 'Administration'
      },
      {
        username: 'doctor',
        password: 'doctor123',
        email: 'doctor@bristolpark.com',
        first_name: 'Doctor',
        last_name: 'User',
        role: 'doctor',
        department: 'Medical'
      },
      {
        username: 'nurse',
        password: 'nurse123',
        email: 'nurse@bristolpark.com',
        first_name: 'Nurse',
        last_name: 'User',
        role: 'nurse',
        department: 'Nursing'
      },
      {
        username: 'frontdesk',
        password: 'frontdesk123',
        email: 'frontdesk@bristolpark.com',
        first_name: 'Front',
        last_name: 'Desk',
        role: 'frontdesk',
        department: 'Reception'
      },
      {
        username: 'pharmacy',
        password: 'pharmacy123',
        email: 'pharmacy@bristolpark.com',
        first_name: 'Pharmacy',
        last_name: 'User',
        role: 'pharmacy',
        department: 'Pharmacy'
      },
      {
        username: 'lab',
        password: 'lab123',
        email: 'lab@bristolpark.com',
        first_name: 'Lab',
        last_name: 'Technician',
        role: 'lab',
        department: 'Laboratory'
      }
    ];
    
    // Create each user if they don't already exist
    for (const userData of defaultUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.getByUsername(userData.username);
        
        if (existingUser) {
          console.log(`User ${userData.username} already exists, skipping...`);
        } else {
          // Create user
          await User.create(userData);
          console.log(`Created user: ${userData.username}`);
        }
      } catch (error) {
        console.error(`Error creating user ${userData.username}:`, error);
      }
    }
    
    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    // Close database connection
    await db.pool.end();
  }
}

// Run initialization if this script is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };
