const db = require('../utils/db');

/**
 * Patient model for database operations
 */
class Patient {
  /**
   * Get all patients with pagination
   * @param {number} limit - Number of records to return
   * @param {number} offset - Number of records to skip
   * @returns {Promise<Array>} Array of patient records
   */
  static async getAll(limit = 10, offset = 0) {
    const query = 'SELECT * FROM patients ORDER BY created_at DESC LIMIT $1 OFFSET $2';
    const result = await db.query(query, [limit, offset]);
    return result.rows;
  }

  /**
   * Get patient by ID
   * @param {string} id - UUID of the patient
   * @returns {Promise<Object>} Patient record
   */
  static async getById(id) {
    const query = 'SELECT * FROM patients WHERE id = $1';
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  /**
   * Get patient by MRN (Medical Record Number)
   * @param {string} mrn - Medical Record Number
   * @returns {Promise<Object>} Patient record
   */
  static async getByMRN(mrn) {
    const query = 'SELECT * FROM patients WHERE mrn = $1';
    const result = await db.query(query, [mrn]);
    return result.rows[0];
  }

  /**
   * Create a new patient
   * @param {Object} patientData - Patient data
   * @returns {Promise<Object>} Created patient record
   */
  static async create(patientData) {
    const { 
      mrn, 
      first_name, 
      last_name, 
      date_of_birth, 
      gender, 
      address, 
      phone, 
      email,
      insurance_provider,
      insurance_id,
      blood_type,
      allergies
    } = patientData;
    
    const query = `
      INSERT INTO patients (
        mrn, 
        first_name, 
        last_name, 
        date_of_birth, 
        gender, 
        address, 
        phone, 
        email,
        insurance_provider,
        insurance_id,
        blood_type,
        allergies
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;
    
    const values = [
      mrn, 
      first_name, 
      last_name, 
      date_of_birth, 
      gender, 
      address, 
      phone, 
      email,
      insurance_provider,
      insurance_id,
      blood_type,
      allergies
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Update a patient record
   * @param {string} id - UUID of the patient
   * @param {Object} patientData - Updated patient data
   * @returns {Promise<Object>} Updated patient record
   */
  static async update(id, patientData) {
    const { 
      first_name, 
      last_name, 
      date_of_birth, 
      gender, 
      address, 
      phone, 
      email,
      insurance_provider,
      insurance_id,
      blood_type,
      allergies
    } = patientData;
    
    const query = `
      UPDATE patients 
      SET 
        first_name = $1, 
        last_name = $2, 
        date_of_birth = $3, 
        gender = $4, 
        address = $5, 
        phone = $6, 
        email = $7,
        insurance_provider = $8,
        insurance_id = $9,
        blood_type = $10,
        allergies = $11,
        updated_at = NOW()
      WHERE id = $12
      RETURNING *
    `;
    
    const values = [
      first_name, 
      last_name, 
      date_of_birth, 
      gender, 
      address, 
      phone, 
      email,
      insurance_provider,
      insurance_id,
      blood_type,
      allergies,
      id
    ];
    
    const result = await db.query(query, values);
    return result.rows[0];
  }

  /**
   * Delete a patient record
   * @param {string} id - UUID of the patient
   * @returns {Promise<boolean>} True if deleted, false otherwise
   */
  static async delete(id) {
    const query = 'DELETE FROM patients WHERE id = $1 RETURNING id';
    const result = await db.query(query, [id]);
    return result.rowCount > 0;
  }

  /**
   * Search patients by name
   * @param {string} searchTerm - Search term
   * @param {number} limit - Number of records to return
   * @param {number} offset - Number of records to skip
   * @returns {Promise<Array>} Array of patient records
   */
  static async search(searchTerm, limit = 10, offset = 0) {
    const query = `
      SELECT * FROM patients 
      WHERE 
        first_name ILIKE $1 OR 
        last_name ILIKE $1 OR 
        mrn ILIKE $1
      ORDER BY created_at DESC 
      LIMIT $2 OFFSET $3
    `;
    
    const result = await db.query(query, [`%${searchTerm}%`, limit, offset]);
    return result.rows;
  }
}

module.exports = Patient;
