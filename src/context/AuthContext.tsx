import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSettings } from './SettingsContext';
import { useUserRoles } from './UserRolesContext';
import apiClient from '../services/apiClient';

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

  // Login function - simplified to only use API authentication
  const login = async (identifier: string, password: string, branchId?: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      // Authenticate with the API
      try {
        const response = await apiClient.login({
          username: identifier,
          password
        });

        if (response.data && response.data.token) {
          // Store the token
          localStorage.setItem('token', response.data.token);

          // Get the user data from the response
          const apiUser = response.data.user;

          // Create a user object from the API response
          const userObj: User = {
            id: apiUser.id.toString(),
            name: `${apiUser.first_name} ${apiUser.last_name}`,
            email: apiUser.email,
            role: apiUser.role,
            branch: branchId || 'default', // Use provided branch or default
            allowedBranches: [branchId || 'default'], // Default to single branch access
          };

          setUser(userObj);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userObj));
          return { success: true };
        }

        return { success: false, message: 'Invalid credentials' };
      } catch (apiError) {
        console.log('API authentication failed', apiError);
        return { success: false, message: 'Authentication failed. Please check your credentials.' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    } finally {
      setIsLoading(false);
    }
  };

  // Select branch function (simplified for API users)
  const selectBranch = async (branchId: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      if (!user) {
        return { success: false, message: 'You must be logged in to select a branch' };
      }

      // Update the user object with the selected branch
      const updatedUser: User = {
        ...user,
        branch: branchId,
        allowedBranches: [...user.allowedBranches, branchId]
      };

      // Set user and authentication state
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Clear any stored login attempt
      sessionStorage.removeItem('lastLoginAttempt');

      return { success: true };
    } catch (error) {
      console.error('Branch selection error:', error);
      return { success: false, message: 'An error occurred during branch selection' };
    } finally {
      setIsLoading(false);
    }
  };

  // Branch switching function (simplified for API users)
  const switchBranch = async (branchId: string): Promise<LoginResult> => {
    setIsLoading(true);
    try {
      // Make sure user is logged in
      if (!user) {
        return { success: false, message: 'You must be logged in to switch branches' };
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
    localStorage.removeItem('token'); // Clear API token
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

    // For API users, we'll grant permissions based on role
    // Admin users have all permissions
    if (user.role === 'admin') return true;

    // Doctor users have clinical permissions
    if (user.role === 'doctor') {
      const doctorPermissions = [
        'view_patients', 'view_appointments', 'view_patient_charges',
        'view_patient_notes', 'view_discharge_summary', 'bill_consultation',
        'view_laboratory_price_list', 'view_radiology_price_list',
        'view_medicine_price_list', 'view_waiting_patients'
      ];
      return doctorPermissions.includes(permission);
    }

    // For other roles, check the roles context
    const role = roles.find(r => r.id === user.role);
    if (role) {
      return role.permissions.includes(permission as any);
    }

    return false;
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
