/**
 * Script to count patients in the database
 * 
 * This script connects to the database and counts the number of patients.
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

// Main function to count patients
async function countPatients() {
  try {
    console.log('Counting patients in the database...');

    // Get the table names to find the patients table
    const tablesResult = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Available tables:');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name}`);
    });

    // Try to count patients from the patients table if it exists
    const patientTable = tablesResult.rows.find(row => 
      row.table_name === 'patients' || 
      row.table_name === 'patient'
    );

    if (patientTable) {
      const tableName = patientTable.table_name;
      console.log(`Found patients table: ${tableName}`);
      
      // Get column information
      const columnsResult = await pool.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = $1
      `, [tableName]);
      
      console.log(`Columns in ${tableName} table:`);
      columnsResult.rows.forEach(row => {
        console.log(`- ${row.column_name}`);
      });
      
      // Count patients
      const countResult = await pool.query(`SELECT COUNT(*) FROM ${tableName}`);
      console.log(`Total patients in database: ${countResult.rows[0].count}`);
      
      // Get a sample of patients if any exist
      if (parseInt(countResult.rows[0].count) > 0) {
        const sampleResult = await pool.query(`SELECT * FROM ${tableName} LIMIT 5`);
        console.log('Sample patient records:');
        sampleResult.rows.forEach(patient => {
          console.log(patient);
        });
      }
    } else {
      console.log('No patients table found in the database.');
      
      // Look for tables that might contain patient data
      console.log('Looking for tables that might contain patient data...');
      const potentialPatientTables = tablesResult.rows.filter(row => 
        row.table_name.includes('patient') || 
        row.table_name.includes('person') || 
        row.table_name.includes('client') ||
        row.table_name.includes('user')
      );
      
      if (potentialPatientTables.length > 0) {
        console.log('Potential tables that might contain patient data:');
        potentialPatientTables.forEach(row => {
          console.log(`- ${row.table_name}`);
        });
      } else {
        console.log('No potential patient tables found.');
      }
    }
  } catch (error) {
    console.error('Error counting patients:', error);
  } finally {
    // Close the pool
    await pool.end();
  }
}

// Run the main function
countPatients();
