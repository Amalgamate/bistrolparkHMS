import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define permission types based on the list provided
export type Permission =
  // Patient Management
  | 'register_patient'
  | 'view_patients'
  | 'register_inpatient'
  | 'view_admitted_patients'
  | 'view_patient_charges'
  | 'edit_patient_charges'
  | 'patient_interbranch_transfer'
  | 'discharge_patient'
  | 'discharge_with_balance'
  | 'cancel_admission'
  | 'change_inpatient_admission_date'
  | 'reverse_discharge'
  | 'view_inpatient_admission_profile'
  | 'view_interim_inpatient_bill'
  | 'view_patient_notes'
  | 'view_discharge_summary'
  | 'view_patients_diagnoses'
  | 'view_patients_seen_on_a_selected_period'

  // Appointments
  | 'view_appointments'
  | 'view_waiting_patients'
  | 'delete_appointment'
  | 'set_appointment_individual_limits'
  | 'view_appointment_individual_limits_report'
  | 'upload_appointment_files'

  // Financial Management
  | 'view_invoices'
  | 'create_consultation_retainer_invoice'
  | 'finalize_invoices'
  | 'reverse_finalized_invoices'
  | 'edit_invoice_payment'
  | 'edit_invoice_particulars'
  | 'edit_personal_charge_payment'
  | 'edit_personal_charge_particulars'
  | 'reconcile_personal_charges_payments'
  | 'reconcile_credit_payments'
  | 'add_invoice_payment'
  | 'receipt_partial_payments'
  | 'issue_patient_refunds'
  | 'issue_insurance_credit_notes'
  | 'add_offline_mpesa_payment'
  | 'delete_receipts'
  | 'cancel_transaction'
  | 'view_edited_payments_report'
  | 'view_edited_charges_report'
  | 'discounting'
  | 'add_and_modify_bills_of_closed_patient_visits'
  | 'convert_patient_bills_from_cash_to_corporate_and_vice_versa'
  | 'edit_delete_invoice_particulars_drugs'
  | 'edit_invoice_particulars_service'
  | 'delete_invoice_particulars_service'

  // Reports
  | 'daily_cash_reports'
  | 'daily_credit_reports'
  | 'collections_per_service_corporate_report'
  | 'collections_per_service_non_corporate_report'
  | 'view_ministry_of_health_reports'
  | 'view_management_reports'
  | 'view_variances_in_shift_report'

  // Laboratory
  | 'view_waiting_patients_for_lab'
  | 'view_patient_visits_on_lab'
  | 'view_external_patient_visits_on_lab'
  | 'view_laboratory_price_list'
  | 'edit_internal_lab_reports'
  | 'remove_lab_and_radiology_requests'

  // Pharmacy
  | 'view_waiting_patients_for_pharmacy'
  | 'purchase_medicine'
  | 'medicine_purchases_report'
  | 'medicine_sales_report'
  | 'medicine_stock_report'
  | 'medicine_batch_expiry_report'
  | 'edit_medication_details'
  | 'drugs_dispensed_reversal'
  | 'remove_undispensed_drugs'
  | 'remove_undispensed_pharmacy_request'
  | 'edit_medicine_purchase'
  | 'view_medicine_price_list'
  | 'insurance_drugs_sales_allowance_mapping'
  | 'medicine_stock_take'
  | 'medicine_stock_take_entry_sheet'
  | 'medicine_stock_take_report'

  // Radiology
  | 'view_waiting_patients_for_radiology'
  | 'view_patient_visits_on_radiology'
  | 'view_external_patient_visits_on_radiology'
  | 'view_radiology_price_list'

  // Vaccines
  | 'purchase_vaccine'
  | 'vaccine_purchases_report'
  | 'vaccine_sales_report'
  | 'vaccine_stock_report'

  // Expenses
  | 'record_expense'
  | 'expenses_report'
  | 'expense_consumables'

  // Inventory
  | 'register_items'
  | 'view_items'
  | 'items_that_need_reorder'
  | 'handle_main_store_transactions'
  | 'issue_items_to_cost_centres'
  | 'loan_items_to_cost_centres'
  | 'internal_transfers'
  | 'stock_adjustment'
  | 'inventory_reports'
  | 'stores'
  | 'stores_requisitions'

  // Accounting
  | 'chart_of_accounts'
  | 'general_journal'
  | 'banking'
  | 'petty_cash'
  | 'taxes'
  | 'general_accounting_items'
  | 'money_in_items'
  | 'money_out_items'
  | 'view_accounting_reports'
  | 'view_general_ledger_report'
  | 'view_trial_balance_report'
  | 'view_profit_and_loss_report'
  | 'view_departmental_income_report'
  | 'view_departmental_expenses_report'
  | 'view_balance_sheet_report'
  | 'view_payables_aging_report'
  | 'view_supplier_balances_report'
  | 'view_supplier_statement_report'
  | 'view_cash_flow_statement_report'
  | 'edit_accounts_from_general_journal'
  | 'edit_petty_cash_transaction'
  | 'define_insurances_opening_balance'
  | 'define_suppliers_opening_balances'
  | 'bank_loans'
  | 'edit_supplier_invoice'
  | 'post_and_edit_transactions_for_closed_periods'
  | 'donations'

  // Nursing
  | 'record_vital_signs'
  | 'bill_patient_meals'

  // Specialized Services
  | 'maternity'
  | 'mortuary'
  | 'view_physiotherapy_stock'
  | 'bill_consultation'

  // HR & Payroll
  | 'handle_payroll'
  | 'leave_management'
  | 'employee_performance_management'
  | 'hr_payroll_confirmation'
  | 'finance_payroll_verification'
  | 'director_payroll_verification'
  | 'payroll_restriction'

  // User Management
  | 'register_user'
  | 'view_users'
  | 'view_user_activity_logs'

  // System Configuration
  | 'upload_hospital_logo'
  | 'logo_details'
  | 'register_clinic'
  | 'view_clinic'
  | 'create_data'
  | 'handle_virtual_patients'
  | 'open_close_shift'

  // Assets Management
  | 'assets'
  | 'vehicles_and_mileage'

  // Procurement
  | 'create_and_view_purchase_orders'

  // Tax Management
  | 'process_etims_invoice'
  | 'process_etims_invoice_manually';

