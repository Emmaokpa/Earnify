import { Router } from 'express';
import { verifyTelegramWebAppData } from '../middleware/auth';
import {
    createOrGetUser,
    getUserDashboard,
    getUserProfile,
    claimDailyReward,
    completeAdTask,
    requestWithdrawal
} from '../controllers/userController';

const router = Router();

// All routes require Telegram authentication
router.use(verifyTelegramWebAppData);

// Authentication
router.post('/auth', createOrGetUser);

// Dashboard & Profile
router.get('/dashboard', getUserDashboard);
router.get('/profile', getUserProfile);

// Earnings
router.post('/daily-reward', claimDailyReward);
router.post('/complete-ad', completeAdTask);
router.post('/withdraw', requestWithdrawal);

export default router;
