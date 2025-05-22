import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  FileText,
  Settings,
  Calendar,
  Clipboard,
  Pill,
  DollarSign,
  Activity,
  Thermometer,
  Beaker,
  Scan,
  Bed,
  Stethoscope,
  Ambulance,
  BarChart,
  Droplet,
  Heart,
  UserCog,
  LucideIcon
} from 'lucide-react';
import { APP_VERSION } from '../../utils/cacheUtils';
import { ColoredIcon } from '../ui/colored-icon';
import { ColorVariant } from '../ui/colored-icon-button';

// Module grid version - should match APP_VERSION
const MODULE_GRID_VERSION = APP_VERSION;

interface ModuleIcon {
  id: string;
  name: string;
  icon: LucideIcon;
  path: string;
  active: boolean;
  color: ColorVariant;
  usageCount: number;
}

// Mock function to get user role - in a real app, this would come from auth context
const getUserRole = () => {
  // For demo purposes, return 'admin'
  return 'admin';
};

export const SimpleModuleGrid: React.FC = () => {
  const navigate = useNavigate();
  const [userModules, setUserModules] = useState<ModuleIcon[]>([]);

  // Base modules configuration
  const allModules: ModuleIcon[] = [
    {
      id: 'patient-register',
      name: 'Patient Register',
      icon: User,
      path: '/patient-module',
      active: true,
      color: 'blue',
      usageCount: 0
    },
    {
      id: 'document-center',
      name: 'Document Center',
      icon: FileText,
      path: '/document-center',
      active: true,
      color: 'green',
      usageCount: 0
    },
    {
      id: 'settings',
      name: 'Branch Settings',
      icon: Settings,
      path: '/settings',
      active: true,
      color: 'purple',
      usageCount: 0
    },
    {
      id: 'user-management',
      name: 'User Management',
      icon: UserCog,
      path: '/users',
      active: true,
      color: 'orange',
      usageCount: 0
    },
    {
      id: 'appointments',
      name: 'Appointments',
      icon: Calendar,
      path: '/appointments',
      active: true,
      color: 'indigo',
      usageCount: 0
    },
    {
      id: 'clinical-notes',
      name: 'Clinical Notes',
      icon: Clipboard,
      path: '/clinical-notes',
      active: true,
      color: 'teal',
      usageCount: 0
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy',
      icon: Pill,
      path: '/pharmacy',
      active: true,
      color: 'pink',
      usageCount: 0
    },
    {
      id: 'billing',
      name: 'Billing',
      icon: DollarSign,
      path: '/billing',
      active: true,
      color: 'amber',
      usageCount: 0
    },
    {
      id: 'vitals',
      name: 'Vitals',
      icon: Activity,
      path: '/vitals',
      active: true,
      color: 'red',
      usageCount: 0
    },
    {
      id: 'lab-tests',
      name: 'Lab Tests',
      icon: Thermometer,
      path: '/lab-tests',
      active: true,
      color: 'teal',
      usageCount: 0
    },
    {
      id: 'lab-results',
      name: 'Lab Results',
      icon: Beaker,
      path: '/lab-results',
      active: true,
      color: 'green',
      usageCount: 0
    },
    {
      id: 'radiology',
      name: 'Radiology',
      icon: Scan,
      path: '/radiology',
      active: true,
      color: 'indigo',
      usageCount: 0
    },
    {
      id: 'inpatient',
      name: 'Inpatient',
      icon: Bed,
      path: '/inpatient',
      active: true,
      color: 'amber',
      usageCount: 0
    },
    {
      id: 'doctors',
      name: 'Doctors',
      icon: Stethoscope,
      path: '/doctors',
      active: true,
      color: 'purple',
      usageCount: 0
    },
    {
      id: 'ambulance',
      name: 'Ambulance',
      icon: Ambulance,
      path: '/ambulance',
      active: true,
      color: 'red',
      usageCount: 0
    },
    {
      id: 'reports',
      name: 'Reports',
      icon: BarChart,
      path: '/reports',
      active: true,
      color: 'blue',
      usageCount: 0
    },
    {
      id: 'blood-bank',
      name: 'Blood Bank',
      icon: Droplet,
      path: '/blood-bank',
      active: true,
      color: 'red',
      usageCount: 0
    },
    {
      id: 'emergency',
      name: 'Emergency',
      icon: Heart,
      path: '/emergency',
      active: true,
      color: 'red',
      usageCount: 0
    }
  ];

  // Load user's module usage from localStorage on component mount
  useEffect(() => {
    const loadUserModules = () => {
      const userRole = getUserRole();
      const storedVersion = localStorage.getItem('module_grid_version');

      // Check if we need to reset module usage data due to version change
      if (storedVersion !== MODULE_GRID_VERSION) {
        // Update version in localStorage
        localStorage.setItem('module_grid_version', MODULE_GRID_VERSION);

        // Clear module usage data
        localStorage.removeItem(`${userRole}_module_usage`);

        // Set default modules
        setUserModules(allModules);
        return;
      }

      const storedUsage = localStorage.getItem(`${userRole}_module_usage`);

      if (storedUsage) {
        try {
          const usageData = JSON.parse(storedUsage);

          // Update the usage counts in our modules
          const updatedModules = allModules.map(module => {
            const storedModule = usageData.find((m: {id: string, count: number}) => m.id === module.id);
            return {
              ...module,
              usageCount: storedModule ? storedModule.count : 0
            };
          });

          setUserModules(updatedModules);
        } catch (error) {
          console.error('Error loading module usage data:', error);
          setUserModules(allModules);
        }
      } else {
        setUserModules(allModules);
      }
    };

    loadUserModules();
  }, []);

  const handleModuleClick = (module: ModuleIcon) => {
    if (module.active) {
      // Increment usage count
      const updatedModules = userModules.map(m => {
        if (m.id === module.id) {
          return { ...m, usageCount: m.usageCount + 1 };
        }
        return m;
      });

      setUserModules(updatedModules);

      // Save to localStorage
      const userRole = getUserRole();
      const usageData = updatedModules.map(m => ({ id: m.id, count: m.usageCount }));
      localStorage.setItem(`${userRole}_module_usage`, JSON.stringify(usageData));

      // Navigate to the module
      navigate(module.path);
    }
  };

  // Sort modules by active status first, then by usage count
  const sortedModules = [...userModules].sort((a, b) => {
    // Active modules first
    if (a.active && !b.active) return -1;
    if (!a.active && b.active) return 1;

    // Then by usage count (descending)
    return b.usageCount - a.usageCount;
  });

  // Take only the first 12 modules to display
  const displayModules = sortedModules.slice(0, 12);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Quick Access Modules</h2>
        <div className="text-sm text-gray-500">Click on any module to navigate</div>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {displayModules.slice(0, 12).map((module) => (
          <div
            key={module.id}
            className={`flex flex-col items-center justify-center p-2 transition-all duration-200 ${
              module.active
                ? 'cursor-pointer hover:shadow-md hover:scale-105'
                : 'opacity-60 cursor-not-allowed'
            }`}
            onClick={() => handleModuleClick(module)}
          >
            {module.active ? (
              <ColoredIcon
                icon={module.icon}
                color={module.color}
                size="md"
                variant="solid"
                className="mb-2 shadow-sm"
              />
            ) : (
              <div className="p-3 rounded-full mb-2 shadow-sm bg-gray-200">
                <module.icon className="h-5 w-5 text-gray-500" />
              </div>
            )}
            <span className={`text-sm text-center font-medium ${
              module.active ? 'text-gray-800' : 'text-gray-500'
            }`}>
              {module.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
