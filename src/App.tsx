import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LocationBasedLogin from './pages/LocationBasedLogin';
import { useAuth } from './context/AuthContext';
import { AppRoutes } from './routes';
import { checkAndUpdateVersion, forceReload } from './utils/cacheUtils';
import { RealTimeNotificationProvider } from './context/RealTimeNotificationContext';
import { ApprovalProvider } from './context/ApprovalContext';
import { ChatProvider } from './context/ChatContext';
import IconTest from './components/IconTest';

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

  // For testing purposes, allow direct access to the icon test page
  if (!isAuthenticated) {
    // Check if the user is trying to access the icon test page
    if (window.location.pathname === '/icon-test') {
      return (
        <BrowserRouter>
          <Routes>
            <Route path="/icon-test" element={<IconTest />} />
            <Route path="*" element={<Navigate to="/icon-test" replace />} />
          </Routes>
        </BrowserRouter>
      );
    }
    return <LocationBasedLogin />;
  }

  return (
    <RealTimeNotificationProvider>
      <ApprovalProvider>
        <ChatProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ChatProvider>
      </ApprovalProvider>
    </RealTimeNotificationProvider>
  );
}

export default App;
