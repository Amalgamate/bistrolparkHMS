import React from 'react';
import { Button } from '../../components/ui/button';
import {
  Calendar,
  Scissors,
  FileText,
  CheckSquare,
  BookOpen
} from 'lucide-react';

interface ProceduresQuickActionsProps {
  onMenuItemClick: (item: string) => void;
}

const ProceduresQuickActions: React.FC<ProceduresQuickActionsProps> = ({ onMenuItemClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('schedule')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Procedure
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('procedures')}
        >
          <Scissors className="h-4 w-4 mr-2" />
          View Procedures
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('templates')}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Procedure Templates
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('consents')}
        >
          <CheckSquare className="h-4 w-4 mr-2" />
          Consent Forms
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

export default ProceduresQuickActions;
