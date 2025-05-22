import React from 'react';
import { cn } from '../../lib/utils';
import { ColoredMenuItem } from './colored-menu-item';
import { LucideIcon } from 'lucide-react';
import { ColorVariant } from './colored-icon-button';

interface MenuItem {
  id: string;
  icon: LucideIcon;
  color: ColorVariant;
  label: string;
  description?: string;
  badge?: {
    text: string;
    color: ColorVariant;
  };
}

interface ModuleMenuProps {
  title: string;
  items: MenuItem[];
  activeItemId?: string;
  onItemClick: (itemId: string) => void;
  className?: string;
}

export const ModuleMenu: React.FC<ModuleMenuProps> = ({
  title,
  items,
  activeItemId,
  onItemClick,
  className
}) => {
  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm p-4",
      className
    )}>
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-1">
        {items.map((item) => (
          <ColoredMenuItem
            key={item.id}
            icon={item.icon}
            color={item.color}
            label={item.label}
            description={item.description}
            active={activeItemId === item.id}
            onClick={() => onItemClick(item.id)}
            badge={item.badge}
          />
        ))}
      </div>
    </div>
  );
};

export default ModuleMenu;
