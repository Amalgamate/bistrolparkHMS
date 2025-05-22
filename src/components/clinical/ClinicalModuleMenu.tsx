import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Users,
  Activity,
  Stethoscope,
  Beaker,
  Pill,
  Settings,
  LucideIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import StickyModuleMenu from '../layout/StickyModuleMenu';
import { ColoredMenuItem } from '../ui/colored-menu-item';
import { ColorVariant } from '../ui/colored-icon-button';
import { ModuleMenu } from '../ui/module-menu';

interface ClinicalModuleMenuProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  className?: string;
}

export const ClinicalModuleMenu: React.FC<ClinicalModuleMenuProps> = ({
  activeTab = 'registration',
  onTabChange,
  className
}) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'registration',
      icon: UserPlus,
      color: 'blue' as ColorVariant,
      label: 'Patient Registration'
    },
    {
      id: 'queue',
      icon: Users,
      color: 'green' as ColorVariant,
      label: 'Queue Management'
    },
    {
      id: 'vitals',
      icon: Activity,
      color: 'purple' as ColorVariant,
      label: 'Vitals Capture'
    },
    {
      id: 'consultation',
      icon: Stethoscope,
      color: 'indigo' as ColorVariant,
      label: 'Doctor Consultation'
    },
    {
      id: 'lab',
      icon: Beaker,
      color: 'teal' as ColorVariant,
      label: 'Lab Queue'
    },
    {
      id: 'pharmacy',
      icon: Pill,
      color: 'orange' as ColorVariant,
      label: 'Pharmacy Queue'
    },
    {
      id: 'settings',
      icon: Settings,
      color: 'gray' as ColorVariant,
      label: 'Settings'
    }
  ];

  return (
    <StickyModuleMenu>
      <div className={cn("bg-white rounded-md shadow-sm overflow-hidden", className)}>
        <ModuleMenu
          title="Clinical Menu"
          items={menuItems}
          activeItemId={activeTab || ''}
          onItemClick={(itemId) => onTabChange?.(itemId)}
        />
      </div>
    </StickyModuleMenu>
  );
};

export default ClinicalModuleMenu;
