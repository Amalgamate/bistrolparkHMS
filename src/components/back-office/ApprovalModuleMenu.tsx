import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import {
  CheckSquare,
  ClipboardList,
  Clock,
  Settings,
  FileText,
  Users,
  BarChart,
  AlertTriangle,
  Truck,
  Package,
  ShoppingCart,
  Layers,
  Home,
  Calendar,
  UserPlus,
  UserCheck,
  LogOut,
  Scissors,
  DollarSign,
  CreditCard
} from 'lucide-react';

interface ApprovalModuleMenuProps {
  activeItem: string;
  onMenuItemClick: (itemId: string) => void;
}

const ApprovalModuleMenu: React.FC<ApprovalModuleMenuProps> = ({
  activeItem,
  onMenuItemClick
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Approval Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'pending', label: 'Pending Approvals', icon: <Clock className="w-4 h-4" /> },

    // Procurement & Inventory
    { id: 'procurement', label: 'Procurement Approvals', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'inventory', label: 'Inventory Approvals', icon: <Package className="w-4 h-4" /> },
    { id: 'requisitions', label: 'Requisition Approvals', icon: <ClipboardList className="w-4 h-4" /> },
    { id: 'transfers', label: 'Transfer Approvals', icon: <Truck className="w-4 h-4" /> },

    // HR & Staff
    { id: 'leave', label: 'Leave Requests', icon: <Calendar className="w-4 h-4" /> },
    { id: 'shifts', label: 'Shift Swaps', icon: <Clock className="w-4 h-4" /> },
    { id: 'recruitment', label: 'Recruitment Approvals', icon: <UserPlus className="w-4 h-4" /> },

    // Clinical
    { id: 'referrals', label: 'Patient Referrals', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'discharges', label: 'Discharge Authorizations', icon: <LogOut className="w-4 h-4" /> },
    { id: 'procedures', label: 'Procedure Approvals', icon: <Scissors className="w-4 h-4" /> },

    // Finance
    { id: 'budget', label: 'Budget Approvals', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'expenses', label: 'Expense Approvals', icon: <CreditCard className="w-4 h-4" /> },

    // System
    { id: 'workflows', label: 'Approval Workflows', icon: <Layers className="w-4 h-4" /> },
    { id: 'history', label: 'Approval History', icon: <FileText className="w-4 h-4" /> },
    { id: 'escalations', label: 'Escalations', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'delegations', label: 'Delegations', icon: <Users className="w-4 h-4" /> },
    { id: 'reports', label: 'Approval Reports', icon: <BarChart className="w-4 h-4" /> },
    { id: 'settings', label: 'Approval Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="py-2">
          <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border-b">
            Approvals Menu
          </h3>
          <nav className="mt-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onMenuItemClick(`approval-${item.id}`)}
                className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                  activeItem === `approval-${item.id}`
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

export default ApprovalModuleMenu;
