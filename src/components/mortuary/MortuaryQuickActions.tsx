import React from 'react';
import { Button } from '../../components/ui/button';
import {
  Users,
  Thermometer,
  Truck,
  FileText,
  Calendar
} from 'lucide-react';

interface MortuaryQuickActionsProps {
  onMenuItemClick: (item: string) => void;
}

const MortuaryQuickActions: React.FC<MortuaryQuickActionsProps> = ({ onMenuItemClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('deceased')}
        >
          <Users className="h-4 w-4 mr-2" />
          Register Deceased
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('storage')}
        >
          <Thermometer className="h-4 w-4 mr-2" />
          Assign Storage
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('release')}
        >
          <Truck className="h-4 w-4 mr-2" />
          Process Release
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('certificates')}
        >
          <FileText className="h-4 w-4 mr-2" />
          Issue Certificate
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('appointments')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Viewing
        </Button>
      </div>
    </div>
  );
};

export default MortuaryQuickActions;
