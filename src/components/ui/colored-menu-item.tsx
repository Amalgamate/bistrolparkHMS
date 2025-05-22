import React from 'react';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';
import { ColoredIcon } from './colored-icon';
import { ColorVariant } from './colored-icon-button';

interface ColoredMenuItemProps {
  icon: LucideIcon;
  color: ColorVariant;
  label: string;
  description?: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  badge?: {
    text: string;
    color: ColorVariant;
  };
}

export const ColoredMenuItem: React.FC<ColoredMenuItemProps> = ({
  icon,
  color,
  label,
  description,
  active = false,
  onClick,
  className,
  badge
}) => {
  return (
    <button
      className={cn(
        "w-full flex items-center px-3 py-2 rounded-md transition-colors",
        active 
          ? `bg-${color}-50 text-${color}-700` 
          : "text-gray-700 hover:bg-gray-50",
        className
      )}
      onClick={onClick}
    >
      <ColoredIcon 
        icon={icon} 
        color={color} 
        size="sm" 
        variant={active ? "solid" : "outline"}
        className="mr-3 flex-shrink-0"
      />
      
      <div className="flex-grow text-left">
        <div className="flex items-center justify-between">
          <span className="font-medium">{label}</span>
          
          {badge && (
            <span className={cn(
              "ml-2 px-2 py-0.5 text-xs rounded-full",
              `bg-${badge.color}-100 text-${badge.color}-800`
            )}>
              {badge.text}
            </span>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        )}
      </div>
    </button>
  );
};

export default ColoredMenuItem;
