import React, { useState } from 'react';
import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import {
  Building,
  Users,
  Settings,
  Shield,
  FileText,
  Mail,
  Phone,
  Globe,
  Database,
  Server,
  Cog,
  Bell,
  Calendar,
  Briefcase,
  Layers,
  BarChart,
  Lock,
  HardDrive,
  Wrench,
  AlertTriangle,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Edit,
  Trash,
  CheckCircle,
  XCircle,
  Eye
} from 'lucide-react';
import AdminModuleMenu from '../../../components/back-office/AdminModuleMenu';

const AdministrationModule: React.FC = () => {
  const [activeItem, setActiveItem] = useState('admin-dashboard');

  const handleMenuItemClick = (item: string) => {
    setActiveItem(item);
  };

  // Render content based on active menu item
  const renderContent = () => {
    switch (activeItem) {
      case 'admin-dashboard':
        return <AdminDashboardContent />;
      case 'admin-facilities':
        return <FacilitiesContent />;
      case 'admin-branches':
        return <BranchesContent />;
      case 'admin-departments':
        return <DepartmentsContent />;
      case 'admin-users':
        return <UserManagementContent />;
      case 'admin-roles':
        return <RolesPermissionsContent />;
      case 'admin-policies':
        return <PoliciesContent />;
      case 'admin-communications':
        return <CommunicationsContent />;
      case 'admin-notifications':
        return <NotificationsContent />;
      case 'admin-system':
        return <SystemSettingsContent />;
      case 'admin-database':
        return <DatabaseManagementContent />;
      case 'admin-backups':
        return <BackupsRecoveryContent />;
      case 'admin-security':
        return <SecurityContent />;
      case 'admin-maintenance':
        return <SystemMaintenanceContent />;
      case 'admin-logs':
        return <SystemLogsContent />;
      case 'admin-audit':
        return <AuditTrailsContent />;
      case 'admin-reports':
        return <AdminReportsContent />;
      default:
        return <AdminDashboardContent />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="md:col-span-1">
        <AdminModuleMenu activeItem={activeItem} onMenuItemClick={handleMenuItemClick} />
      </div>
      <div className="md:col-span-3">
        {renderContent()}
      </div>
    </div>
  );
};

// Admin Dashboard Content
const AdminDashboardContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Admin Dashboard</h2>
          <p className="text-gray-500">System overview and key metrics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Active Users</h3>
          <p className="text-2xl font-bold mt-1">243</p>
          <div className="text-xs text-green-600 mt-1">+18 this month</div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">System Health</h3>
          <p className="text-2xl font-bold mt-1">98%</p>
          <div className="text-xs text-gray-500 mt-1">All systems operational</div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-gray-500">Storage Usage</h3>
          <p className="text-2xl font-bold mt-1">64%</p>
          <div className="text-xs text-amber-600 mt-1">2.4TB of 3.8TB used</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-md font-medium mb-3">System Activity</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md">
            <BarChart className="h-16 w-16 text-gray-300" />
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-md font-medium mb-3">Recent Events</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <Users className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">New user account created</p>
                <p className="text-xs text-gray-500">Dr. Michael Chen</p>
                <p className="text-xs text-gray-400">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <Shield className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Security scan completed</p>
                <p className="text-xs text-gray-500">No issues found</p>
                <p className="text-xs text-gray-400">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-50">
              <Database className="h-5 w-5 text-purple-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Database backup completed</p>
                <p className="text-xs text-gray-500">Backup size: 1.2GB</p>
                <p className="text-xs text-gray-400">Yesterday</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Facilities Content
const FacilitiesContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Facilities</h2>
          <p className="text-gray-500">Manage hospital facilities and locations</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Facility
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search facilities..." className="pl-8" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="maintenance">Under Maintenance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <div className="grid grid-cols-6 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div className="col-span-2">Facility Name</div>
          <div>Location</div>
          <div>Capacity</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Main Hospital</p>
              <p className="text-xs text-gray-500">ID: FAC-001</p>
            </div>
            <div>Nairobi Central</div>
            <div>350 beds</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">East Wing</p>
              <p className="text-xs text-gray-500">ID: FAC-002</p>
            </div>
            <div>Eastlands</div>
            <div>120 beds</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Pediatric Center</p>
              <p className="text-xs text-gray-500">ID: FAC-003</p>
            </div>
            <div>Westlands</div>
            <div>80 beds</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Maintenance</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Branches Content
const BranchesContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Branches</h2>
          <p className="text-gray-500">Manage hospital branches and locations</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Branch
        </Button>
      </div>

      <div className="border rounded-md">
        <div className="grid grid-cols-6 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div className="col-span-2">Branch Name</div>
          <div>Location</div>
          <div>Manager</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Nairobi Main</p>
              <p className="text-xs text-gray-500">Headquarters</p>
            </div>
            <div>Central Business District</div>
            <div>Dr. James Mwangi</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Mombasa Branch</p>
              <p className="text-xs text-gray-500">Coastal Region</p>
            </div>
            <div>Nyali</div>
            <div>Dr. Sarah Ochieng</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Kisumu Branch</p>
              <p className="text-xs text-gray-500">Western Region</p>
            </div>
            <div>Milimani</div>
            <div>Dr. Robert Otieno</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">Opening Soon</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// User Management Content
const UserManagementContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">User Management</h2>
          <p className="text-gray-500">Manage system users and access</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search users..." className="pl-8" />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Administrators</SelectItem>
              <SelectItem value="doctor">Doctors</SelectItem>
              <SelectItem value="nurse">Nurses</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-md">
        <div className="grid grid-cols-6 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div className="col-span-2">Name</div>
          <div>Email</div>
          <div>Role</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">JM</div>
              <div>
                <p className="font-medium">John Maina</p>
                <p className="text-xs text-gray-500">ID: USR-001</p>
              </div>
            </div>
            <div>john.maina@hospital.com</div>
            <div>Administrator</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">SW</div>
              <div>
                <p className="font-medium">Sarah Wanjiku</p>
                <p className="text-xs text-gray-500">ID: USR-002</p>
              </div>
            </div>
            <div>sarah.w@hospital.com</div>
            <div>Doctor</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-medium">DO</div>
              <div>
                <p className="font-medium">David Omondi</p>
                <p className="text-xs text-gray-500">ID: USR-003</p>
              </div>
            </div>
            <div>david.o@hospital.com</div>
            <div>Nurse</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Inactive</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Roles & Permissions Content
const RolesPermissionsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Roles & Permissions</h2>
          <p className="text-gray-500">Manage user roles and access rights</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Role
        </Button>
      </div>

      <div className="border rounded-md mb-6">
        <div className="grid grid-cols-5 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div className="col-span-2">Role Name</div>
          <div>Users</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-5 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Administrator</p>
              <p className="text-xs text-gray-500">Full system access</p>
            </div>
            <div>5</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Doctor</p>
              <p className="text-xs text-gray-500">Clinical access</p>
            </div>
            <div>28</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Nurse</p>
              <p className="text-xs text-gray-500">Limited clinical access</p>
            </div>
            <div>42</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        </div>
      </div>

      <h3 className="text-lg font-medium mb-4">Permission Matrix</h3>
      <div className="border rounded-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Permission</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Administrator</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nurse</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receptionist</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">View Patients</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><CheckCircle className="h-5 w-5 text-green-500" /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><CheckCircle className="h-5 w-5 text-green-500" /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><CheckCircle className="h-5 w-5 text-green-500" /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><CheckCircle className="h-5 w-5 text-green-500" /></td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Edit Patient Records</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><CheckCircle className="h-5 w-5 text-green-500" /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><CheckCircle className="h-5 w-5 text-green-500" /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><CheckCircle className="h-5 w-5 text-green-500" /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><XCircle className="h-5 w-5 text-red-500" /></td>
            </tr>
            <tr>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Manage Users</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><CheckCircle className="h-5 w-5 text-green-500" /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><XCircle className="h-5 w-5 text-red-500" /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><XCircle className="h-5 w-5 text-red-500" /></td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><XCircle className="h-5 w-5 text-red-500" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Policies Content
const PoliciesContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Policies</h2>
          <p className="text-gray-500">Manage system policies and guidelines</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Policy
        </Button>
      </div>

      <div className="border rounded-md">
        <div className="grid grid-cols-5 gap-4 p-3 border-b bg-gray-50 font-medium text-sm">
          <div className="col-span-2">Policy Name</div>
          <div>Last Updated</div>
          <div>Status</div>
          <div>Actions</div>
        </div>
        <div className="divide-y">
          <div className="grid grid-cols-5 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Data Privacy Policy</p>
              <p className="text-xs text-gray-500">Guidelines for handling patient data</p>
            </div>
            <div>Jan 15, 2023</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Security Protocol</p>
              <p className="text-xs text-gray-500">System security guidelines</p>
            </div>
            <div>Mar 22, 2023</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Active</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-4 p-3 items-center hover:bg-gray-50">
            <div className="col-span-2">
              <p className="font-medium">Password Policy</p>
              <p className="text-xs text-gray-500">Password requirements and rotation</p>
            </div>
            <div>Feb 10, 2023</div>
            <div><span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-800">Under Review</span></div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">View</Button>
              <Button variant="ghost" size="sm">Edit</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Communications Content
const CommunicationsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Communications</h2>
          <p className="text-gray-500">Manage system communications and notifications</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Message
        </Button>
      </div>

      <div className="text-center py-12">
        <Mail className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Communications management will be implemented soon.</p>
        <p className="text-sm text-gray-400 mt-2">This module will include email templates, SMS notifications, and system announcements.</p>
      </div>
    </div>
  );
};

