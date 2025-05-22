import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import {
  ShoppingCart,
  FileText,
  Users,
  DollarSign,
  Package,
  CheckSquare,
  BarChart,
  Settings,
  Home,
  Truck,
  ClipboardList,
  Calendar,
  AlertTriangle,
  Clock,
  Search
} from 'lucide-react';

interface ProcurementModuleMenuProps {
  activeItem: string;
  onMenuItemClick: (itemId: string) => void;
}

const ProcurementModuleMenu: React.FC<ProcurementModuleMenuProps> = ({
  activeItem,
  onMenuItemClick
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Procurement Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'purchase-orders', label: 'Purchase Orders', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'requisitions', label: 'Requisitions', icon: <FileText className="w-4 h-4" /> },
    { id: 'vendors', label: 'Vendors', icon: <Users className="w-4 h-4" /> },
    { id: 'quotes', label: 'Quotes & Tenders', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'contracts', label: 'Contracts', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'receiving', label: 'Receiving', icon: <Package className="w-4 h-4" /> },
    { id: 'delivery-schedule', label: 'Delivery Schedule', icon: <Calendar className="w-4 h-4" /> },
    { id: 'approvals', label: 'Approvals', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'order-tracking', label: 'Order Tracking', icon: <Truck className="w-4 h-4" /> },
    { id: 'pending-items', label: 'Pending Items', icon: <Clock className="w-4 h-4" /> },
    { id: 'item-search', label: 'Item Search', icon: <Search className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="py-2">
          <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border-b">
            Procurement Menu
          </h3>
          <nav className="mt-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onMenuItemClick(`procurement-${item.id}`)}
                className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                  activeItem === `procurement-${item.id}`
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

export default ProcurementModuleMenu;
