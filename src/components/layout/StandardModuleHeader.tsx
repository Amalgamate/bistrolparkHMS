import React, { ReactNode } from 'react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Filter } from 'lucide-react';

interface StandardModuleHeaderProps {
  title: string;
  description: string;
  badges?: Array<{
    text: string;
    color: string;
  }>;
  actions?: ReactNode;
  searchComponent?: ReactNode;
  className?: string;
}

export const StandardModuleHeader: React.FC<StandardModuleHeaderProps> = ({
  title,
  description,
  badges = [],
  actions,
  searchComponent,
  className
}) => {
  return (
    <div className={cn("bg-white rounded-md shadow-sm", className)}>
      {/* Header Section */}
      <div className="p-4 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-[#2B4F60]">{title}</h2>
          <p className="text-sm text-muted">{description}</p>
          {badges.length > 0 && (
            <div className="mt-1 text-xs text-gray-500 flex items-center">
              {badges.map((badge, index) => (
                <span 
                  key={index} 
                  className={`bg-${badge.color}-100 text-${badge.color}-800 px-2 py-0.5 rounded ${index > 0 ? 'ml-2' : ''}`}
                >
                  {badge.text}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {actions}
        </div>
      </div>

      {/* Search Section (if provided) */}
      {searchComponent && (
        <div className="px-4 pb-4">
          {searchComponent}
        </div>
      )}
    </div>
  );
};

export default StandardModuleHeader;