// Notifications Content
const NotificationsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Notifications</h2>
          <p className="text-gray-500">Manage system notifications and alerts</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Notification
        </Button>
      </div>

      <div className="text-center py-12">
        <Bell className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">Notification management will be implemented soon.</p>
        <p className="text-sm text-gray-400 mt-2">This module will include notification templates, delivery methods, and scheduling.</p>
      </div>
    </div>
  );
};

// System Settings Content
const SystemSettingsContent = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">System Settings</h2>
          <p className="text-gray-500">Configure system-wide settings</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Cog className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="text-center py-12">
        <Settings className="h-16 w-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">System settings will be implemented soon.</p>
        <p className="text-sm text-gray-400 mt-2">This module will include general settings, localization, and system preferences.</p>
      </div>
    </div>
  );
};

// Placeholder components for remaining sections
const DepartmentsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Departments</h2>
        <p className="text-gray-500">Manage hospital departments</p>
      </div>
      <Button className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Add Department
      </Button>
    </div>

    <div className="text-center py-12">
      <Briefcase className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Department management will be implemented soon.</p>
    </div>
  </div>
);

const DatabaseManagementContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Database Management</h2>
        <p className="text-gray-500">Manage system database</p>
      </div>
      <Button className="flex items-center gap-2">
        <Database className="h-4 w-4" />
        Backup Now
      </Button>
    </div>

    <div className="text-center py-12">
      <Database className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Database management will be implemented soon.</p>
    </div>
  </div>
);

const BackupsRecoveryContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Backups & Recovery</h2>
        <p className="text-gray-500">Manage system backups and recovery</p>
      </div>
      <Button className="flex items-center gap-2">
        <HardDrive className="h-4 w-4" />
        Create Backup
      </Button>
    </div>

    <div className="text-center py-12">
      <HardDrive className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Backup and recovery will be implemented soon.</p>
    </div>
  </div>
);

const SecurityContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Security</h2>
        <p className="text-gray-500">Manage system security settings</p>
      </div>
      <Button className="flex items-center gap-2">
        <Lock className="h-4 w-4" />
        Security Scan
      </Button>
    </div>

    <div className="text-center py-12">
      <Lock className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Security management will be implemented soon.</p>
    </div>
  </div>
);

const SystemMaintenanceContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">System Maintenance</h2>
        <p className="text-gray-500">Manage system maintenance tasks</p>
      </div>
      <Button className="flex items-center gap-2">
        <Wrench className="h-4 w-4" />
        Run Maintenance
      </Button>
    </div>

    <div className="text-center py-12">
      <Wrench className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">System maintenance will be implemented soon.</p>
    </div>
  </div>
);

const SystemLogsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">System Logs</h2>
        <p className="text-gray-500">View and manage system logs</p>
      </div>
      <Button className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export Logs
      </Button>
    </div>

    <div className="text-center py-12">
      <Server className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">System logs will be implemented soon.</p>
    </div>
  </div>
);

const AuditTrailsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Audit Trails</h2>
        <p className="text-gray-500">View system audit trails</p>
      </div>
      <Button className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export Audit
      </Button>
    </div>

    <div className="text-center py-12">
      <AlertTriangle className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Audit trails will be implemented soon.</p>
    </div>
  </div>
);

const AdminReportsContent = () => (
  <div className="bg-white rounded-lg shadow-sm p-6">
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold">Admin Reports</h2>
        <p className="text-gray-500">Generate and view administrative reports</p>
      </div>
      <Button className="flex items-center gap-2">
        <Download className="h-4 w-4" />
        Export Reports
      </Button>
    </div>

    <div className="text-center py-12">
      <BarChart className="h-16 w-16 mx-auto text-gray-300 mb-4" />
      <p className="text-gray-500">Administrative reports will be implemented soon.</p>
    </div>
  </div>
);

export default AdministrationModule;
