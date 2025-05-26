/**
 * Role-based access control utilities for Bristol Park HMS
 * Provides enhanced role checking for different admin levels
 */

import { User } from '../context/AuthContext';

// Define admin role levels
export enum AdminLevel {
  SUPER_ADMIN = 'super-admin',
  BRISTOL_ADMIN = 'bristol-admin',
  ADMIN = 'admin'
}

// Define admin role hierarchy (higher number = more privileges)
const ADMIN_HIERARCHY = {
  [AdminLevel.SUPER_ADMIN]: 3,
  [AdminLevel.BRISTOL_ADMIN]: 2,
  [AdminLevel.ADMIN]: 1
};

/**
 * Check if user has a specific admin level or higher
 */
export const hasAdminLevel = (user: User | null, requiredLevel: AdminLevel): boolean => {
  if (!user) return false;
  
  const userLevel = ADMIN_HIERARCHY[user.role as AdminLevel];
  const requiredLevelValue = ADMIN_HIERARCHY[requiredLevel];
  
  return userLevel >= requiredLevelValue;
};

/**
 * Check if user is Super Admin (highest level)
 */
export const isSuperAdmin = (user: User | null): boolean => {
  return user?.role === AdminLevel.SUPER_ADMIN;
};

/**
 * Check if user is Bristol Admin or higher
 */
export const isBristolAdminOrHigher = (user: User | null): boolean => {
  return hasAdminLevel(user, AdminLevel.BRISTOL_ADMIN);
};

/**
 * Check if user has any admin role
 */
export const isAnyAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return Object.values(AdminLevel).includes(user.role as AdminLevel);
};

/**
 * Check if user can access service management
 */
export const canAccessServiceManagement = (user: User | null): boolean => {
  return isSuperAdmin(user);
};

/**
 * Check if user can control server services (start/stop/restart)
 */
export const canControlServerServices = (user: User | null): boolean => {
  return isSuperAdmin(user);
};

/**
 * Check if user can access back office modules
 */
export const canAccessBackOffice = (user: User | null): boolean => {
  return hasAdminLevel(user, AdminLevel.ADMIN);
};

/**
 * Check if user can access administration modules
 */
export const canAccessAdministration = (user: User | null): boolean => {
  return hasAdminLevel(user, AdminLevel.ADMIN);
};

/**
 * Check if user can manage all users (including other admins)
 */
export const canManageAllUsers = (user: User | null): boolean => {
  return isSuperAdmin(user);
};

/**
 * Check if user can manage hospital users (non-admin users)
 */
export const canManageHospitalUsers = (user: User | null): boolean => {
  return hasAdminLevel(user, AdminLevel.BRISTOL_ADMIN);
};

/**
 * Get user's admin level display name
 */
export const getAdminLevelDisplayName = (user: User | null): string => {
  if (!user) return 'No Access';
  
  switch (user.role) {
    case AdminLevel.SUPER_ADMIN:
      return 'Super Administrator';
    case AdminLevel.BRISTOL_ADMIN:
      return 'Bristol Administrator';
    case AdminLevel.ADMIN:
      return 'Administrator';
    default:
      return 'User';
  }
};

/**
 * Get available modules for user based on role
 */
export const getAvailableModules = (user: User | null) => {
  if (!user) return [];
  
  const modules = [];
  
  // Hospital modules (available to all authenticated users with appropriate permissions)
  modules.push('clinical', 'patients', 'admissions', 'appointments', 'laboratory', 'pharmacy', 'radiology');
  
  // Back office modules (admin and above)
  if (canAccessBackOffice(user)) {
    modules.push('finance', 'inventory', 'procurement', 'hr', 'reports');
  }
  
  // Administration modules (admin and above, but service management only for super admin)
  if (canAccessAdministration(user)) {
    modules.push('user-management', 'system-settings');
    
    if (isBristolAdminOrHigher(user)) {
      modules.push('role-permissions', 'audit-logs');
    }
    
    if (isSuperAdmin(user)) {
      modules.push('service-management', 'database-management', 'security-settings');
    }
  }
  
  return modules;
};

/**
 * Check if user can access a specific module
 */
export const canAccessModule = (user: User | null, module: string): boolean => {
  const availableModules = getAvailableModules(user);
  return availableModules.includes(module);
};
