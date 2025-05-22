import React, { useRef, useEffect, useState } from 'react';
import { Message, Reaction } from '../../context/ChatContext';
import { format } from 'date-fns';
import {
  CheckCheck,
  Clock,
  MoreVertical,
  Reply,
  Smile,
  Edit,
  Trash2,
  Forward,
  Download,
  ExternalLink,
  File,
  Image as ImageIcon,
  FileText,
  Film,
  Music,
  AtSign
} from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import ExternalMessageBubble from './ExternalMessageBubble';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Group messages by date
  const groupedMessages: { [date: string]: Message[] } = {};

  messages.forEach(message => {
    const date = new Date(message.timestamp).toDateString();
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  // Format date for display
  const formatMessageDate = (date: string) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(messageDate, 'MMMM d, yyyy');
    }
  };

  // Handle message selection
  const toggleMessageSelection = (messageId: string) => {
    setSelectedMessage(prev => prev === messageId ? null : messageId);
    // Close emoji picker if open
    setShowEmojiPicker(null);
  };

  // Handle emoji picker
  const toggleEmojiPicker = (messageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEmojiPicker(prev => prev === messageId ? null : messageId);
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: any, messageId: string) => {
    console.log(`Selected emoji ${emoji.native} for message ${messageId}`);
    // In a real implementation, this would call reactToMessage
    setShowEmojiPicker(null);
  };

  // Render file attachment
  const renderAttachment = (attachment: any) => {
    const fileType = attachment.type.split('/')[0];

    switch (fileType) {
      case 'image':
        return (
          <div className="mt-2 relative group">
            <img
              src={attachment.url}
              alt={attachment.name}
              className="max-w-xs rounded-lg max-h-60 object-contain bg-gray-100"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <button className="p-2 bg-white rounded-full shadow-lg mx-1">
                <Download className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white rounded-full shadow-lg mx-1">
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      case 'video':
        return (
          <div className="mt-2 bg-gray-100 rounded-lg p-3 flex items-center">
            <Film className="w-8 h-8 text-blue-500 mr-3" />
            <div className="flex-1">
              <p className="font-medium text-sm">{attachment.name}</p>
              <p className="text-xs text-gray-500">{(attachment.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
              <Download className="w-4 h-4" />
            </button>
          </div>
        );
      case 'audio':
        return (
          <div className="mt-2 bg-gray-100 rounded-lg p-3 flex items-center">
            <Music className="w-8 h-8 text-purple-500 mr-3" />
            <div className="flex-1">
              <p className="font-medium text-sm">{attachment.name}</p>
              <p className="text-xs text-gray-500">{(attachment.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
              <Download className="w-4 h-4" />
            </button>
          </div>
        );
      case 'application':
        const isPdf = attachment.type === 'application/pdf';
        return (
          <div className="mt-2 bg-gray-100 rounded-lg p-3 flex items-center">
            {isPdf ? (
              <FileText className="w-8 h-8 text-red-500 mr-3" />
            ) : (
              <File className="w-8 h-8 text-blue-500 mr-3" />
            )}
            <div className="flex-1">
              <p className="font-medium text-sm">{attachment.name}</p>
              <p className="text-xs text-gray-500">{(attachment.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
              <Download className="w-4 h-4" />
            </button>
          </div>
        );
      default:
        return (
          <div className="mt-2 bg-gray-100 rounded-lg p-3 flex items-center">
            <File className="w-8 h-8 text-gray-500 mr-3" />
            <div className="flex-1">
              <p className="font-medium text-sm">{attachment.name}</p>
              <p className="text-xs text-gray-500">{(attachment.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full">
              <Download className="w-4 h-4" />
            </button>
          </div>
        );
    }
  };

  // Render reactions
  const renderReactions = (reactions: Reaction[]) => {
    if (!reactions || reactions.length === 0) return null;

    // Group reactions by emoji
    const groupedReactions: { [emoji: string]: number } = {};
    reactions.forEach(reaction => {
      if (!groupedReactions[reaction.emoji]) {
        groupedReactions[reaction.emoji] = 0;
      }
      groupedReactions[reaction.emoji]++;
    });

    return (
      <div className="flex flex-wrap mt-1 gap-1">
        {Object.entries(groupedReactions).map(([emoji, count]) => (
          <div
            key={emoji}
            className="bg-gray-100 rounded-full px-2 py-0.5 text-xs flex items-center"
          >
            <span className="mr-1">{emoji}</span>
            <span className="text-gray-600">{count}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render a message
  const renderMessage = (message: Message) => {
    const isCurrentUser = message.senderId === currentUserId;
    const showAvatar = !isCurrentUser;

    // Handle external messages differently
    if (message.type === 'external' || message.externalSource) {
      return <ExternalMessageBubble key={message.id} message={message} isCurrentUser={isCurrentUser} />;
    }

    return (
      <div
        key={message.id}
        className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
      >
        {showAvatar && (
          <div className="flex-shrink-0 mr-3">
            {message.senderAvatar ? (
              <img
                src={message.senderAvatar}
                alt={message.senderName}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xs">
                {message.senderName.charAt(0)}
              </div>
            )}
          </div>
        )}

        <div className={`max-w-[70%] ${isCurrentUser ? 'order-1' : 'order-2'}`}>
          {!isCurrentUser && (
            <div className="text-xs text-gray-500 mb-1">{message.senderName}</div>
          )}

          <div
            className={`relative group ${selectedMessage === message.id ? 'bg-blue-50' : ''}`}
            onClick={() => toggleMessageSelection(message.id)}
          >
            <div
              className={`
                p-3 rounded-lg break-words
                ${isCurrentUser
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
                }
              `}
            >
              {message.replyTo && (
                <div
                  className={`
                    text-xs p-2 rounded mb-2 border-l-2
                    ${isCurrentUser
                      ? 'bg-blue-600 border-blue-300'
                      : 'bg-gray-200 border-gray-400'
                    }
                  `}
                >
                  <div className="flex items-center mb-1">
                    <Reply className="w-3 h-3 mr-1" />
                    <span className="font-medium">Reply to {message.senderName}</span>
                  </div>
                  <p className="truncate">Original message text here...</p>
                </div>
              )}

              <p>{message.content}</p>

              {message.attachments && message.attachments.map((attachment, index) => (
                <div key={index}>
                  {renderAttachment(attachment)}
                </div>
              ))}

              {message.edited && (
                <span className="text-xs opacity-70 ml-1">(edited)</span>
              )}
            </div>

            {renderReactions(message.reactions || [])}

            <div
              className={`
                absolute ${isCurrentUser ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'}
                top-0 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity
                ${selectedMessage === message.id ? 'opacity-100' : ''}
              `}
            >
              <button
                className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100"
                onClick={(e) => toggleEmojiPicker(message.id, e)}
              >
                <Smile className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100">
                <Reply className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100">
                <Forward className="w-4 h-4 text-gray-600" />
              </button>
              {isCurrentUser && (
                <>
                  <button className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-100">
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>
                </>
              )}
            </div>

            {showEmojiPicker === message.id && (
              <div
                className={`absolute ${isCurrentUser ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-8 z-10`}
                onClick={(e) => e.stopPropagation()}
              >
                <Picker
                  data={data}
                  onEmojiSelect={(emoji: any) => handleEmojiSelect(emoji, message.id)}
                  theme="light"
                  set="apple"
                />
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 mt-1 flex items-center">
            <span>{format(new Date(message.timestamp), 'h:mm a')}</span>
            {isCurrentUser && (
              <div className="ml-1">
                {message.read ? (
                  <CheckCheck className="w-3 h-3 text-blue-500" />
                ) : (
                  <Clock className="w-3 h-3" />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="flex justify-center mb-4">
            <div className="bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-full">
              {formatMessageDate(date)}
            </div>
          </div>
          {dateMessages.map(renderMessage)}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
