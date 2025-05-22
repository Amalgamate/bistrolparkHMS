import db from '../utils/db.js';

// Get all medications
const getAllMedications = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM medications ORDER BY name');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ message: 'Error fetching medications', error: error.message });
  }
};

// Get medication by ID
const getMedicationById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('SELECT * FROM medications WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error fetching medication with ID ${id}:`, error);
    res.status(500).json({ message: 'Error fetching medication', error: error.message });
  }
};

// Create new medication
const createMedication = async (req, res) => {
  const { 
    name, 
    description, 
    dosage, 
    manufacturer, 
    stock_quantity, 
    unit_price 
  } = req.body;
  
  try {
    const result = await db.query(
      `INSERT INTO medications (
        name, description, dosage, manufacturer, stock_quantity, unit_price
      ) 
      VALUES ($1, $2, $3, $4, $5, $6) 
      RETURNING *`,
      [name, description, dosage, manufacturer, stock_quantity, unit_price]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating medication:', error);
    res.status(500).json({ message: 'Error creating medication', error: error.message });
  }
};

// Update medication
const updateMedication = async (req, res) => {
  const { id } = req.params;
  const { 
    name, 
    description, 
    dosage, 
    manufacturer, 
    stock_quantity, 
    unit_price 
  } = req.body;
  
  try {
    const result = await db.query(
      `UPDATE medications 
       SET name = $1, description = $2, dosage = $3, 
           manufacturer = $4, stock_quantity = $5, unit_price = $6,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 
       RETURNING *`,
      [name, description, dosage, manufacturer, stock_quantity, unit_price, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating medication with ID ${id}:`, error);
    res.status(500).json({ message: 'Error updating medication', error: error.message });
  }
};

// Update medication stock
const updateMedicationStock = async (req, res) => {
  const { id } = req.params;
  const { stock_quantity } = req.body;
  
  try {
    const result = await db.query(
      `UPDATE medications 
       SET stock_quantity = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 
       RETURNING *`,
      [stock_quantity, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(`Error updating stock for medication with ID ${id}:`, error);
    res.status(500).json({ message: 'Error updating medication stock', error: error.message });
  }
};

// Delete medication
const deleteMedication = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('DELETE FROM medications WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    res.status(200).json({ message: 'Medication deleted successfully', medication: result.rows[0] });
  } catch (error) {
    console.error(`Error deleting medication with ID ${id}:`, error);
    res.status(500).json({ message: 'Error deleting medication', error: error.message });
  }
};

// Search medications
const searchMedications = async (req, res) => {
  const { query } = req.query;
  
  try {
    const result = await db.query(
      `SELECT * FROM medications 
       WHERE name ILIKE $1 OR description ILIKE $1 OR manufacturer ILIKE $1
       ORDER BY name`,
      [`%${query}%`]
    );
    
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(`Error searching medications with query ${query}:`, error);
    res.status(500).json({ message: 'Error searching medications', error: error.message });
  }
};

export {
  getAllMedications,
  getMedicationById,
  createMedication,
  updateMedication,
  updateMedicationStock,
  deleteMedication,
  searchMedications
};
