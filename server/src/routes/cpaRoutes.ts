import { Router } from 'express';
import { verifyTelegramWebAppData } from '../middleware/auth';
import { getActiveOffers, createOffer, trackOfferClick, handlePostback } from '../controllers/cpaController';
import { getImageKitAuth } from '../controllers/imageKitController';

const router = Router();

// ImageKit Auth
router.get('/imagekit-auth', getImageKitAuth);

// Postback - Unprotected (called by Ad Networks)
router.get('/postback', handlePostback);

// App routes - Protected
router.use(verifyTelegramWebAppData);

router.get('/offers', getActiveOffers);
router.post('/click/:offerId', trackOfferClick);

// Potentially add admin middleware here later
router.post('/create', createOffer);

export default router;
