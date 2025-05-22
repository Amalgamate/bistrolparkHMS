import React from 'react';
import {
  FlaskConical,
  Users,
  FileText,
  DollarSign,
  ClipboardList,
  UserPlus,
  Home,
  Settings,
  LucideIcon
} from 'lucide-react';
import { ColoredMenuItem } from '../ui/colored-menu-item';
import { ColorVariant } from '../ui/colored-icon-button';

interface LabMenuProps {
  onMenuItemClick: (item: string) => void;
  activeItem: string;
}

const LabMenu: React.FC<LabMenuProps> = ({ onMenuItemClick, activeItem }) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      color: 'blue' as ColorVariant
    },
    {
      id: 'requests',
      label: 'Lab Requests',
      icon: FlaskConical,
      color: 'teal' as ColorVariant
    },
    {
      id: 'internal',
      label: 'Internal Patient Visits',
      icon: Users,
      color: 'green' as ColorVariant
    },
    {
      id: 'external',
      label: 'External Patient Visits',
      icon: Users,
      color: 'purple' as ColorVariant
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileText,
      color: 'indigo' as ColorVariant
    },
    {
      id: 'prices',
      label: 'Test Prices',
      icon: DollarSign,
      color: 'amber' as ColorVariant
    },
    {
      id: 'new',
      label: 'New Lab Request',
      icon: ClipboardList,
      color: 'green' as ColorVariant
    },
    {
      id: 'walkin',
      label: 'Walk-In Patients',
      icon: UserPlus,
      color: 'pink' as ColorVariant
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'gray' as ColorVariant
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Lab Menu</h2>
      <div className="space-y-1">
        {menuItems.map((item) => (
          <ColoredMenuItem
            key={item.id}
            icon={item.icon}
            color={item.color}
            label={item.label}
            active={activeItem === item.id}
            onClick={() => onMenuItemClick(item.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default LabMenu;
