import db from '../utils/db.js';

// Get all patients with pagination and search
const getAllPatients = async (req, res) => {
  try {
    // Extract pagination and search parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50; // Reduced default for better performance
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'patient_id';
    const sortOrder = req.query.sortOrder || 'DESC';
    const offset = (page - 1) * limit;

    // Validate sort parameters to prevent SQL injection
    const allowedSortFields = ['patient_id', 'first_name', 'last_name', 'date_created'];
    const allowedSortOrders = ['ASC', 'DESC'];

    const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'patient_id';
    const validSortOrder = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'DESC';

    // Build search conditions
    let searchCondition = `
      WHERE first_name IS NOT NULL
        AND last_name IS NOT NULL
        AND first_name != ''
        AND last_name != ''
    `;

    let searchParams = [];
    let paramIndex = 1;

    if (search.trim()) {
      searchCondition += ` AND (
        LOWER(first_name) LIKE LOWER($${paramIndex}) OR
        LOWER(last_name) LIKE LOWER($${paramIndex + 1}) OR
        LOWER(middle_name) LIKE LOWER($${paramIndex + 2}) OR
        LOWER(out_patient_file_no) LIKE LOWER($${paramIndex + 3}) OR
        LOWER(cell_phone) LIKE LOWER($${paramIndex + 4}) OR
        LOWER(id_number) LIKE LOWER($${paramIndex + 5})
      )`;
      const searchTerm = `%${search.trim()}%`;
      searchParams = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
      paramIndex += 6;
    }

    // Get total count for pagination info
    const countQuery = `
      SELECT COUNT(*) as total
      FROM patient_details
      ${searchCondition}
    `;

    const countResult = await db.query(countQuery, searchParams);
    const totalRecords = parseInt(countResult.rows[0].total);
    const totalPages = Math.ceil(totalRecords / limit);

    // Get paginated results
    const dataQuery = `
      SELECT
        patient_id as id,
        out_patient_file_no as mrn,
        first_name,
        middle_name,
        last_name,
        patient_gender as gender,
        dob as date_of_birth,
        cell_phone as phone,
        email,
        allergies,
        residence as address,
        nhif_no as insurance_id,
        id_number,
        date_created as created_at
      FROM patient_details
      ${searchCondition}
      ORDER BY ${validSortBy} ${validSortOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    const dataParams = [...searchParams, limit, offset];
    const result = await db.query(dataQuery, dataParams);

    // Transform the data to match expected format
    const transformedPatients = result.rows.map(patient => ({
      ...patient,
      gender: patient.gender === '0' ? 'Male' : 'Female',
      blood_type: null, // Not available in patient_details
      insurance_provider: patient.insurance_id ? 'NHIF' : null,
      full_name: `${patient.first_name} ${patient.middle_name || ''} ${patient.last_name}`.trim()
    }));

    // Return paginated response
    res.status(200).json({
      data: transformedPatients,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
        nextPage: page < totalPages ? page + 1 : null,
        previousPage: page > 1 ? page - 1 : null
      },
      search: search.trim() || null,
      sort: {
        field: validSortBy,
        order: validSortOrder
      }
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ message: 'Error fetching patients', error: error.message });
  }
};

// Get patient by ID
const getPatientById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`
      SELECT
        patient_id as id,
        out_patient_file_no as mrn,
        first_name,
        middle_name,
        last_name,
        patient_gender as gender,
        dob as date_of_birth,
        cell_phone as phone,
        email,
        allergies,
        residence as address,
        nhif_no as insurance_id,
        id_number,
        date_created as created_at
      FROM patient_details
      WHERE patient_id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Transform the data to match expected format
    const patient = result.rows[0];
    const transformedPatient = {
      ...patient,
      gender: patient.gender === '0' ? 'Male' : 'Female',
      blood_type: null, // Not available in patient_details
      insurance_provider: patient.insurance_id ? 'NHIF' : null
    };

    res.status(200).json(transformedPatient);
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
    blood_type,
    allergies,
    insurance_provider,
    insurance_id
  } = req.body;

  // Generate patient MRN (e.g., BP-YYYY-XXXX)
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
  const mrn = `BP-${year}-${randomNum}`;

  try {
    const result = await db.query(
      `INSERT INTO patients (
        mrn, first_name, last_name, date_of_birth, gender,
        address, phone, email, blood_type, allergies,
        insurance_provider, insurance_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        mrn, first_name, last_name, date_of_birth, gender,
        address, phone, email, blood_type, allergies,
        insurance_provider, insurance_id
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
    blood_type,
    allergies,
    insurance_provider,
    insurance_id
  } = req.body;

  try {
    const result = await db.query(
      `UPDATE patients
       SET first_name = $1, last_name = $2, date_of_birth = $3, gender = $4,
           address = $5, phone = $6, email = $7, blood_type = $8, allergies = $9,
           insurance_provider = $10, insurance_id = $11, updated_at = CURRENT_TIMESTAMP
       WHERE id = $12
       RETURNING *`,
      [
        first_name, last_name, date_of_birth, gender,
        address, phone, email, blood_type, allergies,
        insurance_provider, insurance_id, id
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
    const result = await db.query(`
      DELETE FROM patient_details
      WHERE patient_id = $1
      RETURNING patient_id as id, first_name, last_name
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.status(200).json({
      message: 'Patient deleted successfully',
      patient: result.rows[0]
    });
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
