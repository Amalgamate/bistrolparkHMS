-- Create admin user with password 'admin123'
-- Password hash is for 'admin123'
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
VALUES (
  'admin',
  '$2b$10$3euPcmQFCiblsZeEu5s7p.9MXXCJYnYlLbhsEZh5GYbpTUYxTMDPi',
  'System',
  'Administrator',
  'admin@bristolpark.com',
  'admin',
  'Administration',
  true
)
ON CONFLICT (username) DO NOTHING;
