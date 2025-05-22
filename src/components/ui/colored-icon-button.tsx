import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

export type ColorVariant =
  | 'blue'    // Primary actions
  | 'green'   // Create/New actions
  | 'purple'  // Confirm/Verify actions
  | 'orange'  // Reverse/Cancel actions
  | 'red'     // Delete/Remove actions
  | 'teal'    // View/Display actions
  | 'indigo'  // Report/Analytics actions
  | 'pink'    // Patient-related actions
  | 'amber'   // Finance-related actions
  | 'gray';   // Neutral/Misc actions

interface ColoredIconButtonProps {
  icon: LucideIcon;
  color: ColorVariant;
  label?: string;
  description?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const colorVariants: Record<ColorVariant, string> = {
  blue: 'icon-blue hover:bg-blue-600',
  green: 'icon-green hover:bg-green-600',
  purple: 'icon-purple hover:bg-purple-600',
  orange: 'icon-orange hover:bg-orange-600',
  red: 'icon-red hover:bg-red-600',
  teal: 'icon-teal hover:bg-teal-600',
  indigo: 'icon-indigo hover:bg-indigo-600',
  pink: 'icon-pink hover:bg-pink-600',
  amber: 'icon-amber hover:bg-amber-600',
  gray: 'icon-gray hover:bg-gray-600',
};

const sizeVariants = {
  sm: {
    button: 'h-10 w-10',
    icon: 'h-5 w-5',
    container: 'max-w-[120px]'
  },
  md: {
    button: 'h-14 w-14',
    icon: 'h-6 w-6',
    container: 'max-w-[160px]'
  },
  lg: {
    button: 'h-20 w-20',
    icon: 'h-8 w-8',
    container: 'max-w-[200px]'
  }
};

export const ColoredIconButton: React.FC<ColoredIconButtonProps> = ({
  icon: Icon,
  color,
  label,
  description,
  onClick,
  disabled = false,
  className,
  size = 'md'
}) => {
  const sizeClasses = sizeVariants[size];

  return (
    <div className={cn(
      "flex flex-col items-center text-center gap-2",
      sizeClasses.container,
      className
    )}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "rounded-full flex items-center justify-center text-white transition-colors",
          colorVariants[color],
          sizeClasses.button,
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        <Icon className={sizeClasses.icon} />
      </button>

      {label && (
        <div className="mt-2">
          <h3 className="font-medium text-gray-900">{label}</h3>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ColoredIconButton;
