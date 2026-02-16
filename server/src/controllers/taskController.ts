import { Request, Response } from 'express';
import { db } from '../config/firebase';
import admin from 'firebase-admin';

export const claimDailyReward = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const userRef = db.collection('users').doc(userId.toString());
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const userData = userDoc.data();
        const now = new Date();
        const lastClaim = userData?.lastDailyClaim ? userData.lastDailyClaim.toDate() : null;

        let currentStreak = userData?.dailyStreak || 0;
        const rewards = [1, 2, 4, 8, 15, 25, 50]; // EC rewards for Day 1-7

        if (lastClaim) {
            const hoursSinceLastClaim = (now.getTime() - lastClaim.getTime()) / (1000 * 60 * 60);

            if (hoursSinceLastClaim < 24) {
                const remainingTime = 24 - hoursSinceLastClaim;
                return res.status(400).json({
                    success: false,
                    message: `Cooldown active. Returns in ${Math.ceil(remainingTime)}h`
                });
            }

            if (hoursSinceLastClaim < 48) {
                // Continued streak
                currentStreak = (currentStreak % 7) + 1;
            } else {
                // Streak broken
                currentStreak = 1;
            }
        } else {
            // First time claim
            currentStreak = 1;
        }

        const rewardAmount = rewards[currentStreak - 1];

        await userRef.update({
            balance: admin.firestore.FieldValue.increment(rewardAmount),
            dailyStreak: currentStreak,
            lastDailyClaim: admin.firestore.Timestamp.fromDate(now),
            totalEarned: admin.firestore.FieldValue.increment(rewardAmount)
        });

        // Log transaction
        await db.collection('transactions').add({
            userId,
            type: 'daily_claim',
            amount: rewardAmount,
            streak: currentStreak,
            timestamp: admin.firestore.Timestamp.fromDate(now)
        });

        res.status(200).json({
            success: true,
            message: `Claimed ${rewardAmount} EC!`,
            reward: rewardAmount,
            streak: currentStreak
        });

    } catch (error) {
        console.error('Daily claim error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getTaskStatus = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        const userDoc = await db.collection('users').doc(userId.toString()).get();

        if (!userDoc.exists) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const data = userDoc.data();
        const lastClaim = data?.lastDailyClaim ? data.lastDailyClaim.toDate() : null;
        const hoursSince = lastClaim ? (new Date().getTime() - lastClaim.getTime()) / (1000 * 60 * 60) : 999;

        res.status(200).json({
            success: true,
            streak: data?.dailyStreak || 0,
            canClaim: hoursSince >= 24,
            nextClaimIn: hoursSince < 24 ? Math.ceil(24 - hoursSince) : 0
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching status' });
    }
};
