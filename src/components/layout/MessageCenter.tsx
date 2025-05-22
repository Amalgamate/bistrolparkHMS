import React, { useState, useEffect, useRef } from 'react';
import {
  X, Send, Search, Smile, Paperclip, AtSign, Phone, Video,
  Calendar, Mail, MessageSquare
} from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import webSocketService from '../../services/WebSocketService';

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface MessageCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessageCenter: React.FC<MessageCenterProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const {
    messages: chatMessages,
    sendMessage,
    chats,
    createChat
  } = useChat();

  // Convert chat messages to the format expected by this component
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'Dr. Sarah Williams',
      content: 'Patient in Room 302 needs immediate attention',
      timestamp: new Date(2024, 0, 6, 14, 30),
      read: false
    },
    {
      id: '2',
      sender: 'Nurse Johnson',
      content: 'Lab results for patient #BR263585643 are ready',
      timestamp: new Date(2024, 0, 6, 14, 15),
      read: true
    }
  ]);

  // Update messages when chatMessages changes
  useEffect(() => {
    if (chatMessages.length > 0) {
      // Get the most recent messages from each chat
      const recentMessages = chats.map(chat => {
        const chatMsgs = chatMessages.filter(m => m.chatId === chat.id);
        return chatMsgs.length > 0 ? chatMsgs[chatMsgs.length - 1] : null;
      }).filter(m => m !== null);

      // Convert to the format expected by this component
      const formattedMessages = recentMessages.map(m => ({
        id: m!.id,
        sender: m!.senderName,
        content: m!.content,
        timestamp: new Date(m!.timestamp),
        read: m!.read
      }));

      // Add external messages
      const externalMessages = chatMessages
        .filter(m => m.type === 'external' || m.externalSource)
        .map(m => ({
          id: m.id,
          sender: m.externalSource ? `${m.senderName} (${m.externalSource})` : m.senderName,
          content: m.content,
          timestamp: new Date(m.timestamp),
          read: m.read
        }));

      // Combine and sort by timestamp (newest first)
      const allMessages = [...formattedMessages, ...externalMessages]
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      // Take the 10 most recent messages
      setMessages(allMessages.slice(0, 10));
    }
  }, [chatMessages, chats]);

  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('all');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [showMentionList, setShowMentionList] = useState(false);
  const [activeView, setActiveView] = useState<'messages' | 'appointments' | 'history'>('messages');
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const attachmentOptionsRef = useRef<HTMLDivElement>(null);
  const mentionListRef = useRef<HTMLDivElement>(null);

  // Close pickers when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (attachmentOptionsRef.current && !attachmentOptionsRef.current.contains(event.target as Node)) {
        setShowAttachmentOptions(false);
      }
      if (mentionListRef.current && !mentionListRef.current.contains(event.target as Node)) {
        setShowMentionList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle emoji selection
  const handleEmojiSelect = (emoji: any) => {
    setNewMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  // Handle @mention
  const handleAtMention = () => {
    setShowMentionList(!showMentionList);
  };

  // Handle attachment
  const handleAttachment = () => {
    setShowAttachmentOptions(!showAttachmentOptions);
  };

  // Handle voice call
  const handleVoiceCall = () => {
    if (selectedRecipient === 'all' || selectedRecipient === 'external') {
      // Can't call all users or external services
      console.log('Cannot initiate voice call to multiple recipients or external services');
      return;
    }

    // Find the chat with the selected recipient
    const chat = chats.find(c =>
      c.type === 'direct' &&
      c.participants.some(p => p.userId === selectedRecipient)
    );

    if (chat && user) {
      // Get the participant
      const participant = chat.participants.find(p => p.userId === selectedRecipient);

      if (participant) {
        // Generate a call ID
        const callId = `call_${Date.now()}`;

        // Notify the recipient
        webSocketService.notifyCallInitiated(
          callId,
          chat.id,
          user.id,
          user.name || user.username || 'User',
          participant.userId,
          participant.name,
          'audio'
        );

        // In a real implementation, this would open a call interface
        console.log(`Voice call initiated to ${participant.name}`);

        // Listen for call setup event
        webSocketService.on('call:setup', (data) => {
          console.log('Call setup:', data);
          // In a real implementation, this would initialize WebRTC
        });
      }
    }
  };

  // Handle video call
  const handleVideoCall = () => {
    if (selectedRecipient === 'all' || selectedRecipient === 'external') {
      // Can't call all users or external services
      console.log('Cannot initiate video call to multiple recipients or external services');
      return;
    }

    // Find the chat with the selected recipient
    const chat = chats.find(c =>
      c.type === 'direct' &&
      c.participants.some(p => p.userId === selectedRecipient)
    );

    if (chat && user) {
      // Get the participant
      const participant = chat.participants.find(p => p.userId === selectedRecipient);

      if (participant) {
        // Generate a call ID
        const callId = `call_${Date.now()}`;

        // Notify the recipient
        webSocketService.notifyCallInitiated(
          callId,
          chat.id,
          user.id,
          user.name || user.username || 'User',
          participant.userId,
          participant.name,
          'video'
        );

        // In a real implementation, this would open a call interface
        console.log(`Video call initiated to ${participant.name}`);

        // Listen for call setup event
        webSocketService.on('call:setup', (data) => {
          console.log('Call setup:', data);
          // In a real implementation, this would initialize WebRTC
        });
      }
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      if (selectedRecipient === 'all') {
        // Broadcast message to all staff
        // Find or create a broadcast chat
        let broadcastChat = chats.find(c => c.type === 'group' && c.name === 'Broadcast');

        if (!broadcastChat && user) {
          // Create a broadcast chat if it doesn't exist
          const chatId = createChat('group', 'Broadcast', [], user.id);
          broadcastChat = chats.find(c => c.id === chatId);
        }

        if (broadcastChat && user) {
          sendMessage(broadcastChat.id, newMessage.trim(), 'text');
        }
      } else if (selectedRecipient === 'external') {
        // Show a dropdown or modal to select which external service to send to
        // For now, we'll just find the first external chat
        let externalChat = chats.find(c => c.type === 'external');

        if (externalChat && user) {
          // Find the external participant
          const externalParticipant = externalChat.participants.find(p => p.userId.startsWith('tawkto_'));

          if (externalParticipant) {
            sendMessage(externalChat.id, newMessage.trim(), 'text');
          } else {
            console.error('No external participant found in the external chat');
            // In a real implementation, you would show an error message to the user
          }
        } else {
          console.error('No external chat found');
          // In a real implementation, you would show an error message to the user
        }
      } else {
        // Send direct message to selected recipient
        // Find or create a direct chat with the recipient
        let directChat = chats.find(c =>
          c.type === 'direct' &&
          c.participants.some(p => p.userId === selectedRecipient)
        );

        if (!directChat && user) {
          // Create a direct chat if it doesn't exist
          const chatId = createChat('direct', '', [{ userId: selectedRecipient, name: 'Recipient' }], user.id);
          directChat = chats.find(c => c.id === chatId);
        }

        if (directChat && user) {
          sendMessage(directChat.id, newMessage.trim(), 'text');
        }
      }

      setNewMessage('');
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-[999]"
          onClick={onClose}
        />
      )}

      {/* Message Panel */}
      <div
        className={`fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-[1000] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
      <div className="flex flex-col h-full">
        <div className="flex flex-col border-b">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-semibold text-[#2B4F60]">
              {activeView === 'messages' && 'Messages'}
              {activeView === 'appointments' && 'Appointments'}
              {activeView === 'history' && 'Chat History'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex border-t">
            <button
              onClick={() => setActiveView('messages')}
              className={`flex-1 py-3 flex items-center justify-center ${
                activeView === 'messages'
                  ? 'text-[#2B4F60] border-b-2 border-[#2B4F60]'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <MessageSquare className="w-5 h-5 mr-1" />
              <span className="text-sm">Messages</span>
            </button>

            <button
              onClick={() => setActiveView('appointments')}
              className={`flex-1 py-3 flex items-center justify-center ${
                activeView === 'appointments'
                  ? 'text-[#2B4F60] border-b-2 border-[#2B4F60]'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-5 h-5 mr-1" />
              <span className="text-sm">Appointments</span>
            </button>

            <button
              onClick={() => setActiveView('history')}
              className={`flex-1 py-3 flex items-center justify-center ${
                activeView === 'history'
                  ? 'text-[#2B4F60] border-b-2 border-[#2B4F60]'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <Mail className="w-5 h-5 mr-1" />
              <span className="text-sm">History</span>
            </button>
          </div>
        </div>

        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#A5C4D4] focus:border-[#A5C4D4]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Messages View */}
          {activeView === 'messages' && (
            <>
              {messages
                .filter(message =>
                  searchTerm === '' ||
                  message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  message.sender.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.read ? 'bg-gray-50' : 'bg-[#E6F3F7]'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-[#2B4F60]">{message.sender}</span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{message.content}</p>
                  </div>
                ))}
              {messages.filter(message =>
                searchTerm === '' ||
                message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                message.sender.toLowerCase().includes(searchTerm.toLowerCase())
              ).length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  {searchTerm ? 'No messages match your search' : 'No messages yet'}
                </div>
              )}
            </>
          )}

          {/* Appointments View */}
          {activeView === 'appointments' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-[#2B4F60]">Upcoming Appointments</h3>
                <button className="text-sm text-blue-600 hover:underline">
                  + New Appointment
                </button>
              </div>

              {/* Sample appointments - would be fetched from API in real implementation */}
              <div className="p-3 rounded-lg bg-white border border-gray-200">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-[#2B4F60]">Dr. Sarah Williams</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    Confirmed
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">Patient: John Doe</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>Tomorrow, 10:00 AM</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-white border border-gray-200">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-[#2B4F60]">Lab Test</span>
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                    Pending
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-2">Patient: Jane Smith</p>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>Friday, 2:30 PM</span>
                </div>
              </div>
            </div>
          )}

          {/* Chat History View */}
          {activeView === 'history' && (
            <div className="space-y-4">
              <div className="mb-4">
                <h3 className="font-medium text-[#2B4F60] mb-2">Recent Conversations</h3>
                <p className="text-xs text-gray-500">
                  Select a conversation to continue chatting
                </p>
              </div>

              {/* Sample chat history - would be fetched from API in real implementation */}
              {chats.map(chat => {
                // Get the last message from this chat
                const chatMessages = messages.filter(m =>
                  m.id === chat.id ||
                  (chat.lastMessage && m.id === chat.lastMessage.id)
                );
                const lastMessage = chatMessages.length > 0
                  ? chatMessages[0]
                  : chat.lastMessage
                    ? {
                        sender: chat.lastMessage.senderName,
                        content: chat.lastMessage.content,
                        timestamp: new Date(chat.lastMessage.timestamp)
                      }
                    : null;

                if (!lastMessage) return null;

                return (
                  <div
                    key={chat.id}
                    className="p-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      // In a real implementation, this would open the chat
                      console.log('Opening chat:', chat.id);
                    }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-[#2B4F60]">{chat.name}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(lastMessage.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 truncate">
                      {lastMessage.content}
                    </p>
                  </div>
                );
              })}

              {chats.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No conversations yet
                </div>
              )}
            </div>
          )}
        </div>

        {/* Message Input - Only show in Messages view */}
        {activeView === 'messages' && (
          <div className="p-4 border-t">
            <div className="mb-2">
              <select
                value={selectedRecipient}
                onChange={(e) => setSelectedRecipient(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#A5C4D4] focus:border-[#A5C4D4]"
              >
                <option value="all">Broadcast to All Staff</option>
                {chats
                  .filter(chat => chat.type === 'direct')
                  .map(chat => {
                    const participant = chat.participants.find(p => p.userId !== user?.id);
                    return participant ? (
                      <option key={chat.id} value={participant.userId}>
                        {participant.name}
                      </option>
                    ) : null;
                  })
                }
                <option value="external">External Contacts</option>
              </select>
            </div>
            <div className="flex items-center mb-2 space-x-2">
              <button
                onClick={handleVoiceCall}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none"
                title="Voice Call"
              >
                <Phone className="w-5 h-5" />
              </button>
              <button
                onClick={handleVideoCall}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full focus:outline-none"
                title="Video Call"
              >
                <Video className="w-5 h-5" />
              </button>
            </div>

            <div className="flex space-x-2 relative">
              <div className="flex-1 flex items-center relative border border-gray-300 rounded-md focus-within:ring-1 focus-within:ring-[#A5C4D4] focus-within:border-[#A5C4D4]">
                <button
                  onClick={handleAtMention}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  title="Mention someone"
                >
                  <AtSign className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-2 py-2 focus:outline-none"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />

                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  title="Add emoji"
                >
                  <Smile className="w-5 h-5" />
                </button>

                <button
                  onClick={handleAttachment}
                  className="p-2 text-gray-500 hover:text-gray-700"
                  title="Add attachment"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>

              <button
                onClick={handleSendMessage}
                className="p-2 text-white bg-[#2B4F60] rounded-md hover:bg-[#1e3b4a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A5C4D4]"
                disabled={!newMessage.trim()}
              >
                <Send className="w-5 h-5" />
              </button>

              {/* Emoji Picker */}
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  className="absolute bottom-full right-0 mb-2"
                >
                  <Picker
                    data={data}
                    onEmojiSelect={handleEmojiSelect}
                    theme="light"
                    set="apple"
                  />
                </div>
              )}

              {/* Attachment Options */}
              {showAttachmentOptions && (
                <div
                  ref={attachmentOptionsRef}
                  className="absolute bottom-full right-12 mb-2 bg-white rounded-lg shadow-lg p-2 w-48"
                >
                  <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
                    📷 Image
                  </div>
                  <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
                    📁 Document
                  </div>
                  <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
                    🎥 Video
                  </div>
                  <div className="p-2 hover:bg-gray-100 rounded cursor-pointer">
                    🎤 Audio
                  </div>
                </div>
              )}

              {/* Mention List */}
              {showMentionList && (
                <div
                  ref={mentionListRef}
                  className="absolute bottom-full left-0 mb-2 bg-white rounded-lg shadow-lg p-2 w-48"
                >
                  {chats
                    .filter(chat => chat.type === 'direct')
                    .map(chat => {
                      const participant = chat.participants.find(p => p.userId !== user?.id);
                      return participant ? (
                        <div
                          key={chat.id}
                          className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                          onClick={() => {
                            setNewMessage(prev => prev + `@${participant.name} `);
                            setShowMentionList(false);
                          }}
                        >
                          @{participant.name}
                        </div>
                      ) : null;
                    })
                  }
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appointments View Footer */}
        {activeView === 'appointments' && (
          <div className="p-4 border-t">
            <button className="w-full py-2 bg-[#2B4F60] text-white rounded-md hover:bg-[#1e3b4a] focus:outline-none">
              Manage Appointments
            </button>
          </div>
        )}

        {/* Chat History View Footer */}
        {activeView === 'history' && (
          <div className="p-4 border-t">
            <button className="w-full py-2 bg-[#2B4F60] text-white rounded-md hover:bg-[#1e3b4a] focus:outline-none">
              Start New Conversation
            </button>
          </div>
        )}
      </div>
    </div>
    </>
  );
};