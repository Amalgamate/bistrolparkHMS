import React from 'react';
import {
  Home,
  Droplets,
  Users,
  FileText,
  Settings,
  BarChart
} from 'lucide-react';

interface BloodBankMenuProps {
  onMenuItemClick: (item: string) => void;
  activeItem: string;
}

const BloodBankMenu: React.FC<BloodBankMenuProps> = ({ onMenuItemClick, activeItem }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-4 w-4 mr-3" />
    },
    {
      id: 'inventory',
      label: 'Blood Inventory',
      icon: <Droplets className="h-4 w-4 mr-3" />
    },
    {
      id: 'donors',
      label: 'Donor Management',
      icon: <Users className="h-4 w-4 mr-3" />
    },
    {
      id: 'requests',
      label: 'Blood Requests',
      icon: <FileText className="h-4 w-4 mr-3" />
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <BarChart className="h-4 w-4 mr-3" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4 mr-3" />
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Blood Bank Menu</h2>
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
              activeItem === item.id
                ? 'bg-red-50 text-red-700'
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

export default BloodBankMenu;
