import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the branch type
export type Branch = 'Fedha' | 'Utawala' | 'Machakos' | 'Tassia' | 'Kitengela';

// Define the user type
interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Doctor' | 'Nurse' | 'Staff';
  branch: Branch;
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, branch: Branch) => Promise<boolean>;
  logout: () => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

// Dummy admin user
const createAdminUser = (branch: Branch): User => ({
  id: '1',
  name: 'Admin User',
  email: 'admin@bristolhospital.com',
  role: 'Admin',
  branch,
});

// Admin credentials
const ADMIN_CREDENTIALS = {
  email: 'admin@bristolhospital.com',
  password: 'admin12345',
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Login function
  const login = async (email: string, password: string, branch: Branch): Promise<boolean> => {
    // Check if credentials match the dummy admin
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser = createAdminUser(branch);
      setUser(adminUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
