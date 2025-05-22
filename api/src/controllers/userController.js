import db from '../utils/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Configure dotenv
dotenv.config();

// Get all users
const getAllUsers = async (req, res) => {
  try {
    // Don't return password
    const result = await db.query(`
      SELECT id, username, email, first_name, last_name, role, created_at, updated_at
      FROM users
      ORDER BY last_name, first_name
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // Don't return password
    const result = await db.query(`
      SELECT id, username, email, first_name, last_name, role, created_at, updated_at
      FROM users
      WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
};

// Get users by role
const getUsersByRole = async (req, res) => {
  const { role } = req.params;

  try {
    // Don't return password
    const result = await db.query(`
      SELECT id, username, email, first_name, last_name, role, created_at, updated_at
      FROM users
      WHERE role = $1
      ORDER BY last_name, first_name
    `, [role]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(`Error fetching users with role ${role}:`, error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Register new user
const registerUser = async (req, res) => {
  const {
    username,
    password,
    email,
    first_name,
    last_name,
    role
  } = req.body;

  try {
    // Check if username or email already exists
    const existingUser = await db.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const result = await db.query(
      `INSERT INTO users (
        username, password, email, first_name, last_name, role
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, email, first_name, last_name, role, created_at, updated_at`,
      [username, hashedPassword, email, first_name, last_name, role]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const result = await db.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Determine which password field to use
    const passwordField = user.password_hash ? 'password_hash' : 'password';

    // Check password
    const isMatch = await bcrypt.compare(password, user[passwordField]);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create JWT token
    const payload = {
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'bristol_park_secret_key',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' },
      (err, token) => {
        if (err) throw err;

        // Return user info and token
        res.status(200).json({
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            department: user.department
          }
        });
      }
    );
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    email,
    first_name,
    last_name,
    role
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE users
       SET email = $1, first_name = $2, last_name = $3, role = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, username, email, first_name, last_name, role, created_at, updated_at`,
      [email, first_name, last_name, role, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  const { id } = req.params;
  const { current_password, new_password } = req.body;

  try {
    // Get user
    const userResult = await db.query('SELECT * FROM users WHERE id = $1', [id]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = userResult.rows[0];

    // Check current password
    const isMatch = await bcrypt.compare(current_password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(new_password, salt);

    // Update password
    await db.query(
      `UPDATE users
       SET password = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [hashedPassword, id]
    );

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(`Error changing password for user with ID ${id}:`, error);
    res.status(500).json({ message: 'Error changing password', error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'DELETE FROM users WHERE id = $1 RETURNING id, username, email, first_name, last_name, role',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully', user: result.rows[0] });
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

export {
  getAllUsers,
  getUserById,
  getUsersByRole,
  registerUser,
  loginUser,
  updateUser,
  changePassword,
  deleteUser
};
