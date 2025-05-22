import React from 'react';
import {
  Home,
  Users,
  Calendar,
  FileText,
  Settings,
  Activity,
  Clipboard,
  Dumbbell,
  Wrench,
  UserPlus
} from 'lucide-react';

interface PhysiotherapyMenuProps {
  onMenuItemClick: (item: string) => void;
  activeItem: string;
}

const PhysiotherapyMenu: React.FC<PhysiotherapyMenuProps> = ({ onMenuItemClick, activeItem }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-4 w-4 mr-3" />
    },
    {
      id: 'patients',
      label: 'Patients',
      icon: <Users className="h-4 w-4 mr-3" />
    },
    {
      id: 'assessments',
      label: 'Assessments',
      icon: <Clipboard className="h-4 w-4 mr-3" />
    },
    {
      id: 'sessions',
      label: 'Sessions',
      icon: <Calendar className="h-4 w-4 mr-3" />
    },
    {
      id: 'exercises',
      label: 'Exercise Library',
      icon: <Dumbbell className="h-4 w-4 mr-3" />
    },
    {
      id: 'therapists',
      label: 'Therapists',
      icon: <UserPlus className="h-4 w-4 mr-3" />
    },
    {
      id: 'equipment',
      label: 'Equipment',
      icon: <Wrench className="h-4 w-4 mr-3" />
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
      <h2 className="text-lg font-semibold mb-4">Physiotherapy Menu</h2>
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
              activeItem === item.id
                ? 'bg-green-50 text-green-700'
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

export default PhysiotherapyMenu;
