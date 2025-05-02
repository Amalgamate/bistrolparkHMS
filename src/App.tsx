import React, { useEffect } from 'react';
import { BrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';
import { AppRoutes } from './routes';

function App() {
  const { isAuthenticated } = useAuth();

  // Redirect to dashboard after login
  useEffect(() => {
    if (isAuthenticated) {
      // Use window.location to ensure a full page reload to the dashboard
      if (window.location.pathname === '/') {
        window.location.href = '/dashboard';
      }
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;