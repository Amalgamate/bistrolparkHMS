import React, { useState, useRef, useEffect } from 'react';
import { Plus, LucideIcon } from 'lucide-react';
import { useModuleQuickActions } from '../../context/ModuleQuickActionsContext';
import { useNavigate } from 'react-router-dom';
import { ColoredIcon } from '../ui/colored-icon';
import { ColorVariant } from '../ui/colored-icon-button';

const ModuleQuickActionsButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentModule, quickActions, moduleName } = useModuleQuickActions();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle action click
  const handleActionClick = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  // Determine icon color based on action type
  const getIconColor = (actionId: string): ColorVariant => {
    // Map action types to colors
    if (actionId.includes('new') || actionId.includes('add') || actionId.includes('create') || actionId.includes('register')) {
      return 'green';
    } else if (actionId.includes('view') || actionId.includes('search') || actionId.includes('find')) {
      return 'blue';
    } else if (actionId.includes('edit') || actionId.includes('update') || actionId.includes('manage')) {
      return 'purple';
    } else if (actionId.includes('delete') || actionId.includes('remove')) {
      return 'red';
    } else if (actionId.includes('report') || actionId.includes('analytics')) {
      return 'indigo';
    } else if (actionId.includes('schedule') || actionId.includes('appointment')) {
      return 'pink';
    } else if (actionId.includes('billing') || actionId.includes('payment') || actionId.includes('transaction')) {
      return 'amber';
    } else if (actionId.includes('status') || actionId.includes('check')) {
      return 'teal';
    } else {
      // Default color based on module
      switch (currentModule) {
        case 'clinical':
          return 'purple';
        case 'pharmacy':
          return 'orange';
        case 'laboratory':
          return 'teal';
        case 'radiology':
          return 'indigo';
        case 'patients':
          return 'green';
        case 'appointments':
          return 'pink';
        case 'admissions':
          return 'amber';
        default:
          return 'blue';
      }
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="p-1.5 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F5B800]"
        onClick={() => setIsOpen(!isOpen)}
        title="Quick Actions"
      >
        <ColoredIcon icon={Plus} color="amber" size="sm" variant="solid" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-[1000] border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800">{moduleName} Quick Actions</h3>
            <p className="text-xs text-gray-500 mt-1">Frequently used actions for this module</p>
          </div>

          <div className="py-2">
            {quickActions.length > 0 ? (
              quickActions.map((action) => (
                <button
                  key={action.id}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  onClick={() => handleActionClick(action.path)}
                >
                  <div className="mr-3">
                    <ColoredIcon
                      icon={action.icon as LucideIcon}
                      color={getIconColor(action.id)}
                      size="sm"
                      variant="outline"
                    />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{action.label}</span>
                    {action.description && (
                      <span className="text-xs text-gray-500">{action.description}</span>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">
                No quick actions available for this module
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleQuickActionsButton;
