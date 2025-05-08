import { useAuth } from '../context/AuthContext';

/**
 * A custom hook that provides permission-checking functionality.
 * It wraps the hasPermission function from the AuthContext.
 */
export const usePermissions = () => {
  const { hasPermission } = useAuth();
  
  return {
    hasPermission
  };
};
