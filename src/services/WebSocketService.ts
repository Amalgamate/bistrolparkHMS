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
  | 'TOKEN_CALLED'
  | 'CHAT_MESSAGE'
  | 'CHAT_TYPING'
  | 'CHAT_READ'
  | 'CALL_INITIATED'
  | 'CALL_ANSWERED'
  | 'CALL_REJECTED'
  | 'CALL_ENDED'
  | 'EXTERNAL_MESSAGE';

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

    // Chat-related fields
    chatId?: string;
    messageId?: string;
    senderId?: string;
    senderName?: string;
    senderAvatar?: string;
    receiverId?: string;
    receiverName?: string;
    content?: string;
    messageType?: 'text' | 'image' | 'file' | 'video' | 'audio' | 'location' | 'contact';
    isTyping?: boolean;

    // Call-related fields
    callId?: string;
    callType?: 'audio' | 'video';
    callStatus?: 'ringing' | 'ongoing' | 'ended' | 'missed' | 'rejected';

    // External message fields
    externalSource?: string;
    externalUserId?: string;
    externalChatId?: string;

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
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

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

      // Send a welcome message - using a console log instead of a notification
      console.log('WebSocket ready to receive notifications');

      // No longer sending a simulated notification on connection
      // this.simulateIncomingMessage({
      //   type: 'PATIENT_REGISTERED',
      //   message: 'Welcome to the notification system',
      //   details: {
      //     timestamp: new Date().toISOString()
      //   }
      // });
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

  /**
   * Notify that a token has been called
   * @param patientId Patient ID
   * @param patientName Patient name
   * @param tokenNumber Token number
   * @param counterName Counter name
   */
  public notifyTokenCalled(patientId: string, patientName: string, tokenNumber: number, counterName: string): void {
    this.sendNotification({
      type: 'TOKEN_CALLED',
      message: `Token #${tokenNumber} for ${patientName} has been called to ${counterName}`,
      details: {
        patientId,
        patientName,
        tokenNumber,
        counterName
      }
    });
  }

  /**
   * Notify that a chat message has been sent
   * @param chatId Chat ID
   * @param messageId Message ID
   * @param senderId Sender ID
   * @param senderName Sender name
   * @param receiverId Receiver ID
   * @param content Message content
   * @param messageType Message type
   */
  public notifyChatMessage(
    chatId: string,
    messageId: string,
    senderId: string,
    senderName: string,
    receiverId: string,
    content: string,
    messageType: 'text' | 'image' | 'file' | 'video' | 'audio' | 'location' | 'contact' = 'text'
  ): void {
    this.sendNotification({
      type: 'CHAT_MESSAGE',
      message: `New message from ${senderName}`,
      details: {
        chatId,
        messageId,
        senderId,
        senderName,
        receiverId,
        content,
        messageType
      }
    });
  }

  /**
   * Notify that a user is typing in a chat
   * @param chatId Chat ID
   * @param userId User ID
   * @param userName User name
   * @param isTyping Whether the user is typing
   */
  public notifyTyping(chatId: string, userId: string, userName: string, isTyping: boolean): void {
    this.sendNotification({
      type: 'CHAT_TYPING',
      message: isTyping ? `${userName} is typing...` : '',
      details: {
        chatId,
        senderId: userId,
        senderName: userName,
        isTyping
      }
    });
  }

  /**
   * Notify that a message has been read
   * @param chatId Chat ID
   * @param messageId Message ID
   * @param userId User ID who read the message
   */
  public notifyMessageRead(chatId: string, messageId: string, userId: string): void {
    this.sendNotification({
      type: 'CHAT_READ',
      message: 'Message read',
      details: {
        chatId,
        messageId,
        senderId: userId
      }
    });
  }

  /**
   * Notify that a call has been initiated
   * @param callId Call ID
   * @param chatId Chat ID
   * @param callerId Caller ID
   * @param callerName Caller name
   * @param receiverId Receiver ID
   * @param receiverName Receiver name
   * @param callType Call type
   */
  public notifyCallInitiated(
    callId: string,
    chatId: string,
    callerId: string,
    callerName: string,
    receiverId: string,
    receiverName: string,
    callType: 'audio' | 'video'
  ): void {
    this.sendNotification({
      type: 'CALL_INITIATED',
      message: `Incoming ${callType} call from ${callerName}`,
      details: {
        callId,
        chatId,
        senderId: callerId,
        senderName: callerName,
        receiverId,
        receiverName,
        callType,
        callStatus: 'ringing'
      }
    });

    // In a real implementation, this would initiate a WebRTC connection
    console.log(`Initiating ${callType} call from ${callerId} to ${receiverId}`);

    // For demonstration purposes, we'll simulate the call setup
    setTimeout(() => {
      console.log(`${callType} call connection established`);

      // Emit a custom event for the call setup
      this.emit('call:setup', {
        callId,
        chatId,
        callerId,
        callerName,
        receiverId,
        receiverName,
        callType
      });
    }, 1000);
  }

  /**
   * Notify that a call has been answered
   * @param callId Call ID
   * @param receiverId Receiver ID
   */
  public notifyCallAnswered(callId: string, receiverId: string): void {
    this.sendNotification({
      type: 'CALL_ANSWERED',
      message: 'Call answered',
      details: {
        callId,
        senderId: receiverId,
        callStatus: 'ongoing'
      }
    });
  }

  /**
   * Notify that a call has been rejected
   * @param callId Call ID
   * @param receiverId Receiver ID
   */
  public notifyCallRejected(callId: string, receiverId: string): void {
    this.sendNotification({
      type: 'CALL_REJECTED',
      message: 'Call rejected',
      details: {
        callId,
        senderId: receiverId,
        callStatus: 'rejected'
      }
    });
  }

  /**
   * Notify that a call has ended
   * @param callId Call ID
   * @param userId User ID who ended the call
   */
  public notifyCallEnded(callId: string, userId: string): void {
    this.sendNotification({
      type: 'CALL_ENDED',
      message: 'Call ended',
      details: {
        callId,
        senderId: userId,
        callStatus: 'ended'
      }
    });
  }

  /**
   * Notify about an external message (e.g., from tawk.to)
   * @param externalChatId External chat ID
   * @param externalUserId External user ID
   * @param senderName Sender name
   * @param content Message content
   * @param source Source of the message (e.g., 'tawkto')
   * @param timestamp Message timestamp
   */
  public notifyExternalMessage(
    externalChatId: string,
    externalUserId: string,
    senderName: string,
    content: string,
    source: string,
    timestamp: string = new Date().toISOString()
  ): void {
    this.sendNotification({
      type: 'EXTERNAL_MESSAGE',
      message: `New message from ${senderName} via ${source}`,
      details: {
        externalChatId,
        externalUserId,
        senderName,
        content,
        externalSource: source,
        timestamp
      }
    });
  }

  /**
   * Register an event listener
   * @param event Event name
   * @param callback Callback function
   */
  public on(event: string, callback: (data: any) => void): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  /**
   * Remove an event listener
   * @param event Event name
   * @param callback Callback function
   */
  public off(event: string, callback: (data: any) => void): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.delete(callback);
    }
  }

  /**
   * Emit an event
   * @param event Event name
   * @param data Event data
   */
  public emit(event: string, data: any): void {
    if (this.listeners.has(event)) {
      this.listeners.get(event)?.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} event listener:`, error);
        }
      });
    }
  }
}

// Create a singleton instance
const webSocketService = new WebSocketService();
export default webSocketService;
