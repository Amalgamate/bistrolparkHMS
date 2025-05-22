import db from './db.js';
import { createDatabase } from './create-db.js';
import bcrypt from 'bcrypt';
import { createExternalMessagesTable } from '../migrations/create_external_messages_table.js';

const { pool } = db;

const createTables = async () => {
  try {
    // Check if users table exists and get its id column type
    const userTableCheck = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'id'
    `);

    // Get user id column type
    const userIdType = userTableCheck.rows.length > 0 ?
      userTableCheck.rows[0].data_type : 'integer';

    // If users table doesn't exist, create it
    if (userTableCheck.rows.length === 0) {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(100) NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          role VARCHAR(20) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Users table created');
    } else {
      console.log('Users table already exists');
    }

    // Check if patients table exists and get its id column type
    const patientTableCheck = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'patients' AND column_name = 'id'
    `);

    // Get patient id column type
    const patientIdType = patientTableCheck.rows.length > 0 ?
      patientTableCheck.rows[0].data_type : 'integer';

    // If patients table doesn't exist, create it
    if (patientTableCheck.rows.length === 0) {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS patients (
          id SERIAL PRIMARY KEY,
          patient_id VARCHAR(20) UNIQUE NOT NULL,
          first_name VARCHAR(50) NOT NULL,
          last_name VARCHAR(50) NOT NULL,
          date_of_birth DATE NOT NULL,
          gender VARCHAR(10) NOT NULL,
          address TEXT,
          phone VARCHAR(20),
          email VARCHAR(100),
          emergency_contact VARCHAR(100),
          emergency_phone VARCHAR(20),
          blood_type VARCHAR(5),
          allergies TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Patients table created');
    } else {
      console.log('Patients table already exists');
    }

    // Drop appointments table if it exists
    await pool.query(`DROP TABLE IF EXISTS appointments CASCADE`);

    // Create appointments table with the correct patient_id and doctor_id types
    if (patientIdType === 'uuid' && userIdType === 'uuid') {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS appointments (
          id SERIAL PRIMARY KEY,
          patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
          doctor_id UUID REFERENCES users(id) ON DELETE SET NULL,
          appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
          status VARCHAR(20) NOT NULL,
          reason TEXT,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } else if (patientIdType === 'uuid') {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS appointments (
          id SERIAL PRIMARY KEY,
          patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
          doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
          status VARCHAR(20) NOT NULL,
          reason TEXT,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } else if (userIdType === 'uuid') {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS appointments (
          id SERIAL PRIMARY KEY,
          patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
          doctor_id UUID REFERENCES users(id) ON DELETE SET NULL,
          appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
          status VARCHAR(20) NOT NULL,
          reason TEXT,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } else {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS appointments (
          id SERIAL PRIMARY KEY,
          patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
          doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
          status VARCHAR(20) NOT NULL,
          reason TEXT,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
    console.log('Appointments table created or already exists');

    // Check if medications table exists and get its id column type
    const medicationTableCheck = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'medications' AND column_name = 'id'
    `);

    // Get medication id column type
    const medicationIdType = medicationTableCheck.rows.length > 0 ?
      medicationTableCheck.rows[0].data_type : 'integer';

    // If medications table doesn't exist, create it
    if (medicationTableCheck.rows.length === 0) {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS medications (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description TEXT,
          dosage VARCHAR(50),
          manufacturer VARCHAR(100),
          stock_quantity INTEGER NOT NULL DEFAULT 0,
          unit_price DECIMAL(10, 2) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Medications table created');
    } else {
      console.log('Medications table already exists');
    }

    // Drop tables if they exist to avoid foreign key issues
    await pool.query(`DROP TABLE IF EXISTS prescription_items CASCADE`);
    await pool.query(`DROP TABLE IF EXISTS prescriptions CASCADE`);

    // Create prescriptions table with the correct patient_id and doctor_id types
    if (patientIdType === 'uuid' && userIdType === 'uuid') {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS prescriptions (
          id SERIAL PRIMARY KEY,
          patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
          doctor_id UUID REFERENCES users(id) ON DELETE SET NULL,
          prescription_date TIMESTAMP WITH TIME ZONE NOT NULL,
          status VARCHAR(20) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } else if (patientIdType === 'uuid') {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS prescriptions (
          id SERIAL PRIMARY KEY,
          patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
          doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          prescription_date TIMESTAMP WITH TIME ZONE NOT NULL,
          status VARCHAR(20) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } else if (userIdType === 'uuid') {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS prescriptions (
          id SERIAL PRIMARY KEY,
          patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
          doctor_id UUID REFERENCES users(id) ON DELETE SET NULL,
          prescription_date TIMESTAMP WITH TIME ZONE NOT NULL,
          status VARCHAR(20) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } else {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS prescriptions (
          id SERIAL PRIMARY KEY,
          patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
          doctor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          prescription_date TIMESTAMP WITH TIME ZONE NOT NULL,
          status VARCHAR(20) NOT NULL,
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
    console.log('Prescriptions table created or already exists');

    // Create prescription_items table with the correct prescription_id and medication_id types
    if (medicationIdType === 'uuid') {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS prescription_items (
          id SERIAL PRIMARY KEY,
          prescription_id INTEGER REFERENCES prescriptions(id) ON DELETE CASCADE,
          medication_id UUID REFERENCES medications(id) ON DELETE CASCADE,
          dosage VARCHAR(50) NOT NULL,
          frequency VARCHAR(50) NOT NULL,
          duration VARCHAR(50) NOT NULL,
          quantity INTEGER NOT NULL,
          instructions TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } else {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS prescription_items (
          id SERIAL PRIMARY KEY,
          prescription_id INTEGER REFERENCES prescriptions(id) ON DELETE CASCADE,
          medication_id INTEGER REFERENCES medications(id) ON DELETE CASCADE,
          dosage VARCHAR(50) NOT NULL,
          frequency VARCHAR(50) NOT NULL,
          duration VARCHAR(50) NOT NULL,
          quantity INTEGER NOT NULL,
          instructions TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `);
    }
    console.log('Prescription items table created or already exists');

    console.log('All tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    // Check the structure of the users table
    const userColumns = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'users'
    `);

    // Get column names
    const columnNames = userColumns.rows.map(row => row.column_name);
    console.log('User table columns:', columnNames);

    // Check if admin user exists
    const adminExists = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      ['admin']
    );

    if (adminExists.rows.length === 0 && columnNames.includes('password')) {
      // Hash password (password is 'admin123')
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      // Create admin user
      await pool.query(
        `INSERT INTO users (username, password, email, first_name, last_name, role)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ['admin', hashedPassword, 'admin@bristolpark.com', 'Admin', 'User', 'admin']
      );
      console.log('Admin user created');

      // Create doctor user
      await pool.query(
        `INSERT INTO users (username, password, email, first_name, last_name, role)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ['doctor', hashedPassword, 'doctor@bristolpark.com', 'John', 'Smith', 'doctor']
      );
      console.log('Doctor user created');

      // Create nurse user
      await pool.query(
        `INSERT INTO users (username, password, email, first_name, last_name, role)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ['nurse', hashedPassword, 'nurse@bristolpark.com', 'Jane', 'Doe', 'nurse']
      );
      console.log('Nurse user created');

      // Create pharmacist user
      await pool.query(
        `INSERT INTO users (username, password, email, first_name, last_name, role)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        ['pharmacist', hashedPassword, 'pharmacist@bristolpark.com', 'Robert', 'Johnson', 'pharmacist']
      );
      console.log('Pharmacist user created');
    } else {
      console.log('Users already exist or password column is missing');
    }

    // Check the structure of the medications table
    const medicationColumns = await pool.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'medications'
    `);

    // Get column names
    const medicationColumnNames = medicationColumns.rows.map(row => row.column_name);
    console.log('Medication table columns:', medicationColumnNames);

    // Check if sample medications exist
    const medicationsExist = await pool.query('SELECT * FROM medications LIMIT 1');

    if (medicationsExist.rows.length === 0 && medicationColumnNames.includes('name')) {
      // Create sample medications
      const medications = [
        {
          name: 'Paracetamol',
          dosage: '500mg',
          manufacturer: 'Generic',
          stock_quantity: 100,
          unit_price: 5.99
        },
        {
          name: 'Amoxicillin',
          dosage: '250mg',
          manufacturer: 'Generic',
          stock_quantity: 50,
          unit_price: 12.99
        },
        {
          name: 'Ibuprofen',
          dosage: '400mg',
          manufacturer: 'Generic',
          stock_quantity: 75,
          unit_price: 7.99
        },
        {
          name: 'Omeprazole',
          dosage: '20mg',
          manufacturer: 'Generic',
          stock_quantity: 30,
          unit_price: 15.99
        },
        {
          name: 'Metformin',
          dosage: '500mg',
          manufacturer: 'Generic',
          stock_quantity: 40,
          unit_price: 9.99
        }
      ];

      // Dynamically build the query based on available columns
      for (const med of medications) {
        const columns = [];
        const values = [];
        const placeholders = [];
        let paramIndex = 1;

        for (const [key, value] of Object.entries(med)) {
          if (medicationColumnNames.includes(key)) {
            columns.push(key);
            values.push(value);
            placeholders.push(`$${paramIndex++}`);
          }
        }

        if (columns.length > 0) {
          const query = `
            INSERT INTO medications (${columns.join(', ')})
            VALUES (${placeholders.join(', ')})
          `;

          await pool.query(query, values);
        }
      }

      console.log('Sample medications created');
    } else {
      console.log('Medications already exist or required columns are missing');
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

const initializeDatabase = async () => {
  try {
    // First create the database if it doesn't exist
    await createDatabase();

    // Then create tables and seed data
    await createTables();
    await seedDatabase();

    // Create external messages table for tawk.to integration
    await createExternalMessagesTable();

    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
  } finally {
    // Keep the connection open for the application
  }
};

export { initializeDatabase };
