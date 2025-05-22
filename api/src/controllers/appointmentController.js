import db from '../utils/db.js';

// Get all appointments
const getAllAppointments = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, 
             p.first_name as patient_first_name, p.last_name as patient_last_name,
             u.first_name as doctor_first_name, u.last_name as doctor_last_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.doctor_id = u.id
      ORDER BY a.appointment_date DESC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query(`
      SELECT a.*, 
             p.first_name as patient_first_name, p.last_name as patient_last_name,
             u.first_name as doctor_first_name, u.last_name as doctor_last_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.doctor_id = u.id
      WHERE a.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching appointment with ID ${id}:`, error);
    res.status(500).json({ message: 'Error fetching appointment', error: error.message });
  }
};

// Get appointments by patient ID
const getAppointmentsByPatientId = async (req, res) => {
  const { patientId } = req.params;
  
  try {
    const result = await db.query(`
      SELECT a.*, 
             p.first_name as patient_first_name, p.last_name as patient_last_name,
             u.first_name as doctor_first_name, u.last_name as doctor_last_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.doctor_id = u.id
      WHERE a.patient_id = $1
      ORDER BY a.appointment_date DESC
    `, [patientId]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(`Error fetching appointments for patient ID ${patientId}:`, error);
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// Get appointments by doctor ID
const getAppointmentsByDoctorId = async (req, res) => {
  const { doctorId } = req.params;
  
  try {
    const result = await db.query(`
      SELECT a.*, 
             p.first_name as patient_first_name, p.last_name as patient_last_name,
             u.first_name as doctor_first_name, u.last_name as doctor_last_name
      FROM appointments a
      LEFT JOIN patients p ON a.patient_id = p.id
      LEFT JOIN users u ON a.doctor_id = u.id
      WHERE a.doctor_id = $1
      ORDER BY a.appointment_date DESC
    `, [doctorId]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(`Error fetching appointments for doctor ID ${doctorId}:`, error);
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

// Create new appointment
const createAppointment = async (req, res) => {
  const { 
    patient_id, 
    doctor_id, 
    appointment_date, 
    status, 
    reason, 
    notes 
  } = req.body;
  
  try {
    const result = await db.query(
      `INSERT INTO appointments (
        patient_id, doctor_id, appointment_date, status, reason, notes
      ) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [patient_id, doctor_id, appointment_date, status, reason, notes]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Error creating appointment', error: error.message });
  }
};

// Update appointment
const updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { 
    patient_id, 
    doctor_id, 
    appointment_date, 
    status, 
    reason, 
    notes 
  } = req.body;
  
  try {
    const result = await db.query(
      `UPDATE appointments 
       SET patient_id = $1, doctor_id = $2, appointment_date = $3, 
           status = $4, reason = $5, notes = $6, updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [patient_id, doctor_id, appointment_date, status, reason, notes, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating appointment with ID ${id}:`, error);
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
};

// Delete appointment
const deleteAppointment = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    res.status(200).json({ message: 'Appointment deleted successfully', appointment: result.rows[0] });
  } catch (error) {
    console.error(`Error deleting appointment with ID ${id}:`, error);
    res.status(500).json({ message: 'Error deleting appointment', error: error.message });
  }
};

export {
  getAllAppointments,
  getAppointmentById,
  getAppointmentsByPatientId,
  getAppointmentsByDoctorId,
  createAppointment,
  updateAppointment,
  deleteAppointment
};
