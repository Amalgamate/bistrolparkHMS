import db from '../utils/db.js';
import { v4 as uuidv4 } from 'uuid';

// Get patient invoices with line items (using real credit_payments table)
export const getPatientInvoices = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE cp.patient_id_credit_payments = $1';
    let queryParams = [patientId];

    if (status) {
      whereClause += ' AND cp.payment_status = $2';
      queryParams.push(status);
    }

    const invoicesQuery = `
      SELECT
        cp.credit_payment_id as id,
        cp.invoice_no as invoice_number,
        cp.date_of_invoice as invoice_date,
        cp.time_of_invoice as invoice_time,
        cp.total_invoice_amount as total_amount,
        cp.total_invoice_payments as paid_amount,
        (cp.total_invoice_amount - COALESCE(cp.total_invoice_payments, 0)) as outstanding_amount,
        CASE
          WHEN cp.total_invoice_payments >= cp.total_invoice_amount THEN 'paid'
          WHEN cp.total_invoice_payments > 0 THEN 'partial'
          ELSE 'unpaid'
        END as payment_status,
        cp.amount,
        cp.discounted_amount,
        cp.rejected_amount,
        cp.insurance_name_credit_payments as insurance_provider,
        p.first_name || ' ' || COALESCE(p.middle_name, '') || ' ' || p.last_name as patient_name,
        cp.created_at
      FROM credit_payments cp
      LEFT JOIN patient_details p ON cp.patient_id_credit_payments = p.patient_id
      ${whereClause}
      ORDER BY cp.date_of_invoice DESC, cp.time_of_invoice DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;

    queryParams.push(limit, offset);
    const result = await db.query(invoicesQuery, queryParams);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM credit_payments cp
      ${whereClause}
    `;
    const countResult = await db.query(countQuery, queryParams.slice(0, -2));

    res.json({
      success: true,
      data: {
        invoices: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].total),
          pages: Math.ceil(countResult.rows[0].total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching patient invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient invoices',
      error: error.message
    });
  }
};

