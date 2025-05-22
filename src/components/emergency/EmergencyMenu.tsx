import React from 'react';
import {
  Home,
  AlertTriangle,
  Users,
  Heart,
  Bed,
  FileText,
  Settings
} from 'lucide-react';

interface EmergencyMenuProps {
  onMenuItemClick: (item: string) => void;
  activeItem: string;
}

const EmergencyMenu: React.FC<EmergencyMenuProps> = ({ onMenuItemClick, activeItem }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-4 w-4 mr-3" />
    },
    {
      id: 'triage',
      label: 'Triage',
      icon: <AlertTriangle className="h-4 w-4 mr-3" />
    },
    {
      id: 'patients',
      label: 'Patients',
      icon: <Users className="h-4 w-4 mr-3" />
    },
    {
      id: 'trauma',
      label: 'Trauma Center',
      icon: <Heart className="h-4 w-4 mr-3" />
    },
    {
      id: 'resources',
      label: 'Resources',
      icon: <Bed className="h-4 w-4 mr-3" />
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText className="h-4 w-4 mr-3" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4 mr-3" />
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Emergency Menu</h2>
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

export default EmergencyMenu;
