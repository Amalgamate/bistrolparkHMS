import React, { useState, useEffect } from 'react';
import { hmrHelper } from '../../utils/hmr-helper';
import { Zap, RefreshCw, AlertCircle } from 'lucide-react';

interface HMRStatusProps {
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  showInProduction?: boolean;
}

const HMRStatus: React.FC<HMRStatusProps> = ({ 
  position = 'bottom-right', 
  showInProduction = false 
}) => {
  const [status, setStatus] = useState(hmrHelper.getStatus());
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Don't show in production unless explicitly requested
    if (!import.meta.hot && !showInProduction) {
      setIsVisible(false);
      return;
    }

    const unsubscribe = hmrHelper.onStatusChange(setStatus);
    return unsubscribe;
  }, [showInProduction]);

  if (!isVisible) return null;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  const getStatusColor = () => {
    if (!status.isConnected) return 'bg-red-500';
    if (status.updateCount > 0) return 'bg-green-500';
    return 'bg-yellow-500';
  };

  const getStatusText = () => {
    if (!status.isConnected) return 'HMR Disconnected';
    if (status.updateCount === 0) return 'HMR Ready';
    return `HMR Active (${status.updateCount} updates)`;
  };

  const handleClick = () => {
    if (import.meta.hot) {
      console.log('🔥 Bristol Park Hospital - HMR Status:');
      console.log('   Connected:', status.isConnected);
      console.log('   Updates:', status.updateCount);
      console.log('   Last Update:', status.lastUpdate?.toLocaleTimeString() || 'None');
      console.log('   Available commands: hmr.help()');
    }
  };

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-50 transition-all duration-200 hover:scale-105`}
      onClick={handleClick}
      title="Click for HMR info (check console)"
    >
      <div className={`
        flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg cursor-pointer
        ${getStatusColor()} text-white text-sm font-medium
        hover:shadow-xl transition-shadow duration-200
      `}>
        {status.isConnected ? (
          <Zap className="w-4 h-4" />
        ) : (
          <AlertCircle className="w-4 h-4" />
        )}
        <span>{getStatusText()}</span>
        {status.lastUpdate && (
          <RefreshCw className="w-3 h-3 opacity-75" />
        )}
      </div>
      
      {status.lastUpdate && (
        <div className="text-xs text-gray-600 mt-1 text-center">
          {status.lastUpdate.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default HMRStatus;
