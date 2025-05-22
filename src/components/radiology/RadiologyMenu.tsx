import React from 'react';
import {
  Home,
  FileImage,
  Calendar,
  FileText,
  Settings,
  Users,
  BarChart,
  Database,
  Cog
} from 'lucide-react';

interface RadiologyMenuProps {
  onMenuItemClick: (item: string) => void;
  activeItem: string;
}

const RadiologyMenu: React.FC<RadiologyMenuProps> = ({ onMenuItemClick, activeItem }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-4 w-4 mr-3" />
    },
    {
      id: 'requests',
      label: 'Requests',
      icon: <FileImage className="h-4 w-4 mr-3" />
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: <Calendar className="h-4 w-4 mr-3" />
    },
    {
      id: 'tests',
      label: 'Tests',
      icon: <Database className="h-4 w-4 mr-3" />
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText className="h-4 w-4 mr-3" />
    },
    {
      id: 'patients',
      label: 'Patients',
      icon: <Users className="h-4 w-4 mr-3" />
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart className="h-4 w-4 mr-3" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Cog className="h-4 w-4 mr-3" />
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Radiology Menu</h2>
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
              activeItem === item.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => onMenuItemClick(item.id)}
          >
            <div className="flex items-center">
              {item.icon}
              <span>{item.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RadiologyMenu;
