import React from 'react';
import { Message } from '../../context/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '../ui/badge';

interface ExternalMessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
}

const ExternalMessageBubble: React.FC<ExternalMessageBubbleProps> = ({ message, isCurrentUser }) => {
  const formattedTime = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });

  // Determine the source icon and color
  let sourceIcon = '🌐';
  let sourceColor = 'bg-blue-500';
  let sourceName = message.externalSource || 'External';

  if (message.externalSource === 'tawkto') {
    sourceIcon = '💬';
    sourceColor = 'bg-green-500';
    sourceName = 'Tawk.to';
  } else if (message.externalSource === 'whatsapp') {
    sourceIcon = '📱';
    sourceColor = 'bg-green-600';
    sourceName = 'WhatsApp';
  }

  return (
    <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <div className={`h-8 w-8 mr-2 rounded-full flex items-center justify-center ${sourceColor}`}>
          {message.senderAvatar ? (
            <img src={message.senderAvatar} alt={message.senderName} className="w-full h-full rounded-full" />
          ) : (
            <span>{sourceIcon}</span>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex items-center mb-1">
            <span className={`text-sm font-medium ${isCurrentUser ? 'mr-1' : 'ml-1'}`}>
              {message.senderName}
            </span>
            <Badge variant="outline" className="ml-1 text-xs">
              {sourceName}
            </Badge>
          </div>

          <div className={`rounded-lg px-4 py-2 ${
            isCurrentUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted'
          }`}>
            {message.content}
          </div>

          <div className={`text-xs text-muted-foreground mt-1 ${
            isCurrentUser ? 'text-right' : 'text-left'
          }`}>
            {formattedTime}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalMessageBubble;
