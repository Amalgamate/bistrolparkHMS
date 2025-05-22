import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import {
  Home,
  Building,
  Trash2,
  Shirt,
  Wrench,
  Hammer,
  Thermometer,
  Bed,
  Warehouse,
  Truck,
  FileText,
  Settings,
  BarChart,
  Calendar,
  AlertTriangle
} from 'lucide-react';

interface FacilitiesManagementModuleMenuProps {
  activeItem: string;
  onMenuItemClick: (itemId: string) => void;
}

const FacilitiesManagementModuleMenu: React.FC<FacilitiesManagementModuleMenuProps> = ({
  activeItem,
  onMenuItemClick
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Facilities Dashboard', icon: <Home className="w-4 h-4" /> },
    { id: 'buildings', label: 'Buildings & Floors', icon: <Building className="w-4 h-4" /> },
    { id: 'waste-management', label: 'Waste Management', icon: <Trash2 className="w-4 h-4" /> },
    { id: 'laundry', label: 'Laundry Services', icon: <Shirt className="w-4 h-4" /> },
    { id: 'maintenance', label: 'Maintenance Requests', icon: <Wrench className="w-4 h-4" /> },
    { id: 'equipment', label: 'Equipment Management', icon: <Hammer className="w-4 h-4" /> },
    { id: 'hvac', label: 'HVAC Systems', icon: <Thermometer className="w-4 h-4" /> },
    { id: 'beds', label: 'Bed Management', icon: <Bed className="w-4 h-4" /> },
    { id: 'storage', label: 'Storage Areas', icon: <Warehouse className="w-4 h-4" /> },
    { id: 'transport', label: 'Transport Services', icon: <Truck className="w-4 h-4" /> },
    { id: 'contracts', label: 'Service Contracts', icon: <FileText className="w-4 h-4" /> },
    { id: 'schedules', label: 'Maintenance Schedules', icon: <Calendar className="w-4 h-4" /> },
    { id: 'incidents', label: 'Incident Reports', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'reports', label: 'Facilities Reports', icon: <BarChart className="w-4 h-4" /> },
    { id: 'settings', label: 'Facilities Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-0">
        <div className="py-2">
          <h3 className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 border-b">
            Facilities Management Menu
          </h3>
          <nav className="mt-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onMenuItemClick(`facilities-${item.id}`)}
                className={`w-full flex items-center px-4 py-2 text-sm transition-colors ${
                  activeItem === `facilities-${item.id}`
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </CardContent>
    </Card>
  );
};

export default FacilitiesManagementModuleMenu;
