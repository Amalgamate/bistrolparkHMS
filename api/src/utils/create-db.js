import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Configure dotenv
dotenv.config();

// Connect to the default 'postgres' database to create our application database
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: 'postgres', // Connect to the default postgres database
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

const createDatabase = async () => {
  const client = await pool.connect();
  
  try {
    // Check if database exists
    const checkResult = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [process.env.DB_NAME]
    );
    
    if (checkResult.rows.length === 0) {
      // Database doesn't exist, create it
      console.log(`Creating database: ${process.env.DB_NAME}`);
      // Need to use template literal here as parameterized queries don't work with CREATE DATABASE
      await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      console.log(`Database ${process.env.DB_NAME} created successfully`);
    } else {
      console.log(`Database ${process.env.DB_NAME} already exists`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// Run the function if this script is executed directly
const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFilePath) {
  createDatabase()
    .then(() => {
      console.log('Database creation script completed');
      process.exit(0);
    })
    .catch(err => {
      console.error('Database creation failed:', err);
      process.exit(1);
    });
}

export { createDatabase };
