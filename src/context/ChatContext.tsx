import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import webSocketService from '../services/WebSocketService';
import externalChatService from '../services/ExternalChatService';

// Types
export type MessageType = 'text' | 'image' | 'file' | 'video' | 'audio' | 'location' | 'contact' | 'external';
export type CallType = 'audio' | 'video';
export type CallStatus = 'ringing' | 'ongoing' | 'ended' | 'missed' | 'rejected';
export type ChatType = 'direct' | 'group' | 'broadcast' | 'external';

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
  thumbnailUrl?: string;
}

export interface Reaction {
  emoji: string;
  userId: string;
  timestamp: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: MessageType;
  timestamp: string;
  read: boolean;
  readBy?: { userId: string; timestamp: string }[];
  edited: boolean;
  editedAt?: string;
  replyTo?: string;
  attachments?: Attachment[];
  reactions?: Reaction[];
  mentions?: string[]; // User IDs that were mentioned
  isForwarded?: boolean;
  externalSource?: string; // Source of external message (e.g., 'tawkto')
  externalUserId?: string; // External user ID
  externalChatId?: string; // External chat ID
}

export interface ChatParticipant {
  userId: string;
  name: string;
  avatar?: string;
  role?: 'admin' | 'member';
  lastSeen?: string;
  isOnline?: boolean;
  isTyping?: boolean;
}

export interface Chat {
  id: string;
  type: ChatType;
  name: string;
  avatar?: string;
  participants: ChatParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  muted: boolean;
  archived: boolean;
}

export interface Call {
  id: string;
  chatId: string;
  callerId: string;
  callerName: string;
  callerAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  type: CallType;
  status: CallStatus;
  startTime: string;
  endTime?: string;
  duration?: number;
}

// Context type
interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  messages: Message[];
  calls: Call[];
  activeCall: Call | null;
  isLoading: boolean;

  // Chat management
  setActiveChat: (chatId: string | null) => void;
  createChat: (participants: string[], name?: string, type?: ChatType) => Promise<Chat>;
  updateChat: (chatId: string, updates: Partial<Chat>) => Promise<Chat>;
  deleteChat: (chatId: string) => Promise<boolean>;
  pinChat: (chatId: string, pinned: boolean) => Promise<boolean>;
  muteChat: (chatId: string, muted: boolean) => Promise<boolean>;
  archiveChat: (chatId: string, archived: boolean) => Promise<boolean>;

  // Message management
  sendMessage: (chatId: string, content: string, type?: MessageType, attachments?: File[], replyTo?: string, mentions?: string[]) => Promise<Message>;
  editMessage: (messageId: string, content: string) => Promise<Message>;
  deleteMessage: (messageId: string) => Promise<boolean>;
  markAsRead: (messageId: string) => Promise<boolean>;
  markChatAsRead: (chatId: string) => Promise<boolean>;
  reactToMessage: (messageId: string, emoji: string) => Promise<boolean>;
  forwardMessage: (messageId: string, chatIds: string[]) => Promise<boolean>;

  // Call management
  initiateCall: (chatId: string, type: CallType) => Promise<Call>;
  answerCall: (callId: string) => Promise<boolean>;
  rejectCall: (callId: string) => Promise<boolean>;
  endCall: (callId: string) => Promise<boolean>;

  // User status
  setUserTyping: (chatId: string, isTyping: boolean) => void;

  // Utility functions
  searchMessages: (query: string) => Message[];
  searchChats: (query: string) => Chat[];
  getParticipantById: (userId: string) => ChatParticipant | undefined;

  // External integrations
  sendWhatsAppMessage: (phoneNumber: string, message: string) => Promise<boolean>;
  handleExternalMessage: (externalMessage: {
    id: string;
    externalChatId: string;
    externalUserId: string;
    senderName: string;
    content: string;
    source: string;
    timestamp: string;
  }) => Promise<Message>;
}

// Create context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Helper functions for local storage
const CHATS_STORAGE_KEY = 'bristol_park_chats';
const MESSAGES_STORAGE_KEY = 'bristol_park_messages';

// Load chats from local storage
const loadChatsFromStorage = (): Chat[] => {
  try {
    const storedChats = localStorage.getItem(CHATS_STORAGE_KEY);
    if (storedChats) {
      return JSON.parse(storedChats);
    }
  } catch (error) {
    console.error('Error loading chats from storage:', error);
  }
  return [];
};

