import React from 'react';
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
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface AdminModuleMenuProps {
  activeItem: string;
  onMenuItemClick: (item: string) => void;
}

const AdminModuleMenu: React.FC<AdminModuleMenuProps> = ({ activeItem, onMenuItemClick }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: <Layers className="w-4 h-4" /> },
    { id: 'facilities', label: 'Facilities', icon: <Building className="w-4 h-4" /> },
    { id: 'branches', label: 'Branches', icon: <Globe className="w-4 h-4" /> },
    { id: 'departments', label: 'Departments', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'users', label: 'User Management', icon: <Users className="w-4 h-4" /> },
    { id: 'roles', label: 'Roles & Permissions', icon: <Shield className="w-4 h-4" /> },
    { id: 'policies', label: 'Policies', icon: <FileText className="w-4 h-4" /> },
    { id: 'communications', label: 'Communications', icon: <Mail className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'system', label: 'System Settings', icon: <Cog className="w-4 h-4" /> },
    { id: 'database', label: 'Database Management', icon: <Database className="w-4 h-4" /> },
    { id: 'backups', label: 'Backups & Recovery', icon: <HardDrive className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'maintenance', label: 'System Maintenance', icon: <Wrench className="w-4 h-4" /> },
    { id: 'logs', label: 'System Logs', icon: <Server className="w-4 h-4" /> },
    { id: 'audit', label: 'Audit Trails', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'reports', label: 'Admin Reports', icon: <BarChart className="w-4 h-4" /> }
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="py-2">
          <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border-b">
            Administration Menu
          </h3>
          <nav className="mt-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onMenuItemClick(`admin-${item.id}`)}
                className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                  activeItem === `admin-${item.id}`
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminModuleMenu;
