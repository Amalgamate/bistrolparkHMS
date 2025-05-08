import React from 'react';
import { useUserRoles } from '../context/UserRolesContext';
import { useSettings } from '../context/SettingsContext';
import { Copy, User, Key, Building, Shield } from 'lucide-react';

const LoginCredentials: React.FC = () => {
  const { users, roles } = useUserRoles();
  const { branches } = useSettings();

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Get role name by ID
  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };

  // Get branch names by IDs
  const getBranchNames = (branchIds: string[]) => {
    return branchIds.map(id => {
      const branch = branches.find(b => b.id === id);
      return branch ? branch.name : id;
    }).join(', ');
  };

  // Get role color
  const getRoleColor = (roleId: string) => {
    switch (roleId) {
      case 'supa-admin':
        return 'bg-purple-100 text-purple-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      case 'doctor':
        return 'bg-green-100 text-green-800';
      case 'accountant':
        return 'bg-yellow-100 text-yellow-800';
      case 'front-office':
        return 'bg-indigo-100 text-indigo-800';
      case 'nurse':
        return 'bg-pink-100 text-pink-800';
      case 'pharmacy':
        return 'bg-teal-100 text-teal-800';
      case 'mortuary-attendant':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#2B3990] mb-6">Login Credentials</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <User className="w-6 h-6 text-[#2B3990] mr-2" />
          <h2 className="text-xl font-semibold">Test User Accounts</h2>
        </div>

        <p className="mb-4 text-gray-600">
          Use these credentials to test different user roles and permissions in the system.
          Click on any credential to copy it to your clipboard.
        </p>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email / Job ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Password
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Branches
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.filter(user => user.active).map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-[#2B3990] text-white rounded-full flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div
                          className="text-sm text-gray-900 cursor-pointer flex items-center"
                          onClick={() => copyToClipboard(user.email)}
                          title="Click to copy email"
                        >
                          <span>{user.email}</span>
                          <Copy className="h-4 w-4 ml-1 text-gray-400 hover:text-gray-600" />
                        </div>
                        {user.jobId && (
                          <div
                            className="text-sm text-gray-500 cursor-pointer flex items-center"
                            onClick={() => copyToClipboard(user.jobId || '')}
                            title="Click to copy Job ID"
                          >
                            <span>ID: {user.jobId}</span>
                            <Copy className="h-4 w-4 ml-1 text-gray-400 hover:text-gray-600" />
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div
                      className="text-sm text-gray-900 cursor-pointer flex items-center"
                      onClick={() => copyToClipboard(user.password)}
                      title="Click to copy password"
                    >
                      <Key className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{user.password}</span>
                      <Copy className="h-4 w-4 ml-1 text-gray-400 hover:text-gray-600" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Shield className="h-4 w-4 mr-1 text-gray-400" />
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {getRoleName(user.role)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{getBranchNames(user.allowedBranches)}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-4">
          <Shield className="w-6 h-6 text-[#2B3990] mr-2" />
          <h2 className="text-xl font-semibold">Role Permissions Summary</h2>
        </div>

        <p className="mb-4 text-gray-600">
          Here's a summary of what each role can access in the system:
        </p>

        <div className="space-y-4">
          {roles.map(role => (
            <div key={role.id} className="border rounded-lg overflow-hidden">
              <div className={`px-4 py-3 ${getRoleColor(role.id)}`}>
                <h3 className="font-medium">{role.name}</h3>
                <p className="text-sm">{role.description}</p>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Permissions:</h4>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoginCredentials;
