import React from 'react';
import { ModuleMenu } from '../ui/module-menu';
import {
  Home,
  Users,
  Package,
  ArrowUpDown,
  Calendar,
  Clipboard,
  Box,
  BarChart,
  Settings
} from 'lucide-react';

interface PharmacyModuleMenuProps {
  activeItemId: string;
  onItemClick: (itemId: string) => void;
  pendingPrescriptions?: number;
  lowStockItems?: number;
  expiringItems?: number;
}

export const PharmacyModuleMenu: React.FC<PharmacyModuleMenuProps> = ({
  activeItemId,
  onItemClick,
  pendingPrescriptions = 0,
  lowStockItems = 0,
  expiringItems = 0
}) => {
  const menuItems = [
    {
      id: 'dashboard',
      icon: Home,
      color: 'blue' as const,
      label: 'Dashboard'
    },
    {
      id: 'queue',
      icon: Users,
      color: 'green' as const,
      label: 'Prescription Queue',
      badge: pendingPrescriptions > 0 
        ? { text: pendingPrescriptions.toString(), color: 'blue' as const } 
        : undefined
    },
    {
      id: 'inventory',
      icon: Package,
      color: 'purple' as const,
      label: 'Medication Inventory'
    },
    {
      id: 'stock-movement',
      icon: ArrowUpDown,
      color: 'indigo' as const,
      label: 'Stock Movement'
    },
    {
      id: 'expiry',
      icon: Calendar,
      color: 'red' as const,
      label: 'Expiry Management',
      badge: expiringItems > 0 
        ? { text: expiringItems.toString(), color: 'red' as const } 
        : undefined
    },
    {
      id: 'stock-take',
      icon: Clipboard,
      color: 'teal' as const,
      label: 'Stock Take'
    },
    {
      id: 'transfers',
      icon: Box,
      color: 'orange' as const,
      label: 'Internal Transfers'
    },
    {
      id: 'reports',
      icon: BarChart,
      color: 'amber' as const,
      label: 'Reports'
    },
    {
      id: 'settings',
      icon: Settings,
      color: 'gray' as const,
      label: 'Settings'
    }
  ];

  return (
    <ModuleMenu
      title="Pharmacy Menu"
      items={menuItems}
      activeItemId={activeItemId}
      onItemClick={onItemClick}
    />
  );
};

export default PharmacyModuleMenu;
