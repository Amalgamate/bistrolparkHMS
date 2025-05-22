import React from 'react';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';
import { ColorVariant } from './colored-icon-button';

interface ColoredIconProps {
  icon: LucideIcon;
  color: ColorVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'solid' | 'outline';
  className?: string;
  whiteBackground?: boolean;
}

const sizeVariants = {
  xs: {
    container: 'h-6 w-6',
    icon: 'h-3 w-3'
  },
  sm: {
    container: 'h-8 w-8',
    icon: 'h-4 w-4'
  },
  md: {
    container: 'h-10 w-10',
    icon: 'h-5 w-5'
  },
  lg: {
    container: 'h-12 w-12',
    icon: 'h-6 w-6'
  },
  xl: {
    container: 'h-16 w-16',
    icon: 'h-8 w-8'
  }
};

const colorVariants: Record<ColorVariant, { solid: string, outline: string, text: string }> = {
  blue: {
    solid: 'icon-blue',
    outline: 'icon-blue-outline',
    text: 'text-blue-600'
  },
  green: {
    solid: 'icon-green',
    outline: 'icon-green-outline',
    text: 'text-green-600'
  },
  purple: {
    solid: 'icon-purple',
    outline: 'icon-purple-outline',
    text: 'text-purple-600'
  },
  orange: {
    solid: 'icon-orange',
    outline: 'icon-orange-outline',
    text: 'text-orange-600'
  },
  red: {
    solid: 'icon-red',
    outline: 'icon-red-outline',
    text: 'text-red-600'
  },
  teal: {
    solid: 'icon-teal',
    outline: 'icon-teal-outline',
    text: 'text-teal-600'
  },
  indigo: {
    solid: 'icon-indigo',
    outline: 'icon-indigo-outline',
    text: 'text-indigo-600'
  },
  pink: {
    solid: 'icon-pink',
    outline: 'icon-pink-outline',
    text: 'text-pink-600'
  },
  amber: {
    solid: 'icon-amber',
    outline: 'icon-amber-outline',
    text: 'text-amber-600'
  },
  gray: {
    solid: 'icon-gray',
    outline: 'icon-gray-outline',
    text: 'text-gray-600'
  }
};

export const ColoredIcon: React.FC<ColoredIconProps> = ({
  icon: Icon,
  color,
  size = 'md',
  variant = 'solid',
  className,
  whiteBackground = false
}) => {
  const sizeClasses = sizeVariants[size];
  const colorClass = variant === 'solid' ? colorVariants[color].solid : colorVariants[color].outline;

  if (whiteBackground) {
    return (
      <div className={cn(
        "rounded-full flex items-center justify-center bg-white p-0.5",
        sizeClasses.container,
        className
      )}>
        <div className={cn(
          "rounded-full flex items-center justify-center w-full h-full",
          colorClass
        )}>
          <Icon className={sizeClasses.icon} />
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-full flex items-center justify-center",
      colorClass,
      sizeClasses.container,
      className
    )}>
      <Icon className={sizeClasses.icon} />
    </div>
  );
};

export default ColoredIcon;
