import { Router } from 'express';
import { verifyTelegramWebAppData } from '../middleware/auth';
import { claimDailyReward, getTaskStatus } from '../controllers/taskController';

const router = Router();

router.use(verifyTelegramWebAppData);

router.post('/daily-claim', claimDailyReward);
router.get('/status', getTaskStatus);

export default router;
