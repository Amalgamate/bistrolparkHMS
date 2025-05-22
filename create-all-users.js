/**
 * Script to create all users from UserRolesContext in the database
 *
 * This script reads the hardcoded users from UserRolesContext and creates them in the database.
 * After running this script, you can remove the hardcoded users from UserRolesContext.
 */

import pkg from 'pg';
const { Pool } = pkg;
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'bristol_park',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Log connection details
console.log('Database connection details:');
console.log('Host:', process.env.DB_HOST || 'localhost');
console.log('Port:', process.env.DB_PORT || 5432);
console.log('Database:', process.env.DB_NAME || 'bristol_park');
console.log('User:', process.env.DB_USER || 'postgres');

// Users from UserRolesContext
const users = [
  {
    name: 'Super Admin',
    email: 'superadmin@bristolparkhospital.com',
    username: 'superadmin',
    jobId: 'BPH001',
    role: 'admin',
    password: 'admin12345',
    first_name: 'Super',
    last_name: 'Admin'
  },
  {
    name: 'Admin User',
    email: 'admin@bristolparkhospital.com',
    username: 'admin',
    jobId: 'BPH002',
    role: 'admin',
    password: 'admin12345',
    first_name: 'Admin',
    last_name: 'User'
  },
  {
    name: 'Dr. Smith',
    email: 'smith@bristolparkhospital.com',
    username: 'drsmith',
    jobId: 'BPH003',
    role: 'doctor',
    password: 'doctor12345',
    first_name: 'Dr.',
    last_name: 'Smith'
  },
  {
    name: 'Jane Accountant',
    email: 'jane@bristolparkhospital.com',
    username: 'janeacc',
    jobId: 'BPH004',
    role: 'accountant',
    password: 'account12345',
    first_name: 'Jane',
    last_name: 'Accountant'
  },
  {
    name: 'Reception Staff',
    email: 'reception@bristolparkhospital.com',
    username: 'reception',
    jobId: 'BPH005',
    role: 'front-office',
    password: 'front12345',
    first_name: 'Reception',
    last_name: 'Staff'
  },
  {
    name: 'Nurse Johnson',
    email: 'johnson@bristolparkhospital.com',
    username: 'nursejohnson',
    jobId: 'BPH006',
    role: 'nurse',
    password: 'nurse12345',
    first_name: 'Nurse',
    last_name: 'Johnson'
  },
  {
    name: 'Pharmacy Staff',
    email: 'pharmacy@bristolparkhospital.com',
    username: 'pharmacy',
    jobId: 'BPH007',
    role: 'pharmacy',
    password: 'pharm12345',
    first_name: 'Pharmacy',
    last_name: 'Staff'
  },
  {
    name: 'Mortuary Staff',
    email: 'mortuary@bristolparkhospital.com',
    username: 'mortuary',
    jobId: 'BPH008',
    role: 'mortuary-attendant',
    password: 'mort12345',
    first_name: 'Mortuary',
    last_name: 'Staff'
  },
  {
    name: 'Dr. Johnson',
    email: 'drjohnson@bristolparkhospital.com',
    username: 'drjohnson',
    jobId: 'BPH009',
    role: 'doctor',
    password: 'doctor12345',
    first_name: 'Dr.',
    last_name: 'Johnson'
  },
  {
    name: 'Lab Technician',
    email: 'lab@bristolparkhospital.com',
    username: 'labtech',
    jobId: 'BPH010',
    role: 'lab-technician',
    password: 'lab12345',
    first_name: 'Lab',
    last_name: 'Technician'
  }
];

// Function to create a user in the database
async function createUser(user) {
  try {
    // Check if user already exists
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [user.username, user.email]
    );

    if (userCheck.rows.length > 0) {
      console.log(`User ${user.username} (${user.email}) already exists.`);
      return;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);

    // Create the user
    await pool.query(
      `INSERT INTO users (username, password_hash, email, first_name, last_name, role, department)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        user.username,
        hashedPassword,
        user.email,
        user.first_name,
        user.last_name,
        user.role,
        'Administration'
      ]
    );

    console.log(`User ${user.username} (${user.email}) created successfully.`);
  } catch (error) {
    console.error(`Error creating user ${user.username}:`, error);
  }
}

// Main function to create all users
async function createAllUsers() {
  try {
    console.log('Starting user creation process...');

    // Create each user
    for (const user of users) {
      await createUser(user);
    }

    console.log('All users created successfully.');
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the main function
createAllUsers();