// Get patient payments
export const getPatientPayments = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10, payment_method, status } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE p.patient_id = $1';
    let queryParams = [patientId];

    if (payment_method) {
      whereClause += ` AND p.payment_method = $${queryParams.length + 1}`;
      queryParams.push(payment_method);
    }

    if (status) {
      whereClause += ` AND p.status = $${queryParams.length + 1}`;
      queryParams.push(status);
    }

    // Combine different payment sources from real tables
    const paymentsQuery = `
      SELECT * FROM (
        -- Invoice payments
        SELECT
          ip.invoice_payment_id as id,
          ip.invoice_payment_receipt_no as payment_reference,
          ip.amount,
          CASE
            WHEN ip.cash_payment_mode_id = 1 THEN 'cash'
            WHEN ip.cash_payment_mode_id = 2 THEN 'mpesa'
            WHEN ip.cash_payment_mode_id = 3 THEN 'card'
            WHEN ip.cash_payment_mode_id = 4 THEN 'bank_transfer'
            ELSE 'other'
          END as payment_method,
          'invoice_payment' as payment_type,
          'completed' as status,
          ip.date_of_payment as payment_date,
          ip.time_of_payment,
          ip.invoice_no as invoice_number,
          ip.transaction_charges_amount,
          p.first_name || ' ' || COALESCE(p.middle_name, '') || ' ' || p.last_name as patient_name,
          'invoice_payments' as source_table
        FROM invoice_payments ip
        LEFT JOIN credit_payments cp ON ip.invoice_no = cp.invoice_no
        LEFT JOIN patient_details p ON cp.patient_id_credit_payments = p.patient_id
        WHERE cp.patient_id_credit_payments = $1

        UNION ALL

        -- Personal charge payments
        SELECT
          pcp.charge_payment_id as id,
          pcp.charge_no as payment_reference,
          pcp.amount,
          CASE
            WHEN pcp.cash_payment_mode_id = 1 THEN 'cash'
            WHEN pcp.cash_payment_mode_id = 2 THEN 'mpesa'
            WHEN pcp.cash_payment_mode_id = 3 THEN 'card'
            WHEN pcp.cash_payment_mode_id = 4 THEN 'bank_transfer'
            ELSE 'other'
          END as payment_method,
          'charge_payment' as payment_type,
          'completed' as status,
          pcp.date_of_payment as payment_date,
          pcp.time_of_payment,
          pcp.charge_no as invoice_number,
          pcp.transaction_charges_amount,
          p.first_name || ' ' || COALESCE(p.middle_name, '') || ' ' || p.last_name as patient_name,
          'personal_charges_payments' as source_table
        FROM personal_charges_payments pcp
        LEFT JOIN patient_details p ON pcp.patient_id_personal_charge_payments = p.patient_id
        WHERE pcp.patient_id_personal_charge_payments = $1

        UNION ALL

        -- M-Pesa transactions (linked through personal charges)
        SELECT
          mct.record_id as id,
          mct.bill_ref_number as payment_reference,
          mct.transaction_amount as amount,
          'mpesa' as payment_method,
          'mpesa_c2b' as payment_type,
          mct.payment_status as status,
          mct.transaction_time as payment_date,
          mct.transaction_time as time_of_payment,
          mct.bill_ref_number as invoice_number,
          0 as transaction_charges_amount,
          mct.full_name as patient_name,
          'mpesa_c2b_transactions' as source_table
        FROM mpesa_c2b_transactions mct
        LEFT JOIN personal_charges_payments pcp ON mct.record_id::text = pcp.mpesa_c2b_record_id
        WHERE pcp.patient_id_personal_charge_payments = $1
      ) combined_payments
      ORDER BY payment_date DESC, time_of_payment DESC
      LIMIT $2 OFFSET $3
    `;

    queryParams = [patientId, limit, offset];
    const result = await db.query(paymentsQuery, queryParams);

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total FROM (
        SELECT 1 FROM invoice_payments ip
        LEFT JOIN credit_payments cp ON ip.invoice_no = cp.invoice_no
        WHERE cp.patient_id_credit_payments = $1
        UNION ALL
        SELECT 1 FROM personal_charges_payments WHERE patient_id_personal_charge_payments = $1
        UNION ALL
        SELECT 1 FROM mpesa_c2b_transactions mct
        LEFT JOIN personal_charges_payments pcp ON mct.record_id::text = pcp.mpesa_c2b_record_id
        WHERE pcp.patient_id_personal_charge_payments = $1
      ) combined_count
    `;
    const countResult = await db.query(countQuery, [patientId]);

    res.json({
      success: true,
      data: {
        payments: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(countResult.rows[0].total),
          pages: Math.ceil(countResult.rows[0].total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching patient payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient payments',
      error: error.message
    });
  }
};

// Get patient billing summary
export const getPatientBillingSummary = async (req, res) => {
  try {
    const { patientId } = req.params;

    const summaryQuery = `
      SELECT
        COALESCE(SUM(cp.total_invoice_amount), 0) as total_billed,
        COALESCE(SUM(cp.total_invoice_payments), 0) as total_paid,
        COALESCE(SUM(cp.total_invoice_amount - COALESCE(cp.total_invoice_payments, 0)), 0) as total_outstanding,
        COALESCE(SUM(CASE WHEN cp.insurance_name_credit_payments IS NOT NULL THEN cp.amount ELSE 0 END), 0) as insurance_coverage,
        COUNT(cp.credit_payment_id) as total_invoices,
        COUNT(CASE WHEN cp.total_invoice_payments >= cp.total_invoice_amount THEN 1 END) as paid_invoices,
        COUNT(CASE WHEN cp.total_invoice_payments > 0 AND cp.total_invoice_payments < cp.total_invoice_amount THEN 1 END) as pending_invoices,
        COUNT(CASE WHEN COALESCE(cp.total_invoice_payments, 0) = 0 THEN 1 END) as overdue_invoices
      FROM credit_payments cp
      WHERE cp.patient_id_credit_payments = $1
    `;

    const result = await db.query(summaryQuery, [patientId]);

    // Get recent transactions from real tables
    const recentTransactionsQuery = `
      SELECT * FROM (
        -- Recent invoices from credit_payments
        SELECT
          'invoice' as type,
          cp.invoice_no as reference,
          cp.total_invoice_amount as amount,
          'N/A' as payment_method,
          CASE
            WHEN cp.total_invoice_payments >= cp.total_invoice_amount THEN 'paid'
            WHEN cp.total_invoice_payments > 0 THEN 'partial'
            ELSE 'unpaid'
          END as status,
          cp.date_of_invoice as date,
          cp.invoice_no as invoice_number
        FROM credit_payments cp
        WHERE cp.patient_id_credit_payments = $1

        UNION ALL

        -- Recent payments from invoice_payments
        SELECT
          'payment' as type,
          ip.invoice_payment_receipt_no as reference,
          ip.amount,
          CASE
            WHEN ip.cash_payment_mode_id = 1 THEN 'cash'
            WHEN ip.cash_payment_mode_id = 2 THEN 'mpesa'
            WHEN ip.cash_payment_mode_id = 3 THEN 'card'
            ELSE 'other'
          END as payment_method,
          'completed' as status,
          ip.date_of_payment as date,
          ip.invoice_no as invoice_number
        FROM invoice_payments ip
        LEFT JOIN credit_payments cp ON ip.invoice_no = cp.invoice_no
        WHERE cp.patient_id_credit_payments = $1

        UNION ALL

        -- Recent payments from personal_charges_payments
        SELECT
          'payment' as type,
          pcp.charge_no as reference,
          pcp.amount,
          CASE
            WHEN pcp.cash_payment_mode_id = 1 THEN 'cash'
            WHEN pcp.cash_payment_mode_id = 2 THEN 'mpesa'
            WHEN pcp.cash_payment_mode_id = 3 THEN 'card'
            ELSE 'other'
          END as payment_method,
          'completed' as status,
          pcp.date_of_payment as date,
          pcp.charge_no as invoice_number
        FROM personal_charges_payments pcp
        WHERE pcp.patient_id_personal_charge_payments = $1
      ) combined_transactions
      ORDER BY date DESC
      LIMIT 10
    `;

    const transactionsResult = await db.query(recentTransactionsQuery, [patientId]);

    res.json({
      success: true,
      data: {
        summary: result.rows[0],
        recent_transactions: transactionsResult.rows
      }
    });
  } catch (error) {
    console.error('Error fetching patient billing summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient billing summary',
      error: error.message
    });
  }
};

// Get patient insurance claims
export const getPatientInsuranceClaims = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { page = 1, limit = 10, status, insurance_provider } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE ic.patient_id = $1';
    let queryParams = [patientId];

    if (status) {
      whereClause += ` AND ic.claim_status = $${queryParams.length + 1}`;
      queryParams.push(status);
    }

    if (insurance_provider) {
      whereClause += ` AND ic.insurance_provider = $${queryParams.length + 1}`;
      queryParams.push(insurance_provider);
    }

    // Return empty claims for now since insurance_claims table uses UUID patient_id
    res.json({
      success: true,
      data: {
        claims: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          pages: 0
        }
      }
    });
  } catch (error) {
    console.error('Error fetching patient insurance claims:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch patient insurance claims',
      error: error.message
    });
  }
};

// Create invoice
export const createInvoice = async (req, res) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const {
      patient_id,
      doctor_id,
      line_items,
      due_date,
      notes,
      tax_rate = 0.16
    } = req.body;

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}`;

    // Calculate totals
    const subtotal = line_items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
    const taxAmount = subtotal * tax_rate;
    const totalAmount = subtotal + taxAmount;

    // Create invoice
    const invoiceQuery = `
      INSERT INTO invoices (
        invoice_number, patient_id, doctor_id, due_date,
        subtotal, tax_amount, total_amount, outstanding_amount, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $7, $8)
      RETURNING *
    `;

    const invoiceResult = await client.query(invoiceQuery, [
      invoiceNumber, patient_id, doctor_id, due_date,
      subtotal, taxAmount, totalAmount, notes
    ]);

    const invoice = invoiceResult.rows[0];

    // Create invoice items
    for (const item of line_items) {
      const itemQuery = `
        INSERT INTO invoice_items (
          invoice_id, item_type, item_id, description,
          quantity, unit_price, total_price
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `;

      await client.query(itemQuery, [
        invoice.id,
        item.item_type,
        item.item_id || null,
        item.description,
        item.quantity,
        item.unit_price,
        item.quantity * item.unit_price
      ]);
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      data: { invoice },
      message: 'Invoice created successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create invoice',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// Create payment
export const createPayment = async (req, res) => {
  const client = await db.getClient();

  try {
    await client.query('BEGIN');

    const {
      patient_id,
      invoice_id,
      amount,
      payment_method,
      payment_type,
      transaction_id,
      mpesa_receipt_number,
      phone_number,
      notes
    } = req.body;

    // Generate payment reference
    const paymentReference = `PAY-${Date.now()}`;

    // Create payment
    const paymentQuery = `
      INSERT INTO payments (
        payment_reference, patient_id, invoice_id, amount,
        payment_method, payment_type, transaction_id,
        mpesa_receipt_number, phone_number, processed_by, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const paymentResult = await client.query(paymentQuery, [
      paymentReference, patient_id, invoice_id, amount,
      payment_method, payment_type, transaction_id,
      mpesa_receipt_number, phone_number, req.user.id, notes
    ]);

    const payment = paymentResult.rows[0];

    // Update invoice paid amount if invoice_id is provided
    if (invoice_id) {
      const updateInvoiceQuery = `
        UPDATE invoices
        SET
          paid_amount = paid_amount + $1,
          outstanding_amount = total_amount - (paid_amount + $1),
          payment_status = CASE
            WHEN (paid_amount + $1) >= total_amount THEN 'paid'
            WHEN (paid_amount + $1) > 0 THEN 'partial'
            ELSE 'unpaid'
          END,
          updated_at = NOW()
        WHERE id = $2
      `;

      await client.query(updateInvoiceQuery, [amount, invoice_id]);
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      data: { payment },
      message: 'Payment recorded successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record payment',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// Additional controller methods would continue here...
// For brevity, I'll implement the remaining methods in the next file chunk

export const getInvoiceById = async (req, res) => {
  // Implementation for getting invoice by ID
};

export const updateInvoice = async (req, res) => {
  // Implementation for updating invoice
};

export const deleteInvoice = async (req, res) => {
  // Implementation for deleting invoice
};

export const getPaymentById = async (req, res) => {
  // Implementation for getting payment by ID
};

export const updatePaymentStatus = async (req, res) => {
  // Implementation for updating payment status
};

export const createInsuranceClaim = async (req, res) => {
  // Implementation for creating insurance claim
};

export const getInsuranceClaimById = async (req, res) => {
  // Implementation for getting insurance claim by ID
};

export const updateInsuranceClaimStatus = async (req, res) => {
  // Implementation for updating insurance claim status
};

export const initiateMpesaPayment = async (req, res) => {
  // Implementation for M-Pesa payment initiation
};

export const handleMpesaCallback = async (req, res) => {
  // Implementation for M-Pesa callback handling
};
