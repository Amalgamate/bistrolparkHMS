import { useState } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastOptions {
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface Toast extends ToastOptions {
  id: string;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = ({ title, message, type, duration = 5000 }: ToastOptions) => {
    const id = Math.random().toString(36).substring(2, 9);
    const toast = { id, title, message, type, duration };
    
    setToasts((prevToasts) => [...prevToasts, toast]);

    // Auto-dismiss after duration
    setTimeout(() => {
      dismissToast(id);
    }, duration);

    return id;
  };

  const dismissToast = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    showToast,
    dismissToast,
  };
};
