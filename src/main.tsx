import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/medical-background.css';
import './styles/tabs.css';
import './styles/lab-tabs.css';
import { SettingsProvider } from './context/SettingsContext';
import { UserRolesProvider } from './context/UserRolesContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

if (typeof window !== 'undefined') {
  window._babelPolyfillLoaded = true;
}

if (typeof window !== 'undefined') {
  import('./utils/cacheUtils').then(({ initCacheBusting }) => {
    initCacheBusting();
  });

  // Initialize test environment for development
  if (process.env.NODE_ENV === 'development') {
    import('./utils/testInit').then(({ initTestEnvironment }) => {
      initTestEnvironment();
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <UserRolesProvider>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </UserRolesProvider>
    </SettingsProvider>
  </StrictMode>
);
