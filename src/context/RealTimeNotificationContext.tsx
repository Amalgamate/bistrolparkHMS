import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import webSocketService, { NotificationPayload, NotificationType } from '../services/WebSocketService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

// Define notification item structure
export interface NotificationItem extends NotificationPayload {
  id: string;
  read: boolean;
  createdAt: Date;
}

// Define context type
interface RealTimeNotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  sendNotification: (type: NotificationType, message: string, details?: any) => void;
  notifyRole: (role: string, type: NotificationType, message: string, details?: any) => void;
  notifyUser: (userId: string, type: NotificationType, message: string, details?: any) => void;
  notifyBranch: (branch: string, type: NotificationType, message: string, details?: any) => void;

  // Clinical workflow notifications
  notifyPatientRegistered: (patientId: string, patientName: string, tokenNumber: number) => void;
  notifyVitalsReady: (patientId: string, patientName: string, tokenNumber: number) => void;
  notifyVitalsTaken: (patientId: string, patientName: string, tokenNumber: number, doctorId?: string) => void;
  notifyDoctorAssigned: (patientId: string, patientName: string, tokenNumber: number, doctorId: string, doctorName: string) => void;
  notifyLabOrdered: (patientId: string, patientName: string, tokenNumber: number, labTests: string[]) => void;
  notifyLabResultsReady: (patientId: string, patientName: string, tokenNumber: number, doctorId: string) => void;
  notifyPrescriptionReady: (patientId: string, patientName: string, tokenNumber: number) => void;
  notifyEmergencyPatient: (patientId: string, patientName: string, tokenNumber: number) => void;
  notifyTokenCalled: (patientId: string, patientName: string, tokenNumber: number, destination: string) => void;

  // Chat-specific notifications
  notifyChatMessage: (chatId: string, messageId: string, senderId: string, senderName: string, receiverId: string, content: string, messageType?: 'text' | 'image' | 'file' | 'video' | 'audio' | 'location' | 'contact') => void;
  notifyTyping: (chatId: string, userId: string, userName: string, isTyping: boolean) => void;
  notifyMessageRead: (chatId: string, messageId: string, userId: string) => void;
  notifyCallInitiated: (callId: string, chatId: string, callerId: string, callerName: string, receiverId: string, receiverName: string, callType: 'audio' | 'video') => void;
  notifyCallAnswered: (callId: string, receiverId: string) => void;
  notifyCallRejected: (callId: string, receiverId: string) => void;
  notifyCallEnded: (callId: string, userId: string) => void;

  // External chat notifications
  notifyExternalMessage: (externalChatId: string, externalUserId: string, senderName: string, content: string, source: string) => void;
}

// Create context
const RealTimeNotificationContext = createContext<RealTimeNotificationContextType | undefined>(undefined);

