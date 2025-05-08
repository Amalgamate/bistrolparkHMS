import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Permission } from '../../context/UserRolesContext';

interface PermissionNavItemProps {
  permission: Permission;
  children: React.ReactNode;
}

/**
 * A component that conditionally renders a navigation item based on user permissions.
 * If the user doesn't have the required permission, the item won't be rendered.
 */
const PermissionNavItem: React.FC<PermissionNavItemProps> = ({ permission, children }) => {
  const { hasPermission } = useAuth();
  
  if (!hasPermission(permission)) {
    return null;
  }
  
  return <>{children}</>;
};

export default PermissionNavItem;
