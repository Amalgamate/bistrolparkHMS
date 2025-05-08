import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  title,
  duration = 5000,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Allow time for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = () => {
    const baseStyles = "fixed bottom-4 right-4 flex items-center p-4 rounded-md shadow-lg transform transition-all duration-300 max-w-md";
    const visibilityStyles = isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0";

    let typeStyles = "";
    switch (type) {
      case 'success':
        typeStyles = "bg-green-50 text-green-800 border-l-4 border-green-500";
        break;
      case 'error':
        typeStyles = "bg-red-50 text-red-800 border-l-4 border-red-500";
        break;
      case 'warning':
        typeStyles = "bg-yellow-50 text-yellow-800 border-l-4 border-yellow-500";
        break;
      case 'info':
        typeStyles = "bg-blue-50 text-blue-800 border-l-4 border-blue-500";
        break;
    }

    return `${baseStyles} ${typeStyles} ${visibilityStyles}`;
  };

  return (
    <div className={getStyles()}>
      <div className="flex-shrink-0 mr-3">
        {getIcon()}
      </div>
      <div className="flex-1 mr-2">
        {title && <div className="font-medium">{title}</div>}
        <div className={title ? "text-sm mt-1" : ""}>{message}</div>
      </div>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="flex-shrink-0 p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: Array<{
    id: string;
    type: ToastType;
    message: string;
    title?: string;
  }>;
  removeToast: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  removeToast
}) => {
  return (
    <div className="fixed bottom-0 right-0 z-50 p-4 space-y-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          title={toast.title}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};