// Provider component
export const RealTimeNotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [connected, setConnected] = useState(false);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Initialize WebSocket connection when user is authenticated
  useEffect(() => {
    if (user) {
      webSocketService.init(
        user.id,
        user.role,
        user.branch || 'fedha'
      );

      webSocketService.onConnect(() => {
        setConnected(true);
        console.log('Connected to notification service');
      });

      webSocketService.onDisconnect(() => {
        setConnected(false);
        console.log('Disconnected from notification service');
      });

      webSocketService.onMessage((notification) => {
        handleIncomingNotification(notification);
      });

      return () => {
        webSocketService.disconnect();
      };
    }
  }, [user]);

  // Handle incoming notifications
  const handleIncomingNotification = (notification: NotificationPayload) => {
    // Skip typing notifications for the notification list
    if (notification.type === 'CHAT_TYPING') {
      // Just update the UI for typing indicators, don't add to notifications list
      return;
    }

    // Skip read receipts for the notification list
    if (notification.type === 'CHAT_READ') {
      // Just update the UI for read receipts, don't add to notifications list
      return;
    }

    // Check if the notification is targeted at the current user
    if (
      notification.details.targetUserId &&
      notification.details.targetUserId !== user?.id
    ) {
      return;
    }

    // Check if the notification is targeted at the current role
    if (
      notification.details.targetRole &&
      notification.details.targetRole !== user?.role
    ) {
      return;
    }

    // Check if the notification is targeted at the current branch
    if (
      notification.details.targetBranch &&
      notification.details.targetBranch !== user?.branch
    ) {
      return;
    }

    // For chat messages, check if the receiver is the current user
    if (
      notification.type === 'CHAT_MESSAGE' &&
      notification.details.receiverId &&
      notification.details.receiverId !== user?.id
    ) {
      return;
    }

    // For calls, check if the receiver is the current user
    if (
      (notification.type === 'CALL_INITIATED' ||
       notification.type === 'CALL_ANSWERED' ||
       notification.type === 'CALL_REJECTED') &&
      notification.details.receiverId &&
      notification.details.receiverId !== user?.id
    ) {
      return;
    }

    // For external messages, always show them to all users
    // In a real implementation, you might want to route these to specific users or roles
    if (notification.type === 'EXTERNAL_MESSAGE') {
      // Handle external message - we'll let it pass through to be displayed
      // This will be handled by the ChatContext
    }

    // Add notification to the list
    const newNotification: NotificationItem = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date()
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification
    showToast({
      title: getToastTitleForNotification(notification.type),
      description: notification.message,
      variant: getToastTypeForNotification(notification.type),
    });

    // Play sound based on notification type
    if (shouldPlaySound(notification.type)) {
      playNotificationSound(notification.type);
    } else if (
      notification.details.priority === 'urgent' ||
      notification.details.priority === 'emergency'
    ) {
      playNotificationSound('urgent');
    } else {
      playNotificationSound('normal');
    }

    // Show desktop notification for important notifications
    if (
      notification.details.priority === 'urgent' ||
      notification.details.priority === 'emergency' ||
      notification.type === 'EMERGENCY_PATIENT' ||
      notification.type === 'LAB_RESULTS_READY' ||
      notification.type === 'CALL_INITIATED' ||
      notification.type === 'CHAT_MESSAGE'
    ) {
      showDesktopNotification(
        getToastTitleForNotification(notification.type),
        notification.message
      );
    }
  };

  // Determine if a sound should be played for a notification type
  const shouldPlaySound = (type: NotificationType): boolean => {
    // Play sounds for these notification types
    return [
      'CHAT_MESSAGE',
      'CALL_INITIATED',
      'EMERGENCY_PATIENT',
      'TOKEN_CALLED'
    ].includes(type);
  };

  // Helper function to get toast type based on notification type
  const getToastTypeForNotification = (type: NotificationType): 'success' | 'info' | 'warning' | 'error' => {
    switch (type) {
      // Success notifications
      case 'PATIENT_REGISTERED':
      case 'VITALS_TAKEN':
      case 'LAB_RESULTS_READY':
      case 'PRESCRIPTION_READY':
      case 'PATIENT_COMPLETED':
      case 'CHAT_READ':
      case 'CALL_ANSWERED':
        return 'success';

      // Info notifications
      case 'VITALS_READY':
      case 'DOCTOR_ASSIGNED':
      case 'LAB_ORDERED':
      case 'TOKEN_CALLED':
      case 'CHAT_MESSAGE':
      case 'CHAT_TYPING':
      case 'EXTERNAL_MESSAGE':
        return 'info';

      // Warning notifications
      case 'CALL_REJECTED':
      case 'CALL_ENDED':
        return 'warning';

      // Error notifications
      case 'EMERGENCY_PATIENT':
        return 'error';

      // Default to info
      default:
        return 'info';
    }
  };

  // Helper function to get toast title based on notification type
  const getToastTitleForNotification = (type: NotificationType): string => {
    switch (type) {
      // Clinical workflow notifications
      case 'PATIENT_REGISTERED':
        return 'New Patient Registered';
      case 'VITALS_READY':
        return 'Patient Ready for Vitals';
      case 'VITALS_TAKEN':
        return 'Vitals Recorded';
      case 'DOCTOR_ASSIGNED':
        return 'Doctor Assigned';
      case 'LAB_ORDERED':
        return 'Lab Tests Ordered';
      case 'LAB_RESULTS_READY':
        return 'Lab Results Ready';
      case 'PRESCRIPTION_READY':
        return 'Prescription Ready';
      case 'PATIENT_COMPLETED':
        return 'Patient Visit Completed';
      case 'EMERGENCY_PATIENT':
        return 'EMERGENCY PATIENT';
      case 'TOKEN_CALLED':
        return 'Token Called';

      // Chat-specific notifications
      case 'CHAT_MESSAGE':
        return 'New Message';
      case 'CHAT_TYPING':
        return 'Typing Notification';
      case 'CHAT_READ':
        return 'Message Read';
      case 'CALL_INITIATED':
        return 'Incoming Call';
      case 'CALL_ANSWERED':
        return 'Call Connected';
      case 'CALL_REJECTED':
        return 'Call Rejected';
      case 'CALL_ENDED':
        return 'Call Ended';

      default:
        return 'Notification';
    }
  };

  // Play notification sound
  const playNotificationSound = (type: 'normal' | 'urgent' | NotificationType) => {
    try {
      let soundFile = '/sounds/notification.mp3';

      if (type === 'urgent') {
        soundFile = '/sounds/urgent-notification.mp3';
      } else if (type === 'CHAT_MESSAGE' || type === 'EXTERNAL_MESSAGE') {
        soundFile = '/sounds/message.mp3';
      } else if (type === 'CALL_INITIATED') {
        soundFile = '/sounds/call.mp3';
      } else if (type === 'EMERGENCY_PATIENT') {
        soundFile = '/sounds/emergency.mp3';
      } else if (type === 'TOKEN_CALLED') {
        soundFile = '/sounds/token-called.mp3';
      }

      const audio = new Audio(soundFile);
      audio.play().catch(error => {
        console.error('Error playing notification sound:', error);
      });
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  };

  // Show desktop notification
  const showDesktopNotification = (title: string, message: string) => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(title, { body: message });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification(title, { body: message });
          }
        });
      }
    }
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Send a notification
  const sendNotification = (type: NotificationType, message: string, details?: any) => {
    webSocketService.sendNotification({
      type,
      message,
      details: details || {}
    });
  };

  // Notify a specific role
  const notifyRole = (role: string, type: NotificationType, message: string, details?: any) => {
    webSocketService.notifyRole(role, {
      type,
      message,
      details: details || {}
    });
  };

  // Notify a specific user
  const notifyUser = (userId: string, type: NotificationType, message: string, details?: any) => {
    webSocketService.notifyUser(userId, {
      type,
      message,
      details: details || {}
    });
  };

  // Notify a specific branch
  const notifyBranch = (branch: string, type: NotificationType, message: string, details?: any) => {
    webSocketService.notifyBranch(branch, {
      type,
      message,
      details: details || {}
    });
  };

  // Convenience methods for common notifications
  const notifyPatientRegistered = (patientId: string, patientName: string, tokenNumber: number) => {
    notifyRole('nurse', 'PATIENT_REGISTERED', `New patient ${patientName} registered with token #${tokenNumber}`, {
      patientId,
      patientName,
      tokenNumber,
      priority: 'normal'
    });
  };

  const notifyVitalsReady = (patientId: string, patientName: string, tokenNumber: number) => {
    notifyRole('nurse', 'VITALS_READY', `Patient ${patientName} (Token #${tokenNumber}) is ready for vitals`, {
      patientId,
      patientName,
      tokenNumber,
      priority: 'normal'
    });
  };

  const notifyVitalsTaken = (patientId: string, patientName: string, tokenNumber: number, doctorId?: string) => {
    if (doctorId) {
      notifyUser(doctorId, 'VITALS_TAKEN', `Patient ${patientName} (Token #${tokenNumber}) vitals recorded and ready for consultation`, {
        patientId,
        patientName,
        tokenNumber,
        priority: 'normal'
      });
    } else {
      notifyRole('doctor', 'VITALS_TAKEN', `Patient ${patientName} (Token #${tokenNumber}) vitals recorded and ready for consultation`, {
        patientId,
        patientName,
        tokenNumber,
        priority: 'normal'
      });
    }
  };

  const notifyDoctorAssigned = (patientId: string, patientName: string, tokenNumber: number, doctorId: string, doctorName: string) => {
    notifyUser(doctorId, 'DOCTOR_ASSIGNED', `Patient ${patientName} (Token #${tokenNumber}) has been assigned to you`, {
      patientId,
      patientName,
      tokenNumber,
      doctorId,
      doctorName,
      priority: 'normal'
    });
  };

  const notifyLabOrdered = (patientId: string, patientName: string, tokenNumber: number, labTests: string[]) => {
    notifyRole('lab-technician', 'LAB_ORDERED', `New lab tests ordered for patient ${patientName} (Token #${tokenNumber})`, {
      patientId,
      patientName,
      tokenNumber,
      labTests,
      priority: 'normal'
    });
  };

  const notifyLabResultsReady = (patientId: string, patientName: string, tokenNumber: number, doctorId: string) => {
    notifyUser(doctorId, 'LAB_RESULTS_READY', `Lab results are ready for patient ${patientName} (Token #${tokenNumber})`, {
      patientId,
      patientName,
      tokenNumber,
      priority: 'normal'
    });
  };

  const notifyPrescriptionReady = (patientId: string, patientName: string, tokenNumber: number) => {
    notifyRole('pharmacy', 'PRESCRIPTION_READY', `New prescription for patient ${patientName} (Token #${tokenNumber})`, {
      patientId,
      patientName,
      tokenNumber,
      priority: 'normal'
    });
  };

  const notifyEmergencyPatient = (patientId: string, patientName: string, tokenNumber: number) => {
    sendNotification('EMERGENCY_PATIENT', `EMERGENCY: Patient ${patientName} (Token #${tokenNumber}) needs immediate attention`, {
      patientId,
      patientName,
      tokenNumber,
      priority: 'emergency'
    });
  };

  const notifyTokenCalled = (patientId: string, patientName: string, tokenNumber: number, destination: string) => {
    sendNotification('TOKEN_CALLED', `Token #${tokenNumber} for ${patientName} has been called to ${destination}`, {
      patientId,
      patientName,
      tokenNumber,
      destination,
      priority: 'normal'
    });
  };

  // Chat-specific notification methods
  const notifyChatMessage = (
    chatId: string,
    messageId: string,
    senderId: string,
    senderName: string,
    receiverId: string,
    content: string,
    messageType: 'text' | 'image' | 'file' | 'video' | 'audio' | 'location' | 'contact' = 'text'
  ) => {
    webSocketService.notifyChatMessage(
      chatId,
      messageId,
      senderId,
      senderName,
      receiverId,
      content,
      messageType
    );
  };

  const notifyTyping = (chatId: string, userId: string, userName: string, isTyping: boolean) => {
    webSocketService.notifyTyping(chatId, userId, userName, isTyping);
  };

  const notifyMessageRead = (chatId: string, messageId: string, userId: string) => {
    webSocketService.notifyMessageRead(chatId, messageId, userId);
  };

  const notifyCallInitiated = (
    callId: string,
    chatId: string,
    callerId: string,
    callerName: string,
    receiverId: string,
    receiverName: string,
    callType: 'audio' | 'video'
  ) => {
    webSocketService.notifyCallInitiated(
      callId,
      chatId,
      callerId,
      callerName,
      receiverId,
      receiverName,
      callType
    );
  };

  const notifyCallAnswered = (callId: string, receiverId: string) => {
    webSocketService.notifyCallAnswered(callId, receiverId);
  };

  const notifyCallRejected = (callId: string, receiverId: string) => {
    webSocketService.notifyCallRejected(callId, receiverId);
  };

  const notifyCallEnded = (callId: string, userId: string) => {
    webSocketService.notifyCallEnded(callId, userId);
  };

  // External message notification
  const notifyExternalMessage = (
    externalChatId: string,
    externalUserId: string,
    senderName: string,
    content: string,
    source: string
  ) => {
    webSocketService.notifyExternalMessage(
      externalChatId,
      externalUserId,
      senderName,
      content,
      source
    );
  };

  return (
    <RealTimeNotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        sendNotification,
        notifyRole,
        notifyUser,
        notifyBranch,

        // Clinical workflow notifications
        notifyPatientRegistered,
        notifyVitalsReady,
        notifyVitalsTaken,
        notifyDoctorAssigned,
        notifyLabOrdered,
        notifyLabResultsReady,
        notifyPrescriptionReady,
        notifyEmergencyPatient,
        notifyTokenCalled,

        // Chat-specific notifications
        notifyChatMessage,
        notifyTyping,
        notifyMessageRead,
        notifyCallInitiated,
        notifyCallAnswered,
        notifyCallRejected,
        notifyCallEnded,

        // External chat notifications
        notifyExternalMessage
      }}
    >
      {children}
    </RealTimeNotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useRealTimeNotification = () => {
  const context = useContext(RealTimeNotificationContext);
  if (context === undefined) {
    throw new Error('useRealTimeNotification must be used within a RealTimeNotificationProvider');
  }
  return context;
};
