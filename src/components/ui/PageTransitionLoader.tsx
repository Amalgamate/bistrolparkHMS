import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionLoaderProps {
  isLoading: boolean;
  progress: number;
}

export const PageTransitionLoader: React.FC<PageTransitionLoaderProps> = ({
  isLoading,
  progress
}) => {
  const [visible, setVisible] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
      setAnimatedProgress(0);
    } else {
      // Complete the animation before hiding
      setAnimatedProgress(100);
      const timer = setTimeout(() => {
        setVisible(false);
        setAnimatedProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading && progress > animatedProgress) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [progress, animatedProgress, isLoading]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1">
      {/* Background track */}
      <div className="absolute inset-0 bg-gray-200/30 backdrop-blur-sm" />

      {/* Progress bar with glow effect */}
      <div
        className="h-full bg-gradient-to-r from-[#0100f6] via-[#2B3990] to-[#e91e63]
                   shadow-lg transition-all duration-500 ease-out relative overflow-hidden"
        style={{
          width: `${animatedProgress}%`,
          boxShadow: `
            0 0 15px rgba(1, 0, 246, 0.6),
            0 0 25px rgba(43, 57, 144, 0.4),
            0 0 35px rgba(233, 30, 99, 0.4),
            0 2px 10px rgba(0, 0, 0, 0.1)
          `
        }}
      >
        {/* Animated shimmer effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent
                     transform -skew-x-12 animate-pulse"
          style={{
            animation: 'shimmer 1.5s infinite',
          }}
        />

        {/* Glow effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#0100f6]/50 to-[#dc2626]/50
                     blur-sm opacity-75"
        />
      </div>

      {/* Enhanced moving dot at the front */}
      {animatedProgress > 0 && animatedProgress < 100 && (
        <div
          className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 rounded-full
                     bg-white shadow-lg animate-pulse transition-all duration-300"
          style={{
            left: `${animatedProgress}%`,
            boxShadow: `
              0 0 8px rgba(255, 255, 255, 0.8),
              0 0 16px rgba(220, 38, 38, 0.6),
              0 0 24px rgba(220, 38, 38, 0.4)
            `
          }}
        />
      )}

      {/* Additional trailing glow effect */}
      {animatedProgress > 10 && animatedProgress < 100 && (
        <div
          className="absolute top-0 h-full w-8 bg-gradient-to-r from-transparent to-white/20
                     rounded-full opacity-60"
          style={{ left: `${Math.max(0, animatedProgress - 8)}%` }}
        />
      )}
    </div>
  );
};

// Auto-detecting page transition loader
export const AutoPageTransitionLoader: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start loading on route change
    setIsLoading(true);
    setProgress(10);

    // Simulate loading progress
    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressTimer);
          return 90;
        }
        return prev + Math.random() * 20;
      });
    }, 100);

    // Complete loading after a short delay
    const completeTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }, 500 + Math.random() * 300);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(completeTimer);
    };
  }, [location.pathname]);

  return <PageTransitionLoader isLoading={isLoading} progress={progress} />;
};

// CSS for shimmer animation (add to your global CSS)
const shimmerKeyframes = `
@keyframes shimmer {
  0% {
    transform: translateX(-100%) skewX(-12deg);
  }
  100% {
    transform: translateX(200%) skewX(-12deg);
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerKeyframes;
  document.head.appendChild(style);
}
