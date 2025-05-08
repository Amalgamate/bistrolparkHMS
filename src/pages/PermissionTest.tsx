import React from 'react';
import { useAuth } from '../context/AuthContext';
import Permission from '../components/auth/Permission';
import { Shield, AlertCircle, Check, X } from 'lucide-react';

const PermissionTest: React.FC = () => {
  const { user } = useAuth();

  // List of permissions to test
  const permissionsToTest = [
    'register_patient',
    'view_patients',
    'edit_patient_charges',
    'view_invoices',
    'add_invoice_payment',
    'delete_receipts',
    'register_user',
    'view_users',
    'chart_of_accounts',
    'handle_payroll',
    'mortuary',
    'maternity'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#2B3990] mb-6">Permission Test</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <Shield className="w-6 h-6 text-[#2B3990] mr-2" />
          <h2 className="text-xl font-semibold">Current User Permissions</h2>
        </div>
        
        {user ? (
          <div>
            <div className="mb-4">
              <p className="text-gray-700">
                <span className="font-medium">Name:</span> {user.name}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Role:</span> {user.role}
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Branch:</span> {user.branch}
              </p>
            </div>
            
            <h3 className="text-lg font-medium mb-3">Permission Check</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {permissionsToTest.map(permission => (
                <div key={permission} className="border rounded-md p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{permission.replace(/_/g, ' ')}</span>
                    <Permission
                      permission={permission as any}
                      fallback={<X className="h-5 w-5 text-red-500" />}
                    >
                      <Check className="h-5 w-5 text-green-500" />
                    </Permission>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">UI Elements Based on Permissions</h3>
              
              <div className="space-y-4">
                <Permission permission="register_patient">
                  <div className="p-4 bg-blue-50 rounded-md border border-blue-200">
                    <h4 className="font-medium text-blue-700">Patient Registration Form</h4>
                    <p className="text-blue-600 text-sm">
                      This content is only visible to users with the 'register_patient' permission.
                    </p>
                  </div>
                </Permission>
                
                <Permission permission="view_invoices">
                  <div className="p-4 bg-green-50 rounded-md border border-green-200">
                    <h4 className="font-medium text-green-700">Invoice Viewer</h4>
                    <p className="text-green-600 text-sm">
                      This content is only visible to users with the 'view_invoices' permission.
                    </p>
                  </div>
                </Permission>
                
                <Permission permission="delete_receipts">
                  <div className="p-4 bg-red-50 rounded-md border border-red-200">
                    <h4 className="font-medium text-red-700">Delete Receipt Button</h4>
                    <p className="text-red-600 text-sm">
                      This content is only visible to users with the 'delete_receipts' permission.
                    </p>
                  </div>
                </Permission>
                
                <Permission permission="register_user">
                  <div className="p-4 bg-purple-50 rounded-md border border-purple-200">
                    <h4 className="font-medium text-purple-700">User Registration Form</h4>
                    <p className="text-purple-600 text-sm">
                      This content is only visible to users with the 'register_user' permission.
                    </p>
                  </div>
                </Permission>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center p-4 bg-yellow-50 rounded-md">
            <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
            <p className="text-yellow-700">Please log in to test permissions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionTest;
