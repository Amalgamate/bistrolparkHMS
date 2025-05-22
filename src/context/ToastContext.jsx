import React, { createContext, useContext, useState } from 'react';

// Create context
const ToastContext = createContext();

// Custom hook to use the toast context
export const useToast = () => {
  return useContext(ToastContext);
};

// Toast component
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-green-500' : 
                 type === 'error' ? 'bg-red-500' : 
                 type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';
  
  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-2 rounded shadow-lg z-50 flex items-center`}>
      <span>{message}</span>
      <button 
        onClick={onClose} 
        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>
  );
};

// Provider component
export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  
  // Function to show a toast
  const showToast = (message, type = 'info', duration = 3000) => {
    setToast({ message, type });
    
    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        setToast(null);
      }, duration);
    }
  };
  
  // Function to hide the toast
  const hideToast = () => {
    setToast(null);
  };
  
  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}
    </ToastContext.Provider>
  );
};

export default ToastContext;
