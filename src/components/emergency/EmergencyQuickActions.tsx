import React from 'react';
import { Button } from '../../components/ui/button';
import {
  AlertTriangle,
  Users,
  Heart,
  Bed,
  Clock
} from 'lucide-react';

interface EmergencyQuickActionsProps {
  onMenuItemClick: (item: string) => void;
}

const EmergencyQuickActions: React.FC<EmergencyQuickActionsProps> = ({ onMenuItemClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('triage')}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Triage Patient
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('patients')}
        >
          <Users className="h-4 w-4 mr-2" />
          View Patients
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('trauma')}
        >
          <Heart className="h-4 w-4 mr-2" />
          Trauma Center
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('resources')}
        >
          <Bed className="h-4 w-4 mr-2" />
          Check Resources
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('wait-times')}
        >
          <Clock className="h-4 w-4 mr-2" />
          View Wait Times
        </Button>
      </div>
    </div>
  );
};

export default EmergencyQuickActions;
