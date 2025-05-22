import React from 'react';
import { Button } from '../../components/ui/button';
import {
  FileImage,
  Calendar,
  FileText,
  Users,
  Database,
  Zap
} from 'lucide-react';

interface RadiologyQuickActionsProps {
  onMenuItemClick: (item: string) => void;
}

const RadiologyQuickActions: React.FC<RadiologyQuickActionsProps> = ({ onMenuItemClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('requests')}
        >
          <FileImage className="h-4 w-4 mr-2" />
          New Request
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('schedule')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Examination
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('reports')}
        >
          <FileText className="h-4 w-4 mr-2" />
          Create Report
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('patients')}
        >
          <Users className="h-4 w-4 mr-2" />
          Register External Patient
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('tests')}
        >
          <Database className="h-4 w-4 mr-2" />
          Manage Tests
        </Button>
      </div>
    </div>
  );
};

export default RadiologyQuickActions;
