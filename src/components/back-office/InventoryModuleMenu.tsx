import React from 'react';
import {
  Package,
  Clipboard,
  BarChart,
  AlertTriangle,
  Truck,
  RefreshCw,
  Search,
  Settings,
  Calendar,
  Building,
  FileText,
  Users,
  CheckSquare,
  ShoppingCart,
  Clock
} from 'lucide-react';
import { Card, CardContent } from '../ui/card';

interface InventoryModuleMenuProps {
  activeItem: string;
  onMenuItemClick: (item: string) => void;
}

const InventoryModuleMenu: React.FC<InventoryModuleMenuProps> = ({ activeItem, onMenuItemClick }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Inventory Dashboard', icon: <Package className="w-4 h-4" /> },
    { id: 'stock-levels', label: 'Real-time Stock', icon: <Clock className="w-4 h-4" /> },
    { id: 'batch-expiry', label: 'Batch & Expiry', icon: <Calendar className="w-4 h-4" /> },
    { id: 'department-stock', label: 'Department Stock', icon: <Building className="w-4 h-4" /> },
    { id: 'requisitions', label: 'Requisitions', icon: <FileText className="w-4 h-4" /> },
    { id: 'purchase-vendor', label: 'Purchase & Vendors', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'approvals', label: 'Approval Workflows', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'inventory-check', label: 'Inventory Check', icon: <Clipboard className="w-4 h-4" /> },
    { id: 'stock-movement', label: 'Stock Movement', icon: <RefreshCw className="w-4 h-4" /> },
    { id: 'low-stock', label: 'Low Stock Items', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'receiving', label: 'Receiving', icon: <Truck className="w-4 h-4" /> },
    { id: 'item-search', label: 'Item Search', icon: <Search className="w-4 h-4" /> },
    { id: 'inventory-reports', label: 'Reports & Audits', icon: <BarChart className="w-4 h-4" /> },
    { id: 'inventory-settings', label: 'Inventory Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="py-2">
          <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border-b">
            Inventory Menu
          </h3>
          <nav className="mt-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onMenuItemClick(`inventory-${item.id}`)}
                className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                  activeItem === `inventory-${item.id}`
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </CardContent>
    </Card>
  );
};

export default InventoryModuleMenu;
