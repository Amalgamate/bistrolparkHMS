import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSettings } from './SettingsContext';
import { useUserRoles } from './UserRolesContext';

// Define the user type
export interface User {
  id: string;
  name: string;
  email: string;
  jobId?: string;
  role: string;
  branch: string;
  allowedBranches: string[]; // List of branch IDs the user is allowed to access
}

// Define login result type
export interface LoginResult {
  success: boolean;
  message?: string;
  requiresBranchSelection?: boolean;
  allowedBranches?: string[];
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string, branchId?: string) => Promise<LoginResult>;
  logout: () => void;
  selectBranch: (branchId: string) => Promise<LoginResult>;
  switchBranch: (branchId: string) => Promise<LoginResult>;
  isLoading: boolean;
  hasPermission: (permission: string) => boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  logout: () => {},
  selectBranch: async () => ({ success: false }),
  switchBranch: async () => ({ success: false }),
  isLoading: false,
  hasPermission: () => false,
});

// We'll use the users from UserRolesContext instead of this mock database

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const settings = useSettings();
  const { users: roleUsers, roles } = useUserRoles();

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Find user by email or job ID
  const findUser = (identifier: string) => {
    return roleUsers.find(
      (u) => u.email === identifier || u.jobId === identifier
    );
  };

  // Login function
  const login = async (identifier: string, password: string, branchId?: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      // Find user by email or job ID
      const foundUser = findUser(identifier);

      // Check if user exists and password matches
      if (!foundUser || foundUser.password !== password || !foundUser.active) {
        return { success: false, message: 'Invalid credentials or inactive account' };
      }

      // If no branch is specified, try to detect current location
      if (!branchId) {
        const position = await settings.getCurrentLocation();

        if (position) {
          // Find the closest branch within allowed branches
          const { latitude, longitude } = position.coords;
          let closestBranch = null;
          let minDistance = Infinity;

          for (const branchId of foundUser.allowedBranches) {
            const branch = settings.getBranchById(branchId);
            if (!branch) continue;

            // Calculate distance to this branch
            const distance = calculateDistance(
              latitude,
              longitude,
              branch.location.latitude,
              branch.location.longitude
            );

            // If within radius and closer than previous closest
            if (distance <= branch.location.radius && distance < minDistance) {
              closestBranch = branch;
              minDistance = distance;
            }
          }

          // If we found a branch within radius, use it
          if (closestBranch) {
            branchId = closestBranch.id;
          }
        }
      }

      // If we have a branch ID, check if user is allowed to access it
      if (branchId) {
        // Check if user is allowed to access this branch
        if (!foundUser.allowedBranches.includes(branchId)) {
          return {
            success: false,
            message: 'You do not have access to this branch'
          };
        }

        // Check if user is within the branch's geofence (if remote access is not allowed)
        const branch = settings.getBranchById(branchId);

        // If the branch doesn't allow remote access OR the user doesn't have remote access permission
        if ((branch && !branch.allowRemoteAccess) || !foundUser.remoteAccessAllowed) {
          const hasAccess = await settings.checkBranchAccess(branchId);
          if (!hasAccess) {
            return {
              success: false,
              message: foundUser.remoteAccessAllowed
                ? 'This branch requires physical presence to access'
                : 'You do not have permission to access the system remotely. Please visit the branch.'
            };
          }
        }

        // Create user object with selected branch
        const userObj: User = {
          id: foundUser.id,
          name: foundUser.name,
          email: foundUser.email,
          jobId: foundUser.jobId,
          role: foundUser.role,
          branch: branchId,
          allowedBranches: foundUser.allowedBranches,
        };

        // Set user and authentication state
        setUser(userObj);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userObj));
        return { success: true };
      }

      // If we don't have a branch ID and user has multiple allowed branches,
      // return success: false with requiresBranchSelection: true
      if (foundUser.allowedBranches.length > 0) {
        return {
          success: false,
          requiresBranchSelection: true,
          allowedBranches: foundUser.allowedBranches,
        };
      }

      return { success: false, message: 'No accessible branches found' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    } finally {
      setIsLoading(false);
    }
  };

  // Select branch function (used after initial login if branch selection is required)
  const selectBranch = async (branchId: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      // Get the last attempted login credentials from session storage
      const lastAttemptStr = sessionStorage.getItem('lastLoginAttempt');
      if (!lastAttemptStr) {
        return { success: false, message: 'No login attempt found' };
      }

      const lastAttempt = JSON.parse(lastAttemptStr);
      const { identifier } = lastAttempt;

      // Find user
      const foundUser = findUser(identifier);
      if (!foundUser) {
        return { success: false, message: 'User not found' };
      }

      // Check if user is allowed to access this branch
      if (!foundUser.allowedBranches.includes(branchId)) {
        return {
          success: false,
          message: 'You do not have access to this branch'
        };
      }

      // Check if user is within the branch's geofence (if remote access is not allowed)
      const branch = settings.getBranchById(branchId);

      // If the branch doesn't allow remote access OR the user doesn't have remote access permission
      if ((branch && !branch.allowRemoteAccess) || !foundUser.remoteAccessAllowed) {
        const hasAccess = await settings.checkBranchAccess(branchId);
        if (!hasAccess) {
          return {
            success: false,
            message: foundUser.remoteAccessAllowed
              ? 'This branch requires physical presence to access'
              : 'You do not have permission to access the system remotely. Please visit the branch.'
          };
        }
      }

      // Create user object with selected branch
      const userObj: User = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        jobId: foundUser.jobId,
        role: foundUser.role,
        branch: branchId,
        allowedBranches: foundUser.allowedBranches,
      };

      // Set user and authentication state
      setUser(userObj);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userObj));

      // Clear the last login attempt
      sessionStorage.removeItem('lastLoginAttempt');

      return { success: true };
    } catch (error) {
      console.error('Branch selection error:', error);
      return { success: false, message: 'An error occurred during branch selection' };
    } finally {
      setIsLoading(false);
    }
  };

  // Branch switching function for already logged-in users
  const switchBranch = async (branchId: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      // Make sure user is logged in
      if (!user) {
        return { success: false, message: 'You must be logged in to switch branches' };
      }

      // Find the current user in the database
      const foundUser = roleUsers.find(u => u.id === user.id);
      if (!foundUser || !foundUser.active) {
        return { success: false, message: 'User not found or inactive' };
      }

      // Check if user is allowed to access this branch
      if (!foundUser.allowedBranches.includes(branchId)) {
        return {
          success: false,
          message: 'You do not have access to this branch'
        };
      }

      // Check if user is within the branch's geofence (if remote access is not allowed)
      const branch = settings.getBranchById(branchId);

      // If the branch doesn't allow remote access OR the user doesn't have remote access permission
      if ((branch && !branch.allowRemoteAccess) || !foundUser.remoteAccessAllowed) {
        const hasAccess = await settings.checkBranchAccess(branchId);
        if (!hasAccess) {
          return {
            success: false,
            message: foundUser.remoteAccessAllowed
              ? 'This branch requires physical presence to access'
              : 'You do not have permission to access the system remotely. Please visit the branch.'
          };
        }
      }

      // Create updated user object with new branch
      const updatedUser: User = {
        ...user,
        branch: branchId,
      };

      // Update user state and localStorage
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      return { success: true };
    } catch (error) {
      console.error('Branch switching error:', error);
      return { success: false, message: 'An error occurred while switching branches' };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    sessionStorage.removeItem('lastLoginAttempt');
  };

  // Helper function to calculate distance between two points
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Distance in meters
  };

  // Check if the current user has a specific permission
  const hasPermission = (permission: string) => {
    if (!user) return false;

    // Find the user's role
    const userRole = roleUsers.find(u => u.id === user.id)?.role;
    if (!userRole) return false;

    // Find the role's permissions
    const role = roles.find(r => r.id === userRole);
    if (!role) return false;

    // Check if the role has the requested permission
    return role.permissions.includes(permission as any);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      selectBranch,
      switchBranch,
      isLoading,
      hasPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
