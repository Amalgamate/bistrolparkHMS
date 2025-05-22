import React from 'react';
import {
  AlertTriangle,
  Droplets,
  Truck,
  Bed
} from 'lucide-react';

interface EmergencyServicesMenuProps {
  onMenuItemClick: (item: string) => void;
  activeItem: string;
}

const EmergencyServicesMenu: React.FC<EmergencyServicesMenuProps> = ({ onMenuItemClick, activeItem }) => {
  const menuItems = [
    {
      id: 'emergency',
      label: 'Emergency',
      icon: <AlertTriangle className="h-4 w-4 mr-3" />
    },
    {
      id: 'blood-bank',
      label: 'Blood Bank',
      icon: <Droplets className="h-4 w-4 mr-3" />
    },
    {
      id: 'ambulance',
      label: 'Ambulance',
      icon: <Truck className="h-4 w-4 mr-3" />
    },
    {
      id: 'mortuary',
      label: 'Mortuary',
      icon: <Bed className="h-4 w-4 mr-3" />
    }
  ];

  return (
    <div className="bg-blue-900 rounded-lg p-4">
      <div className="flex items-center mb-4 text-yellow-400 font-semibold">
        <AlertTriangle className="h-5 w-5 mr-2" />
        <h2 className="text-lg">Emergency Services</h2>
      </div>
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`w-full flex items-center justify-start px-3 py-2 text-sm rounded-md ${
              activeItem === item.id
                ? 'bg-yellow-400 text-blue-900 font-medium'
                : 'text-white hover:bg-blue-800'
            }`}
            onClick={() => onMenuItemClick(item.id)}
          >
            <div className="flex items-center">
              {item.icon}
              <span>{item.label}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmergencyServicesMenu;
