import React, { useState } from 'react';
import { useUserRoles, User, Role } from '../context/UserRolesContext';
import { useSettings } from '../context/SettingsContext';
import RoleManagement from '../components/users/RoleManagement';
import ResponsiveTable, { Column } from '../components/common/ResponsiveTable';
import {
  User as UserIcon,
  UserPlus,
  Edit,
  Trash,
  Save,
  X,
  Check,
  Shield,
  Building
} from 'lucide-react';

const UserManagement: React.FC = () => {
  const { users, roles, addUser, updateUser, deleteUser } = useUserRoles();
  const { branches } = useSettings();
  const [selectedTab, setSelectedTab] = useState<'users' | 'roles'>('users');
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // New user form state
  const [newUser, setNewUser] = useState<Omit<User, 'id'>>({
    name: '',
    email: '',
    jobId: '',
    role: '',
    allowedBranches: [],
    password: '',
    active: true,
    remoteAccessAllowed: false
  });

  // Edit user form state
  const [editUser, setEditUser] = useState<User | null>(null);

  // Handle input change for new user
  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (name === 'active') {
      setNewUser({
        ...newUser,
        active: (e.target as HTMLInputElement).checked
      });
    } else if (name === 'allowedBranches') {
      // Handle multi-select for branches
      const select = e.target as HTMLSelectElement;
      const options = Array.from(select.selectedOptions);
      const values = options.map(option => option.value);

      setNewUser({
        ...newUser,
        allowedBranches: values
      });
    } else {
      setNewUser({
        ...newUser,
        [name]: value
      });
    }
  };

  // Handle input change for editing user
  const handleEditUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editUser) return;

    const { name, value, type } = e.target;

    if (name === 'active') {
      setEditUser({
        ...editUser,
        active: (e.target as HTMLInputElement).checked
      });
    } else if (name === 'allowedBranches') {
      // Handle multi-select for branches
      const select = e.target as HTMLSelectElement;
      const options = Array.from(select.selectedOptions);
      const values = options.map(option => option.value);

      setEditUser({
        ...editUser,
        allowedBranches: values
      });
    } else {
      setEditUser({
        ...editUser,
        [name]: value
      });
    }
  };

  // Start editing a user
  const handleEditUser = (user: User) => {
    setEditingUserId(user.id);
    setEditUser({ ...user });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditUser(null);
  };

  // Save edited user
  const handleSaveEdit = () => {
    if (editingUserId && editUser) {
      updateUser(editingUserId, editUser);
      setEditingUserId(null);
      setEditUser(null);
    }
  };

  // Delete a user
  const handleDeleteUser = (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      deleteUser(id);
    }
  };

  // Add new user
  const handleAddUser = () => {
    if (newUser.name.trim() === '' || newUser.email.trim() === '' || newUser.password.trim() === '') {
      alert('Name, email, and password are required');
      return;
    }

    if (newUser.role === '') {
      alert('Please select a role');
      return;
    }

    if (newUser.allowedBranches.length === 0) {
      alert('Please select at least one branch');
      return;
    }

    addUser(newUser);
    setShowAddUserForm(false);
    setNewUser({
      name: '',
      email: '',
      jobId: '',
      role: '',
      allowedBranches: [],
      password: '',
      active: true,
      remoteAccessAllowed: false
    });
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-[#2B3990] mb-6">User Management</h1>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setSelectedTab('users')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                selectedTab === 'users'
                  ? 'border-[#2B3990] text-[#2B3990]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <UserIcon className="w-5 h-5 inline-block mr-2" />
              Users
            </button>
            <button
              onClick={() => setSelectedTab('roles')}
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                selectedTab === 'roles'
                  ? 'border-[#2B3990] text-[#2B3990]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Shield className="w-5 h-5 inline-block mr-2" />
              Roles & Permissions
            </button>
          </nav>
        </div>
      </div>

      {selectedTab === 'users' && (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Manage system users and their access permissions
            </p>
            <button
              onClick={() => setShowAddUserForm(true)}
              className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <UserPlus size={16} />
              Add New User
            </button>
          </div>

          {/* Add User Form */}
          {showAddUserForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-[#2B3990]">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Add New User</h2>
                <button
                  onClick={() => setShowAddUserForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newUser.name}
                    onChange={handleNewUserChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                    placeholder="e.g., John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={newUser.email}
                    onChange={handleNewUserChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                    placeholder="e.g., john@bristolparkhospital.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job ID
                  </label>
                  <input
                    type="text"
                    name="jobId"
                    value={newUser.jobId}
                    onChange={handleNewUserChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                    placeholder="e.g., BPH123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={newUser.password}
                    onChange={handleNewUserChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    name="role"
                    value={newUser.role}
                    onChange={handleNewUserChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allowed Branches
                  </label>
                  <select
                    name="allowedBranches"
                    multiple
                    value={newUser.allowedBranches}
                    onChange={handleNewUserChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990] h-24"
                  >
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple branches</p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={newUser.active}
                    onChange={handleNewUserChange}
                    className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                  />
                  <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                    Active Account
                  </label>
                </div>

                <div className="flex items-center mt-3">
                  <input
                    type="checkbox"
                    id="remoteAccessAllowed"
                    name="remoteAccessAllowed"
                    checked={newUser.remoteAccessAllowed}
                    onChange={handleNewUserChange}
                    className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                  />
                  <label htmlFor="remoteAccessAllowed" className="ml-2 block text-sm text-gray-900">
                    Allow Remote Access (from home/outside premises)
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowAddUserForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 mr-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddUser}
                  className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700"
                >
                  Add User
                </button>
              </div>
            </div>
          )}

          {/* User List */}
          {editingUserId ? (
            // Show traditional table when editing (for better form control)
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Branches
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remote Access
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      {editingUserId === user.id && editUser ? (
                        // Edit Mode
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              name="name"
                              value={editUser.name}
                              onChange={handleEditUserChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="email"
                              name="email"
                              value={editUser.email}
                              onChange={handleEditUserChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990] mb-2"
                            />
                            <input
                              type="text"
                              name="jobId"
                              value={editUser.jobId || ''}
                              onChange={handleEditUserChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                              placeholder="Job ID"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              name="role"
                              value={editUser.role}
                              onChange={handleEditUserChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
                            >
                              {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                  {role.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              name="allowedBranches"
                              multiple
                              value={editUser.allowedBranches}
                              onChange={handleEditUserChange}
                              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990] h-24"
                            >
                              {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                  {branch.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`active-${user.id}`}
                                name="active"
                                checked={editUser.active}
                                onChange={handleEditUserChange}
                                className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                              />
                              <label htmlFor={`active-${user.id}`} className="ml-2 block text-sm text-gray-900">
                                Active
                              </label>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                id={`remote-${user.id}`}
                                name="remoteAccessAllowed"
                                checked={editUser.remoteAccessAllowed}
                                onChange={handleEditUserChange}
                                className="h-4 w-4 text-[#2B3990] focus:ring-[#2B3990] border-gray-300 rounded"
                              />
                              <label htmlFor={`remote-${user.id}`} className="ml-2 block text-sm text-gray-900">
                                Allow Remote Access
                              </label>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={handleSaveEdit}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              <Save size={18} />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <X size={18} />
                            </button>
                          </td>
                        </>
                      ) : (
                        // View Mode for non-edited rows
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-[#2B3990] text-white rounded-full flex items-center justify-center">
                                <UserIcon className="h-5 w-5" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{user.email}</div>
                            {user.jobId && (
                              <div className="text-sm text-gray-500">ID: {user.jobId}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                              {getRoleName(user.role)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-1 text-gray-400" />
                              <span>{getBranchNames(user.allowedBranches)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.remoteAccessAllowed ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {user.remoteAccessAllowed ? 'Allowed' : 'Not Allowed'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEditUser(user)}
                              className="text-indigo-600 hover:text-indigo-900 mr-3"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash size={18} />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            // Use responsive table when not editing
            <ResponsiveTable
              columns={[
                {
                  key: 'name',
                  header: 'Name',
                  priority: 1,
                  render: (value, row) => (
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-[#2B3990] text-white rounded-full flex items-center justify-center">
                        <UserIcon className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{row.name}</div>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'email',
                  header: 'Email / Job ID',
                  priority: 2,
                  render: (value, row) => (
                    <div>
                      <div className="text-sm text-gray-900">{row.email}</div>
                      {row.jobId && (
                        <div className="text-sm text-gray-500">ID: {row.jobId}</div>
                      )}
                    </div>
                  )
                },
                {
                  key: 'role',
                  header: 'Role',
                  priority: 3,
                  render: (value, row) => (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {getRoleName(row.role)}
                    </span>
                  )
                },
                {
                  key: 'allowedBranches',
                  header: 'Branches',
                  hideOnMobile: true,
                  render: (value, row) => (
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-1 text-gray-400" />
                      <span>{getBranchNames(row.allowedBranches)}</span>
                    </div>
                  )
                },
                {
                  key: 'active',
                  header: 'Status',
                  priority: 4,
                  render: (value, row) => (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      row.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {row.active ? 'Active' : 'Inactive'}
                    </span>
                  )
                },
                {
                  key: 'remoteAccessAllowed',
                  header: 'Remote Access',
                  priority: 5,
                  render: (value, row) => (
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      row.remoteAccessAllowed ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {row.remoteAccessAllowed ? 'Allowed' : 'Not Allowed'}
                    </span>
                  )
                },
                {
                  key: 'actions',
                  header: 'Actions',
                  priority: 6,
                  render: (value, row) => (
                    <div className="flex justify-end md:justify-end">
                      <button
                        onClick={() => handleEditUser(row)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3 p-1 hover:bg-indigo-50 rounded"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(row.id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  )
                }
              ]}
              data={users}
              keyField="id"
              emptyMessage="No users found"
            />
          )}
        </div>
      )}

      {selectedTab === 'roles' && (
        <RoleManagement />
      )}
    </div>
  );
};

export default UserManagement;
