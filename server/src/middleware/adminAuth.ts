import { Request, Response, NextFunction } from 'express';
import { getFirestore } from '../config/firebase';

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (!user || !user.id) {
            return res.status(401).json({
                success: false,
                error: 'Unauthorized',
                message: 'User not authenticated'
            });
        }

        const db = getFirestore();
        const userDoc = await db.collection('users').doc(user.id.toString()).get();

        if (!userDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'User not found',
                message: 'User account does not exist'
            });
        }

        const userData = userDoc.data();

        if (!userData?.isAdmin) {
            console.warn(`⚠️ User ${user.id} attempted to access admin route without privileges`);
            return res.status(403).json({
                success: false,
                error: 'Forbidden',
                message: 'Admin privileges required'
            });
        }

        // User is admin, proceed
        next();

    } catch (error) {
        console.error('❌ Admin verification error:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to verify admin status'
        });
    }
};
