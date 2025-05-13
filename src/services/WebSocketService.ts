/**
 * WebSocket Service for real-time notifications
 * 
 * This service handles real-time communication between different users
 * in the system, particularly for clinical workflow notifications.
 */

// Define notification types
export type NotificationType = 
  | 'PATIENT_REGISTERED'
  | 'VITALS_READY'
  | 'VITALS_TAKEN'
  | 'DOCTOR_ASSIGNED'
  | 'LAB_ORDERED'
  | 'LAB_RESULTS_READY'
  | 'PRESCRIPTION_READY'
  | 'PATIENT_COMPLETED'
  | 'EMERGENCY_PATIENT'
  | 'TOKEN_CALLED';

// Define notification payload structure
export interface NotificationPayload {
  type: NotificationType;
  message: string;
  details: {
    patientId?: string;
    patientName?: string;
    tokenNumber?: number;
    queueId?: string;
    priority?: 'normal' | 'urgent' | 'emergency';
    doctorId?: string;
    doctorName?: string;
    targetRole?: string;
    targetBranch?: string;
    timestamp: string;
    [key: string]: any;
  };
}

// Define callback types
type MessageCallback = (notification: NotificationPayload) => void;
type ConnectionCallback = () => void;

class WebSocketService {
  private socket: WebSocket | null = null;
  private messageCallbacks: MessageCallback[] = [];
  private connectCallbacks: ConnectionCallback[] = [];
  private disconnectCallbacks: ConnectionCallback[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout: NodeJS.Timeout | null = null;
  private userId: string | null = null;
  private userRole: string | null = null;
  private branch: string | null = null;
  private isConnected = false;

  /**
   * Initialize the WebSocket connection
   * @param userId User ID
   * @param userRole User role
   * @param branch Branch
   */
  public init(userId: string, userRole: string, branch: string): void {
    this.userId = userId;
    this.userRole = userRole;
    this.branch = branch;

    // In a real implementation, this would connect to a real WebSocket server
    // For demo purposes, we'll simulate the connection
    this.simulateConnection();
  }

  /**
   * Simulate WebSocket connection for demo purposes
   */
  private simulateConnection(): void {
    console.log('Simulating WebSocket connection...');
    
    // Simulate connection established
    setTimeout(() => {
      this.isConnected = true;
      console.log('WebSocket connection established (simulated)');
      this.connectCallbacks.forEach(callback => callback());
      
      // Send a welcome message
      this.simulateIncomingMessage({
        type: 'PATIENT_REGISTERED',
        message: 'Welcome to the notification system',
        details: {
          timestamp: new Date().toISOString()
        }
      });
    }, 1000);
  }

  /**
   * Simulate receiving a message from the WebSocket server
   */
  private simulateIncomingMessage(notification: NotificationPayload): void {
    if (!this.isConnected) return;
    
    console.log('Received WebSocket message (simulated):', notification);
    this.messageCallbacks.forEach(callback => callback(notification));
  }

  /**
   * Send a notification through the WebSocket
   * @param notification Notification payload
   */
  public sendNotification(notification: Omit<NotificationPayload, 'details'> & { details?: Partial<NotificationPayload['details']> }): void {
    if (!this.isConnected) {
      console.warn('Cannot send notification: WebSocket not connected');
      return;
    }

    const fullNotification: NotificationPayload = {
      ...notification,
      details: {
        ...notification.details,
        timestamp: new Date().toISOString(),
        senderId: this.userId,
        senderRole: this.userRole,
        senderBranch: this.branch
      }
    };

    console.log('Sending WebSocket message (simulated):', fullNotification);
    
    // In a real implementation, this would send the message to the WebSocket server
    // For demo purposes, we'll simulate receiving the message back
    setTimeout(() => {
      this.simulateIncomingMessage(fullNotification);
    }, 300);
  }

  /**
   * Register a callback for incoming messages
   * @param callback Function to call when a message is received
   */
  public onMessage(callback: MessageCallback): void {
    this.messageCallbacks.push(callback);
  }

  /**
   * Register a callback for connection established
   * @param callback Function to call when connection is established
   */
  public onConnect(callback: ConnectionCallback): void {
    this.connectCallbacks.push(callback);
    if (this.isConnected) {
      callback();
    }
  }

  /**
   * Register a callback for connection lost
   * @param callback Function to call when connection is lost
   */
  public onDisconnect(callback: ConnectionCallback): void {
    this.disconnectCallbacks.push(callback);
  }

  /**
   * Close the WebSocket connection
   */
  public disconnect(): void {
    if (!this.isConnected) return;
    
    console.log('Closing WebSocket connection...');
    this.isConnected = false;
    this.disconnectCallbacks.forEach(callback => callback());
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  /**
   * Send a notification to a specific role
   * @param role Target role
   * @param notification Notification payload
   */
  public notifyRole(role: string, notification: Omit<NotificationPayload, 'details'> & { details?: Partial<NotificationPayload['details']> }): void {
    this.sendNotification({
      ...notification,
      details: {
        ...notification.details,
        targetRole: role
      }
    });
  }

  /**
   * Send a notification to a specific user
   * @param userId Target user ID
   * @param notification Notification payload
   */
  public notifyUser(userId: string, notification: Omit<NotificationPayload, 'details'> & { details?: Partial<NotificationPayload['details']> }): void {
    this.sendNotification({
      ...notification,
      details: {
        ...notification.details,
        targetUserId: userId
      }
    });
  }

  /**
   * Send a notification to a specific branch
   * @param branch Target branch
   * @param notification Notification payload
   */
  public notifyBranch(branch: string, notification: Omit<NotificationPayload, 'details'> & { details?: Partial<NotificationPayload['details']> }): void {
    this.sendNotification({
      ...notification,
      details: {
        ...notification.details,
        targetBranch: branch
      }
    });
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;
