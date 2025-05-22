import db from '../utils/db.js';

// Get all patients
const getAllPatients = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM patients ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
};

// Get patient by ID
const getPatientById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('SELECT * FROM patients WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching patient with ID ${id}:`, error);
    res.status(500).json({ message: 'Error fetching patient', error: error.message });
  }
};

// Create new patient
const createPatient = async (req, res) => {
  const { 
    first_name, 
    last_name, 
    date_of_birth, 
    gender, 
    address, 
    phone, 
    email, 
    emergency_contact, 
    emergency_phone, 
    blood_type, 
    allergies 
  } = req.body;
  
  // Generate patient ID (e.g., BP-YYYY-XXXX)
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  const patient_id = `BP-${year}-${randomNum}`;
  
  try {
    const result = await db.query(
      `INSERT INTO patients (
        patient_id, first_name, last_name, date_of_birth, gender, 
        address, phone, email, emergency_contact, emergency_phone, 
        blood_type, allergies
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *`,
      [
        patient_id, first_name, last_name, date_of_birth, gender, 
        address, phone, email, emergency_contact, emergency_phone, 
        blood_type, allergies
      ]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ message: 'Error creating patient', error: error.message });
  }
};

// Update patient
const updatePatient = async (req, res) => {
  const { id } = req.params;
  const { 
    first_name, 
    last_name, 
    date_of_birth, 
    gender, 
    address, 
    phone, 
    email, 
    emergency_contact, 
    emergency_phone, 
    blood_type, 
    allergies 
  } = req.body;
  
  try {
    const result = await db.query(
      `UPDATE patients 
       SET first_name = $1, last_name = $2, date_of_birth = $3, gender = $4, 
           address = $5, phone = $6, email = $7, emergency_contact = $8, 
           emergency_phone = $9, blood_type = $10, allergies = $11, 
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $12 
       RETURNING *`,
      [
        first_name, last_name, date_of_birth, gender, 
        address, phone, email, emergency_contact, 
        emergency_phone, blood_type, allergies, id
      ]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating patient with ID ${id}:`, error);
    res.status(500).json({ message: 'Error updating patient', error: error.message });
  }
};

// Delete patient
const deletePatient = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('DELETE FROM patients WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }
    
    res.status(200).json({ message: 'Patient deleted successfully', patient: result.rows[0] });
  } catch (error) {
    console.error(`Error deleting patient with ID ${id}:`, error);
    res.status(500).json({ message: 'Error deleting patient', error: error.message });
  }
};

export {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
};
