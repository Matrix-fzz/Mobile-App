import { Router } from 'express';
import { sendMessage, getConversation, getInbox } from '../controllers/messagesController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', protect, sendMessage);
router.get('/inbox', protect, getInbox); // Tjib kol conversations dyal l user
router.get('/conversation/:otherUserId', protect, getConversation); // Tjib l'conversation m3a user wehd

export default router;