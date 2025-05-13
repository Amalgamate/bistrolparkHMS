import React, { useState, useEffect } from 'react';
import { useClinical, QueueEntry } from '../../context/ClinicalContext';
import TokenDisplay from './TokenDisplay';
import { useRealTimeNotification } from '../../context/RealTimeNotificationContext';

interface TokenBoardProps {
  title: string;
  status: string[];
  maxTokens?: number;
  showActions?: boolean;
  destination?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const TokenBoard: React.FC<TokenBoardProps> = ({
  title,
  status,
  maxTokens = 5,
  showActions = true,
  destination = 'Consultation',
  autoRefresh = true,
  refreshInterval = 30000 // 30 seconds
}) => {
  const { queue, getQueueByStatus } = useClinical();
  const { notifyTokenCalled } = useRealTimeNotification();
  const [tokens, setTokens] = useState<QueueEntry[]>([]);
  
  // Update tokens when queue changes
  useEffect(() => {
    updateTokens();
  }, [queue]);
  
  // Auto refresh tokens
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        updateTokens();
      }, refreshInterval);
      
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);
  
  // Update tokens
  const updateTokens = () => {
    // Get tokens for all specified statuses
    const allTokens = status.flatMap(s => getQueueByStatus(s));
    
    // Sort by priority (emergency > urgent > normal) and then by token number
    const sortedTokens = allTokens.sort((a, b) => {
      // First sort by priority
      const priorityOrder = { emergency: 0, urgent: 1, normal: 2 };
      const priorityA = priorityOrder[a.priority];
      const priorityB = priorityOrder[b.priority];
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // Then sort by token number
      return a.tokenNumber - b.tokenNumber;
    });
    
    // Limit to maxTokens
    setTokens(sortedTokens.slice(0, maxTokens));
  };
  
  // Handle call token
  const handleCallToken = (token: QueueEntry) => {
    notifyTokenCalled(
      token.patientId,
      token.patientName,
      token.tokenNumber,
      destination
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">{title}</h2>
        <p className="text-sm text-gray-500">
          {tokens.length} {tokens.length === 1 ? 'patient' : 'patients'}
        </p>
      </div>
      
      <div className="p-4 space-y-3">
        {tokens.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No patients in this queue</p>
          </div>
        ) : (
          tokens.map(token => (
            <TokenDisplay
              key={token.id}
              tokenNumber={token.tokenNumber}
              patientName={token.patientName}
              patientId={token.patientId}
              status={token.status}
              priority={token.priority}
              estimatedWaitTime={token.estimatedWaitTime}
              queueId={token.id}
              onCall={() => handleCallToken(token)}
              showActions={showActions}
              destination={destination}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TokenBoard;
