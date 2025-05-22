import React from 'react';
import { Card, CardContent } from './card';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';
import { ColorVariant } from './colored-icon-button';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: ColorVariant;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  onClick,
  className
}) => {
  const colorVariants: Record<ColorVariant, { bg: string, text: string }> = {
    blue: { bg: 'icon-blue-outline', text: 'text-blue-600' },
    green: { bg: 'icon-green-outline', text: 'text-green-600' },
    purple: { bg: 'icon-purple-outline', text: 'text-purple-600' },
    orange: { bg: 'icon-orange-outline', text: 'text-orange-600' },
    red: { bg: 'icon-red-outline', text: 'text-red-600' },
    teal: { bg: 'icon-teal-outline', text: 'text-teal-600' },
    indigo: { bg: 'icon-indigo-outline', text: 'text-indigo-600' },
    pink: { bg: 'icon-pink-outline', text: 'text-pink-600' },
    amber: { bg: 'icon-amber-outline', text: 'text-amber-600' },
    gray: { bg: 'icon-gray-outline', text: 'text-gray-600' },
  };

  const colorClasses = colorVariants[color];

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-shadow",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>

            {trend && (
              <p className={cn(
                "text-xs mt-1 flex items-center",
                trend.isPositive ? "text-green-600" : "text-red-600"
              )}>
                <span className="mr-1">
                  {trend.isPositive ? '↑' : '↓'}
                </span>
                {trend.value}%
              </p>
            )}
          </div>

          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center",
            colorClasses.bg
          )}>
            <Icon className={cn("h-6 w-6", colorClasses.text)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const StatsCardGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}> = ({
  children,
  className,
  columns = 3
}) => {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4'
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

export default StatsCard;
