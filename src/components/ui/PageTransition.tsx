import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
  transitionDuration?: number;
  easing?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  transitionDuration = 300,
  easing = 'cubic-bezier(0.4, 0, 0.2, 1)', // Material Design easing
}) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== currentPath) {
      // Fade out
      setIsVisible(false);
      
      const timer = setTimeout(() => {
        setCurrentPath(location.pathname);
        // Fade in
        setIsVisible(true);
      }, transitionDuration / 2);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [location.pathname, currentPath, transitionDuration]);

  return (
    <div
      className={`transition-all duration-${transitionDuration} ${
        isVisible 
          ? 'opacity-100 transform translate-y-0 scale-100' 
          : 'opacity-0 transform translate-y-2 scale-98'
      } ${className}`}
      style={{
        transitionTimingFunction: easing,
        transitionDuration: `${transitionDuration}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Slide transition variant
export const SlidePageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  transitionDuration = 400,
}) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== currentPath) {
      setIsVisible(false);
      
      const timer = setTimeout(() => {
        setCurrentPath(location.pathname);
        setIsVisible(true);
      }, transitionDuration / 3);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [location.pathname, currentPath, transitionDuration]);

  return (
    <div
      className={`transition-all ease-out ${
        isVisible 
          ? 'opacity-100 transform translate-x-0' 
          : 'opacity-0 transform translate-x-4'
      } ${className}`}
      style={{
        transitionDuration: `${transitionDuration}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Scale transition variant
export const ScalePageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  transitionDuration = 350,
}) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname !== currentPath) {
      setIsVisible(false);
      
      const timer = setTimeout(() => {
        setCurrentPath(location.pathname);
        setIsVisible(true);
      }, transitionDuration / 2);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [location.pathname, currentPath, transitionDuration]);

  return (
    <div
      className={`transition-all ease-out ${
        isVisible 
          ? 'opacity-100 transform scale-100' 
          : 'opacity-0 transform scale-95'
      } ${className}`}
      style={{
        transitionDuration: `${transitionDuration}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Staggered content transition
export const StaggeredPageTransition: React.FC<{
  children: React.ReactNode;
  staggerDelay?: number;
}> = ({ children, staggerDelay = 50 }) => {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="space-y-4">
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={`transition-all duration-500 ease-out ${
            isVisible 
              ? 'opacity-100 transform translate-y-0' 
              : 'opacity-0 transform translate-y-4'
          }`}
          style={{
            transitionDelay: `${index * staggerDelay}ms`,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
};
