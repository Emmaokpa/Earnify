import { Router } from 'express';
import userRoutes from './userRoutes';
import cpaRoutes from './cpaRoutes';
import gameRoutes from './gameRoutes';
import socialRoutes from './socialRoutes';

const router = Router();

router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// User routes
router.use('/user', userRoutes);

// CPA routes
router.use('/cpa', cpaRoutes);

// Game routes
router.use('/games', gameRoutes);

// Social routes
router.use('/social', socialRoutes);

// Task routes
import taskRoutes from './taskRoutes';
router.use('/tasks', taskRoutes);

export default router;
