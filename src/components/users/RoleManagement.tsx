import React, { useState } from 'react';
import { Role, Permission, useUserRoles } from '../../context/UserRolesContext';
import ResponsiveTable, { Column } from '../common/ResponsiveTable';
import ResponsiveRoleList from './ResponsiveRoleList';
import { Shield, Edit, Trash, Save, X, Plus, Check, Search } from 'lucide-react';

const RoleManagement: React.FC = () => {
  const { roles, addRole, updateRole, deleteRole, getUsersByRole } = useUserRoles();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // New role form state
  const [newRole, setNewRole] = useState<Omit<Role, 'id'>>({
    name: '',
    description: '',
    permissions: [],
  });

  // Edit role form state
  const [editRole, setEditRole] = useState<Role | null>(null);

  // Group permissions by category for easier selection
  const permissionGroups = {
    'Patient Management': [
      'register_patient', 'view_patients', 'register_inpatient', 'view_admitted_patients',
      'view_patient_charges', 'edit_patient_charges', 'patient_interbranch_transfer',
      'discharge_patient', 'discharge_with_balance', 'cancel_admission',
      'change_inpatient_admission_date', 'reverse_discharge', 'view_inpatient_admission_profile',
      'view_interim_inpatient_bill', 'view_patient_notes', 'view_discharge_summary',
      'view_patients_diagnoses', 'view_patients_seen_on_a_selected_period'
    ],
    'Appointments': [
      'view_appointments', 'view_waiting_patients', 'delete_appointment',
      'set_appointment_individual_limits', 'view_appointment_individual_limits_report',
      'upload_appointment_files'
    ],
    'Financial Management': [
      'view_invoices', 'create_consultation_retainer_invoice', 'finalize_invoices',
      'reverse_finalized_invoices', 'edit_invoice_payment', 'edit_invoice_particulars',
      'edit_personal_charge_payment', 'edit_personal_charge_particulars',
      'reconcile_personal_charges_payments', 'reconcile_credit_payments',
      'add_invoice_payment', 'receipt_partial_payments', 'issue_patient_refunds',
      'issue_insurance_credit_notes', 'add_offline_mpesa_payment', 'delete_receipts',
      'cancel_transaction', 'view_edited_payments_report', 'view_edited_charges_report',
      'discounting', 'add_and_modify_bills_of_closed_patient_visits',
      'convert_patient_bills_from_cash_to_corporate_and_vice_versa',
      'edit_delete_invoice_particulars_drugs', 'edit_invoice_particulars_service',
      'delete_invoice_particulars_service'
    ],
    'Reports': [
      'daily_cash_reports', 'daily_credit_reports', 'collections_per_service_corporate_report',
      'collections_per_service_non_corporate_report', 'view_ministry_of_health_reports',
      'view_management_reports', 'view_variances_in_shift_report'
    ],
    'Laboratory': [
      'view_waiting_patients_for_lab', 'view_patient_visits_on_lab',
      'view_external_patient_visits_on_lab', 'view_laboratory_price_list',
      'edit_internal_lab_reports', 'remove_lab_and_radiology_requests'
    ],
    'Pharmacy': [
      'view_waiting_patients_for_pharmacy', 'purchase_medicine', 'medicine_purchases_report',
      'medicine_sales_report', 'medicine_stock_report', 'medicine_batch_expiry_report',
      'edit_medication_details', 'drugs_dispensed_reversal', 'remove_undispensed_drugs',
      'remove_undispensed_pharmacy_request', 'edit_medicine_purchase', 'view_medicine_price_list',
      'insurance_drugs_sales_allowance_mapping', 'medicine_stock_take',
      'medicine_stock_take_entry_sheet', 'medicine_stock_take_report'
    ],
    'Radiology': [
      'view_waiting_patients_for_radiology', 'view_patient_visits_on_radiology',
      'view_external_patient_visits_on_radiology', 'view_radiology_price_list'
    ],
    'Vaccines': [
      'purchase_vaccine', 'vaccine_purchases_report', 'vaccine_sales_report', 'vaccine_stock_report'
    ],
    'Expenses': [
      'record_expense', 'expenses_report', 'expense_consumables'
    ],
    'Inventory': [
      'register_items', 'view_items', 'items_that_need_reorder', 'handle_main_store_transactions',
      'issue_items_to_cost_centres', 'loan_items_to_cost_centres', 'internal_transfers',
      'stock_adjustment', 'inventory_reports', 'stores', 'stores_requisitions'
    ],
    'Accounting': [
      'chart_of_accounts', 'general_journal', 'banking', 'petty_cash', 'taxes',
      'general_accounting_items', 'money_in_items', 'money_out_items', 'view_accounting_reports',
      'view_general_ledger_report', 'view_trial_balance_report', 'view_profit_and_loss_report',
      'view_departmental_income_report', 'view_departmental_expenses_report',
      'view_balance_sheet_report', 'view_payables_aging_report', 'view_supplier_balances_report',
      'view_supplier_statement_report', 'view_cash_flow_statement_report',
      'edit_accounts_from_general_journal', 'edit_petty_cash_transaction',
      'define_insurances_opening_balance', 'define_suppliers_opening_balances', 'bank_loans',
      'edit_supplier_invoice', 'post_and_edit_transactions_for_closed_periods', 'donations'
    ],
    'Nursing': [
      'record_vital_signs', 'bill_patient_meals'
    ],
    'Specialized Services': [
      'maternity', 'mortuary', 'view_physiotherapy_stock', 'bill_consultation'
    ],
    'HR & Payroll': [
      'handle_payroll', 'leave_management', 'employee_performance_management',
      'hr_payroll_confirmation', 'finance_payroll_verification', 'director_payroll_verification',
      'payroll_restriction'
    ],
    'User Management': [
      'register_user', 'view_users', 'view_user_activity_logs'
    ],
    'System Configuration': [
      'upload_hospital_logo', 'logo_details', 'register_clinic', 'view_clinic',
      'create_data', 'handle_virtual_patients', 'open_close_shift'
    ],
    'Assets Management': [
      'assets', 'vehicles_and_mileage'
    ],
    'Procurement': [
      'create_and_view_purchase_orders'
    ],
    'Tax Management': [
      'process_etims_invoice', 'process_etims_invoice_manually'
    ]
  };

  // Handle input change for new role
  const handleNewRoleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRole({
      ...newRole,
      [name]: value,
    });
  };

  // Handle permission toggle for new role
  const handleNewRolePermissionToggle = (permission: Permission) => {
    setNewRole({
      ...newRole,
      permissions: newRole.permissions.includes(permission)
        ? newRole.permissions.filter(p => p !== permission)
        : [...newRole.permissions, permission],
    });
  };

  // Handle permission group toggle for new role
  const handleNewRolePermissionGroupToggle = (permissions: Permission[]) => {
    const allIncluded = permissions.every(p => newRole.permissions.includes(p));

    if (allIncluded) {
      // Remove all permissions in this group
      setNewRole({
        ...newRole,
        permissions: newRole.permissions.filter(p => !permissions.includes(p)),
      });
    } else {
      // Add all permissions in this group that aren't already included
      const permissionsToAdd = permissions.filter(p => !newRole.permissions.includes(p));
      setNewRole({
        ...newRole,
        permissions: [...newRole.permissions, ...permissionsToAdd],
      });
    }
  };

  // Handle input change for editing role
  const handleEditRoleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editRole) return;

    const { name, value } = e.target;
    setEditRole({
      ...editRole,
      [name]: value,
    });
  };

  // Handle permission toggle for editing role
  const handleEditRolePermissionToggle = (permission: Permission) => {
    if (!editRole) return;

    setEditRole({
      ...editRole,
      permissions: editRole.permissions.includes(permission)
        ? editRole.permissions.filter(p => p !== permission)
        : [...editRole.permissions, permission],
    });
  };

  // Handle permission group toggle for editing role
  const handleEditRolePermissionGroupToggle = (permissions: Permission[]) => {
    if (!editRole) return;

    const allIncluded = permissions.every(p => editRole.permissions.includes(p));

    if (allIncluded) {
      // Remove all permissions in this group
      setEditRole({
        ...editRole,
        permissions: editRole.permissions.filter(p => !permissions.includes(p)),
      });
    } else {
      // Add all permissions in this group that aren't already included
      const permissionsToAdd = permissions.filter(p => !editRole.permissions.includes(p));
      setEditRole({
        ...editRole,
        permissions: [...editRole.permissions, ...permissionsToAdd],
      });
    }
  };

  // Start editing a role
  const handleEditRole = (role: Role) => {
    setEditingRoleId(role.id);
    setEditRole({ ...role });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingRoleId(null);
    setEditRole(null);
  };

  // Save edited role
  const handleSaveEdit = () => {
    if (editingRoleId && editRole) {
      updateRole(editingRoleId, editRole);
      setEditingRoleId(null);
      setEditRole(null);
    }
  };

  // Delete a role
  const handleDeleteRole = (id: string) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      deleteRole(id);
    }
  };

  // Add new role
  const handleAddRole = () => {
    if (newRole.name.trim() === '') {
      alert('Role name is required');
      return;
    }

    if (newRole.permissions.length === 0) {
      alert('Please select at least one permission');
      return;
    }

    addRole(newRole);
    setShowAddForm(false);
    setNewRole({
      name: '',
      description: '',
      permissions: [],
    });
  };

  // Filter permissions based on search term
  const filterPermissions = (permissions: Permission[]) => {
    if (!searchTerm) return permissions;
    return permissions.filter(p =>
      p.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Render permission checkboxes
  const renderPermissionCheckboxes = (
    permissions: Permission[],
    selectedPermissions: Permission[],
    onToggle: (permission: Permission) => void
  ) => {
    const filteredPermissions = filterPermissions(permissions);

    if (filteredPermissions.length === 0) {
      return <p className="text-sm text-gray-500 italic">No matching permissions</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {filteredPermissions.map(permission => (
          <div key={permission} className="flex items-center">
            <input
              type="checkbox"
              id={`permission-${permission}`}
              checked={selectedPermissions.includes(permission)}
              onChange={() => onToggle(permission)}
              className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
            />
            <label htmlFor={`permission-${permission}`} className="ml-2 block text-sm text-gray-900">
              {permission.replace(/_/g, ' ')}
            </label>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">
          Manage system roles and define the specific permissions for each role
        </p>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Role
        </button>
      </div>

      {/* Add Role Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-[#2B3990]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Add New Role</h2>
            <button
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role Name
              </label>
              <input
                type="text"
                name="name"
                value={newRole.name}
                onChange={handleNewRoleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                placeholder="e.g., Lab Technician"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={newRole.description}
                onChange={handleNewRoleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                placeholder="e.g., Laboratory staff with access to lab functions"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Permissions
            </label>
            <div className="mb-2 flex">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                />
              </div>
            </div>

            <div className="border border-gray-200 rounded-md p-4 max-h-96 overflow-y-auto">
              {Object.entries(permissionGroups).map(([groupName, permissions]) => {
                const filteredPermissions = filterPermissions(permissions);
                if (filteredPermissions.length === 0) return null;

                const allIncluded = filteredPermissions.every(p => newRole.permissions.includes(p));
                const someIncluded = filteredPermissions.some(p => newRole.permissions.includes(p));

                return (
                  <div key={groupName} className="mb-4">
                    <div className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`group-${groupName}`}
                        checked={allIncluded}
                        ref={input => {
                          if (input) {
                            input.indeterminate = someIncluded && !allIncluded;
                          }
                        }}
                        onChange={() => handleNewRolePermissionGroupToggle(filteredPermissions)}
                        className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                      />
                      <label htmlFor={`group-${groupName}`} className="ml-2 block text-sm font-medium text-gray-900">
                        {groupName}
                      </label>
                    </div>
                    <div className="ml-6">
                      {renderPermissionCheckboxes(
                        filteredPermissions,
                        newRole.permissions,
                        handleNewRolePermissionToggle
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddRole}
              className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700"
            >
              Add Role
            </button>
          </div>
        </div>
      )}

      {/* Role List */}
      {editingRoleId ? (
        // Show traditional role list when editing
        <div className="space-y-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="bg-white rounded-lg shadow-md overflow-hidden border-l-4 border-[#2B3990]"
            >
              {editingRoleId === role.id && editRole ? (
                // Edit Mode
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-[#2B3990] mr-2" />
                      <input
                        type="text"
                        name="name"
                        value={editRole.name}
                        onChange={handleEditRoleChange}
                        className="text-lg font-semibold p-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="p-1 text-green-600 hover:text-green-800"
                        title="Save"
                      >
                        <Save size={20} />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="p-1 text-gray-600 hover:text-gray-800"
                        title="Cancel"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      name="description"
                      value={editRole.description}
                      onChange={handleEditRoleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Permissions
                    </label>
                    <div className="mb-2 flex">
                      <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          placeholder="Search permissions..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                        />
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-md p-4 max-h-96 overflow-y-auto">
                      {Object.entries(permissionGroups).map(([groupName, permissions]) => {
                        const filteredPermissions = filterPermissions(permissions);
                        if (filteredPermissions.length === 0) return null;

                        const allIncluded = filteredPermissions.every(p => editRole.permissions.includes(p));
                        const someIncluded = filteredPermissions.some(p => editRole.permissions.includes(p));

                        return (
                          <div key={groupName} className="mb-4">
                            <div className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                id={`edit-group-${groupName}`}
                                checked={allIncluded}
                                ref={input => {
                                  if (input) {
                                    input.indeterminate = someIncluded && !allIncluded;
                                  }
                                }}
                                onChange={() => handleEditRolePermissionGroupToggle(filteredPermissions)}
                                className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                              />
                              <label htmlFor={`edit-group-${groupName}`} className="ml-2 block text-sm font-medium text-gray-900">
                                {groupName}
                              </label>
                            </div>
                            <div className="ml-6">
                              {renderPermissionCheckboxes(
                                filteredPermissions,
                                editRole.permissions,
                                handleEditRolePermissionToggle
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="p-4 bg-gray-50 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Shield className="w-5 h-5 text-[#2B3990] mr-2" />
                        <h3 className="text-lg font-semibold">{role.name}</h3>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 mr-2">
                          {role.permissions.length} permissions
                        </span>
                        <button
                          onClick={() => handleEditRole(role)}
                          className="p-1 text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        {/* Only show delete button if no users have this role */}
                        {getUsersByRole(role.id).length === 0 && (
                          <button
                            onClick={() => handleDeleteRole(role.id)}
                            className="p-1 text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <Trash size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">{role.description}</p>

                    {/* Show users with this role */}
                    {getUsersByRole(role.id).length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        <span className="font-medium">Users: </span>
                        {getUsersByRole(role.id).map(user => user.name).join(', ')}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions:</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.slice(0, 15).map((permission) => (
                        <span
                          key={permission}
                          className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                        >
                          {permission.replace(/_/g, ' ')}
                        </span>
                      ))}
                      {role.permissions.length > 15 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                          +{role.permissions.length - 15} more
                        </span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      ) : (
        // Use responsive role list when not editing
        <ResponsiveRoleList
          roles={roles}
          onEdit={handleEditRole}
          onDelete={handleDeleteRole}
          getUsersByRole={getUsersByRole}
        />
      )}
    </div>
  );
};

export default RoleManagement;
