import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import LocationBasedLogin from './pages/LocationBasedLogin';
import { useAuth } from './context/AuthContext';
import { AppRoutes } from './routes';
import { checkAndUpdateVersion, forceReload } from './utils/cacheUtils';

import React from 'react';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

    const versionChanged = checkAndUpdateVersion();

    if (versionChanged && localStorage.getItem('app_initialized')) {
      forceReload();
    } else {
      localStorage.setItem('app_initialized', 'true');
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isAuthenticated) {
      if (window.location.pathname === '/') {
        window.location.href = '/dashboard';
      }
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LocationBasedLogin />;
  }

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
