import React from 'react';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';
import { ColoredIconButton, ColorVariant } from './colored-icon-button';

interface ActionCardProps {
  icon: LucideIcon;
  color: ColorVariant;
  title: string;
  description?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  icon,
  color,
  title,
  description,
  onClick,
  disabled = false,
  className,
}) => {
  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow cursor-pointer",
        disabled && "opacity-60 cursor-not-allowed",
        className
      )}
      onClick={disabled ? undefined : onClick}
    >
      <ColoredIconButton 
        icon={icon} 
        color={color} 
        size="md" 
      />
      
      <h3 className="mt-4 font-medium text-gray-900">{title}</h3>
      
      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
};

export const ActionCardGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}> = ({ 
  children, 
  className,
  columns = 4
}) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  };

  return (
    <div className={cn(
      `grid ${gridCols[columns]} gap-4`,
      className
    )}>
      {children}
    </div>
  );
};

export default ActionCard;
