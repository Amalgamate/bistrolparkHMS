import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Permission as PermissionType } from '../../context/UserRolesContext';
import { AlertCircle } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: PermissionType;
  redirectTo?: string;
}

/**
 * A component that protects routes based on authentication and permissions.
 * If the user is not authenticated, they will be redirected to the login page.
 * If a required permission is specified and the user doesn't have it, they will
 * see an access denied message or be redirected to the specified path.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermission,
  redirectTo = '/'
}) => {
  const { isAuthenticated, hasPermission } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If a permission is required, check if the user has it
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    // If no redirect is specified, show an access denied message
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center text-red-500 mb-4">
            <AlertCircle size={48} />
          </div>
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 text-center mb-6">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          <div className="flex justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-[#2B3990] text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated and has permission (or no permission required), render children
  return <>{children}</>;
};

export default ProtectedRoute;
