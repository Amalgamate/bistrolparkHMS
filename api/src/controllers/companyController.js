import db from '../utils/db.js';

// Get all companies
export const getAllCompanies = async (req, res) => {
    try {

        const search = req.params.search || '';

        const query = search
            ? {
                text: `SELECT * FROM company_details WHERE company_name ILIKE $1 ORDER BY company_name ASC LIMIT 20`,
                values: [`%${search}%`],
            }
            : {
                text: `SELECT * FROM company_details ORDER BY company_name ASC LIMIT 20`,
            };

        const result = await db.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching companies:', error);
        res.status(500).json({ message: 'Error fetching companies', error: error.message });
    }
};


// Get company by ID
export const getCompanyById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM company_details WHERE company_id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Company not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching company:', error);
        res.status(500).json({ message: 'Error fetching company', error: error.message });
    }
};
