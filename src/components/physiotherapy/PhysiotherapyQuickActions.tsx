import React from 'react';
import { Button } from '../../components/ui/button';
import {
  UserPlus,
  Calendar,
  Clipboard,
  Dumbbell,
  Activity
} from 'lucide-react';

interface PhysiotherapyQuickActionsProps {
  onMenuItemClick: (item: string) => void;
}

const PhysiotherapyQuickActions: React.FC<PhysiotherapyQuickActionsProps> = ({ onMenuItemClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('patients')}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Register New Patient
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('assessments')}
        >
          <Clipboard className="h-4 w-4 mr-2" />
          New Assessment
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('sessions')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Session
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('exercises')}
        >
          <Dumbbell className="h-4 w-4 mr-2" />
          Exercise Library
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('reports')}
        >
          <Activity className="h-4 w-4 mr-2" />
          Patient Progress
        </Button>
      </div>
    </div>
  );
};

export default PhysiotherapyQuickActions;