// Define role interface
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

// Define user interface with role
export interface User {
  id: string;
  name: string;
  email: string;
  jobId: string;
  role: string; // Role ID
  allowedBranches: string[]; // Branch IDs
  password: string;
  active: boolean;
  remoteAccessAllowed: boolean; // Whether user can access the system remotely (from home)
}

// Define context type
interface UserRolesContextType {
  roles: Role[];
  users: User[];
  addRole: (role: Omit<Role, 'id'>) => void;
  updateRole: (id: string, role: Partial<Role>) => void;
  deleteRole: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  getUsersByRole: (roleId: string) => User[];
  getRoleById: (id: string) => Role | undefined;
  hasPermission: (userId: string, permission: Permission) => boolean;
}

// Initial roles
const INITIAL_ROLES: Role[] = [
  {
    id: 'supa-admin',
    name: 'Supa Admin',
    description: 'Super administrator with full system access',
    permissions: [
      // All permissions - this is a placeholder, in a real system we would list all permissions
      'register_patient', 'view_patients', 'register_user', 'view_users', 'create_data',
      'view_invoices', 'add_invoice_payment', 'delete_receipts', 'handle_main_store_transactions',
      'view_patients_seen_on_a_selected_period', 'register_inpatient', 'view_admitted_patients',
      'view_appointments', 'view_patient_charges', 'reconcile_personal_charges_payments',
      'reconcile_credit_payments', 'daily_cash_reports', 'daily_credit_reports',
      'purchase_vaccine', 'vaccine_purchases_report', 'vaccine_sales_report',
      'vaccine_stock_report', 'record_expense', 'expenses_report', 'items_that_need_reorder',
      'upload_hospital_logo', 'logo_details', 'view_waiting_patients_for_lab',
      'view_patient_visits_on_lab', 'view_external_patient_visits_on_lab',
      'view_waiting_patients_for_pharmacy', 'purchase_medicine', 'medicine_purchases_report',
      'medicine_sales_report', 'medicine_stock_report', 'view_waiting_patients_for_radiology',
      'view_patient_visits_on_radiology', 'view_external_patient_visits_on_radiology',
      'edit_patient_charges', 'collections_per_service_corporate_report',
      'collections_per_service_non_corporate_report', 'cancel_transaction',
      'edit_personal_charge_payment', 'view_edited_payments_report', 'handle_payroll',
      'record_vital_signs', 'chart_of_accounts', 'general_journal', 'banking', 'petty_cash',
      'taxes', 'general_accounting_items', 'money_in_items', 'money_out_items',
      'view_accounting_reports', 'edit_medication_details', 'create_consultation_retainer_invoice',
      'medicine_batch_expiry_report', 'drugs_dispensed_reversal', 'remove_undispensed_drugs',
      'edit_invoice_payment', 'discounting', 'maternity', 'mortuary', 'stores',
      'issue_items_to_cost_centres', 'loan_items_to_cost_centres', 'internal_transfers',
      'stock_adjustment', 'inventory_reports', 'view_inpatient_admission_profile',
      'view_interim_inpatient_bill', 'discharge_patient', 'cancel_admission',
      'upload_appointment_files', 'view_patients_diagnoses', 'receipt_partial_payments',
      'insurance_drugs_sales_allowance_mapping', 'bill_patient_meals',
      'remove_lab_and_radiology_requests', 'edit_personal_charge_particulars',
      'edit_invoice_particulars', 'add_and_modify_bills_of_closed_patient_visits',
      'view_physiotherapy_stock', 'assets', 'vehicles_and_mileage',
      'create_and_view_purchase_orders', 'remove_undispensed_pharmacy_request',
      'add_invoice_payment', 'leave_management', 'employee_performance_management',
      'edit_accounts_from_general_journal', 'edit_medicine_purchase',
      'edit_petty_cash_transaction', 'view_general_ledger_report', 'view_trial_balance_report',
      'view_profit_and_loss_report', 'view_departmental_income_report',
      'view_departmental_expenses_report', 'view_balance_sheet_report',
      'view_payables_aging_report', 'view_supplier_balances_report',
      'view_supplier_statement_report', 'donations', 'handle_virtual_patients',
      'view_ministry_of_health_reports', 'delete_appointment', 'edit_approved_leave_request',
      'define_insurances_opening_balance', 'define_suppliers_opening_balances',
      'view_cash_flow_statement_report', 'bank_loans', 'set_appointment_individual_limits',
      'set_copay_details', 'view_management_reports', 'view_variances_in_shift_report',
      'view_patient_notes', 'view_discharge_summary', 'issue_patient_refunds',
      'bill_consultation', 'view_laboratory_price_list', 'view_radiology_price_list',
      'view_medicine_price_list', 'view_services_price_list', 'edit_supplier_invoice',
      'view_user_activity_logs', 'patient_interbranch_transfer',
      'change_inpatient_admission_date', 'reverse_discharge', 'finalize_invoices',
      'reverse_finalized_invoices', 'issue_insurance_credit_notes',
      'convert_patient_bills_from_cash_to_corporate_and_vice_versa',
      'post_and_edit_transactions_for_closed_periods', 'transfer_inpatient_to_a_different_branch',
      'edit_internal_lab_reports', 'register_clinic', 'view_clinic',
      'edit_delete_invoice_particulars_drugs', 'expense_consumables',
      'edit_invoice_particulars_service', 'delete_invoice_particulars_service',
      'open_close_shift', 'medicine_stock_take', 'medicine_stock_take_entry_sheet',
      'medicine_stock_take_report', 'hr_payroll_confirmation', 'finance_payroll_verification',
      'director_payroll_verification', 'view_appointment_individual_limits_report',
      'add_offline_mpesa_payment', 'view_edited_charges_report', 'view_waiting_patients',
      'process_etims_invoice', 'process_etims_invoice_manually', 'discharge_with_balance',
      'payroll_restriction', 'stores_requisitions', 'register_items', 'view_items'
    ]
  },
  {
    id: 'admin',
    name: 'Admin',
    description: 'Administrator with access to most system functions',
    permissions: [
      'register_patient', 'view_patients', 'register_user', 'view_users',
      'view_invoices', 'add_invoice_payment', 'handle_main_store_transactions',
      'view_patients_seen_on_a_selected_period', 'register_inpatient', 'view_admitted_patients',
      'view_appointments', 'view_patient_charges', 'reconcile_personal_charges_payments',
      'daily_cash_reports', 'daily_credit_reports', 'record_expense', 'expenses_report',
      'items_that_need_reorder', 'upload_hospital_logo', 'logo_details',
      'view_waiting_patients_for_lab', 'view_patient_visits_on_lab',
      'view_waiting_patients_for_pharmacy', 'medicine_stock_report',
      'view_waiting_patients_for_radiology', 'view_patient_visits_on_radiology',
      'edit_patient_charges', 'collections_per_service_corporate_report',
      'record_vital_signs', 'view_inpatient_admission_profile',
      'view_interim_inpatient_bill', 'discharge_patient',
      'upload_appointment_files', 'view_patients_diagnoses',
      'view_physiotherapy_stock', 'assets', 'leave_management',
      'view_ministry_of_health_reports', 'view_management_reports',
      'view_patient_notes', 'view_discharge_summary',
      'view_laboratory_price_list', 'view_radiology_price_list',
      'view_medicine_price_list', 'view_services_price_list',
      'view_user_activity_logs', 'register_clinic', 'view_clinic',
      'view_waiting_patients', 'register_items', 'view_items'
    ]
  },
  {
    id: 'doctor',
    name: 'Doctor',
    description: 'Medical doctor with access to patient records and clinical functions',
    permissions: [
      'view_patients', 'view_patients_seen_on_a_selected_period',
      'view_admitted_patients', 'view_appointments', 'view_patient_charges',
      'view_waiting_patients_for_lab', 'view_patient_visits_on_lab',
      'view_waiting_patients_for_pharmacy', 'view_waiting_patients_for_radiology',
      'view_patient_visits_on_radiology', 'record_vital_signs',
      'view_inpatient_admission_profile', 'view_interim_inpatient_bill',
      'upload_appointment_files', 'view_patients_diagnoses',
      'view_patient_notes', 'view_discharge_summary',
      'bill_consultation', 'view_laboratory_price_list',
      'view_radiology_price_list', 'view_medicine_price_list',
      'view_waiting_patients'
    ]
  },
  {
    id: 'accountant',
    name: 'Accountant',
    description: 'Financial officer with access to accounting and billing functions',
    permissions: [
      'view_invoices', 'add_invoice_payment', 'delete_receipts',
      'view_patient_charges', 'reconcile_personal_charges_payments',
      'reconcile_credit_payments', 'daily_cash_reports', 'daily_credit_reports',
      'record_expense', 'expenses_report', 'edit_patient_charges',
      'collections_per_service_corporate_report',
      'collections_per_service_non_corporate_report', 'cancel_transaction',
      'edit_personal_charge_payment', 'view_edited_payments_report',
      'chart_of_accounts', 'general_journal', 'banking', 'petty_cash',
      'taxes', 'general_accounting_items', 'money_in_items', 'money_out_items',
      'view_accounting_reports', 'edit_invoice_payment', 'receipt_partial_payments',
      'edit_personal_charge_particulars', 'edit_invoice_particulars',
      'edit_accounts_from_general_journal', 'edit_petty_cash_transaction',
      'view_general_ledger_report', 'view_trial_balance_report',
      'view_profit_and_loss_report', 'view_departmental_income_report',
      'view_departmental_expenses_report', 'view_balance_sheet_report',
      'view_payables_aging_report', 'view_supplier_balances_report',
      'view_supplier_statement_report', 'define_insurances_opening_balance',
      'define_suppliers_opening_balances', 'view_cash_flow_statement_report',
      'issue_patient_refunds', 'edit_supplier_invoice', 'finalize_invoices',
      'issue_insurance_credit_notes', 'add_offline_mpesa_payment',
      'view_edited_charges_report', 'process_etims_invoice',
      'process_etims_invoice_manually'
    ]
  },
  {
    id: 'front-office',
    name: 'Front Office',
    description: 'Reception staff with access to patient registration and appointments',
    permissions: [
      'register_patient', 'view_patients', 'view_appointments',
      'view_patient_charges', 'view_patients_seen_on_a_selected_period',
      'view_waiting_patients_for_lab', 'view_waiting_patients_for_pharmacy',
      'view_waiting_patients_for_radiology', 'upload_appointment_files',
      'receipt_partial_payments', 'add_invoice_payment',
      'view_waiting_patients', 'view_laboratory_price_list',
      'view_radiology_price_list', 'view_medicine_price_list',
      'view_services_price_list', 'delete_appointment'
    ]
  },
  {
    id: 'nurse',
    name: 'Nurse',
    description: 'Nursing staff with access to patient care functions',
    permissions: [
      'view_patients', 'view_admitted_patients', 'view_appointments',
      'view_waiting_patients_for_lab', 'view_patient_visits_on_lab',
      'view_waiting_patients_for_pharmacy', 'view_waiting_patients_for_radiology',
      'record_vital_signs', 'view_inpatient_admission_profile',
      'view_interim_inpatient_bill', 'upload_appointment_files',
      'view_patients_diagnoses', 'bill_patient_meals',
      'view_patient_notes', 'view_discharge_summary',
      'view_waiting_patients'
    ]
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy',
    description: 'Pharmacy staff with access to medication management',
    permissions: [
      'view_waiting_patients_for_pharmacy', 'purchase_medicine',
      'medicine_purchases_report', 'medicine_sales_report',
      'medicine_stock_report', 'medicine_batch_expiry_report',
      'edit_medication_details', 'drugs_dispensed_reversal',
      'remove_undispensed_drugs', 'edit_medicine_purchase',
      'view_medicine_price_list', 'insurance_drugs_sales_allowance_mapping',
      'medicine_stock_take', 'medicine_stock_take_entry_sheet',
      'medicine_stock_take_report', 'remove_undispensed_pharmacy_request'
    ]
  },
  {
    id: 'mortuary-attendant',
    name: 'Mortuary Attendant',
    description: 'Staff responsible for mortuary services',
    permissions: [
      'mortuary', 'view_patients'
    ]
  }
];

