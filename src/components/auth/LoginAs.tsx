import React, { useState, useRef, useEffect } from 'react';
import { useUserRoles } from '../../context/UserRolesContext';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
import { UserPlus, ChevronDown, User, Shield } from 'lucide-react';

const LoginAs: React.FC = () => {
  const { users, roles } = useUserRoles();
  const { user: currentUser, login } = useAuth();
  const { branches } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check if current user is an admin
  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'supa-admin';

  if (!isAdmin) {
    return null;
  }

  // Get role name by ID
  const getRoleName = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : roleId;
  };

  // Get branch name by ID
  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.name : branchId;
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

  // Handle login as user
  const handleLoginAs = async (userId: string) => {
    const userToLoginAs = users.find(u => u.id === userId);
    if (!userToLoginAs) return;

    // Use the first allowed branch as default
    const defaultBranch = userToLoginAs.allowedBranches[0];
    
    // Login as the selected user
    if (userToLoginAs && defaultBranch) {
      await login(userToLoginAs.email, userToLoginAs.password, defaultBranch);
      setIsOpen(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(u => {
    if (u.id === currentUser?.id) return false; // Don't show current user
    if (!u.active) return false; // Don't show inactive users
    
    const searchLower = searchTerm.toLowerCase();
    return (
      u.name.toLowerCase().includes(searchLower) ||
      u.email.toLowerCase().includes(searchLower) ||
      getRoleName(u.role).toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center px-3 py-2 text-sm font-medium text-white bg-[#A61F1F] hover:bg-red-700 rounded-md transition-colors"
      >
        <UserPlus className="w-4 h-4 mr-2" />
        Login As
        <ChevronDown className={`w-4 h-4 ml-1 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50">
          <div className="p-3 border-b">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B3990]"
            />
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No users found
              </div>
            ) : (
              <ul>
                {filteredUsers.map((user) => (
                  <li key={user.id} className="border-b last:border-b-0">
                    <button
                      onClick={() => handleLoginAs(user.id)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start"
                    >
                      <div className="flex-shrink-0 h-10 w-10 bg-[#2B3990] text-white rounded-full flex items-center justify-center mr-3">
                        <User className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="mt-1 flex items-center">
                          <Shield className="h-3 w-3 mr-1 text-gray-400" />
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getRoleColor(user.role)}`}>
                            {getRoleName(user.role)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Branch: {getBranchName(user.allowedBranches[0])}
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginAs;
