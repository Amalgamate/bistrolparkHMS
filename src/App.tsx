import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LocationBasedLogin from './pages/LocationBasedLogin';
import { useAuth } from './context/AuthContext';
import { AppRoutes } from './routes';
import { checkAndUpdateVersion, forceReload } from './utils/cacheUtils';
import { RealTimeNotificationProvider } from './context/RealTimeNotificationContext';
import { ApprovalProvider } from './context/ApprovalContext';
import { ChatProvider } from './context/ChatContext';
import { PageTransitionProvider } from './context/PageTransitionContext';
import IconTest from './components/IconTest';
import HMRStatus from './components/dev/HMRStatus';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import StartupProgressModal from './components/admin/StartupProgressModal';
// PWA manager is initialized automatically
import './utils/hmr-helper'; // Initialize HMR helper

import React from 'react';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [showStartupModal, setShowStartupModal] = useState(false);

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

    // Check if this is a unified startup launch
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('startup') || urlParams.has('unified')) {
      setShowStartupModal(true);
      // Clean up URL
      urlParams.delete('startup');
      urlParams.delete('unified');
      const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
      window.history.replaceState(null, '', newUrl);
    }

    if (isAuthenticated) {
      if (window.location.pathname === '/') {
        window.location.href = '/dashboard';
      }
    }
  }, [isAuthenticated]);

  // Handle startup modal completion
  const handleStartupComplete = () => {
    setShowStartupModal(false);
    // Navigate to login if not authenticated, or dashboard if authenticated
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    } else {
      // Just close the modal, user will see login screen
    }
  };

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
    return (
      <>
        <LocationBasedLogin />
        <StartupProgressModal
          isOpen={showStartupModal}
          onClose={() => setShowStartupModal(false)}
          onComplete={handleStartupComplete}
        />
      </>
    );
  }

  return (
    <RealTimeNotificationProvider>
      <ApprovalProvider>
        <ChatProvider>
          <BrowserRouter>
            <PageTransitionProvider
              enableAutoTransitions={true}
              minLoadingTime={200}
              maxLoadingTime={800}
            >
              <AppRoutes />
              <PWAInstallPrompt />
              <HMRStatus position="bottom-right" />
              <StartupProgressModal
                isOpen={showStartupModal}
                onClose={() => setShowStartupModal(false)}
                onComplete={handleStartupComplete}
              />
            </PageTransitionProvider>
          </BrowserRouter>
        </ChatProvider>
      </ApprovalProvider>
    </RealTimeNotificationProvider>
  );
}

export default App;
