import { Request, Response } from 'express';
import { getFirestore } from '../config/firebase';
import crypto from 'crypto';

// Generate unique referral code
const generateReferralCode = (): string => {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// Create or get user
export const createOrGetUser = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        if (!user || !user.id) {
            return res.status(400).json({ error: 'Invalid user data' });
        }

        const db = getFirestore();
        const userRef = db.collection('users').doc(user.id.toString());
        const userDoc = await userRef.get();

        if (userDoc.exists) {
            // User exists, return user data
            const userData = userDoc.data();
            return res.json({
                success: true,
                user: userData,
                isNewUser: false
            });
        }

        // New user - create account
        const referralCode = generateReferralCode();
        const referredBy = req.body.referralCode || null;

        const newUser = {
            telegramId: user.id.toString(),
            username: user.username || '',
            firstName: user.first_name || '',
            lastName: user.last_name || '',

            referralCode,
            referredBy,

            balance: 0,
            pendingBalance: 0,
            totalEarned: 0,
            referralEarnings: 0,

            dailyStreak: 0,
            lastLogin: new Date(),
            level: 1,

            isBlocked: false,
            deviceFingerprint: req.body.deviceFingerprint || '',
            ipHistory: [req.ip || 'unknown'],
            flags: [],

            createdAt: new Date(),
            updatedAt: new Date()
        };

        await userRef.set(newUser);

        // If user was referred, update referrer's stats
        if (referredBy) {
            await updateReferrerStats(referredBy, user.id.toString());
        }

        return res.json({
            success: true,
            user: newUser,
            isNewUser: true
        });

    } catch (error) {
        console.error('Error in createOrGetUser:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Update referrer statistics
const updateReferrerStats = async (referralCode: string, newUserId: string) => {
    try {
        const db = getFirestore();

        // Find referrer by referral code
        const usersSnapshot = await db.collection('users')
            .where('referralCode', '==', referralCode)
            .limit(1)
            .get();

        if (usersSnapshot.empty) {
            console.warn(`Referral code ${referralCode} not found`);
            return;
        }

        const referrerDoc = usersSnapshot.docs[0];
        const referrerId = referrerDoc.id;

        // Update or create referrals document
        const referralRef = db.collection('referrals').doc(referrerId);
        const referralDoc = await referralRef.get();

        if (referralDoc.exists) {
            // Update existing
            await referralRef.update({
                totalReferrals: (referralDoc.data()?.totalReferrals || 0) + 1,
                referrals: [
                    ...(referralDoc.data()?.referrals || []),
                    {
                        userId: newUserId,
                        joinedAt: new Date(),
                        isActive: false,
                        totalEarnings: 0,
                        commissionEarned: 0
                    }
                ],
                updatedAt: new Date()
            });
        } else {
            // Create new
            await referralRef.set({
                userId: referrerId,
                totalReferrals: 1,
                activeReferrals: 0,
                totalEarned: 0,
                referrals: [{
                    userId: newUserId,
                    joinedAt: new Date(),
                    isActive: false,
                    totalEarnings: 0,
                    commissionEarned: 0
                }],
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
    } catch (error) {
        console.error('Error updating referrer stats:', error);
    }
};

// Get user dashboard data
export const getUserDashboard = async (req: Request, res: Response) => {
    try {
        const user = req.user;

        if (!user || !user.id) {
            return res.status(400).json({ error: 'Invalid user data' });
        }

        const db = getFirestore();
        const userId = user.id.toString();

        // Get user data
        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userDoc.data();

        // Get referral stats
        const referralDoc = await db.collection('referrals').doc(userId).get();
        const referralData = referralDoc.exists ? referralDoc.data() : {
            totalReferrals: 0,
            activeReferrals: 0,
            totalEarned: 0
        };

        // Get recent transactions
        const transactionsSnapshot = await db.collection('transactions')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .limit(10)
            .get();

        const transactions = transactionsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return res.json({
            success: true,
            dashboard: {
                balance: userData?.balance || 0,
                pendingBalance: userData?.pendingBalance || 0,
                totalEarned: userData?.totalEarned || 0,
                referralEarnings: userData?.referralEarnings || 0,
                dailyStreak: userData?.dailyStreak || 0,
                level: userData?.level || 1,
                referralStats: {
                    totalReferrals: referralData?.totalReferrals || 0,
                    activeReferrals: referralData?.activeReferrals || 0,
                    totalEarned: referralData?.totalEarned || 0
                },
                recentTransactions: transactions
            }
        });

    } catch (error) {
        console.error('Error in getUserDashboard:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Claim daily reward
export const claimDailyReward = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user || !user.id) return res.status(400).json({ error: 'Invalid user data' });

        const db = getFirestore();
        const userRef = db.collection('users').doc(user.id.toString());
        const userDoc = await userRef.get();

        if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });

        const userData = userDoc.data();
        const now = new Date();
        const lastLogin = userData?.lastLogin?.toDate() || new Date(0);

        // Difference in hours
        const diffHours = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);

        if (diffHours < 24) {
            return res.status(400).json({
                success: false,
                message: 'Daily reward already claimed today',
                nextClaimIn: Math.ceil(24 - diffHours)
            });
        }

        let newStreak = (userData?.dailyStreak || 0) + 1;
        // Reset streak if missed more than 48 hours
        if (diffHours > 48) {
            newStreak = 1;
        }

        const rewardAmount = 20; // Fixed ₦20 for now, could be scaled by streak

        await db.runTransaction(async (transaction) => {
            transaction.update(userRef, {
                balance: (userData?.balance || 0) + rewardAmount,
                totalEarned: (userData?.totalEarned || 0) + rewardAmount,
                dailyStreak: newStreak,
                lastLogin: now,
                updatedAt: now
            });

            const transRef = db.collection('transactions').doc();
            transaction.set(transRef, {
                userId: user.id.toString(),
                amount: rewardAmount,
                type: 'credit',
                category: 'daily_reward',
                description: `Daily login reward - Day ${newStreak}`,
                status: 'completed',
                createdAt: now
            });
        });

        return res.json({
            success: true,
            message: 'Daily reward claimed!',
            reward: rewardAmount,
            streak: newStreak
        });

    } catch (error) {
        console.error('Error claiming daily reward:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Complete Ad Reward
export const completeAdTask = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user || !user.id) return res.status(400).json({ error: 'Invalid user data' });

        const db = getFirestore();
        const userId = user.id.toString();
        const userRef = db.collection('users').doc(userId);

        const rewardAmount = 5; // ₦5 per ad

        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) throw new Error('User not found');

            const userData = userDoc.data();

            transaction.update(userRef, {
                balance: (userData?.balance || 0) + rewardAmount,
                totalEarned: (userData?.totalEarned || 0) + rewardAmount,
                updatedAt: new Date()
            });

            const transRef = db.collection('transactions').doc();
            transaction.set(transRef, {
                userId,
                amount: rewardAmount,
                type: 'credit',
                category: 'ad_reward',
                description: 'Watched rewarded video ad',
                status: 'completed',
                createdAt: new Date()
            });
        });

        return res.json({
            success: true,
            message: 'Ad reward added!',
            reward: rewardAmount
        });

    } catch (error) {
        console.error('Error completing ad task:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
// Get user profile
export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (!user || !user.id) return res.status(400).json({ error: 'Invalid user data' });

        const db = getFirestore();
        const userDoc = await db.collection('users').doc(user.id.toString()).get();

        if (!userDoc.exists) return res.status(404).json({ error: 'User not found' });

        const userData = userDoc.data();

        return res.json({
            success: true,
            profile: {
                telegramId: userData?.telegramId,
                username: userData?.username,
                firstName: userData?.firstName,
                lastName: userData?.lastName,
                referralCode: userData?.referralCode,
                level: userData?.level,
                createdAt: userData?.createdAt,
                dailyStreak: userData?.dailyStreak
            }
        });

    } catch (error) {
        console.error('Error in getUserProfile:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Request withdrawal
export const requestWithdrawal = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const { amount, bank, accountNumber } = req.body;

        if (!user || !user.id) return res.status(400).json({ error: 'Invalid user data' });
        if (!amount || !bank || !accountNumber) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const withdrawalAmount = Number(amount);
        if (withdrawalAmount < 500) {
            return res.status(400).json({ success: false, message: 'Minimum withdrawal is ₦500' });
        }

        const db = getFirestore();
        const userRef = db.collection('users').doc(user.id.toString());

        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (!userDoc.exists) throw new Error('User not found');

            const userData = userDoc.data();
            const currentBalance = userData?.balance || 0;

            if (currentBalance < withdrawalAmount) {
                throw new Error('Insufficient balance');
            }

            // Deduct from balance and move to pending
            transaction.update(userRef, {
                balance: currentBalance - withdrawalAmount,
                pendingBalance: (userData?.pendingBalance || 0) + withdrawalAmount,
                updatedAt: new Date()
            });

            // Log withdrawal transaction
            const transRef = db.collection('transactions').doc();
            transaction.set(transRef, {
                userId: user.id.toString(),
                amount: withdrawalAmount,
                type: 'debit',
                category: 'withdrawal',
                description: `Withdrawal request to ${bank} (${accountNumber})`,
                status: 'pending',
                bankDetails: { bank, accountNumber },
                createdAt: new Date()
            });
        });

        return res.json({
            success: true,
            message: 'Withdrawal request submitted successfully'
        });

    } catch (error: any) {
        console.error('Error in requestWithdrawal:', error);
        return res.status(400).json({
            success: false,
            message: error.message || 'Internal server error'
        });
    }
};
