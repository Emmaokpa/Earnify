import { Request, Response } from 'express';
import { getFirestore } from '../config/firebase';

// Get all active CPA offers
export const getActiveOffers = async (req: Request, res: Response) => {
    try {
        const db = getFirestore();
        const offersSnapshot = await db.collection('cpa_offers')
            .where('isActive', '==', true)
            .orderBy('reward', 'desc')
            .get();

        const offers = offersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return res.json({
            success: true,
            offers
        });

    } catch (error) {
        console.error('Error fetching CPA offers:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new CPA offer (Admin/Internal use)
export const createOffer = async (req: Request, res: Response) => {
    try {
        const { title, description, reward, link, imageUrl, category, type } = req.body;

        if (!title || !reward || !link) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const db = getFirestore();
        const newOffer = {
            title,
            description: description || '',
            reward: Number(reward),
            link,
            imageUrl: imageUrl || '',
            category: category || 'General',
            type: type || 'direct', // 'direct', 'offerwall', etc.
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = await db.collection('cpa_offers').add(newOffer);

        return res.json({
            success: true,
            offer: { id: docRef.id, ...newOffer }
        });

    } catch (error) {
        console.error('Error creating CPA offer:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Log click and redirect (simplified for now)
export const trackOfferClick = async (req: Request, res: Response) => {
    try {
        const { offerId } = req.params;
        const user = req.user;

        if (!user || !user.id) return res.status(401).json({ error: 'Unauthorized' });

        const db = getFirestore();

        // Log the click
        await db.collection('offer_clicks').add({
            userId: user.id.toString(),
            offerId,
            timestamp: new Date()
        });

        return res.json({ success: true, message: 'Click tracked' });

    } catch (error) {
        console.error('Error tracking offer click:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Handle postback from offerwalls (Standardized)
export const handlePostback = async (req: Request, res: Response) => {
    try {
        const { userId, reward, offerId, secret } = req.query;

        // Security check (ideally check IP or dynamic secret)
        if (secret !== process.env.POSTBACK_SECRET) {
            return res.status(403).json({ error: 'Unauthorized postback' });
        }

        if (!userId || !reward) {
            return res.status(400).json({ error: 'Missing data' });
        }

        const db = getFirestore();
        const userRef = db.collection('users').doc(userId.toString());

        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) throw new Error('User not found');

            const userData = userDoc.data();
            const rewardAmount = Number(reward);

            transaction.update(userRef, {
                pendingBalance: (userData?.pendingBalance || 0) + rewardAmount,
                totalEarned: (userData?.totalEarned || 0) + rewardAmount,
                updatedAt: new Date()
            });

            const transRef = db.collection('transactions').doc();
            transaction.set(transRef, {
                userId: userId.toString(),
                amount: rewardAmount,
                type: 'credit',
                category: 'cpa_reward',
                description: `CPA Task Complete: ${offerId || 'Portal Offer'}`,
                status: 'pending', // Move to available after verification
                createdAt: new Date()
            });
        });

        return res.status(200).send('1'); // Standard response for offerwalls

    } catch (error) {
        console.error('Postback error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
