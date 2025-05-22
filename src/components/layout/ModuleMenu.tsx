import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import StickyModuleMenu from './StickyModuleMenu';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface ModuleMenuProps {
  title: string;
  items: MenuItem[];
  className?: string;
}

export const ModuleMenu: React.FC<ModuleMenuProps> = ({ title, items, className }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <StickyModuleMenu>
      <div className={cn("bg-white rounded-md shadow-sm overflow-hidden", className)}>
        <div className="p-3 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-[#2B4F60]">{title}</h3>
        </div>
        <div className="p-1">
          <nav className="space-y-1">
            {items.map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                  currentPath.endsWith(item.path)
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => navigate(item.path)}
              >
                <span className="mr-3 text-gray-500">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </StickyModuleMenu>
  );
};
