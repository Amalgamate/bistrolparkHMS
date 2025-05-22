import React from 'react';
import { Building, MapPin, Bed } from 'lucide-react';
import { ColoredIcon } from '../ui/colored-icon';

interface WardLocation {
  branch: string;
  floors: string[];
}

interface WardLocationsProps {
  className?: string;
}

const WardLocations: React.FC<WardLocationsProps> = ({ className }) => {
  const wardLocations: WardLocation[] = [
    {
      branch: 'Fedha',
      floors: ['1st floor']
    },
    {
      branch: 'Utawala',
      floors: ['1st floor', '2nd floor']
    },
    {
      branch: 'Tassia',
      floors: ['1st floor']
    },
    {
      branch: 'Machakos',
      floors: ['2nd floor']
    },
    {
      branch: 'Kitengela',
      floors: ['2nd floor', '3rd floor']
    }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <div className="flex items-center mb-3">
        <ColoredIcon icon={Building} color="blue" size="sm" variant="outline" className="mr-2" />
        <h3 className="text-lg font-semibold text-gray-800">Ward Locations</h3>
      </div>
      
      <div className="space-y-3">
        {wardLocations.map((location, index) => (
          <div key={index} className="flex items-start">
            <ColoredIcon icon={MapPin} color="amber" size="xs" variant="text" className="mr-2 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-700">{location.branch} Branch</h4>
              <div className="flex items-center mt-1 text-sm text-gray-600">
                <ColoredIcon icon={Bed} color="teal" size="xs" variant="text" className="mr-1" />
                <span>
                  Wards are in {location.floors.join(' and ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WardLocations;
