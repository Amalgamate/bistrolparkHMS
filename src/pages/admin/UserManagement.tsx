import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { canManageAllUsers, canManageHospitalUsers, isSuperAdmin } from '@/utils/roleUtils';
import {
  Users,
  UserPlus,
  Shield,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  roleDisplayName: string;
  canControlServices: boolean;
  canManageUsers: boolean;
  created_at: string;
  updated_at: string;
}

interface CreateUserForm {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

const UserManagement: React.FC = () => {
  const { user } = useAuth();
  const canManageAll = canManageAllUsers(user);
  const canManageHospital = canManageHospitalUsers(user);
  const isSuper = isSuperAdmin(user);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserForm>({
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    role: 'admin'
  });

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users', {
        headers: {
          'x-auth-token': localStorage.getItem('token') || ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setUsers(data.users);
        } else {
          setError('Failed to fetch users');
        }
      } else {
        setError(`Failed to fetch users: ${response.status}`);
      }
    } catch (err) {
      setError('Network error while fetching users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new user
  const createUser = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': localStorage.getItem('token') || ''
        },
        body: JSON.stringify(createForm)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setUsers(prev => [...prev, data.user]);
        setIsCreateDialogOpen(false);
        setCreateForm({
          username: '',
          password: '',
          email: '',
          first_name: '',
          last_name: '',
          role: 'admin'
        });
        setError(null);
      } else {
        setError(data.message || 'Failed to create user');
      }
    } catch (err) {
      setError('Network error while creating user');
      console.error('Error creating user:', err);
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super-admin':
        return 'bg-red-600 text-white';
      case 'bristol-admin':
        return 'bg-blue-600 text-white';
      case 'admin':
        return 'bg-green-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  // Get available roles for current user
  const getAvailableRoles = () => {
    if (isSuper) {
      return [
        { value: 'super-admin', label: 'Super Administrator' },
        { value: 'bristol-admin', label: 'Bristol Administrator' },
        { value: 'admin', label: 'Administrator' },
        { value: 'user', label: 'User' }
      ];
    } else if (canManageHospital) {
      return [
        { value: 'admin', label: 'Administrator' },
        { value: 'user', label: 'User' }
      ];
    } else {
      return [
        { value: 'user', label: 'User' }
      ];
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (!canManageHospital) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            You don't have permission to access user management.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage Bristol Park HMS user accounts and roles</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Create User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    value={createForm.first_name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder="John"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    value={createForm.last_name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, last_name: e.target.value }))}
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={createForm.username}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, username: e.target.value }))}
                  placeholder="john.doe"
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john.doe@bristolpark.com"
                />
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={createForm.password}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Minimum 8 characters"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={createForm.role} onValueChange={(value) => setCreateForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableRoles().map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={createUser}>
                  Create User
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>System Users ({users.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Clock className="h-6 w-6 animate-spin mr-2" />
              <span>Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No users found
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {user.first_name} {user.last_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        @{user.username} • {user.email}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge className={getRoleBadgeColor(user.role)}>
                          {user.roleDisplayName}
                        </Badge>
                        {user.canControlServices && (
                          <Badge variant="outline" className="text-xs">
                            Service Control
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    {canManageAll && user.role !== 'super-admin' && (
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
