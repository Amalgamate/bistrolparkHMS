import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface PageTransitionContextType {
  isLoading: boolean;
  progress: number;
  startTransition: (targetPath?: string) => void;
  completeTransition: () => void;
  setProgress: (progress: number) => void;
  navigateWithTransition: (path: string, options?: { replace?: boolean }) => void;
}

const PageTransitionContext = createContext<PageTransitionContextType | undefined>(undefined);

export const usePageTransition = () => {
  const context = useContext(PageTransitionContext);
  if (!context) {
    throw new Error('usePageTransition must be used within a PageTransitionProvider');
  }
  return context;
};

interface PageTransitionProviderProps {
  children: React.ReactNode;
  enableAutoTransitions?: boolean;
  minLoadingTime?: number;
  maxLoadingTime?: number;
}

export const PageTransitionProvider: React.FC<PageTransitionProviderProps> = ({
  children,
  enableAutoTransitions = true,
  minLoadingTime = 300,
  maxLoadingTime = 1000,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgressState] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  const startTransition = useCallback((targetPath?: string) => {
    setIsLoading(true);
    setProgressState(10);
    
    // Simulate realistic loading progress
    const progressInterval = setInterval(() => {
      setProgressState(prev => {
        if (prev >= 85) {
          clearInterval(progressInterval);
          return 85;
        }
        // Slower progress as it gets higher (more realistic)
        const increment = Math.random() * (90 - prev) * 0.1;
        return Math.min(prev + increment, 85);
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, []);

  const completeTransition = useCallback(() => {
    setProgressState(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgressState(0);
    }, 200);
  }, []);

  const setProgress = useCallback((newProgress: number) => {
    setProgressState(Math.max(0, Math.min(100, newProgress)));
  }, []);

  const navigateWithTransition = useCallback((path: string, options?: { replace?: boolean }) => {
    startTransition(path);
    
    // Small delay to show the loading bar before navigation
    setTimeout(() => {
      if (options?.replace) {
        navigate(path, { replace: true });
      } else {
        navigate(path);
      }
    }, 100);
  }, [navigate, startTransition]);

  // Auto-detect route changes
  useEffect(() => {
    if (!enableAutoTransitions) return;

    const cleanup = startTransition(location.pathname);
    
    // Complete transition after minimum time
    const timer = setTimeout(() => {
      completeTransition();
    }, minLoadingTime + Math.random() * (maxLoadingTime - minLoadingTime));

    return () => {
      cleanup?.();
      clearTimeout(timer);
    };
  }, [location.pathname, enableAutoTransitions, minLoadingTime, maxLoadingTime, startTransition, completeTransition]);

  const value: PageTransitionContextType = {
    isLoading,
    progress,
    startTransition,
    completeTransition,
    setProgress,
    navigateWithTransition,
  };

  return (
    <PageTransitionContext.Provider value={value}>
      {children}
    </PageTransitionContext.Provider>
  );
};

// Hook for manual transition control
export const useManualTransition = () => {
  const { startTransition, completeTransition, setProgress } = usePageTransition();
  
  return {
    startLoading: startTransition,
    finishLoading: completeTransition,
    updateProgress: setProgress,
  };
};

// Hook for navigation with transitions
export const useTransitionNavigate = () => {
  const { navigateWithTransition } = usePageTransition();
  return navigateWithTransition;
};
