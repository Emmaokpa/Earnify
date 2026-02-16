import { Request, Response } from 'express';
import { db } from '../config/firebase';

export const createSocialTask = async (req: Request, res: Response) => {
    try {
        const { channel_id, platform, budget, reward, title } = req.body;

        if (!channel_id || !platform || !budget) {
            return res.status(400).json({ success: false, message: 'Missing parameters' });
        }

        const taskData = {
            title: title || `Follow ${platform} Node`,
            channel_id,
            platform,
            budget: Number(budget),
            reward: reward || '1 EC',
            active: true,
            createdAt: new Date(),
            verifiedCount: 0
        };

        const docRef = await db.collection('social_tasks').add(taskData);

        res.status(200).json({
            success: true,
            message: 'Social task deployed to Nexus',
            taskId: docRef.id
        });
    } catch (error) {
        console.error('Social task creation error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getSocialTasks = async (req: Request, res: Response) => {
    try {
        const tasksSnapshot = await db.collection('social_tasks')
            .where('active', '==', true)
            .get();

        const tasks = tasksSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching social tasks' });
    }
};

export const placeFollowerOrder = async (req: Request, res: Response) => {
    try {
        const { platform, quantity, link, totalPrice } = req.body;
        const userId = (req as any).user?.id || 'anonymous';

        if (!platform || !quantity || !link) {
            return res.status(400).json({ success: false, message: 'Invalid order parameters' });
        }

        const orderData = {
            userId,
            platform,
            quantity: Number(quantity),
            link,
            totalPrice: Number(totalPrice),
            status: 'pending_payment',
            createdAt: new Date()
        };

        const docRef = await db.collection('follower_orders').add(orderData);

        res.status(200).json({
            success: true,
            message: 'Order recorded. Proceed to payment protocol.',
            orderId: docRef.id
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Order initialization failed' });
    }
};
