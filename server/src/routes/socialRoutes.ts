import { Router } from 'express';
import { verifyTelegramWebAppData } from '../middleware/auth';
import { verifyAdmin } from '../middleware/adminAuth';
import { createSocialTask, getSocialTasks, placeFollowerOrder } from '../controllers/socialController';

const router = Router();

// Publicly accessible for authenticated users
router.get('/list', verifyTelegramWebAppData, getSocialTasks);
router.post('/order', verifyTelegramWebAppData, placeFollowerOrder);

// Admin-only routes
router.post('/create', verifyTelegramWebAppData, verifyAdmin, createSocialTask);

export default router;
