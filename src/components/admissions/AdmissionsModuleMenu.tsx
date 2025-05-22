import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UserCheck,
  Bed,
  FileText,
  Settings,
  LucideIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import StickyModuleMenu from '../layout/StickyModuleMenu';
import { ModuleMenu } from '../ui/module-menu';
import { ColorVariant } from '../ui/colored-icon-button';

interface AdmissionsModuleMenuProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  className?: string;
}

export const AdmissionsModuleMenu: React.FC<AdmissionsModuleMenuProps> = ({
  activeTab = 'admission-register',
  onTabChange,
  className
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      id: 'admission-register',
      icon: UserCheck,
      color: 'amber' as ColorVariant,
      label: 'Admission Register'
    },
    {
      id: 'bed-management',
      icon: Bed,
      color: 'blue' as ColorVariant,
      label: 'Bed Management'
    },
    {
      id: 'reports',
      icon: FileText,
      color: 'indigo' as ColorVariant,
      label: 'Admission Reports'
    },
    {
      id: 'settings',
      icon: Settings,
      color: 'gray' as ColorVariant,
      label: 'Facility Settings'
    }
  ];

  return (
    <StickyModuleMenu>
      <div className={cn("bg-white rounded-md shadow-sm overflow-hidden", className)}>
        <ModuleMenu
          title="Admissions Menu"
          items={menuItems}
          activeItemId={activeTab || ''}
          onItemClick={(itemId) => onTabChange?.(itemId)}
        />
      </div>
    </StickyModuleMenu>
  );
};

export default AdmissionsModuleMenu;
