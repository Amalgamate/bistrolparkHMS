const { pool } = require('./db');
const bcrypt = require('bcrypt');

const createTables = async () => {
  try {
    // Create users table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        role VARCHAR(20) NOT NULL,
        department VARCHAR(50),
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Users table created or already exists');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

const seedDatabase = async () => {
  try {
    // Create default users with the same password for testing
    const password = 'password';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Define users to create
    const users = [
      {
        username: 'admin',
        email: 'admin@bristolpark.com',
        first_name: 'Admin',
        last_name: 'User',
        role: 'admin',
        department: 'Administration'
      },
      {
        username: 'doctor',
        email: 'doctor@bristolpark.com',
        first_name: 'Doctor',
        last_name: 'User',
        role: 'doctor',
        department: 'Medical'
      },
      {
        username: 'nurse',
        email: 'nurse@bristolpark.com',
        first_name: 'Nurse',
        last_name: 'User',
        role: 'nurse',
        department: 'Nursing'
      },
      {
        username: 'frontdesk',
        email: 'frontdesk@bristolpark.com',
        first_name: 'Front',
        last_name: 'Desk',
        role: 'frontdesk',
        department: 'Reception'
      },
      {
        username: 'pharmacy',
        email: 'pharmacy@bristolpark.com',
        first_name: 'Pharmacy',
        last_name: 'User',
        role: 'pharmacy',
        department: 'Pharmacy'
      },
      {
        username: 'lab',
        email: 'lab@bristolpark.com',
        first_name: 'Lab',
        last_name: 'Technician',
        role: 'lab',
        department: 'Laboratory'
      }
    ];

    // Insert each user if they don't already exist
    for (const user of users) {
      // Check if user exists
      const userExists = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [user.username]
      );

      if (userExists.rows.length === 0) {
        // Create user
        await pool.query(
          `INSERT INTO users (
            username, 
            password_hash, 
            email, 
            first_name, 
            last_name, 
            role, 
            department
          ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            user.username,
            passwordHash,
            user.email,
            user.first_name,
            user.last_name,
            user.role,
            user.department
          ]
        );
        console.log(`User ${user.username} created`);
      } else {
        console.log(`User ${user.username} already exists`);
      }
    }

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

const initializeDatabase = async () => {
  try {
    await createTables();
    await seedDatabase();
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

module.exports = { initializeDatabase };
