import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err.stack);
  } else {
    console.log('Database connected successfully. Server time:', res.rows[0].now);
  }
});

const db = {
  query: (text, params) => pool.query(text, params),
  pool
};

export default db;
