import db from '../utils/db.js';

// Get all prescriptions
const getAllPrescriptions = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, 
             pt.first_name as patient_first_name, pt.last_name as patient_last_name,
             u.first_name as doctor_first_name, u.last_name as doctor_last_name
      FROM prescriptions p
      LEFT JOIN patients pt ON p.patient_id = pt.id
      LEFT JOIN users u ON p.doctor_id = u.id
      ORDER BY p.prescription_date DESC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
  }
};

// Get prescription by ID with items
const getPrescriptionById = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Get prescription details
    const prescriptionResult = await db.query(`
      SELECT p.*, 
             pt.first_name as patient_first_name, pt.last_name as patient_last_name,
             u.first_name as doctor_first_name, u.last_name as doctor_last_name
      FROM prescriptions p
      LEFT JOIN patients pt ON p.patient_id = pt.id
      LEFT JOIN users u ON p.doctor_id = u.id
      WHERE p.id = $1
    `, [id]);
    
    if (prescriptionResult.rows.length === 0) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    // Get prescription items
    const itemsResult = await db.query(`
      SELECT pi.*, m.name as medication_name, m.dosage as medication_dosage
      FROM prescription_items pi
      LEFT JOIN medications m ON pi.medication_id = m.id
      WHERE pi.prescription_id = $1
    `, [id]);
    
    // Combine results
    const prescription = prescriptionResult.rows[0];
    prescription.items = itemsResult.rows;
    
    res.status(200).json(prescription);
  } catch (error) {
    console.error(`Error fetching prescription with ID ${id}:`, error);
    res.status(500).json({ message: 'Error fetching prescription', error: error.message });
  }
};

// Get prescriptions by patient ID
const getPrescriptionsByPatientId = async (req, res) => {
  const { patientId } = req.params;
  
  try {
    const result = await db.query(`
      SELECT p.*, 
             pt.first_name as patient_first_name, pt.last_name as patient_last_name,
             u.first_name as doctor_first_name, u.last_name as doctor_last_name
      FROM prescriptions p
      LEFT JOIN patients pt ON p.patient_id = pt.id
      LEFT JOIN users u ON p.doctor_id = u.id
      WHERE p.patient_id = $1
      ORDER BY p.prescription_date DESC
    `, [patientId]);
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(`Error fetching prescriptions for patient ID ${patientId}:`, error);
    res.status(500).json({ message: 'Error fetching prescriptions', error: error.message });
  }
};

// Create new prescription with items
const createPrescription = async (req, res) => {
  const { 
    patient_id, 
    doctor_id, 
    prescription_date, 
    status, 
    notes,
    items // Array of prescription items
  } = req.body;
  
  // Start a transaction
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Create prescription
    const prescriptionResult = await client.query(
      `INSERT INTO prescriptions (
        patient_id, doctor_id, prescription_date, status, notes
      ) 
      VALUES ($1, $2, $3, $4, $5) 
      RETURNING *`,
      [patient_id, doctor_id, prescription_date, status, notes]
    );
    
    const prescription = prescriptionResult.rows[0];
    const prescription_id = prescription.id;
    
    // Create prescription items
    if (items && items.length > 0) {
      for (const item of items) {
        await client.query(
          `INSERT INTO prescription_items (
            prescription_id, medication_id, dosage, frequency, duration, quantity, instructions
          ) 
          VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            prescription_id, 
            item.medication_id, 
            item.dosage, 
            item.frequency, 
            item.duration, 
            item.quantity, 
            item.instructions
          ]
        );
        
        // Update medication stock
        await client.query(
          `UPDATE medications 
           SET stock_quantity = stock_quantity - $1, 
               updated_at = CURRENT_TIMESTAMP
           WHERE id = $2`,
          [item.quantity, item.medication_id]
        );
      }
    }
    
    await client.query('COMMIT');
    
    // Get the complete prescription with items
    const completeResult = await db.query(`
      SELECT p.*, 
             pt.first_name as patient_first_name, pt.last_name as patient_last_name,
             u.first_name as doctor_first_name, u.last_name as doctor_last_name
      FROM prescriptions p
      LEFT JOIN patients pt ON p.patient_id = pt.id
      LEFT JOIN users u ON p.doctor_id = u.id
      WHERE p.id = $1
    `, [prescription_id]);
    
    const itemsResult = await db.query(`
      SELECT pi.*, m.name as medication_name, m.dosage as medication_dosage
      FROM prescription_items pi
      LEFT JOIN medications m ON pi.medication_id = m.id
      WHERE pi.prescription_id = $1
    `, [prescription_id]);
    
    const completePrescription = completeResult.rows[0];
    completePrescription.items = itemsResult.rows;
    
    res.status(201).json(completePrescription);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating prescription:', error);
    res.status(500).json({ message: 'Error creating prescription', error: error.message });
  } finally {
    client.release();
  }
};

// Update prescription status
const updatePrescriptionStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  try {
    const result = await db.query(
      `UPDATE prescriptions 
       SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 
       RETURNING *`,
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating status for prescription with ID ${id}:`, error);
    res.status(500).json({ message: 'Error updating prescription status', error: error.message });
  }
};

// Delete prescription
const deletePrescription = async (req, res) => {
  const { id } = req.params;
  
  // Start a transaction
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // Get prescription items to restore stock
    const itemsResult = await client.query(
      'SELECT * FROM prescription_items WHERE prescription_id = $1',
      [id]
    );
    
    // Restore medication stock
    for (const item of itemsResult.rows) {
      await client.query(
        `UPDATE medications 
         SET stock_quantity = stock_quantity + $1, 
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [item.quantity, item.medication_id]
      );
    }
    
    // Delete prescription items
    await client.query('DELETE FROM prescription_items WHERE prescription_id = $1', [id]);
    
    // Delete prescription
    const result = await client.query('DELETE FROM prescriptions WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    await client.query('COMMIT');
    
    res.status(200).json({ 
      message: 'Prescription deleted successfully', 
      prescription: result.rows[0] 
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`Error deleting prescription with ID ${id}:`, error);
    res.status(500).json({ message: 'Error deleting prescription', error: error.message });
  } finally {
    client.release();
  }
};

export {
  getAllPrescriptions,
  getPrescriptionById,
  getPrescriptionsByPatientId,
  createPrescription,
  updatePrescriptionStatus,
  deletePrescription
};
