const db = require('../utils/db');
const bcrypt = require('bcrypt');

/**
 * User model for database operations
 */
class User {
  /**
   * Get all users with pagination
   * @param {number} limit - Number of records to return
   * @param {number} offset - Number of records to skip
   * @returns {Promise<Array>} Array of user records
   */
  static async getAll(limit = 10, offset = 0) {
    const query = `
      SELECT id, username, first_name, last_name, email, role, department, is_active, last_login, created_at, updated_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT $1 OFFSET $2
    `;
    const result = await db.query(query, [limit, offset]);
    return result.rows;
  }

  /**
   * Get user by ID
   * @param {string} id - UUID of the user
   * @returns {Promise<Object>} User record
   */
  static async getById(id) {
    const query = `
      SELECT id, username, first_name, last_name, email, role, department, is_active, last_login, created_at, updated_at 
      FROM users 
      WHERE id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get user by username
   * @param {string} username - Username
   * @returns {Promise<Object>} User record including password hash
   */
  static async getByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await db.query(query, [username]);
    return result.rows[0];
  }

  /**
   * Get user by email
   * @param {string} email - Email address
   * @returns {Promise<Object>} User record
   */
  static async getByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await db.query(query, [email]);
    return result.rows[0];
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user record
   */
  static async create(userData) {
    const { 
      username, 
      password, 
      first_name, 
      last_name, 
      email, 
      role, 
      department,
      is_active = true
    } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    const query = `
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
      RETURNING id, username, first_name, last_name, email, role, department, is_active, created_at, updated_at
    `;
    
    const values = [
      username, 
      password_hash, 
      first_name, 
      last_name, 
      email, 
      role, 
      department,
      is_active
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Update a user record
   * @param {string} id - UUID of the user
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user record
   */
  static async update(id, userData) {
    const { 
      first_name, 
      last_name, 
      email, 
      role, 
      department,
      is_active
    } = userData;
    
    const query = `
      UPDATE users 
      SET 
        first_name = $1, 
        last_name = $2, 
        email = $3, 
        role = $4, 
        department = $5,
        is_active = $6,
        updated_at = NOW()
      WHERE id = $7
      RETURNING id, username, first_name, last_name, email, role, department, is_active, created_at, updated_at
    `;
    
    const values = [
      first_name, 
      last_name, 
      email, 
      role, 
      department,
      is_active,
      id
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Update user password
   * @param {string} id - UUID of the user
   * @param {string} password - New password
   * @returns {Promise<boolean>} True if updated, false otherwise
   */
  static async updatePassword(id, password) {
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    const query = `
      UPDATE users 
      SET 
        password_hash = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING id
    `;
    
    const result = await db.query(query, [password_hash, id]);
    return result.rowCount > 0;
  }

  /**
   * Update last login timestamp
   * @param {string} id - UUID of the user
   * @returns {Promise<boolean>} True if updated, false otherwise
   */
  static async updateLastLogin(id) {
    const query = `
      UPDATE users 
      SET last_login = NOW()
      WHERE id = $1
      RETURNING id
    `;
    
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Delete a user record
   * @param {string} id - UUID of the user
   * @returns {Promise<boolean>} True if deleted, false otherwise
   */
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Verify password
   * @param {string} password - Password to verify
   * @param {string} hash - Password hash from database
   * @returns {Promise<boolean>} True if password matches, false otherwise
   */
  static async verifyPassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }
}

module.exports = User;
