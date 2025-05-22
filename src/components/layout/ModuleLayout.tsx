import React, { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { RefreshCw, Settings } from 'lucide-react';
import { ModuleMenu } from './ModuleMenu';
import { useToast } from '../../context/ToastContext';

interface ModuleLayoutProps {
  title: string;
  description: string;
  menuTitle: string;
  menuItems: Array<{
    icon: React.ReactNode;
    label: string;
    path: string;
  }>;
  children: ReactNode;
  settingsPath: string;
  badges?: Array<{
    text: string;
    color: string;
  }>;
}

export const ModuleLayout: React.FC<ModuleLayoutProps> = ({
  title,
  description,
  menuTitle,
  menuItems,
  children,
  settingsPath,
  badges = [
    { text: 'SHA Integrated', color: 'bg-blue-100 text-blue-800' },
    { text: 'KES Currency', color: 'bg-green-100 text-green-800' }
  ]
}) => {
  const navigate = useNavigate();
  const { showToast } = useToast();

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Page Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-md shadow-sm mb-4">
        <div>
          <h2 className="text-xl font-semibold text-[#2B4F60]">{title}</h2>
          <p className="text-sm text-muted">{description}</p>
          <div className="mt-1 text-xs text-gray-500 flex items-center">
            {badges.map((badge, index) => (
              <span 
                key={index} 
                className={`${badge.color} px-2 py-0.5 rounded ${index > 0 ? 'ml-2' : ''}`}
              >
                {badge.text}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              showToast({
                title: "Refreshing data...",
                description: `The ${title.toLowerCase()} data is being refreshed`,
                variant: "default"
              });
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(settingsPath)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Module Menu - will show in the white space when sidebar is collapsed */}
            <div className="md:w-64 flex-shrink-0">
              <ModuleMenu 
                title={menuTitle} 
                items={menuItems} 
                className="sticky top-4"
              />
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
