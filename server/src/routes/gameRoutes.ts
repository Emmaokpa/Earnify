import { Router } from 'express';
import { verifyTelegramWebAppData } from '../middleware/auth';
import { getAllGames, createGame, logGamePlay } from '../controllers/gameController';

const router = Router();

// Protected routes
router.use(verifyTelegramWebAppData);

router.get('/list', getAllGames);
router.post('/create', createGame);
router.post('/play/:gameId', logGamePlay);

export default router;
