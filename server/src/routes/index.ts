import { Router } from 'express';
import userRoutes from './userRoutes';
import cpaRoutes from './cpaRoutes';

const router = Router();

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// User routes
router.use('/user', userRoutes);

// CPA routes
router.use('/cpa', cpaRoutes);

export default router;
