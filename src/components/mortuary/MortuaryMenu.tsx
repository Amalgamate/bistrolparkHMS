import React from 'react';
import {
  Home,
  Users,
  FileText,
  Settings,
  Clipboard,
  Thermometer,
  Truck,
  Wrench,
  Calendar,
  DollarSign
} from 'lucide-react';

interface MortuaryMenuProps {
  onMenuItemClick: (item: string) => void;
  activeItem: string;
}

const MortuaryMenu: React.FC<MortuaryMenuProps> = ({ onMenuItemClick, activeItem }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-4 w-4 mr-3" />
    },
    {
      id: 'deceased',
      label: 'Deceased Registry',
      icon: <Users className="h-4 w-4 mr-3" />
    },
    {
      id: 'storage',
      label: 'Storage Management',
      icon: <Thermometer className="h-4 w-4 mr-3" />
    },
    {
      id: 'services',
      label: 'Mortuary Services',
      icon: <Wrench className="h-4 w-4 mr-3" />
    },
    {
      id: 'release',
      label: 'Body Release',
      icon: <Truck className="h-4 w-4 mr-3" />
    },
    {
      id: 'certificates',
      label: 'Death Certificates',
      icon: <FileText className="h-4 w-4 mr-3" />
    },
    {
      id: 'appointments',
      label: 'Viewing Appointments',
      icon: <Calendar className="h-4 w-4 mr-3" />
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: <DollarSign className="h-4 w-4 mr-3" />
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
      <h2 className="text-lg font-semibold mb-4">Mortuary Menu</h2>
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
              activeItem === item.id
                ? 'bg-gray-800 text-white'
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

export default MortuaryMenu;
