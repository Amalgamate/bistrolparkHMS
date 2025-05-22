import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface CompactModuleHeaderProps {
  title: string;
  actions?: ReactNode;
  className?: string;
}

/**
 * A compact header component for module pages
 * Designed to minimize vertical space while maintaining functionality
 */
export const CompactModuleHeader: React.FC<CompactModuleHeaderProps> = ({ 
  title, 
  actions,
  className 
}) => {
  return (
    <div className={cn(
      "flex justify-between items-center py-2 px-1 border-b border-gray-100 mb-3",
      className
    )}>
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};

export default CompactModuleHeader;
