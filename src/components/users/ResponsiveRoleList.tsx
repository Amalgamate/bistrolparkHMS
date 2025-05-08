import React from 'react';
import { Role } from '../../context/UserRolesContext';
import { Shield, Edit, Trash } from 'lucide-react';
import ResponsiveTable from '../common/ResponsiveTable';

interface ResponsiveRoleListProps {
  roles: Role[];
  onEdit: (role: Role) => void;
  onDelete: (roleId: string) => void;
  getUsersByRole: (roleId: string) => any[];
}

const ResponsiveRoleList: React.FC<ResponsiveRoleListProps> = ({
  roles,
  onEdit,
  onDelete,
  getUsersByRole
}) => {
  return (
    <ResponsiveTable
      columns={[
        {
          key: 'name',
          header: 'Role',
          priority: 1,
          render: (value, role) => (
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-[#2B3990] mr-2" />
              <div>
                <h3 className="font-semibold">{role.name}</h3>
                {role.description && (
                  <p className="text-sm text-gray-600">{role.description}</p>
                )}
              </div>
            </div>
          )
        },
        {
          key: 'permissions',
          header: 'Permissions',
          priority: 2,
          render: (value, role) => (
            <div className="flex flex-wrap gap-1">
              {role.permissions.slice(0, 3).map((permission) => (
                <span
                  key={permission}
                  className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                >
                  {permission.replace(/_/g, ' ')}
                </span>
              ))}
              {role.permissions.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                  +{role.permissions.length - 3} more
                </span>
              )}
            </div>
          )
        },
        {
          key: 'users',
          header: 'Users',
          priority: 3,
          render: (value, role) => {
            const users = getUsersByRole(role.id);
            return (
              <div>
                {users.length > 0 ? (
                  <div className="text-sm">
                    {users.slice(0, 2).map(user => user.name).join(', ')}
                    {users.length > 2 && ` +${users.length - 2} more`}
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">No users</span>
                )}
              </div>
            );
          }
        },
        {
          key: 'actions',
          header: 'Actions',
          priority: 4,
          render: (value, role) => (
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => onEdit(role)}
                className="p-1 text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50 rounded"
                title="Edit"
              >
                <Edit size={18} />
              </button>
              {/* Only show delete button if no users have this role */}
              {getUsersByRole(role.id).length === 0 && (
                <button
                  onClick={() => onDelete(role.id)}
                  className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                  title="Delete"
                >
                  <Trash size={18} />
                </button>
              )}
            </div>
          )
        }
      ]}
      data={roles}
      keyField="id"
      emptyMessage="No roles defined"
    />
  );
};

export default ResponsiveRoleList;
