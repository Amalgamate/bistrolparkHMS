import React, { useState } from 'react';
import { Zap, RefreshCw, Navigation, ArrowRight } from 'lucide-react';
import { useEnhancedNavigation } from '../hooks/useEnhancedNavigation';

const HMRDemo: React.FC = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState('🚀 HMR Live Update! Changes appear instantly!');
  const { navigate } = useEnhancedNavigation();

  return (
    <div className="fixed bottom-4 right-4 bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-lg shadow-lg max-w-sm animate-pulse">
      <div className="flex items-center mb-2">
        <Zap className="w-5 h-5 mr-2 text-yellow-300" />
        <h3 className="font-bold text-sm">Hot Module Replacement</h3>
      </div>

      <div className="space-y-2">
        <p className="text-xs opacity-90">
          {message}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs">Counter: {count}</span>
          <button
            onClick={() => setCount(count + 1)}
            className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs flex items-center"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            +1
          </button>
        </div>

        <div className="text-xs opacity-75 mb-2">
          💡 Try editing this component's message or styling - changes will appear instantly without losing state!
        </div>

        <div className="border-t border-white/20 pt-2 mt-2">
          <p className="text-xs font-medium mb-2">🌟 Test Smooth Transitions:</p>
          <div className="flex gap-1">
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs flex items-center transition-all"
            >
              <Navigation className="w-3 h-3 mr-1" />
              Dashboard
            </button>
            <button
              onClick={() => navigate('/patients')}
              className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-xs flex items-center transition-all"
            >
              <ArrowRight className="w-3 h-3 mr-1" />
              Patients
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HMRDemo;
