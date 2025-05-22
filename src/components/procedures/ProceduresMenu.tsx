import React from 'react';
import {
  Home,
  Calendar,
  FileText,
  Settings,
  Users,
  Clipboard,
  Stethoscope,
  Scissors,
  BookOpen,
  Briefcase,
  CheckSquare
} from 'lucide-react';

interface ProceduresMenuProps {
  onMenuItemClick: (item: string) => void;
  activeItem: string;
}

const ProceduresMenu: React.FC<ProceduresMenuProps> = ({ onMenuItemClick, activeItem }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-4 w-4 mr-3" />
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: <Calendar className="h-4 w-4 mr-3" />
    },
    {
      id: 'procedures',
      label: 'Procedures',
      icon: <Scissors className="h-4 w-4 mr-3" />
    },
    {
      id: 'templates',
      label: 'Templates',
      icon: <BookOpen className="h-4 w-4 mr-3" />
    },
    {
      id: 'rooms',
      label: 'Procedure Rooms',
      icon: <Briefcase className="h-4 w-4 mr-3" />
    },
    {
      id: 'consents',
      label: 'Consent Forms',
      icon: <CheckSquare className="h-4 w-4 mr-3" />
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
      <h2 className="text-lg font-semibold mb-4">Procedures Menu</h2>
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md ${
              activeItem === item.id
                ? 'bg-purple-50 text-purple-700'
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

export default ProceduresMenu;
