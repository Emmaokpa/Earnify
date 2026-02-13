import { Request, Response } from 'express';
import { getFirestore } from '../config/firebase';

// Get all games
export const getAllGames = async (req: Request, res: Response) => {
    try {
        const db = getFirestore();
        const gamesSnapshot = await db.collection('games')
            .where('isActive', '==', true)
            .orderBy('createdAt', 'desc')
            .get();

        const games = gamesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return res.json({
            success: true,
            games
        });

    } catch (error) {
        console.error('Error fetching games:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Create a new game
export const createGame = async (req: Request, res: Response) => {
    try {
        const { name, iframeUrl, imageUrl, minWager, maxWager } = req.body;

        if (!name || !iframeUrl) {
            return res.status(400).json({ error: 'Name and iframe URL are required' });
        }

        const db = getFirestore();
        const newGame = {
            name,
            iframeUrl,
            imageUrl: imageUrl || '',
            minWager: Number(minWager) || 50,
            maxWager: Number(maxWager) || 5000,
            totalPlays: 0,
            totalWagered: 0,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = await db.collection('games').add(newGame);

        return res.json({
            success: true,
            game: { id: docRef.id, ...newGame }
        });

    } catch (error) {
        console.error('Error creating game:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Log game play
export const logGamePlay = async (req: Request, res: Response) => {
    try {
        const { gameId } = req.params;
        const { wager, result } = req.body; // result: 'win' | 'loss'
        const user = req.user;

        if (!user || !user.id) return res.status(401).json({ error: 'Unauthorized' });

        const wagerAmount = Number(wager);
        if (!wagerAmount || wagerAmount < 50) {
            return res.status(400).json({ error: 'Minimum wager is ₦50' });
        }

        const db = getFirestore();
        const userRef = db.collection('users').doc(user.id.toString());

        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) throw new Error('User not found');

            const userData = userDoc.data();
            const currentBalance = userData?.balance || 0;

            if (currentBalance < wagerAmount) {
                throw new Error('Insufficient balance');
            }

            // Deduct wager
            transaction.update(userRef, {
                balance: currentBalance - wagerAmount,
                updatedAt: new Date()
            });

            // Log transaction
            const transRef = db.collection('transactions').doc();
            transaction.set(transRef, {
                userId: user.id.toString(),
                amount: wagerAmount,
                type: 'debit',
                category: 'game_wager',
                description: `PlayGama: ${gameId}`,
                status: 'completed',
                createdAt: new Date()
            });

            // Update game stats
            const gameRef = db.collection('games').doc(gameId);
            const gameDoc = await transaction.get(gameRef);
            if (gameDoc.exists) {
                transaction.update(gameRef, {
                    totalPlays: (gameDoc.data()?.totalPlays || 0) + 1,
                    totalWagered: (gameDoc.data()?.totalWagered || 0) + wagerAmount
                });
            }
        });

        return res.json({
            success: true,
            message: 'Wager placed successfully'
        });

    } catch (error: any) {
        console.error('Error logging game play:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};
