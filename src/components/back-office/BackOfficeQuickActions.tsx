import React from 'react';
import { Button } from '../../components/ui/button';
import {
  UserPlus,
  FileText,
  DollarSign,
  Package,
  Truck,
  Building,
  CheckSquare
} from 'lucide-react';

interface BackOfficeQuickActionsProps {
  onMenuItemClick: (item: string) => void;
}

const BackOfficeQuickActions: React.FC<BackOfficeQuickActionsProps> = ({ onMenuItemClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-3">
      <h2 className="text-sm font-semibold mb-2 text-gray-700">Quick Actions</h2>
      <div className="space-y-1">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs h-8"
          onClick={() => onMenuItemClick('hr-add-employee')}
        >
          <UserPlus className="h-3 w-3 mr-1.5" />
          Add Employee
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs h-8"
          onClick={() => onMenuItemClick('finance-new-transaction')}
        >
          <DollarSign className="h-3 w-3 mr-1.5" />
          New Transaction
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs h-8"
          onClick={() => onMenuItemClick('inventory-check')}
        >
          <Package className="h-3 w-3 mr-1.5" />
          Inventory Check
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs h-8"
          onClick={() => onMenuItemClick('procurement-new-order')}
        >
          <Truck className="h-3 w-3 mr-1.5" />
          New Purchase Order
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs h-8"
          onClick={() => onMenuItemClick('administration-facility')}
        >
          <Building className="h-3 w-3 mr-1.5" />
          Facility Management
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs h-8"
          onClick={() => onMenuItemClick('approvals')}
        >
          <CheckSquare className="h-3 w-3 mr-1.5" />
          Review Approvals
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs h-8"
          onClick={() => onMenuItemClick('reports-generate')}
        >
          <FileText className="h-3 w-3 mr-1.5" />
          Generate Report
        </Button>
      </div>
    </div>
  );
};

export default BackOfficeQuickActions;
