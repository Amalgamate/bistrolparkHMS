import { Pool } from 'pg';
import bcrypt from 'bcrypt';

// Database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bristol_park_hmis', // Using the database name from .env
  password: 'password',
  port: 5432,
});

async function createUser(userData) {
  try {
    // Check which schema is being used by examining the users table
    const tableCheck = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users' AND (column_name = 'password' OR column_name = 'password_hash')
    `);

    if (tableCheck.rows.length === 0) {
      console.error('Users table not found or missing password/password_hash column');
      return;
    }

    // Determine which password column to use
    const passwordColumn = tableCheck.rows.find(row => row.column_name === 'password_hash')
      ? 'password_hash'
      : 'password';

    console.log(`Using ${passwordColumn} column for password storage`);

    // Check if id column is UUID or SERIAL
    const idColumnCheck = await pool.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'id'
    `);

    if (idColumnCheck.rows.length === 0) {
      console.error('Users table not found or missing id column');
      return;
    }

    const idType = idColumnCheck.rows[0].udt_name;
    console.log(`ID column type: ${idType}`);

    // Extract user data
    const { username, password, email, firstName, lastName, role, department } = userData;

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Check if user already exists
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (userCheck.rows.length > 0) {
      console.log(`User ${username} already exists. Updating password...`);

      // Update existing user's password
      await pool.query(
        `UPDATE users SET ${passwordColumn} = $1 WHERE username = $2 OR email = $3`,
        [passwordHash, username, email]
      );

      console.log('Password updated successfully');
      return userCheck.rows[0];
    }

    // Determine which query to use based on the schema
    let query;
    let values;

    if (passwordColumn === 'password_hash') {
      // For UUID schema with password_hash
      query = `
        INSERT INTO users (
          username,
          password_hash,
          first_name,
          last_name,
          email,
          role,
          department,
          is_active
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, username, email, role
      `;

      values = [
        username,
        passwordHash,
        firstName,
        lastName,
        email,
        role,
        department,
        true
      ];
    } else {
      // For SERIAL schema with password
      query = `
        INSERT INTO users (
          username,
          password,
          first_name,
          last_name,
          email,
          role
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, username, email, role
      `;

      values = [
        username,
        passwordHash,
        firstName,
        lastName,
        email,
        role
      ];
    }

    // Execute the query
    const result = await pool.query(query, values);

    console.log('Admin user created successfully:');
    console.log(result.rows[0]);
    console.log('\nLogin credentials:');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Email: ${email}`);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Create admin user
async function createAdminUser() {
  const adminData = {
    username: 'superadmin',
    password: 'admin12345',
    email: 'superadmin@bristolpark.com',
    firstName: 'Super',
    lastName: 'Admin',
    role: 'admin',
    department: 'Administration'
  };

  const result = await createUser(adminData);

  console.log('Admin user created successfully:');
  console.log(result);
  console.log('\nLogin credentials:');
  console.log(`Username: ${adminData.username}`);
  console.log(`Password: ${adminData.password}`);
  console.log(`Email: ${adminData.email}`);
}

// Create doctor user
async function createDoctorUser() {
  const doctorData = {
    username: 'doctor',
    password: 'doctor12345',
    email: 'doctor@bristolpark.com',
    firstName: 'John',
    lastName: 'Smith',
    role: 'doctor',
    department: 'Medical'
  };

  const result = await createUser(doctorData);

  console.log('Doctor user created successfully:');
  console.log(result);
  console.log('\nLogin credentials:');
  console.log(`Username: ${doctorData.username}`);
  console.log(`Password: ${doctorData.password}`);
  console.log(`Email: ${doctorData.email}`);
}

// Run the functions
async function main() {
  try {
    await createAdminUser();
    await createDoctorUser();
  } catch (error) {
    console.error('Error creating users:', error);
  } finally {
    pool.end();
  }
}

main();
