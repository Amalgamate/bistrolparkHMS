import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface StickyModuleMenuProps {
  children: ReactNode;
  className?: string;
}

/**
 * A wrapper component that makes module menus sticky when scrolling
 */
export const StickyModuleMenu: React.FC<StickyModuleMenuProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn(
      "sticky top-2 z-20",
      className
    )}>
      {children}
    </div>
  );
};

export default StickyModuleMenu;
