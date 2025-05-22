import React from 'react';
import { Chat } from '../../context/ChatContext';
import { formatDistanceToNow } from 'date-fns';
import { Pin, BellOff, CheckCheck, Clock } from 'lucide-react';

interface ChatListProps {
  chats: Chat[];
  activeChat: Chat | null;
  onSelectChat: (chatId: string) => void;
  searchQuery?: string;
}

const ChatList: React.FC<ChatListProps> = ({ 
  chats, 
  activeChat, 
  onSelectChat,
  searchQuery = ''
}) => {
  // Filter chats based on search query
  const filteredChats = searchQuery.trim() 
    ? chats.filter(chat => 
        chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        chat.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chats;
  
  // Sort chats: pinned first, then by last message date
  const sortedChats = [...filteredChats].sort((a, b) => {
    // Pinned chats first
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    // Then by last message date
    const aDate = a.lastMessage ? new Date(a.lastMessage.timestamp) : new Date(a.updatedAt);
    const bDate = b.lastMessage ? new Date(b.lastMessage.timestamp) : new Date(b.updatedAt);
    
    return bDate.getTime() - aDate.getTime();
  });
  
  // Group chats by date
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayChats = sortedChats.filter(chat => {
    const date = chat.lastMessage 
      ? new Date(chat.lastMessage.timestamp) 
      : new Date(chat.updatedAt);
    return date.toDateString() === today.toDateString();
  });
  
  const yesterdayChats = sortedChats.filter(chat => {
    const date = chat.lastMessage 
      ? new Date(chat.lastMessage.timestamp) 
      : new Date(chat.updatedAt);
    return date.toDateString() === yesterday.toDateString();
  });
  
  const olderChats = sortedChats.filter(chat => {
    const date = chat.lastMessage 
      ? new Date(chat.lastMessage.timestamp) 
      : new Date(chat.updatedAt);
    return date.toDateString() !== today.toDateString() && 
           date.toDateString() !== yesterday.toDateString();
  });
  
  // Render a chat item
  const renderChatItem = (chat: Chat) => {
    const isActive = activeChat?.id === chat.id;
    const lastMessageDate = chat.lastMessage 
      ? new Date(chat.lastMessage.timestamp) 
      : new Date(chat.updatedAt);
    
    return (
      <div 
        key={chat.id}
        className={`
          p-3 flex items-center cursor-pointer transition-colors
          ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}
          ${chat.unreadCount > 0 ? 'font-semibold' : ''}
        `}
        onClick={() => onSelectChat(chat.id)}
      >
        <div className="relative flex-shrink-0 mr-3">
          {chat.avatar ? (
            <img 
              src={chat.avatar} 
              alt={chat.name} 
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              {chat.name.charAt(0)}
            </div>
          )}
          
          {chat.type === 'direct' && chat.participants.some(p => p.isOnline) && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="font-medium truncate">{chat.name}</h3>
            <div className="flex items-center text-xs text-gray-500">
              {chat.pinned && <Pin className="w-3 h-3 mr-1" />}
              {chat.muted && <BellOff className="w-3 h-3 mr-1" />}
              <span>{formatDistanceToNow(lastMessageDate, { addSuffix: false })}</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600 truncate max-w-[180px]">
              {chat.lastMessage ? (
                <>
                  {chat.lastMessage.senderId !== 'user1' && `${chat.lastMessage.senderName}: `}
                  {chat.lastMessage.content}
                </>
              ) : (
                <span className="text-gray-400 italic">No messages yet</span>
              )}
            </p>
            
            <div className="flex items-center">
              {chat.lastMessage && chat.lastMessage.senderId === 'user1' && (
                <div className="mr-1 text-xs">
                  {chat.lastMessage.read ? (
                    <CheckCheck className="w-3 h-3 text-blue-500" />
                  ) : (
                    <Clock className="w-3 h-3 text-gray-400" />
                  )}
                </div>
              )}
              
              {chat.unreadCount > 0 && (
                <div className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render a section of chats with a header
  const renderChatSection = (title: string, chats: Chat[]) => {
    if (chats.length === 0) return null;
    
    return (
      <div>
        <div className="px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500">
          {title}
        </div>
        {chats.map(renderChatItem)}
      </div>
    );
  };
  
  return (
    <div className="flex-1 overflow-y-auto">
      {filteredChats.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          {searchQuery ? 'No chats match your search' : 'No chats yet'}
        </div>
      ) : (
        <>
          {renderChatSection('Today', todayChats)}
          {renderChatSection('Yesterday', yesterdayChats)}
          {renderChatSection('Older', olderChats)}
        </>
      )}
    </div>
  );
};

export default ChatList;
