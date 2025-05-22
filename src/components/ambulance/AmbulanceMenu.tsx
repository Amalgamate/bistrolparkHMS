import React from 'react';
import {
  Home,
  PhoneCall,
  Truck,
  Users,
  Wrench,
  Calendar,
  FileText,
  Settings,
  BarChart
} from 'lucide-react';

interface AmbulanceMenuProps {
  onMenuItemClick: (item: string) => void;
  activeItem: string;
}

const AmbulanceMenu: React.FC<AmbulanceMenuProps> = ({ onMenuItemClick, activeItem }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-4 w-4 mr-3" />
    },
    {
      id: 'fleet',
      label: 'Fleet Management',
      icon: <Truck className="h-4 w-4 mr-3" />
    },
    {
      id: 'crew',
      label: 'Crew Management',
      icon: <Users className="h-4 w-4 mr-3" />
    },
    {
      id: 'calls',
      label: 'Emergency Calls',
      icon: <PhoneCall className="h-4 w-4 mr-3" />
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: <Wrench className="h-4 w-4 mr-3" />
    },
    {
      id: 'scheduling',
      label: 'Scheduling',
      icon: <Calendar className="h-4 w-4 mr-3" />
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
      <h2 className="text-lg font-semibold mb-4">Ambulance Menu</h2>
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
              activeItem === item.id
                ? 'bg-amber-50 text-amber-700'
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

export default AmbulanceMenu;
