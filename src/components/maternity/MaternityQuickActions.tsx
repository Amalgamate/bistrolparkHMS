import React from 'react';
import { Button } from '../../components/ui/button';
import {
  Calendar,
  Baby,
  Heart,
  Bed,
  UserPlus,
  Stethoscope
} from 'lucide-react';

interface MaternityQuickActionsProps {
  onMenuItemClick: (item: string) => void;
}

const MaternityQuickActions: React.FC<MaternityQuickActionsProps> = ({ onMenuItemClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('prenatal')}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Register New Patient
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('prenatal')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Record Prenatal Visit
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('labor')}
        >
          <Bed className="h-4 w-4 mr-2" />
          Admit for Labor
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('labor')}
        >
          <Baby className="h-4 w-4 mr-2" />
          Record Delivery
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('postpartum')}
        >
          <Heart className="h-4 w-4 mr-2" />
          Postpartum Checkup
        </Button>
      </div>
    </div>
  );
};

export default MaternityQuickActions;
