import React from 'react';
import {
  Home,
  Users,
  Building,
  DollarSign,
  FileText,
  Settings,
  Truck,
  Package,
  BookOpen,
  CheckSquare,
  Wrench
} from 'lucide-react';
import StickyModuleMenu from '../layout/StickyModuleMenu';

interface BackOfficeMenuProps {
  onMenuItemClick: (item: string) => void;
  activeItem: string;
}

const BackOfficeMenu: React.FC<BackOfficeMenuProps> = ({ onMenuItemClick, activeItem }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <Home className="h-4 w-4 mr-3" />
    },
    {
      id: 'hr',
      label: 'Human Resources',
      icon: <Users className="h-4 w-4 mr-3" />
    },
    {
      id: 'finance',
      label: 'Finance',
      icon: <DollarSign className="h-4 w-4 mr-3" />
    },
    {
      id: 'accounting',
      label: 'Accounting',
      icon: <BookOpen className="h-4 w-4 mr-3" />
    },
    {
      id: 'administration',
      label: 'Administration',
      icon: <Building className="h-4 w-4 mr-3" />
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: <Package className="h-4 w-4 mr-3" />
    },
    {
      id: 'procurement',
      label: 'Procurement',
      icon: <Truck className="h-4 w-4 mr-3" />
    },
    {
      id: 'facilities',
      label: 'Facilities Management',
      icon: <Wrench className="h-4 w-4 mr-3" />
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: <FileText className="h-4 w-4 mr-3" />
    },
    {
      id: 'approvals',
      label: 'Approvals',
      icon: <CheckSquare className="h-4 w-4 mr-3" />
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="h-4 w-4 mr-3" />
    }
  ];

  return (
    <StickyModuleMenu>
      <div className="bg-white rounded-lg shadow-sm p-3">
        <h2 className="text-sm font-semibold mb-2 text-gray-700">Back Office Menu</h2>
        <div className="space-y-0.5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center justify-between px-2 py-1.5 text-sm rounded-md ${
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
    </StickyModuleMenu>
  );
};

export default BackOfficeMenu;
