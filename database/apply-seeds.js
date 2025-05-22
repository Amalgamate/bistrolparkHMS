const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database connection info
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'bristol_park_hmis',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password'
};

// Directory containing seed files
const seedsDir = path.join(__dirname, 'seeds');

// Get all SQL files in the seeds directory
const seedFiles = fs.readdirSync(seedsDir)
  .filter(file => file.endsWith('.sql'))
  .sort(); // Sort to ensure they're applied in order

console.log('Applying seed files...');

// Apply each seed file
seedFiles.forEach(file => {
  const filePath = path.join(seedsDir, file);
  console.log(`Applying seed: ${file}`);
  
  try {
    // Set PGPASSWORD environment variable
    process.env.PGPASSWORD = dbConfig.password;
    
    // Execute psql command
    const command = `psql -h ${dbConfig.host} -p ${dbConfig.port} -U ${dbConfig.user} -d ${dbConfig.database} -f "${filePath}"`;
    execSync(command, { stdio: 'inherit' });
    
    console.log(`Successfully applied seed: ${file}`);
  } catch (error) {
    console.error(`Error applying seed ${file}:`, error.message);
    process.exit(1);
  }
});

console.log('All seeds applied successfully!');