// Initial users
const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'superadmin@bristolparkhospital.com',
    jobId: 'BPH001',
    role: 'supa-admin',
    allowedBranches: ['fedha', 'utawala', 'machakos', 'tassia', 'kitengela'],
    password: 'admin12345',
    active: true,
    remoteAccessAllowed: true
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@bristolparkhospital.com',
    jobId: 'BPH002',
    role: 'admin',
    allowedBranches: ['fedha', 'utawala'],
    password: 'admin12345',
    active: true,
    remoteAccessAllowed: true
  },
  {
    id: '3',
    name: 'Dr. Smith',
    email: 'smith@bristolparkhospital.com',
    jobId: 'BPH003',
    role: 'doctor',
    allowedBranches: ['fedha', 'utawala', 'machakos', 'tassia', 'kitengela'],
    password: 'doctor12345',
    active: true,
    remoteAccessAllowed: true
  },
  {
    id: '4',
    name: 'Jane Accountant',
    email: 'jane@bristolparkhospital.com',
    jobId: 'BPH004',
    role: 'accountant',
    allowedBranches: ['fedha', 'utawala', 'machakos'],
    password: 'account12345',
    active: true,
    remoteAccessAllowed: true
  },
  {
    id: '5',
    name: 'Reception Staff',
    email: 'reception@bristolparkhospital.com',
    jobId: 'BPH005',
    role: 'front-office',
    allowedBranches: ['fedha'],
    password: 'front12345',
    active: true,
    remoteAccessAllowed: false
  },
  {
    id: '6',
    name: 'Nurse Johnson',
    email: 'johnson@bristolparkhospital.com',
    jobId: 'BPH006',
    role: 'nurse',
    allowedBranches: ['fedha'],
    password: 'nurse12345',
    active: true,
    remoteAccessAllowed: false
  },
  {
    id: '7',
    name: 'Pharmacy Staff',
    email: 'pharmacy@bristolparkhospital.com',
    jobId: 'BPH007',
    role: 'pharmacy',
    allowedBranches: ['fedha', 'utawala'],
    password: 'pharm12345',
    active: true,
    remoteAccessAllowed: false
  },
  {
    id: '8',
    name: 'Mortuary Staff',
    email: 'mortuary@bristolparkhospital.com',
    jobId: 'BPH008',
    role: 'mortuary-attendant',
    allowedBranches: ['fedha'],
    password: 'mort12345',
    active: true,
    remoteAccessAllowed: false
  },
  {
    id: '9',
    name: 'Dr. Johnson',
    email: 'johnson@bristolparkhospital.com',
    jobId: 'BPH009',
    role: 'doctor',
    allowedBranches: ['fedha', 'utawala', 'machakos', 'tassia', 'kitengela'],
    password: 'doctor12345',
    active: true,
    remoteAccessAllowed: true
  }
];

