import express from 'express';
const router = express.Router();
import * as webhookController from '../controllers/webhookController.js';

// Tawk.to webhook endpoints
router.post('/tawkto', webhookController.handleTawktoWebhook);
router.post('/tawkto/reply', webhookController.handleTawktoReply);
router.get('/tawkto/history/:externalChatId', webhookController.getTawktoChatHistory);

export default router;