// Load messages from local storage
const loadMessagesFromStorage = (): Message[] => {
  try {
    const storedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);
    if (storedMessages) {
      return JSON.parse(storedMessages);
    }
  } catch (error) {
    console.error('Error loading messages from storage:', error);
  }
  return [];
};

// Save chats to local storage
const saveChatsToStorage = (chats: Chat[]): void => {
  try {
    localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error('Error saving chats to storage:', error);
  }
};

// Save messages to local storage
const saveMessagesToStorage = (messages: Message[]): void => {
  try {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error('Error saving messages to storage:', error);
  }
};

// Provider component
export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChatState] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize chat data when user is authenticated
  useEffect(() => {
    if (user) {
      // Load chats and messages from local storage
      console.log('Initializing chat data for user:', user.id);
      const storedChats = loadChatsFromStorage();
      const storedMessages = loadMessagesFromStorage();

      setChats(storedChats);
      setMessages(storedMessages);
    }
  }, [user]);

  // Set active chat
  const setActiveChat = (chatId: string | null) => {
    if (!chatId) {
      setActiveChatState(null);
      return;
    }

    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setActiveChatState(chat);
      // Mark all messages in this chat as read
      markChatAsRead(chatId);
    } else {
      console.error(`Chat with ID ${chatId} not found`);
    }
  };

  // Create a new chat
  const createChat = async (participants: string[], name?: string, type: ChatType = 'direct'): Promise<Chat> => {
    setIsLoading(true);

    try {
      // In a real implementation, this would call an API
      const newChat: Chat = {
        id: uuidv4(),
        type,
        name: name || (type === 'direct' ? 'New Conversation' : 'New Group'),
        participants: participants.map(userId => ({
          userId,
          name: `User ${userId}`, // In a real app, you'd fetch user details
          isOnline: false,
        })),
        unreadCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        pinned: false,
        muted: false,
        archived: false,
      };

      const updatedChats = [newChat, ...chats];
      setChats(updatedChats);
      saveChatsToStorage(updatedChats);
      setActiveChat(newChat.id);

      showToast({
        title: "Chat Created",
        description: `${newChat.name} chat has been created successfully.`,
        variant: "default",
      });

      return newChat;
    } catch (error) {
      console.error('Error creating chat:', error);
      showToast({
        title: "Error",
        description: "Failed to create chat. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a chat
  const updateChat = async (chatId: string, updates: Partial<Chat>): Promise<Chat> => {
    setIsLoading(true);

    try {
      // In a real implementation, this would call an API
      const updatedChats = chats.map(chat => {
        if (chat.id === chatId) {
          return { ...chat, ...updates, updatedAt: new Date().toISOString() };
        }
        return chat;
      });

      setChats(updatedChats);
      saveChatsToStorage(updatedChats);

      const updatedChat = updatedChats.find(c => c.id === chatId);
      if (!updatedChat) {
        throw new Error(`Chat with ID ${chatId} not found`);
      }

      // Update active chat if it's the one being updated
      if (activeChat?.id === chatId) {
        setActiveChatState(updatedChat);
      }

      return updatedChat;
    } catch (error) {
      console.error('Error updating chat:', error);
      showToast({
        title: "Error",
        description: "Failed to update chat. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a chat
  const deleteChat = async (chatId: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // In a real implementation, this would call an API
      const updatedChats = chats.filter(chat => chat.id !== chatId);
      setChats(updatedChats);
      saveChatsToStorage(updatedChats);

      // If the active chat is being deleted, set active chat to null
      if (activeChat?.id === chatId) {
        setActiveChatState(null);
      }

      // Also remove all messages for this chat
      const updatedMessages = messages.filter(message => message.chatId !== chatId);
      setMessages(updatedMessages);
      saveMessagesToStorage(updatedMessages);

      showToast({
        title: "Chat Deleted",
        description: "The chat has been deleted successfully.",
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error('Error deleting chat:', error);
      showToast({
        title: "Error",
        description: "Failed to delete chat. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Pin, mute, and archive chat functions
  const pinChat = async (chatId: string, pinned: boolean): Promise<boolean> => {
    try {
      await updateChat(chatId, { pinned });
      return true;
    } catch (error) {
      return false;
    }
  };

  const muteChat = async (chatId: string, muted: boolean): Promise<boolean> => {
    try {
      await updateChat(chatId, { muted });
      return true;
    } catch (error) {
      return false;
    }
  };

  const archiveChat = async (chatId: string, archived: boolean): Promise<boolean> => {
    try {
      await updateChat(chatId, { archived });
      return true;
    } catch (error) {
      return false;
    }
  };

  // Send a message
  const sendMessage = async (
    chatId: string,
    content: string,
    type: MessageType = 'text',
    attachments: File[] = [],
    replyTo?: string,
    mentions?: string[]
  ): Promise<Message> => {
    setIsLoading(true);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // In a real implementation, this would call an API
      // and handle file uploads for attachments
      const newMessage: Message = {
        id: uuidv4(),
        chatId,
        senderId: user.id,
        senderName: user.name || user.username || 'User',
        senderAvatar: user.avatar,
        content,
        type,
        timestamp: new Date().toISOString(),
        read: false,
        edited: false,
        replyTo,
        mentions,
        attachments: attachments.map(file => ({
          id: uuidv4(),
          name: file.name,
          type: file.type,
          url: URL.createObjectURL(file),
          size: file.size,
        })),
      };

      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      saveMessagesToStorage(updatedMessages);

      // Update the chat's last message and unread count
      const updatedChats = chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            lastMessage: newMessage,
            updatedAt: new Date().toISOString(),
          };
        }
        return chat;
      });
      setChats(updatedChats);
      saveChatsToStorage(updatedChats);

      // In a real implementation, this would send the message via WebSocket
      webSocketService.send('message', newMessage);

      // If this is an external chat, send the message to the external service
      const chat = chats.find(c => c.id === chatId);
      if (chat?.type === 'external') {
        // Find the external participant
        const externalParticipant = chat.participants.find(p => p.userId !== user.id);
        if (externalParticipant) {
          // Extract the external source and user ID from the participant ID
          const [source, externalUserId] = externalParticipant.userId.split('_');

          if (source === 'tawkto' && externalUserId) {
            // Send the message to tawk.to
            const result = await externalChatService.sendTawktoMessage(
              chat.id,
              externalUserId,
              content,
              user.id,
              user.name || user.username || 'User'
            );

            if (!result.success) {
              console.error('Failed to send message to tawk.to:', result.error);
              showToast({
                title: "Warning",
                description: "Message sent internally but failed to deliver to external service.",
                variant: "destructive",
              });
            }
          }
        }
      }

      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      showToast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Edit a message
  const editMessage = async (messageId: string, content: string): Promise<Message> => {
    setIsLoading(true);

    try {
      // In a real implementation, this would call an API
      const updatedMessages = messages.map(message => {
        if (message.id === messageId) {
          return {
            ...message,
            content,
            edited: true,
            editedAt: new Date().toISOString(),
          };
        }
        return message;
      });

      setMessages(updatedMessages);
      saveMessagesToStorage(updatedMessages);

      const editedMessage = updatedMessages.find(m => m.id === messageId);
      if (!editedMessage) {
        throw new Error(`Message with ID ${messageId} not found`);
      }

      // Update the chat's last message if this was the last message
      const chat = chats.find(c => c.id === editedMessage.chatId);
      if (chat?.lastMessage?.id === messageId) {
        const updatedChats = chats.map(c => {
          if (c.id === editedMessage.chatId) {
            return {
              ...c,
              lastMessage: editedMessage,
            };
          }
          return c;
        });
        setChats(updatedChats);
        saveChatsToStorage(updatedChats);
      }

      return editedMessage;
    } catch (error) {
      console.error('Error editing message:', error);
      showToast({
        title: "Error",
        description: "Failed to edit message. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a message
  const deleteMessage = async (messageId: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // In a real implementation, this would call an API
      const updatedMessages = messages.filter(message => message.id !== messageId);
      setMessages(updatedMessages);
      saveMessagesToStorage(updatedMessages);

      // Update the chat's last message if this was the last message
      const messageToDelete = messages.find(m => m.id === messageId);
      if (messageToDelete) {
        const chat = chats.find(c => c.id === messageToDelete.chatId);
        if (chat?.lastMessage?.id === messageId) {
          // Find the new last message for this chat
          const newLastMessage = updatedMessages
            .filter(m => m.chatId === messageToDelete.chatId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

          const updatedChats = chats.map(c => {
            if (c.id === messageToDelete.chatId) {
              return {
                ...c,
                lastMessage: newLastMessage,
              };
            }
            return c;
          });
          setChats(updatedChats);
          saveChatsToStorage(updatedChats);
        }
      }

      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      showToast({
        title: "Error",
        description: "Failed to delete message. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Mark a message as read
  const markAsRead = async (messageId: string): Promise<boolean> => {
    try {
      // In a real implementation, this would call an API
      const updatedMessages = messages.map(message => {
        if (message.id === messageId) {
          return { ...message, read: true };
        }
        return message;
      });
      setMessages(updatedMessages);
      saveMessagesToStorage(updatedMessages);

      return true;
    } catch (error) {
      console.error('Error marking message as read:', error);
      return false;
    }
  };

  // Mark all messages in a chat as read
  const markChatAsRead = async (chatId: string): Promise<boolean> => {
    try {
      // Mark all messages in this chat as read
      const updatedMessages = messages.map(message => {
        if (message.chatId === chatId) {
          return { ...message, read: true };
        }
        return message;
      });
      setMessages(updatedMessages);
      saveMessagesToStorage(updatedMessages);

      // Update the chat's unread count
      const updatedChats = chats.map(chat => {
        if (chat.id === chatId) {
          return { ...chat, unreadCount: 0 };
        }
        return chat;
      });
      setChats(updatedChats);
      saveChatsToStorage(updatedChats);

      return true;
    } catch (error) {
      console.error('Error marking chat as read:', error);
      return false;
    }
  };

  // React to a message
  const reactToMessage = async (messageId: string, emoji: string): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const updatedMessages = messages.map(message => {
        if (message.id === messageId) {
          // Check if user already reacted with this emoji
          const existingReactionIndex = message.reactions?.findIndex(
            r => r.userId === user.id && r.emoji === emoji
          );

          let updatedReactions = message.reactions || [];

          if (existingReactionIndex !== undefined && existingReactionIndex >= 0) {
            // Remove the reaction if it already exists
            updatedReactions = updatedReactions.filter((_, index) => index !== existingReactionIndex);
          } else {
            // Add the new reaction
            updatedReactions = [
              ...updatedReactions,
              {
                emoji,
                userId: user.id,
                timestamp: new Date().toISOString(),
              }
            ];
          }

          return {
            ...message,
            reactions: updatedReactions,
          };
        }
        return message;
      });
      setMessages(updatedMessages);
      saveMessagesToStorage(updatedMessages);

      return true;
    } catch (error) {
      console.error('Error reacting to message:', error);
      return false;
    }
  };

  // Forward a message to other chats
  const forwardMessage = async (messageId: string, chatIds: string[]): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const messageToForward = messages.find(m => m.id === messageId);
      if (!messageToForward) {
        throw new Error(`Message with ID ${messageId} not found`);
      }

      // Create a new message for each chat
      for (const chatId of chatIds) {
        await sendMessage(
          chatId,
          messageToForward.content,
          messageToForward.type,
          [],
          undefined,
          messageToForward.mentions
        );
      }

      return true;
    } catch (error) {
      console.error('Error forwarding message:', error);
      showToast({
        title: "Error",
        description: "Failed to forward message. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Initiate a call
  const initiateCall = async (chatId: string, type: CallType): Promise<Call> => {
    setIsLoading(true);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      const chat = chats.find(c => c.id === chatId);
      if (!chat) {
        throw new Error(`Chat with ID ${chatId} not found`);
      }

      // For simplicity, we'll assume this is a direct chat
      // In a real implementation, you'd handle group calls differently
      const receiver = chat.participants.find(p => p.userId !== user.id);
      if (!receiver) {
        throw new Error('No receiver found for this chat');
      }

      const newCall: Call = {
        id: uuidv4(),
        chatId,
        callerId: user.id,
        callerName: user.name || user.username || 'User',
        callerAvatar: user.avatar,
        receiverId: receiver.userId,
        receiverName: receiver.name,
        receiverAvatar: receiver.avatar,
        type,
        status: 'ringing',
        startTime: new Date().toISOString(),
      };

      setCalls(prev => [newCall, ...prev]);
      setActiveCall(newCall);

      // In a real implementation, this would initiate a WebRTC call
      // and send a notification via WebSocket
      webSocketService.send('call', newCall);

      return newCall;
    } catch (error) {
      console.error('Error initiating call:', error);
      showToast({
        title: "Error",
        description: "Failed to initiate call. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Answer a call
  const answerCall = async (callId: string): Promise<boolean> => {
    try {
      const updatedCalls = calls.map(call => {
        if (call.id === callId) {
          return {
            ...call,
            status: 'ongoing',
          };
        }
        return call;
      });

      setCalls(updatedCalls);
      const answeredCall = updatedCalls.find(c => c.id === callId);
      if (answeredCall) {
        setActiveCall(answeredCall);
      }

      // In a real implementation, this would accept a WebRTC call
      // and send a notification via WebSocket
      webSocketService.send('call-answer', { callId });

      return true;
    } catch (error) {
      console.error('Error answering call:', error);
      return false;
    }
  };

  // Reject a call
  const rejectCall = async (callId: string): Promise<boolean> => {
    try {
      const updatedCalls = calls.map(call => {
        if (call.id === callId) {
          return {
            ...call,
            status: 'rejected',
            endTime: new Date().toISOString(),
          };
        }
        return call;
      });

      setCalls(updatedCalls);
      if (activeCall?.id === callId) {
        setActiveCall(null);
      }

      // In a real implementation, this would reject a WebRTC call
      // and send a notification via WebSocket
      webSocketService.send('call-reject', { callId });

      return true;
    } catch (error) {
      console.error('Error rejecting call:', error);
      return false;
    }
  };

  // End a call
  const endCall = async (callId: string): Promise<boolean> => {
    try {
      const call = calls.find(c => c.id === callId);
      if (!call) {
        throw new Error(`Call with ID ${callId} not found`);
      }

      const now = new Date();
      const startTime = new Date(call.startTime);
      const duration = Math.floor((now.getTime() - startTime.getTime()) / 1000); // Duration in seconds

      const updatedCalls = calls.map(c => {
        if (c.id === callId) {
          return {
            ...c,
            status: 'ended',
            endTime: now.toISOString(),
            duration,
          };
        }
        return c;
      });

      setCalls(updatedCalls);
      if (activeCall?.id === callId) {
        setActiveCall(null);
      }

      // In a real implementation, this would end a WebRTC call
      // and send a notification via WebSocket
      webSocketService.send('call-end', { callId });

      return true;
    } catch (error) {
      console.error('Error ending call:', error);
      return false;
    }
  };

  // Set user typing status
  const setUserTyping = (chatId: string, isTyping: boolean) => {
    if (!user) return;

    // In a real implementation, this would send a notification via WebSocket
    webSocketService.send('typing', { chatId, userId: user.id, isTyping });
  };

  // Search messages
  const searchMessages = (query: string): Message[] => {
    if (!query.trim()) return [];

    const lowerCaseQuery = query.toLowerCase();
    return messages.filter(message =>
      message.content.toLowerCase().includes(lowerCaseQuery)
    );
  };

  // Search chats
  const searchChats = (query: string): Chat[] => {
    if (!query.trim()) return chats;

    const lowerCaseQuery = query.toLowerCase();
    return chats.filter(chat =>
      chat.name.toLowerCase().includes(lowerCaseQuery) ||
      chat.participants.some(p => p.name.toLowerCase().includes(lowerCaseQuery))
    );
  };

  // Get participant by ID
  const getParticipantById = (userId: string): ChatParticipant | undefined => {
    for (const chat of chats) {
      const participant = chat.participants.find(p => p.userId === userId);
      if (participant) return participant;
    }
    return undefined;
  };

  // WhatsApp integration
  const sendWhatsAppMessage = async (phoneNumber: string, message: string): Promise<boolean> => {
    try {
      // In a real implementation, this would call a WhatsApp API
      console.log(`Sending WhatsApp message to ${phoneNumber}: ${message}`);

      showToast({
        title: "WhatsApp Message Sent",
        description: `Message sent to ${phoneNumber}`,
        variant: "default",
      });

      return true;
    } catch (error) {
      console.error('Error sending WhatsApp message:', error);
      showToast({
        title: "Error",
        description: "Failed to send WhatsApp message. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // Handle external message (e.g., from tawk.to)
  const handleExternalMessage = async (externalMessage: {
    id: string;
    externalChatId: string;
    externalUserId: string;
    senderName: string;
    content: string;
    source: string;
    timestamp: string;
  }): Promise<Message> => {
    setIsLoading(true);

    try {
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Check if we already have a chat for this external chat ID
      let chat = chats.find(c =>
        c.type === 'external' &&
        c.participants.some(p => p.userId === `${externalMessage.source}_${externalMessage.externalUserId}`)
      );

      // If no chat exists, create one
      if (!chat) {
        chat = {
          id: uuidv4(),
          type: 'external',
          name: `${externalMessage.senderName} (${externalMessage.source})`,
          participants: [
            {
              userId: `${externalMessage.source}_${externalMessage.externalUserId}`,
              name: externalMessage.senderName,
              role: 'member',
              isOnline: true,
            },
            {
              userId: user.id,
              name: user.name || user.username || 'User',
              avatar: user.avatar,
              role: 'admin',
              isOnline: true,
            }
          ],
          unreadCount: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          pinned: false,
          muted: false,
          archived: false,
        };

        setChats(prevChats => [chat!, ...prevChats]);
        saveChatsToStorage([chat!, ...chats]);
      }

      // Create the message
      const newMessage: Message = {
        id: externalMessage.id,
        chatId: chat.id,
        senderId: `${externalMessage.source}_${externalMessage.externalUserId}`,
        senderName: externalMessage.senderName,
        content: externalMessage.content,
        type: 'external',
        timestamp: externalMessage.timestamp || new Date().toISOString(),
        read: false,
        edited: false,
        externalSource: externalMessage.source,
        externalUserId: externalMessage.externalUserId,
        externalChatId: externalMessage.externalChatId,
      };

      // Add the message to the messages state
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      saveMessagesToStorage(updatedMessages);

      // Update the chat's last message and unread count
      const updatedChats = chats.map(c => {
        if (c.id === chat!.id) {
          return {
            ...c,
            lastMessage: newMessage,
            unreadCount: c.unreadCount + 1,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      });

      setChats(updatedChats);
      saveChatsToStorage(updatedChats);

      // Show a notification
      showToast({
        title: `New message from ${externalMessage.senderName}`,
        description: externalMessage.content.length > 50
          ? `${externalMessage.content.substring(0, 50)}...`
          : externalMessage.content,
        variant: "default",
      });

      return newMessage;
    } catch (error) {
      console.error('Error handling external message:', error);
      showToast({
        title: "Error",
        description: "Failed to process external message.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // WebSocket event handlers
  useEffect(() => {
    if (user) {

      // Store the event handlers so we can properly remove them
      const messageHandler = (data: Message) => {
        // Add the new message to the messages state
        setMessages(prev => [...prev, data]);

        // Update the chat's last message and unread count
        setChats(prev => prev.map(chat => {
          if (chat.id === data.chatId) {
            return {
              ...chat,
              lastMessage: data,
              unreadCount: activeChat?.id === data.chatId ? 0 : chat.unreadCount + 1,
              updatedAt: new Date().toISOString(),
            };
          }
          return chat;
        }));
      };

      const typingHandler = (data: { chatId: string; userId: string; isTyping: boolean }) => {
        // Update the participant's typing status
        setChats(prev => prev.map(chat => {
          if (chat.id === data.chatId) {
            return {
              ...chat,
              participants: chat.participants.map(p => {
                if (p.userId === data.userId) {
                  return { ...p, isTyping: data.isTyping };
                }
                return p;
              }),
            };
          }
          return chat;
        }));
      };

      const callHandler = (data: Call) => {
        // Add the new call to the calls state
        setCalls(prev => [data, ...prev]);

        // If the call is for the current user, set it as active
        if (data.receiverId === user.id && data.status === 'ringing') {
          setActiveCall(data);
        }
      };

      // Set up WebSocket event listeners
      webSocketService.on('message', messageHandler);
      webSocketService.on('typing', typingHandler);
      webSocketService.on('call', callHandler);

      // Clean up event listeners on unmount
      return () => {
        webSocketService.off('message', messageHandler);
        webSocketService.off('typing', typingHandler);
        webSocketService.off('call', callHandler);
      };
    }
  }, [user, activeChat]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        messages,
        calls,
        activeCall,
        isLoading,
        setActiveChat,
        createChat,
        updateChat,
        deleteChat,
        pinChat,
        muteChat,
        archiveChat,
        sendMessage,
        editMessage,
        deleteMessage,
        markAsRead,
        markChatAsRead,
        reactToMessage,
        forwardMessage,
        initiateCall,
        answerCall,
        rejectCall,
        endCall,
        setUserTyping,
        searchMessages,
        searchChats,
        getParticipantById,
        sendWhatsAppMessage,
        handleExternalMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}