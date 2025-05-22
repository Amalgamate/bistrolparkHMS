import React from 'react';
import { Button } from '../../components/ui/button';
import {
  Droplets,
  UserPlus,
  FileText,
  AlertTriangle,
  Calendar,
  Search
} from 'lucide-react';

interface BloodBankQuickActionsProps {
  onMenuItemClick: (item: string) => void;
}

const BloodBankQuickActions: React.FC<BloodBankQuickActionsProps> = ({ onMenuItemClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('donors')}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Register Donor
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('inventory')}
        >
          <Droplets className="h-4 w-4 mr-2" />
          Add Blood Unit
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('requests')}
        >
          <FileText className="h-4 w-4 mr-2" />
          New Blood Request
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('inventory')}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Check Expiring Units
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('inventory')}
        >
          <Search className="h-4 w-4 mr-2" />
          Search Blood Units
        </Button>
      </div>
    </div>
  );
};

export default BloodBankQuickActions;
