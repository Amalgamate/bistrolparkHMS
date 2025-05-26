import db from '../utils/db.js';

// Get all insurances
export const getAllInsurances = async (req, res) => {
    try {
        const search = req.params.search || '';

        const query = search
            ? {
                text: `SELECT * FROM insurance_details WHERE insurance_name ILIKE $1 ORDER BY insurance_name ASC LIMIT 20`,
                values: [`%${search}%`],
            }
            : {
                text: `SELECT * FROM insurance_details ORDER BY insurance_name ASC LIMIT 20`,
            };

        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching insurances:', error);
        res.status(500).json({ message: 'Error fetching insurances', error: error.message });
    }
};


// Get insurance by ID
export const getInsuranceById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM insurance_details WHERE insurance_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Insurance not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching insurance:', error);
        res.status(500).json({ message: 'Error fetching insurance', error: error.message });
    }
};
