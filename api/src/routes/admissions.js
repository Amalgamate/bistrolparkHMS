import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
const router = express.Router();

// Database configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bristol_park_hmis',
  password: 'password',
  port: 5432,
});

// Get comprehensive ward management data
router.get('/ward-management', async (req, res) => {
  try {
    const client = await pool.connect();

    try {
      // Get comprehensive ward and bed data with real database integration
      const result = await client.query(`
        SELECT
          a.hospital_id,
          a.ward_id,
          a.bed_id,
          a.patient_id,
          a.admission_date,
          a.discharge_date,
          a.daily_bed_rate,
          a.admission_category_id,
          a.diagnosis,
          a.doctor_admitting,
          CASE
            WHEN a.discharge_date IS NULL OR a.discharge_date = '' THEN 'Occupied'
            ELSE 'Available'
          END as bed_status,
          EXTRACT(DAYS FROM (CURRENT_DATE - a.admission_date::date)) as length_of_stay,
          pd.first_name,
          pd.last_name,
          pd.patient_gender,
          pd.patient_phone,
          ac.admission_category_description
        FROM admissions a
        LEFT JOIN patient_details pd ON a.patient_id = pd.patient_id
        LEFT JOIN admission_categories ac ON a.admission_category_id = ac.admission_category_id
        WHERE a.bed_id IS NOT NULL
        ORDER BY a.hospital_id, a.ward_id, a.bed_id
      `);

      res.json({
        success: true,
        data: result.rows,
        message: 'Ward management data retrieved successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching ward management data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ward management data',
      error: error.message
    });
  }
});

// Get department summary for Bristol Park Hospital
router.get('/departments', async (req, res) => {
  try {
    const client = await pool.connect();

    try {
      // Get department summary from admission categories
      const result = await client.query(`
        SELECT
          ac.admission_category_description as department_name,
          COUNT(DISTINCT a.ward_id) as ward_count,
          COUNT(DISTINCT a.bed_id) as total_beds,
          COUNT(CASE WHEN a.discharge_date IS NULL OR a.discharge_date = '' THEN 1 END) as occupied_beds,
          COUNT(DISTINCT a.bed_id) - COUNT(CASE WHEN a.discharge_date IS NULL OR a.discharge_date = '' THEN 1 END) as available_beds,
          ROUND(
            (COUNT(CASE WHEN a.discharge_date IS NULL OR a.discharge_date = '' THEN 1 END)::DECIMAL /
             NULLIF(COUNT(DISTINCT a.bed_id), 0)) * 100, 2
          ) as avg_occupancy_percentage,
          COUNT(CASE WHEN a.discharge_date IS NULL OR a.discharge_date = '' THEN 1 END) as total_patients
        FROM admission_categories ac
        LEFT JOIN admissions a ON ac.admission_category_id = a.admission_category_id AND a.bed_id IS NOT NULL
        WHERE ac.admission_category_description IS NOT NULL
        GROUP BY ac.admission_category_description
        HAVING COUNT(DISTINCT a.bed_id) > 0
        ORDER BY total_beds DESC
      `);

      res.json({
        success: true,
        data: result.rows,
        message: 'Department summary retrieved successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch department data',
      error: error.message
    });
  }
});

// Get ward overview with real data
router.get('/wards', async (req, res) => {
  try {
    const client = await pool.connect();

    try {
      const { department, hospital_id, occupancy_status } = req.query;

      let query = `
        SELECT
          a.hospital_id,
          a.ward_id,
          ('Ward ' || a.ward_id) as ward_name,
          ac.admission_category_description as ward_type,
          COUNT(DISTINCT a.bed_id) as total_beds,
          COUNT(CASE WHEN a.discharge_date IS NULL OR a.discharge_date = '' THEN 1 END) as occupied_beds,
          COUNT(DISTINCT a.bed_id) - COUNT(CASE WHEN a.discharge_date IS NULL OR a.discharge_date = '' THEN 1 END) as available_beds,
          ROUND(
            (COUNT(CASE WHEN a.discharge_date IS NULL OR a.discharge_date = '' THEN 1 END)::DECIMAL /
             NULLIF(COUNT(DISTINCT a.bed_id), 0)) * 100, 2
          ) as occupancy_percentage,
          COUNT(CASE WHEN a.discharge_date IS NULL OR a.discharge_date = '' THEN 1 END) as current_patients,
          ROUND(AVG(a.daily_bed_rate), 2) as avg_daily_rate
        FROM admissions a
        LEFT JOIN admission_categories ac ON a.admission_category_id = ac.admission_category_id
        WHERE a.bed_id IS NOT NULL
      `;

      const params = [];
      let paramCount = 0;

      if (department && department !== 'all') {
        paramCount++;
        query += ` AND ac.admission_category_description = $${paramCount}`;
        params.push(department);
      }

      if (hospital_id) {
        paramCount++;
        query += ` AND a.hospital_id = $${paramCount}`;
        params.push(hospital_id);
      }

      query += ` GROUP BY a.hospital_id, a.ward_id, ac.admission_category_description`;
      query += ` ORDER BY a.hospital_id, a.ward_id`;

      const result = await client.query(query, params);

      res.json({
        success: true,
        data: result.rows,
        message: 'Ward overview retrieved successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching wards:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ward data',
      error: error.message
    });
  }
});

// Get hospital branches/locations
router.get('/branches', async (req, res) => {
  try {
    const client = await pool.connect();

    try {
      const result = await client.query(`
        SELECT
          a.hospital_id,
          CASE
            WHEN a.hospital_id = 18 THEN 'Bristol Park Hospital - Main'
            WHEN a.hospital_id = 19 THEN 'Bristol Park Hospital - Fedha'
            WHEN a.hospital_id = 20 THEN 'Bristol Park Hospital - Utawala'
            WHEN a.hospital_id = 21 THEN 'Bristol Park Hospital - Tassia'
            WHEN a.hospital_id = 22 THEN 'Bristol Park Hospital - Machakos'
            WHEN a.hospital_id = 23 THEN 'Bristol Park Hospital - Kitengela'
            ELSE ('Hospital ' || a.hospital_id)
          END as hospital_name,
          COUNT(DISTINCT a.ward_id) as total_wards,
          COUNT(DISTINCT a.bed_id) as total_beds,
          COUNT(CASE WHEN a.discharge_date IS NULL OR a.discharge_date = '' THEN 1 END) as occupied_beds,
          COUNT(DISTINCT a.bed_id) - COUNT(CASE WHEN a.discharge_date IS NULL OR a.discharge_date = '' THEN 1 END) as available_beds,
          ROUND(
            (COUNT(CASE WHEN a.discharge_date IS NULL OR a.discharge_date = '' THEN 1 END)::DECIMAL /
             NULLIF(COUNT(DISTINCT a.bed_id), 0)) * 100, 2
          ) as occupancy_percentage
        FROM admissions a
        WHERE a.bed_id IS NOT NULL AND a.hospital_id IS NOT NULL
        GROUP BY a.hospital_id
        ORDER BY a.hospital_id
      `);

      res.json({
        success: true,
        data: result.rows,
        message: 'Hospital branches retrieved successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching branches:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch branch data',
      error: error.message
    });
  }
});

// Get hospital statistics
router.get('/hospital-stats', async (req, res) => {
  try {
    const client = await pool.connect();

    try {
      const result = await client.query(`
        SELECT
          COUNT(*) as total_wards,
          SUM(total_beds) as total_beds,
          SUM(occupied_beds) as total_occupied,
          SUM(available_beds) as total_available,
          ROUND(
            (SUM(occupied_beds)::DECIMAL / NULLIF(SUM(total_beds), 0)) * 100, 2
          ) as overall_occupancy_percentage,
          SUM(current_patients) as total_patients
        FROM bristol_park_overview
      `);

      res.json({
        success: true,
        data: result.rows[0],
        message: 'Hospital statistics retrieved successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching hospital stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hospital statistics',
      error: error.message
    });
  }
});

// Get bed details
router.get('/beds', async (req, res) => {
  try {
    const client = await pool.connect();

    try {
      const { ward_id, department, status } = req.query;

      let query = `
        SELECT * FROM bristol_park_bed_details
        WHERE 1=1
      `;

      const params = [];
      let paramCount = 0;

      if (ward_id) {
        paramCount++;
        query += ` AND ward_id = $${paramCount}`;
        params.push(ward_id);
      }

      if (department) {
        paramCount++;
        query += ` AND ward_type = $${paramCount}`;
        params.push(department);
      }

      if (status) {
        paramCount++;
        query += ` AND bed_status = $${paramCount}`;
        params.push(status);
      }

      query += ` ORDER BY ward_id, bed_id`;

      const result = await client.query(query, params);

      res.json({
        success: true,
        data: result.rows,
        message: 'Bed details retrieved successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching bed details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bed details',
      error: error.message
    });
  }
});

// Get transferable patients
router.get('/patients/transferable', async (req, res) => {
  try {
    const client = await pool.connect();

    try {
      const { ward_id, department } = req.query;

      let query = `
        SELECT
          a.admission_id,
          a.patient_id,
          CONCAT(pd.first_name, ' ', COALESCE(pd.middle_name, ''), ' ', pd.last_name) as patient_name,
          pd.patient_gender,
          a.ward_id as current_ward_id,
          ('Ward ' || a.ward_id) as current_ward_name,
          a.bed_id as current_bed_id,
          ('Bed-' || a.bed_id) as current_bed_number,
          18 as current_branch_id,
          'Bristol Park Hospital' as current_branch_name,
          a.diagnosis,
          a.doctor_admitting,
          ac.admission_category_description,
          EXTRACT(DAYS FROM (CURRENT_DATE - a.admission_date::date)) as length_of_stay
        FROM admissions a
        LEFT JOIN admission_categories ac ON a.admission_category_id = ac.admission_category_id
        LEFT JOIN patient_details pd ON a.patient_id = pd.patient_id
        WHERE (a.discharge_date IS NULL OR a.discharge_date = '')
          AND a.ward_id IS NOT NULL
          AND a.bed_id IS NOT NULL
          AND pd.first_name IS NOT NULL
          AND pd.last_name IS NOT NULL
          AND pd.first_name != ''
          AND pd.last_name != ''
      `;

      const params = [];
      let paramCount = 0;

      if (ward_id) {
        paramCount++;
        query += ` AND a.ward_id = $${paramCount}`;
        params.push(ward_id);
      }

      if (department) {
        paramCount++;
        query += ` AND ac.admission_category_description = $${paramCount}`;
        params.push(department.toUpperCase());
      }

      query += ` ORDER BY length_of_stay DESC`;

      const result = await client.query(query, params);

      res.json({
        success: true,
        data: result.rows,
        message: 'Transferable patients retrieved successfully'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching transferable patients:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transferable patients',
      error: error.message
    });
  }
});

// Test endpoint to verify API is working
router.get('/test', async (req, res) => {
  try {
    const client = await pool.connect();

    try {
      const result = await client.query('SELECT NOW() as current_time, \'Bristol Park Hospital API\' as message');

      res.json({
        success: true,
        data: result.rows[0],
        message: 'Bristol Park Hospital API is working!'
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error in test endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'API test failed',
      error: error.message
    });
  }
});

export default router;
