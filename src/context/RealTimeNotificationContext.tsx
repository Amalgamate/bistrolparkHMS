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
  notifyPatientRegistered: (patientId: string, patientName: string, tokenNumber: number) => void;
  notifyVitalsReady: (patientId: string, patientName: string, tokenNumber: number) => void;
  notifyVitalsTaken: (patientId: string, patientName: string, tokenNumber: number, doctorId?: string) => void;
  notifyDoctorAssigned: (patientId: string, patientName: string, tokenNumber: number, doctorId: string, doctorName: string) => void;
  notifyLabOrdered: (patientId: string, patientName: string, tokenNumber: number, labTests: string[]) => void;
  notifyLabResultsReady: (patientId: string, patientName: string, tokenNumber: number, doctorId: string) => void;
  notifyPrescriptionReady: (patientId: string, patientName: string, tokenNumber: number) => void;
  notifyEmergencyPatient: (patientId: string, patientName: string, tokenNumber: number) => void;
  notifyTokenCalled: (patientId: string, patientName: string, tokenNumber: number, destination: string) => void;
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

    // Add notification to the list
    const newNotification: NotificationItem = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date()
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification
    showToast(
      getToastTypeForNotification(notification.type),
      notification.message,
      getToastTitleForNotification(notification.type)
    );

    // Play sound for urgent notifications
    if (
      notification.details.priority === 'urgent' || 
      notification.details.priority === 'emergency' ||
      notification.type === 'EMERGENCY_PATIENT'
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
      notification.type === 'LAB_RESULTS_READY'
    ) {
      showDesktopNotification(
        getToastTitleForNotification(notification.type),
        notification.message
      );
    }
  };

  // Helper function to get toast type based on notification type
  const getToastTypeForNotification = (type: NotificationType): 'success' | 'info' | 'warning' | 'error' => {
    switch (type) {
      case 'PATIENT_REGISTERED':
      case 'VITALS_TAKEN':
      case 'LAB_RESULTS_READY':
      case 'PRESCRIPTION_READY':
      case 'PATIENT_COMPLETED':
        return 'success';
      case 'VITALS_READY':
      case 'DOCTOR_ASSIGNED':
      case 'LAB_ORDERED':
      case 'TOKEN_CALLED':
        return 'info';
      case 'EMERGENCY_PATIENT':
        return 'error';
      default:
        return 'info';
    }
  };

  // Helper function to get toast title based on notification type
  const getToastTitleForNotification = (type: NotificationType): string => {
    switch (type) {
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
      default:
        return 'Notification';
    }
  };

  // Play notification sound
  const playNotificationSound = (type: 'normal' | 'urgent') => {
    try {
      const audio = new Audio(type === 'urgent' ? '/sounds/urgent-notification.mp3' : '/sounds/notification.mp3');
      audio.play();
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
        notifyPatientRegistered,
        notifyVitalsReady,
        notifyVitalsTaken,
        notifyDoctorAssigned,
        notifyLabOrdered,
        notifyLabResultsReady,
        notifyPrescriptionReady,
        notifyEmergencyPatient,
        notifyTokenCalled
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
