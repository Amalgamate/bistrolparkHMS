// import { db } from '../config/database.js';
import db from '../utils/db.js';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

/**
 * Handle webhook from tawk.to
 *
 * This endpoint receives messages from tawk.to and forwards them to the appropriate user
 *
 * Expected payload from tawk.to:
 * {
 *   "event": "message", // or "chat_start", "chat_end", etc.
 *   "chatId": "string", // tawk.to chat ID
 *   "visitorId": "string", // tawk.to visitor ID
 *   "visitorName": "string", // visitor name or "Guest"
 *   "message": "string", // message content
 *   "timestamp": "number" // Unix timestamp
 * }
 */
export const handleTawktoWebhook = async (req, res) => {
  try {
    const { event, chatId, visitorId, visitorName, message, timestamp } = req.body;

    console.log('Received tawk.to webhook:', req.body);

    // Validate required fields
    if (!event || !chatId || !visitorId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Handle different event types
    switch (event) {
      case 'message':
        if (!message) {
          return res.status(400).json({
            success: false,
            message: 'Missing message content'
          });
        }

        // Store the message in the database
        const messageId = uuidv4();
        const externalChatId = `tawkto_${visitorId}`;
        const senderName = visitorName || 'Guest';

        // Insert into external_messages table
        await db.query(
          `INSERT INTO external_messages
          (id, external_chat_id, external_user_id, sender_name, content, source, timestamp, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            messageId,
            externalChatId,
            visitorId,
            senderName,
            message,
            'tawkto',
            new Date(timestamp || Date.now()),
            'unread'
          ]
        );

        // Broadcast the message to all connected clients via WebSocket
        // This will be implemented in the WebSocket service
        // For now, we'll just log it
        console.log(`Broadcasting tawk.to message: ${message} from ${senderName}`);

        // In a real implementation, you would use a WebSocket server to broadcast the message
        // For example:
        // io.emit('external_message', {
        //   id: messageId,
        //   externalChatId,
        //   externalUserId: visitorId,
        //   senderName,
        //   content: message,
        //   source: 'tawkto',
        //   timestamp: new Date(timestamp || Date.now()),
        //   status: 'unread'
        // });

        break;

      case 'chat_start':
        // Handle chat start event
        console.log(`Tawk.to chat started with visitor ${visitorId} (${visitorName || 'Guest'})`);
        break;

      case 'chat_end':
        // Handle chat end event
        console.log(`Tawk.to chat ended with visitor ${visitorId} (${visitorName || 'Guest'})`);
        break;

      default:
        console.log(`Unhandled tawk.to event: ${event}`);
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Webhook received successfully'
    });
  } catch (error) {
    console.error('Error handling tawk.to webhook:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Handle reply to tawk.to message
 *
 * This endpoint sends a reply to a tawk.to chat
 *
 * Expected payload:
 * {
 *   "externalChatId": "string", // External chat ID
 *   "externalUserId": "string", // External user ID
 *   "content": "string", // Message content
 *   "userId": "string", // User ID of the sender
 *   "userName": "string" // User name of the sender
 * }
 */
export const handleTawktoReply = async (req, res) => {
  try {
    const { externalChatId, externalUserId, content, userId, userName } = req.body;

    // Validate required fields
    if (!externalChatId || !externalUserId || !content || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // In a real implementation, this would call the tawk.to API to send the message
    // For now, we'll just log it and store it in the database
    console.log(`Sending reply to tawk.to: ${content} to ${externalUserId}`);

    // Store the message in the database
    const messageId = uuidv4();

    await db.query(
      `INSERT INTO external_messages
      (id, external_chat_id, external_user_id, sender_name, content, source, timestamp, status, assigned_to)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        messageId,
        externalChatId,
        externalUserId,
        userName,
        content,
        'tawkto_reply',
        new Date(),
        'sent',
        userId
      ]
    );

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      messageId
    });
  } catch (error) {
    console.error('Error sending reply to tawk.to:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

/**
 * Get chat history for a tawk.to chat
 *
 * This endpoint retrieves the chat history for a tawk.to chat
 *
 * @param {string} externalChatId - External chat ID
 */
export const getTawktoChatHistory = async (req, res) => {
  try {
    const { externalChatId } = req.params;

    // Validate required fields
    if (!externalChatId) {
      return res.status(400).json({
        success: false,
        message: 'Missing external chat ID'
      });
    }

    // Get chat history from the database
    const result = await db.query(
      `SELECT * FROM external_messages
      WHERE external_chat_id = $1
      ORDER BY timestamp ASC`,
      [externalChatId]
    );

    // Return the chat history
    return res.status(200).json({
      success: true,
      messages: result.rows.map(row => ({
        id: row.id,
        externalChatId: row.external_chat_id,
        externalUserId: row.external_user_id,
        senderName: row.sender_name,
        content: row.content,
        timestamp: row.timestamp,
        source: row.source,
        status: row.status
      }))
    });
  } catch (error) {
    console.error('Error getting tawk.to chat history:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};
