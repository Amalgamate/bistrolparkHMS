import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Permission } from '../../context/UserRolesContext';

interface PermissionNavSectionProps {
  requiredPermission: Permission;
  children: React.ReactNode;
}

/**
 * A component that conditionally renders a navigation section based on user permissions.
 * If the user doesn't have the required permission, the section won't be rendered.
 */
const PermissionNavSection: React.FC<PermissionNavSectionProps> = ({ 
  requiredPermission, 
  children 
}) => {
  const { hasPermission } = useAuth();
  
  if (!hasPermission(requiredPermission)) {
    return null;
  }
  
  return <>{children}</>;
};

export default PermissionNavSection;
