import React from 'react';
import {
  Home,
  Calendar,
  Heart,
  Baby,
  Stethoscope,
  FileText,
  Settings,
  Users,
  Bed
} from 'lucide-react';

interface MaternityMenuProps {
  onMenuItemClick: (item: string) => void;
  activeItem: string;
}

const MaternityMenu: React.FC<MaternityMenuProps> = ({ onMenuItemClick, activeItem }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-4 w-4 mr-3" />
    },
    {
      id: 'prenatal',
      label: 'Prenatal Care',
      icon: <Calendar className="h-4 w-4 mr-3" />
    },
    {
      id: 'labor',
      label: 'Labor & Delivery',
      icon: <Bed className="h-4 w-4 mr-3" />
    },
    {
      id: 'newborns',
      label: 'Newborns',
      icon: <Baby className="h-4 w-4 mr-3" />
    },
    {
      id: 'postpartum',
      label: 'Postpartum Care',
      icon: <Heart className="h-4 w-4 mr-3" />
    },
    {
      id: 'patients',
      label: 'Patients',
      icon: <Users className="h-4 w-4 mr-3" />
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
      <h2 className="text-lg font-semibold mb-4">Maternity Menu</h2>
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
              activeItem === item.id
                ? 'bg-pink-50 text-pink-700'
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

export default MaternityMenu;
