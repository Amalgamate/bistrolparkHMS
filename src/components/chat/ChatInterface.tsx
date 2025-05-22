import React, { useState, useEffect, useRef } from 'react';
import { useChat, Chat, Message } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Plus,
  Phone,
  Video,
  Paperclip,
  Send,
  Smile,
  Mic,
  Image,
  File,
  X,
  MoreVertical,
  ChevronLeft,
  Check,
  CheckCheck,
  Clock,
  Edit,
  Trash2,
  Forward,
  Reply,
  AtSign,
  Monitor,
  Pin,
  BellOff,
  Archive,
  UserPlus,
  MessageSquare
} from 'lucide-react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import ChatList from './ChatList';
import MessageList from './MessageList';
import CallInterface from './CallInterface';
import NewChatDialog from './NewChatDialog';
import { formatDistanceToNow } from 'date-fns';

interface ChatInterfaceProps {
  className?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ className = '' }) => {
  const { user } = useAuth();
  const {
    chats,
    activeChat,
    messages,
    activeCall,
    setActiveChat,
    sendMessage,
    setUserTyping,
    initiateCall
  } = useChat();

  const [messageText, setMessageText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showNewChatDialog, setShowNewChatDialog] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileView, setIsMobileView] = useState(false);
  const [showChatList, setShowChatList] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowChatList(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Auto-focus message input when active chat changes
  useEffect(() => {
    if (activeChat && messageInputRef.current) {
      messageInputRef.current.focus();
    }

    // In mobile view, hide chat list when a chat is selected
    if (activeChat && isMobileView) {
      setShowChatList(false);
    }
  }, [activeChat, isMobileView]);

  // Handle typing indicator
  const handleTyping = () => {
    if (!activeChat) return;

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Send typing indicator
    setUserTyping(activeChat.id, true);

    // Set timeout to clear typing indicator after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      setUserTyping(activeChat.id, false);
    }, 2000);
  };

  // Handle message submission
  const handleSendMessage = () => {
    if (!activeChat || (!messageText.trim() && attachments.length === 0)) return;

    // Send message
    sendMessage(
      activeChat.id,
      messageText.trim(),
      'text',
      attachments
    );

    // Clear input
    setMessageText('');
    setAttachments([]);
    setShowAttachmentOptions(false);
    setShowEmojiPicker(false);

    // Clear typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setUserTyping(activeChat.id, false);
  };

  // Handle emoji selection
  const handleEmojiSelect = (emoji: any) => {
    setMessageText(prev => prev + emoji.native);
  };

  // Handle file attachment
  const handleFileAttachment = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      setAttachments(prev => [...prev, ...files]);

      // Reset file input
      event.target.value = '';
    }
  };

  // Handle attachment removal
  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Handle voice recording
  const handleVoiceRecording = () => {
    // Toggle recording state
    setIsRecording(!isRecording);

    // In a real implementation, this would start/stop recording
    // For now, we'll just simulate it
    if (!isRecording) {
      console.log('Started recording');
    } else {
      console.log('Stopped recording');
      // In a real implementation, this would add the recording to attachments
    }
  };

  // Handle call initiation
  const handleCall = (type: 'audio' | 'video') => {
    if (!activeChat) return;

    initiateCall(activeChat.id, type);
  };

  // Handle back button in mobile view
  const handleBackToList = () => {
    setShowChatList(true);
  };

  // Render attachment previews
  const renderAttachmentPreviews = () => {
    if (attachments.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-md">
        {attachments.map((file, index) => (
          <div key={index} className="relative">
            {file.type.startsWith('image/') ? (
              <div className="w-20 h-20 relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                  onClick={() => handleRemoveAttachment(index)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center bg-white p-2 rounded-md">
                <File className="w-4 h-4 mr-2 text-blue-500" />
                <span className="text-xs truncate max-w-[100px]">{file.name}</span>
                <button
                  className="ml-2 text-red-500"
                  onClick={() => handleRemoveAttachment(index)}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`flex h-full bg-white rounded-lg overflow-hidden ${className}`}>
      {/* Chat List */}
      {showChatList && (
        <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Messages</h2>
              <button
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                onClick={() => setShowNewChatDialog(true)}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <ChatList
            chats={chats}
            activeChat={activeChat}
            onSelectChat={setActiveChat}
            searchQuery={searchQuery}
          />
        </div>
      )}

      {/* Chat Area */}
      <div className={`${showChatList ? 'hidden' : 'flex'} md:flex flex-col flex-1`}>
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center">
              {isMobileView && (
                <button
                  className="p-2 mr-2 text-gray-600 hover:bg-gray-100 rounded-full"
                  onClick={handleBackToList}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <div className="flex-shrink-0 mr-3">
                {activeChat.avatar ? (
                  <img
                    src={activeChat.avatar}
                    alt={activeChat.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                    {activeChat.name.charAt(0)}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">{activeChat.name}</h3>
                <p className="text-xs text-gray-500">
                  {activeChat.type === 'direct' ? (
                    activeChat.participants.find(p => p.userId !== user?.id)?.isOnline ?
                      'Online' :
                      'Offline'
                  ) : (
                    `${activeChat.participants.length} participants`
                  )}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                  onClick={() => handleCall('audio')}
                >
                  <Phone className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                  onClick={() => handleCall('video')}
                >
                  <Video className="w-5 h-5" />
                </button>
                <div className="relative">
                  <button
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  {/* Dropdown menu would go here */}
                </div>
              </div>
            </div>

            {/* Message List */}
            <MessageList
              messages={messages.filter(m => m.chatId === activeChat.id)}
              currentUserId={user?.id || ''}
            />

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              {renderAttachmentPreviews()}

              <div className="flex items-end">
                <div className="flex-shrink-0 flex space-x-1">
                  <div className="relative">
                    <button
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                      onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                    >
                      <Paperclip className="w-5 h-5" />
                    </button>

                    {showAttachmentOptions && (
                      <div className="absolute bottom-full left-0 mb-2 bg-white shadow-lg rounded-lg p-2 flex space-x-2">
                        <button
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                          onClick={() => imageInputRef.current?.click()}
                        >
                          <Image className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <File className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-full"
                          onClick={() => {/* Screen recording would go here */}}
                        >
                          <Monitor className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleFileAttachment}
                      multiple
                    />
                    <input
                      type="file"
                      ref={imageInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileAttachment}
                      multiple
                    />
                  </div>

                  <div className="relative">
                    <button
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile className="w-5 h-5" />
                    </button>

                    {showEmojiPicker && (
                      <div className="absolute bottom-full right-0 mb-2">
                        <Picker
                          data={data}
                          onEmojiSelect={handleEmojiSelect}
                          theme="light"
                          set="apple"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    className={`p-2 ${isRecording ? 'text-red-600 bg-red-50' : 'text-gray-600 hover:bg-gray-100'} rounded-full`}
                    onClick={handleVoiceRecording}
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>

                <textarea
                  ref={messageInputRef}
                  className="flex-1 mx-2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Type a message..."
                  rows={1}
                  value={messageText}
                  onChange={(e) => {
                    setMessageText(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />

                <button
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 flex-shrink-0"
                  onClick={handleSendMessage}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
            <p className="text-gray-500 mb-4">Send private messages to colleagues and patients</p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => setShowNewChatDialog(true)}
            >
              Start a Conversation
            </button>
          </div>
        )}
      </div>

      {/* Active Call Interface */}
      {activeCall && <CallInterface call={activeCall} />}

      {/* New Chat Dialog */}
      {showNewChatDialog && (
        <NewChatDialog onClose={() => setShowNewChatDialog(false)} />
      )}
    </div>
  );
};

export default ChatInterface;
