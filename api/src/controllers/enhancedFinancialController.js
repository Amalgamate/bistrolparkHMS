import db from '../utils/db.js';

// =====================================================
// PATIENT REGISTRATION → CASHIER WORKFLOW
// =====================================================

// Create new patient visit and consultation invoice
export const createPatientVisit = async (req, res) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    const {
      patient_id,
      visit_type = 'CONSULTATION',
      consultation_fee,
      assigned_doctor_id,
      insurance_pre_authorized = false,
      notes
    } = req.body;

    // Generate visit number
    const visitNumber = `VIS-${Date.now()}-${patient_id}`;
    
    // Create patient visit
    const visitResult = await client.query(`
      INSERT INTO patient_visits (
        patient_id, visit_number, visit_type, visit_date, visit_time,
        consultation_fee, payment_required, insurance_pre_authorized,
        assigned_doctor_id, notes, created_by
      )
      VALUES ($1, $2, $3, CURRENT_DATE, CURRENT_TIME, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [
      patient_id, visitNumber, visit_type, consultation_fee,
      !insurance_pre_authorized, insurance_pre_authorized,
      assigned_doctor_id, notes, req.user?.id
    ]);

    const visit = visitResult.rows[0];

    // Create consultation invoice if payment required
    let invoice = null;
    if (!insurance_pre_authorized && consultation_fee > 0) {
      const invoiceNumber = `INV-${Date.now()}-${patient_id}`;
      
      const invoiceResult = await client.query(`
        INSERT INTO invoices (
          invoice_number, patient_id, visit_id, invoice_type,
          invoice_date, due_date, subtotal, total_amount, outstanding_amount,
          status, payment_status, created_by
        )
        VALUES ($1, $2, $3, $4, CURRENT_DATE, CURRENT_DATE, $5, $5, $5, 'SENT', 'UNPAID', $6)
        RETURNING *
      `, [
        invoiceNumber, patient_id, visit.id, 'CONSULTATION',
        consultation_fee, req.user?.id
      ]);

      invoice = invoiceResult.rows[0];

      // Add consultation line item
      await client.query(`
        INSERT INTO invoice_line_items (
          invoice_id, service_code, service_name, service_category,
          quantity, unit_price, total_amount
        )
        VALUES ($1, 'CONS001', 'General Consultation', 'CONSULTATION', 1, $2, $2)
      `, [invoice.id, consultation_fee]);
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      data: {
        visit,
        invoice,
        next_step: insurance_pre_authorized ? 'PROCEED_TO_CONSULTATION' : 'PROCEED_TO_CASHIER'
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating patient visit:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create patient visit',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// Process consultation payment
export const processConsultationPayment = async (req, res) => {
  const client = await db.getClient();
  
  try {
    await client.query('BEGIN');
    
    const {
      visit_id,
      invoice_id,
      payment_method_code,
      amount,
      external_reference,
      notes
    } = req.body;

    // Get payment method details
    const paymentMethodResult = await client.query(`
      SELECT * FROM payment_methods WHERE method_code = $1 AND is_active = true
    `, [payment_method_code]);

    if (paymentMethodResult.rows.length === 0) {
      throw new Error('Invalid payment method');
    }

    const paymentMethod = paymentMethodResult.rows[0];

    // Calculate processing fees
    const processingFee = (amount * paymentMethod.processing_fee_percentage) + paymentMethod.processing_fee_fixed;
    const netAmount = amount - processingFee;

    // Generate payment reference
    const paymentReference = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create payment record
    const paymentResult = await client.query(`
      INSERT INTO payments (
        payment_reference, patient_id, invoice_id, payment_method_id,
        amount, processing_fee, net_amount, external_reference,
        status, payment_date, processed_date, notes, processed_by
      )
      VALUES (
        $1, 
        (SELECT patient_id FROM patient_visits WHERE id = $2),
        $3, $4, $5, $6, $7, $8, 'COMPLETED', NOW(), NOW(), $9, $10
      )
      RETURNING *
    `, [
      paymentReference, visit_id, invoice_id, paymentMethod.id,
      amount, processingFee, netAmount, external_reference,
      notes, req.user?.id
    ]);

    // Update invoice payment status
    await client.query(`
      UPDATE invoices SET
        paid_amount = paid_amount + $1,
        outstanding_amount = total_amount - (paid_amount + $1),
        payment_status = CASE 
          WHEN (paid_amount + $1) >= total_amount THEN 'PAID'
          WHEN (paid_amount + $1) > 0 THEN 'PARTIAL'
          ELSE 'UNPAID'
        END,
        updated_at = NOW()
      WHERE id = $2
    `, [amount, invoice_id]);

    // Update visit payment status
    await client.query(`
      UPDATE patient_visits SET
        payment_status = 'PAID',
        cashier_id = $1,
        updated_at = NOW()
      WHERE id = $2
    `, [req.user?.id, visit_id]);

    // Create accounting entries
    await createAccountingEntries(client, {
      type: 'CONSULTATION_PAYMENT',
      amount: netAmount,
      processing_fee: processingFee,
      payment_method: paymentMethod,
      reference_id: paymentResult.rows[0].id,
      description: `Consultation payment - ${paymentReference}`
    });

    await client.query('COMMIT');

    res.json({
      success: true,
      data: {
        payment: paymentResult.rows[0],
        message: 'Payment processed successfully',
        next_step: 'PROCEED_TO_CONSULTATION'
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error processing payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process payment',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// =====================================================
// INSURANCE VERIFICATION SYSTEM
// =====================================================

// Verify insurance eligibility
export const verifyInsuranceEligibility = async (req, res) => {
  try {
    const { patient_id, insurance_provider_code, insurance_number } = req.body;

    // Get insurance provider details
    const providerResult = await db.query(`
      SELECT * FROM insurance_providers 
      WHERE provider_code = $1 AND is_active = true AND verification_enabled = true
    `, [insurance_provider_code]);

    if (providerResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Insurance provider not found or verification not available'
      });
    }

    const provider = providerResult.rows[0];

    // Simulate insurance verification (replace with actual API calls)
    let verificationResult;
    
    if (provider.provider_code === 'SHA') {
      verificationResult = await verifySHAInsurance(insurance_number);
    } else if (provider.provider_code === 'SLADE360') {
      verificationResult = await verifySlade360Insurance(insurance_number);
    } else {
      verificationResult = {
        eligible: true,
        coverage_percentage: 80,
        annual_limit: 500000,
        used_amount: 0,
        remaining_amount: 500000,
        message: 'Verification not implemented for this provider'
      };
    }

    // Update patient financial profile
    await db.query(`
      UPDATE patient_financial_profiles SET
        primary_insurance_provider = $1,
        primary_insurance_number = $2,
        insurance_status = $3,
        updated_at = NOW()
      WHERE patient_id = $4
    `, [
      provider.provider_name,
      insurance_number,
      verificationResult.eligible ? 'VERIFIED' : 'INVALID',
      patient_id
    ]);

    res.json({
      success: true,
      data: {
        verification_result: verificationResult,
        provider: provider,
        eligible: verificationResult.eligible
      }
    });

  } catch (error) {
    console.error('Error verifying insurance:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify insurance',
      error: error.message
    });
  }
};

// =====================================================
// ENHANCED FINANCIAL DATA RETRIEVAL
// =====================================================

// Get comprehensive patient financial summary
export const getPatientFinancialSummary = async (req, res) => {
  try {
    const { patientId } = req.params;

    // Get financial profile
    const profileResult = await db.query(`
      SELECT pf.*, pd.first_name, pd.last_name
      FROM patient_financial_profiles pf
      LEFT JOIN patient_details pd ON pf.patient_id = pd.patient_id
      WHERE pf.patient_id = $1
    `, [patientId]);

    // Get invoice summary
    const invoiceSummaryResult = await db.query(`
      SELECT 
        COUNT(*) as total_invoices,
        COALESCE(SUM(total_amount), 0) as total_billed,
        COALESCE(SUM(paid_amount), 0) as total_paid,
        COALESCE(SUM(outstanding_amount), 0) as total_outstanding,
        COALESCE(SUM(insurance_amount), 0) as insurance_coverage
      FROM invoices
      WHERE patient_id = $1 AND status != 'CANCELLED'
    `, [patientId]);

    // Get payment summary
    const paymentSummaryResult = await db.query(`
      SELECT 
        COUNT(*) as total_payments,
        COALESCE(SUM(amount), 0) as total_amount,
        COALESCE(SUM(processing_fee), 0) as total_fees
      FROM payments
      WHERE patient_id = $1 AND status = 'COMPLETED'
    `, [patientId]);

    // Get recent transactions
    const recentTransactionsResult = await db.query(`
      SELECT * FROM (
        SELECT 
          'invoice' as type,
          invoice_number as reference,
          total_amount as amount,
          invoice_date as date,
          status,
          payment_status
        FROM invoices
        WHERE patient_id = $1
        
        UNION ALL
        
        SELECT 
          'payment' as type,
          payment_reference as reference,
          amount,
          payment_date::date as date,
          status,
          'completed' as payment_status
        FROM payments
        WHERE patient_id = $1
      ) combined
      ORDER BY date DESC
      LIMIT 10
    `, [patientId]);

    res.json({
      success: true,
      data: {
        profile: profileResult.rows[0] || null,
        invoice_summary: invoiceSummaryResult.rows[0],
        payment_summary: paymentSummaryResult.rows[0],
        recent_transactions: recentTransactionsResult.rows
      }
    });

  } catch (error) {
    console.error('Error fetching financial summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch financial summary',
      error: error.message
    });
  }
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

// Create double-entry accounting entries
async function createAccountingEntries(client, transaction) {
  const transactionNumber = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  
  // Create transaction header
  const transactionResult = await client.query(`
    INSERT INTO financial_transactions (
      transaction_number, transaction_date, description,
      reference_type, reference_id, total_amount, status
    )
    VALUES ($1, CURRENT_DATE, $2, $3, $4, $5, 'POSTED')
    RETURNING id
  `, [
    transactionNumber,
    transaction.description,
    transaction.type,
    transaction.reference_id,
    transaction.amount
  ]);

  const transactionId = transactionResult.rows[0].id;

  // Debit: Cash/Bank Account
  await client.query(`
    INSERT INTO transaction_line_items (
      transaction_id, account_id, debit_amount, description
    )
    VALUES (
      $1,
      $2,
      $3,
      $4
    )
  `, [
    transactionId,
    transaction.payment_method.account_id,
    transaction.amount,
    `Payment received via ${transaction.payment_method.method_name}`
  ]);

  // Credit: Revenue Account
  await client.query(`
    INSERT INTO transaction_line_items (
      transaction_id, account_id, credit_amount, description
    )
    VALUES (
      $1,
      (SELECT id FROM chart_of_accounts WHERE account_code = '4100'),
      $2,
      'Consultation revenue'
    )
  `, [transactionId, transaction.amount]);

  // Handle processing fees if any
  if (transaction.processing_fee > 0) {
    // Debit: Processing Fee Expense
    await client.query(`
      INSERT INTO transaction_line_items (
        transaction_id, account_id, debit_amount, description
      )
      VALUES (
        $1,
        (SELECT id FROM chart_of_accounts WHERE account_code = '5100'),
        $2,
        'Payment processing fee'
      )
    `, [transactionId, transaction.processing_fee]);

    // Credit: Cash/Bank Account (reduce by fee)
    await client.query(`
      INSERT INTO transaction_line_items (
        transaction_id, account_id, credit_amount, description
      )
      VALUES (
        $1,
        $2,
        $3,
        'Payment processing fee deduction'
      )
    `, [
      transactionId,
      transaction.payment_method.account_id,
      transaction.processing_fee
    ]);
  }
}

// SHA Insurance Verification (Mock - replace with actual API)
async function verifySHAInsurance(insuranceNumber) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    eligible: true,
    coverage_percentage: 100,
    annual_limit: 1000000,
    used_amount: 150000,
    remaining_amount: 850000,
    member_name: 'John Doe',
    policy_status: 'ACTIVE',
    message: 'SHA verification successful'
  };
}

// Slade360 Insurance Verification (Mock - replace with actual API)
async function verifySlade360Insurance(insuranceNumber) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  return {
    eligible: true,
    coverage_percentage: 80,
    annual_limit: 500000,
    used_amount: 75000,
    remaining_amount: 425000,
    member_name: 'Jane Smith',
    policy_status: 'ACTIVE',
    copay_amount: 500,
    message: 'Slade360 verification successful'
  };
}
