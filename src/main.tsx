// StrictMode temporarily disabled to fix hook call issues
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/theme.css';
import './styles/medical-background.css';
import './styles/tabs.css';
import './styles/lab-tabs.css';
import './styles/icons.css';
import './styles/page-transitions.css';
import { SettingsProvider } from './context/SettingsContext';
import { UserRolesProvider } from './context/UserRolesContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';

// Prevent babel polyfill conflicts
if (typeof window !== 'undefined') {
  if (!window._babelPolyfillLoaded) {
    window._babelPolyfillLoaded = true;
  }
}

if (typeof window !== 'undefined') {
  import('./utils/cacheUtils').then(({ initCacheBusting }) => {
    initCacheBusting();
  });
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <SettingsProvider>
      <UserRolesProvider>
        <AuthProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </AuthProvider>
      </UserRolesProvider>
    </SettingsProvider>
  </ErrorBoundary>
);
