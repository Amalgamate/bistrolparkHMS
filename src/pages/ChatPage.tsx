import React, { useEffect } from 'react';
import { ChatProvider } from '../context/ChatContext';
import ChatInterface from '../components/chat/ChatInterface';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import webSocketService from '../services/WebSocketService';
import webRTCService from '../services/WebRTCService';

const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  // Initialize WebSocket and WebRTC services
  useEffect(() => {
    if (user) {
      // Initialize WebSocket service
      webSocketService.init(
        user.id, 
        user.role || 'user', 
        user.branch || 'main'
      );
      
      // Register WebSocket event handlers
      webSocketService.onConnect(() => {
        console.log('WebSocket connected');
      });
      
      webSocketService.onDisconnect(() => {
        console.log('WebSocket disconnected');
      });
      
      webSocketService.onMessage((notification) => {
        // Handle chat-related notifications
        if (notification.type === 'TOKEN_CALLED') {
          // This is handled by the queue system
          return;
        }
        
        // Show toast for other notifications
        showToast({
          title: notification.type.replace(/_/g, ' '),
          description: notification.message,
          variant: "default",
        });
      });
    }
  }, [user, showToast]);
  
  return (
    <ChatProvider>
      <div className="p-4 h-[calc(100vh-4rem)]">
        <div className="flex flex-col h-full">
          <h1 className="text-2xl font-bold mb-4">Messages</h1>
          <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden">
            <ChatInterface />
          </div>
        </div>
      </div>
    </ChatProvider>
  );
};

export default ChatPage;
