import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { useClinical, Priority, PatientStatus } from '../../context/ClinicalContext';
import { useRealTimeNotification } from '../../context/RealTimeNotificationContext';

interface TokenDisplayProps {
  tokenNumber: number;
  patientName: string;
  patientId: string;
  status: PatientStatus;
  priority: Priority;
  estimatedWaitTime?: number;
  queueId: string;
  onCall?: () => void;
  showActions?: boolean;
  destination?: string;
}

const TokenDisplay: React.FC<TokenDisplayProps> = ({
  tokenNumber,
  patientName,
  patientId,
  status,
  priority,
  estimatedWaitTime,
  queueId,
  onCall,
  showActions = true,
  destination = 'Consultation'
}) => {
  const { notifyTokenCalled } = useRealTimeNotification();
  const [isFlashing, setIsFlashing] = useState(false);
  
  // Flash animation for newly called tokens
  useEffect(() => {
    if (status === 'vitals_taken' || status === 'with_doctor') {
      setIsFlashing(true);
      const timer = setTimeout(() => {
        setIsFlashing(false);
      }, 10000); // Flash for 10 seconds
      
      return () => clearTimeout(timer);
    }
  }, [status]);
  
  // Get background color based on priority
  const getBackgroundColor = () => {
    if (isFlashing) {
      return 'animate-pulse bg-yellow-100';
    }
    
    switch (priority) {
      case 'emergency':
        return 'bg-red-100';
      case 'urgent':
        return 'bg-orange-100';
      default:
        return 'bg-blue-50';
    }
  };
  
  // Get border color based on priority
  const getBorderColor = () => {
    switch (priority) {
      case 'emergency':
        return 'border-red-500';
      case 'urgent':
        return 'border-orange-500';
      default:
        return 'border-blue-300';
    }
  };
  
  // Get status text
  const getStatusText = () => {
    switch (status) {
      case 'registered':
        return 'Registered';
      case 'waiting_vitals':
        return 'Waiting for Vitals';
      case 'vitals_taken':
        return 'Ready for Doctor';
      case 'with_doctor':
        return 'With Doctor';
      case 'lab_ordered':
        return 'Lab Tests Ordered';
      case 'lab_completed':
        return 'Lab Tests Completed';
      case 'pharmacy':
        return 'Pharmacy';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };
  
  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'registered':
        return 'text-gray-600 bg-gray-100';
      case 'waiting_vitals':
        return 'text-blue-600 bg-blue-100';
      case 'vitals_taken':
        return 'text-green-600 bg-green-100';
      case 'with_doctor':
        return 'text-purple-600 bg-purple-100';
      case 'lab_ordered':
        return 'text-yellow-600 bg-yellow-100';
      case 'lab_completed':
        return 'text-indigo-600 bg-indigo-100';
      case 'pharmacy':
        return 'text-pink-600 bg-pink-100';
      case 'completed':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };
  
  // Handle call token
  const handleCallToken = () => {
    if (onCall) {
      onCall();
    }
    
    // Send notification
    notifyTokenCalled(patientId, patientName, tokenNumber, destination);
    
    // Play sound
    const audio = new Audio('/sounds/token-called.mp3');
    audio.play();
  };
  
  return (
    <div className={`rounded-lg border-l-4 ${getBorderColor()} ${getBackgroundColor()} p-4 shadow-sm transition-all duration-300`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-800">{tokenNumber}</span>
            {priority === 'emergency' && (
              <AlertTriangle className="ml-2 h-5 w-5 text-red-500" />
            )}
          </div>
          <h3 className="text-sm font-medium text-gray-800 mt-1">{patientName}</h3>
        </div>
        
        <div className="flex flex-col items-end">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          
          {estimatedWaitTime !== undefined && (
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>~{estimatedWaitTime} min</span>
            </div>
          )}
        </div>
      </div>
      
      {showActions && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleCallToken}
            className="flex items-center px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          >
            Call Token
            <ArrowRight className="ml-1 h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TokenDisplay;
