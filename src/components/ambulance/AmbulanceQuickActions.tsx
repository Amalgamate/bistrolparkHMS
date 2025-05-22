import React from 'react';
import { Button } from '../../components/ui/button';
import {
  PhoneCall,
  Truck,
  Users,
  Wrench,
  Calendar,
  MapPin
} from 'lucide-react';

interface AmbulanceQuickActionsProps {
  onMenuItemClick: (item: string) => void;
}

const AmbulanceQuickActions: React.FC<AmbulanceQuickActionsProps> = ({ onMenuItemClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('calls')}
        >
          <PhoneCall className="h-4 w-4 mr-2" />
          New Emergency Call
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('fleet')}
        >
          <Truck className="h-4 w-4 mr-2" />
          Dispatch Ambulance
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('crew')}
        >
          <Users className="h-4 w-4 mr-2" />
          Assign Crew
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('maintenance')}
        >
          <Wrench className="h-4 w-4 mr-2" />
          Schedule Maintenance
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => onMenuItemClick('scheduling')}
        >
          <Calendar className="h-4 w-4 mr-2" />
          View Schedule
        </Button>
      </div>
    </div>
  );
};

export default AmbulanceQuickActions;