// Create the context
const UserRolesContext = createContext<UserRolesContextType | undefined>(undefined);

// Provider component
export const UserRolesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roles, setRoles] = useState<Role[]>(() => {
    const storedRoles = localStorage.getItem('roles');
    return storedRoles ? JSON.parse(storedRoles) : INITIAL_ROLES;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const storedUsers = localStorage.getItem('users');
    return storedUsers ? JSON.parse(storedUsers) : INITIAL_USERS;
  });

  // Save to localStorage when roles or users change
  useEffect(() => {
    localStorage.setItem('roles', JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  // Add a new role
  const addRole = (role: Omit<Role, 'id'>) => {
    const newRole = {
      ...role,
      id: role.name.toLowerCase().replace(/\s+/g, '-'),
    };
    setRoles([...roles, newRole as Role]);
  };

  // Update an existing role
  const updateRole = (id: string, updatedRole: Partial<Role>) => {
    setRoles(
      roles.map(role => (role.id === id ? { ...role, ...updatedRole } : role))
    );
  };

  // Delete a role
  const deleteRole = (id: string) => {
    // Check if any users are using this role
    const usersWithRole = users.filter(user => user.role === id);
    if (usersWithRole.length > 0) {
      alert(`Cannot delete role: ${id}. It is assigned to ${usersWithRole.length} users.`);
      return;
    }
    setRoles(roles.filter(role => role.id !== id));
  };

  // Add a new user
  const addUser = (user: Omit<User, 'id'>) => {
    const newUser = {
      ...user,
      id: (users.length + 1).toString(),
    };
    setUsers([...users, newUser as User]);
  };

  // Update an existing user
  const updateUser = (id: string, updatedUser: Partial<User>) => {
    setUsers(
      users.map(user => (user.id === id ? { ...user, ...updatedUser } : user))
    );
  };

  // Delete a user
  const deleteUser = (id: string) => {
    setUsers(users.filter(user => user.id !== id));
  };

  // Get users by role
  const getUsersByRole = (roleId: string) => {
    return users.filter(user => user.role === roleId);
  };

  // Get role by ID
  const getRoleById = (id: string) => {
    return roles.find(role => role.id === id);
  };

  // Check if a user has a specific permission
  const hasPermission = (userId: string, permission: Permission) => {
    const user = users.find(u => u.id === userId);
    if (!user) return false;

    const role = roles.find(r => r.id === user.role);
    if (!role) return false;

    return role.permissions.includes(permission);
  };

  return (
    <UserRolesContext.Provider
      value={{
        roles,
        users,
        addRole,
        updateRole,
        deleteRole,
        addUser,
        updateUser,
        deleteUser,
        getUsersByRole,
        getRoleById,
        hasPermission,
      }}
    >
      {children}
    </UserRolesContext.Provider>
  );
};

// Custom hook to use the user roles context
export const useUserRoles = () => {
  const context = useContext(UserRolesContext);
  if (context === undefined) {
    throw new Error('useUserRoles must be used within a UserRolesProvider');
  }
  return context;
};
