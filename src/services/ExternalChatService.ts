/**
 * Service for interacting with external chat services like tawk.to
 */
import axios from 'axios';

class ExternalChatService {
  private apiBaseUrl: string;
  
  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
  }
  
  /**
   * Send a message to a tawk.to chat
   * @param externalChatId External chat ID
   * @param externalUserId External user ID
   * @param content Message content
   * @param userId User ID of the sender
   * @param userName User name of the sender
   * @returns Promise with the result
   */
  public async sendTawktoMessage(
    externalChatId: string,
    externalUserId: string,
    content: string,
    userId: string,
    userName: string
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await axios.post(`${this.apiBaseUrl}/webhooks/tawkto/reply`, {
        externalChatId,
        externalUserId,
        content,
        userId,
        userName
      });
      
      return {
        success: true,
        messageId: response.data.messageId
      };
    } catch (error) {
      console.error('Error sending message to tawk.to:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Get chat history from tawk.to
   * @param externalChatId External chat ID
   * @returns Promise with the chat history
   */
  public async getTawktoChatHistory(externalChatId: string): Promise<{
    success: boolean;
    messages?: Array<{
      id: string;
      externalChatId: string;
      externalUserId: string;
      senderName: string;
      content: string;
      timestamp: string;
      source: string;
    }>;
    error?: string;
  }> {
    try {
      const response = await axios.get(`${this.apiBaseUrl}/webhooks/tawkto/history/${externalChatId}`);
      
      return {
        success: true,
        messages: response.data.messages
      };
    } catch (error) {
      console.error('Error getting tawk.to chat history:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Create a singleton instance
const externalChatService = new ExternalChatService();
export default externalChatService;
