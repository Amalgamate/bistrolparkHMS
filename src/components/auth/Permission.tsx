import React, { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Permission as PermissionType } from '../../context/UserRolesContext';

interface PermissionProps {
  permission: PermissionType;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * A component that conditionally renders its children based on whether
 * the current user has the specified permission.
 */
export const Permission: React.FC<PermissionProps> = ({ 
  permission, 
  children, 
  fallback = null 
}) => {
  const { hasPermission } = useAuth();
  
  if (hasPermission(permission)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};

export default Permission;
