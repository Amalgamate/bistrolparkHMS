import React from 'react';
import { Button } from '../../components/ui/button';
import {
  FlaskConical,
  FileText,
  UserPlus,
  DollarSign,
  ClipboardList
} from 'lucide-react';

interface LabQuickActionsProps {
  onMenuItemClick: (item: string) => void;
}

const LabQuickActions: React.FC<LabQuickActionsProps> = ({ onMenuItemClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('requests')}
        >
          <FlaskConical className="h-4 w-4 mr-2" />
          View Lab Requests
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('new')}
        >
          <ClipboardList className="h-4 w-4 mr-2" />
          New Lab Request
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('walkin')}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Register Walk-In Patient
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('prices')}
        >
          <DollarSign className="h-4 w-4 mr-2" />
          Manage Test Prices
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('reports')}
        >
          <FileText className="h-4 w-4 mr-2" />
          Generate Reports
        </Button>
      </div>
    </div>
  );
};

export default LabQuickActions;
