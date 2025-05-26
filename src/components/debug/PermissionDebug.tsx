import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { canControlServerServices, isSuperAdmin, canManageAllUsers, getAdminLevelDisplayName } from '@/utils/roleUtils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Shield } from 'lucide-react';

const PermissionDebug: React.FC = () => {
  const { user, hasPermission } = useAuth();

  if (!user) {
    return (
      <Card className="m-4">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5" />
            <span>Permission Debug</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-600">No user logged in</p>
        </CardContent>
      </Card>
    );
  }

  const permissions = [
    {
      name: 'Super Admin Check',
      hasPermission: isSuperAdmin(user),
      description: 'Can access all system functions'
    },
    {
      name: 'Service Control',
      hasPermission: canControlServerServices(user),
      description: 'Can start/stop/restart server services'
    },
    {
      name: 'Manage All Users',
      hasPermission: canManageAllUsers(user),
      description: 'Can create and manage all user types including Super Admins'
    },
    {
      name: 'Access Service Management',
      hasPermission: hasPermission('access_service_management'),
      description: 'Can access the Service Management module'
    },
    {
      name: 'Manage Basic Settings',
      hasPermission: hasPermission('manage_basic_settings'),
      description: 'Can access Administration section'
    },
    {
      name: 'Manage Database',
      hasPermission: hasPermission('manage_database'),
      description: 'Can access Database Management'
    }
  ];

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5" />
          <span>Permission Debug - Current User</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Username</label>
            <p className="font-semibold">{user.username}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Role</label>
            <p className="font-semibold">{user.role}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Display Name</label>
            <p className="font-semibold">{getAdminLevelDisplayName(user)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">User ID</label>
            <p className="font-mono text-xs">{user.id}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-lg">Permission Checks</h3>
          {permissions.map((perm, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">{perm.name}</div>
                <div className="text-sm text-gray-500">{perm.description}</div>
              </div>
              <div className="flex items-center space-x-2">
                {perm.hasPermission ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <Badge className="bg-green-600 text-white">GRANTED</Badge>
                  </>
                ) : (
                  <>
                    <XCircle className="h-5 w-5 text-red-600" />
                    <Badge className="bg-red-600 text-white">DENIED</Badge>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900">Expected for Super Admin:</h4>
          <ul className="text-sm text-blue-800 mt-1 space-y-1">
            <li>✅ All permission checks should show "GRANTED"</li>
            <li>✅ Should see "Administration" section in sidebar</li>
            <li>✅ Should see "Service Management" under Administration</li>
            <li>✅ Should be able to create other Super Admin users</li>
          </ul>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-900">Raw User Object:</h4>
          <pre className="text-xs mt-2 overflow-auto">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionDebug;
