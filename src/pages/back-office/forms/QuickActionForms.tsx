import React from 'react';
import { Button } from '../../../components/ui/button';
import {
  UserPlus,
  DollarSign,
  Package,
  Truck,
  Building,
  FileText
} from 'lucide-react';

// Add Employee Form
export const AddEmployeeForm: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Add New Employee</h2>
          <p className="text-gray-500">Create a new employee record</p>
        </div>
      </div>
      <div className="text-center py-12">
        <UserPlus className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Employee creation form will be implemented soon.</p>
        <Button className="mt-4">Back to HR</Button>
      </div>
    </div>
  );
};

// New Transaction Form
export const NewTransactionForm: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">New Financial Transaction</h2>
          <p className="text-gray-500">Record a new financial transaction</p>
        </div>
      </div>
      <div className="text-center py-12">
        <DollarSign className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Transaction form will be implemented soon.</p>
        <Button className="mt-4">Back to Finance</Button>
      </div>
    </div>
  );
};

// Inventory Check Form
export const InventoryCheckForm: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Inventory Check</h2>
          <p className="text-gray-500">Perform an inventory check</p>
        </div>
      </div>
      <div className="text-center py-12">
        <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Inventory check form will be implemented soon.</p>
        <Button className="mt-4">Back to Inventory</Button>
      </div>
    </div>
  );
};

// New Purchase Order Form
export const NewPurchaseOrderForm: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">New Purchase Order</h2>
          <p className="text-gray-500">Create a new purchase order</p>
        </div>
      </div>
      <div className="text-center py-12">
        <Truck className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Purchase order form will be implemented soon.</p>
        <Button className="mt-4">Back to Procurement</Button>
      </div>
    </div>
  );
};

// Facility Management Form
export const FacilityManagementForm: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Facility Management</h2>
          <p className="text-gray-500">Manage facility details</p>
        </div>
      </div>
      <div className="text-center py-12">
        <Building className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Facility management form will be implemented soon.</p>
        <Button className="mt-4">Back to Administration</Button>
      </div>
    </div>
  );
};

// Generate Report Form
export const GenerateReportForm: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Generate Report</h2>
          <p className="text-gray-500">Generate a custom report</p>
        </div>
      </div>
      <div className="text-center py-12">
        <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Report generation form will be implemented soon.</p>
        <Button className="mt-4">Back to Reports</Button>
      </div>
    </div>
  );
};
