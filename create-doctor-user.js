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

async function createDoctorUser() {
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

    // Create a new doctor user
    const username = 'doctor';
    const password = 'doctor12345';
    const email = 'doctor@bristolpark.com';
    const firstName = 'John';
    const lastName = 'Smith';
    const role = 'doctor';
    const department = 'Medical';

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Check if user already exists
    const userCheck = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (userCheck.rows.length > 0) {
      console.log('User already exists. Updating password...');
      
      // Update existing user's password
      await pool.query(
        `UPDATE users SET ${passwordColumn} = $1 WHERE username = $2 OR email = $3`,
        [passwordHash, username, email]
      );
      
      console.log('Password updated successfully');
      return;
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
    
    console.log('Doctor user created successfully:');
    console.log(result.rows[0]);
    console.log('\nLogin credentials:');
    console.log(`Username: ${username}`);
    console.log(`Password: ${password}`);
    console.log(`Email: ${email}`);
  } catch (error) {
    console.error('Error creating doctor user:', error);
  } finally {
    // Close the database connection
    pool.end();
  }
}

// Run the function
createDoctorUser();
