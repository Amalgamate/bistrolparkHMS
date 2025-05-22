/**
 * Script to add sample patients to the database
 * 
 * This script adds sample patients to the database for testing purposes.
 */

import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'bristol_park_hmis',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Log connection details
console.log('Database connection details:');
console.log('Host:', process.env.DB_HOST || 'localhost');
console.log('Port:', process.env.DB_PORT || 5432);
console.log('Database:', process.env.DB_NAME || 'bristol_park_hmis');
console.log('User:', process.env.DB_USER || 'postgres');

// Sample patients data
const samplePatients = [
  {
    mrn: 'BP10001',
    first_name: 'John',
    last_name: 'Kamau',
    date_of_birth: '1985-06-15',
    gender: 'male',
    address: '123 Nairobi Way, Nairobi',
    phone: '0712345678',
    email: 'john.kamau@example.com',
    insurance_provider: 'NHIF',
    insurance_id: 'NHIF12345',
    blood_type: 'O+',
    allergies: 'Penicillin'
  },
  {
    mrn: 'BP10002',
    first_name: 'Mary',
    last_name: 'Wanjiku',
    date_of_birth: '1990-03-22',
    gender: 'female',
    address: '456 Mombasa Road, Nairobi',
    phone: '0723456789',
    email: 'mary.wanjiku@example.com',
    insurance_provider: 'AAR',
    insurance_id: 'AAR67890',
    blood_type: 'A+',
    allergies: 'None'
  },
  {
    mrn: 'BP10003',
    first_name: 'David',
    last_name: 'Omondi',
    date_of_birth: '1978-11-10',
    gender: 'male',
    address: '789 Kisumu Street, Kisumu',
    phone: '0734567890',
    email: 'david.omondi@example.com',
    insurance_provider: 'Jubilee',
    insurance_id: 'JUB54321',
    blood_type: 'B-',
    allergies: 'Sulfa drugs'
  },
  {
    mrn: 'BP10004',
    first_name: 'Sarah',
    last_name: 'Muthoni',
    date_of_birth: '1995-08-05',
    gender: 'female',
    address: '321 Nakuru Avenue, Nakuru',
    phone: '0745678901',
    email: 'sarah.muthoni@example.com',
    insurance_provider: 'Britam',
    insurance_id: 'BRI98765',
    blood_type: 'AB+',
    allergies: 'Latex'
  },
  {
    mrn: 'BP10005',
    first_name: 'James',
    last_name: 'Kiprop',
    date_of_birth: '1982-04-30',
    gender: 'male',
    address: '654 Eldoret Road, Eldoret',
    phone: '0756789012',
    email: 'james.kiprop@example.com',
    insurance_provider: 'CIC',
    insurance_id: 'CIC24680',
    blood_type: 'O-',
    allergies: 'None'
  }
];

// Function to add a patient to the database
async function addPatient(patient) {
  try {
    // Check if patient already exists
    const patientCheck = await pool.query(
      'SELECT * FROM patients WHERE mrn = $1 OR (first_name = $2 AND last_name = $3)',
      [patient.mrn, patient.first_name, patient.last_name]
    );

    if (patientCheck.rows.length > 0) {
      console.log(`Patient ${patient.first_name} ${patient.last_name} (${patient.mrn}) already exists.`);
      return;
    }

    // Insert the patient
    const result = await pool.query(
      `INSERT INTO patients (
        mrn, first_name, last_name, date_of_birth, gender, address, 
        phone, email, insurance_provider, insurance_id, blood_type, allergies
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING id`,
      [
        patient.mrn,
        patient.first_name,
        patient.last_name,
        patient.date_of_birth,
        patient.gender,
        patient.address,
        patient.phone,
        patient.email,
        patient.insurance_provider,
        patient.insurance_id,
        patient.blood_type,
        patient.allergies
      ]
    );

    console.log(`Patient ${patient.first_name} ${patient.last_name} (${patient.mrn}) added with ID: ${result.rows[0].id}`);
  } catch (error) {
    console.error(`Error adding patient ${patient.first_name} ${patient.last_name}:`, error);
  }
}

// Main function to add all sample patients
async function addSamplePatients() {
  try {
    console.log('Adding sample patients to the database...');

    // Add each patient
    for (const patient of samplePatients) {
      await addPatient(patient);
    }

    // Count patients after adding
    const countResult = await pool.query('SELECT COUNT(*) FROM patients');
    console.log(`Total patients in database after adding samples: ${countResult.rows[0].count}`);

    console.log('Sample patients added successfully.');
  } catch (error) {
    console.error('Error adding sample patients:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the main function
addSamplePatients();
