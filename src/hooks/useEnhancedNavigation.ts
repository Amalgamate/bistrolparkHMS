import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTransition } from '../context/PageTransitionContext';

interface NavigationOptions {
  replace?: boolean;
  state?: any;
  showLoader?: boolean;
  customLoadingTime?: number;
}

export const useEnhancedNavigation = () => {
  const navigate = useNavigate();
  const { startTransition, completeTransition, setProgress } = usePageTransition();

  const navigateWithTransition = useCallback(
    (path: string, options: NavigationOptions = {}) => {
      const {
        replace = false,
        state,
        showLoader = true,
        customLoadingTime = 300 + Math.random() * 400,
      } = options;

      if (showLoader) {
        startTransition(path);
        
        // Simulate loading progress
        let progress = 10;
        const progressInterval = setInterval(() => {
          progress += Math.random() * 15;
          if (progress >= 85) {
            clearInterval(progressInterval);
            progress = 85;
          }
          setProgress(progress);
        }, 50);

        // Navigate after a short delay
        setTimeout(() => {
          if (replace) {
            navigate(path, { replace: true, state });
          } else {
            navigate(path, { state });
          }
          
          // Complete the transition
          setTimeout(() => {
            clearInterval(progressInterval);
            completeTransition();
          }, 100);
        }, Math.min(customLoadingTime, 200));
      } else {
        // Navigate immediately without transition
        if (replace) {
          navigate(path, { replace: true, state });
        } else {
          navigate(path, { state });
        }
      }
    },
    [navigate, startTransition, completeTransition, setProgress]
  );

  const goBack = useCallback(
    (options: Omit<NavigationOptions, 'replace'> = {}) => {
      const { showLoader = true, customLoadingTime = 200 } = options;
      
      if (showLoader) {
        startTransition();
        setTimeout(() => {
          navigate(-1);
          setTimeout(() => {
            completeTransition();
          }, 100);
        }, customLoadingTime);
      } else {
        navigate(-1);
      }
    },
    [navigate, startTransition, completeTransition]
  );

  const goForward = useCallback(
    (options: Omit<NavigationOptions, 'replace'> = {}) => {
      const { showLoader = true, customLoadingTime = 200 } = options;
      
      if (showLoader) {
        startTransition();
        setTimeout(() => {
          navigate(1);
          setTimeout(() => {
            completeTransition();
          }, 100);
        }, customLoadingTime);
      } else {
        navigate(1);
      }
    },
    [navigate, startTransition, completeTransition]
  );

  const refresh = useCallback(
    (customLoadingTime = 500) => {
      startTransition();
      setTimeout(() => {
        window.location.reload();
      }, customLoadingTime);
    },
    [startTransition]
  );

  return {
    navigate: navigateWithTransition,
    goBack,
    goForward,
    refresh,
    // Direct access to transition controls
    startLoading: startTransition,
    finishLoading: completeTransition,
    updateProgress: setProgress,
  };
};

// Convenience hooks for common navigation patterns
export const useQuickNavigation = () => {
  const { navigate } = useEnhancedNavigation();
  
  return {
    toDashboard: () => navigate('/dashboard'),
    toPatients: () => navigate('/patients'),
    toAppointments: () => navigate('/appointments'),
    toSettings: () => navigate('/settings'),
    toProfile: () => navigate('/profile'),
  };
};

export const usePatientNavigation = () => {
  const { navigate } = useEnhancedNavigation();
  
  return {
    toPatientList: () => navigate('/patients'),
    toPatientDetails: (patientId: string) => navigate(`/patients/details/${patientId}`),
    toPatientEdit: (patientId: string) => navigate(`/patients/edit/${patientId}`),
    toNewPatient: () => navigate('/patients/new'),
  };
};
