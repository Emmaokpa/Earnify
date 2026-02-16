import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const BOT_TOKEN = process.env.BOT_TOKEN;

// Extend Express Request type to include user data
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const verifyTelegramWebAppData = (req: Request, res: Response, next: NextFunction) => {
    let initData = req.headers['x-telegram-init-data'] as string;

    // Also support Authorization: Bearer <initData>
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
        initData = authHeader.substring(7);
    }

    if (!initData) {
        return res.status(401).json({
            success: false,
            error: 'Authentication required',
            message: 'Telegram initData missing from request headers'
        });
    }

    // Development bypass (optional - remove in production)
    if (process.env.NODE_ENV === 'development' && initData === 'dev_bypass_token') {
        req.user = { id: 999999, first_name: 'Dev', username: 'developer' };
        return next();
    }

    if (!BOT_TOKEN) {
        console.error('❌ BOT_TOKEN is not configured in environment variables');
        return res.status(500).json({
            success: false,
            error: 'Server misconfiguration',
            message: 'Bot token not found. Please configure BOT_TOKEN in .env'
        });
    }

    try {
        const urlParams = new URLSearchParams(initData);
        const hash = urlParams.get('hash');
        const authDate = urlParams.get('auth_date');

        if (!hash) {
            return res.status(401).json({
                success: false,
                error: 'Invalid authentication data',
                message: 'Hash signature missing'
            });
        }

        // Validate auth_date to prevent replay attacks (24 hour window)
        if (authDate) {
            const authTimestamp = parseInt(authDate);
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const timeDiff = currentTimestamp - authTimestamp;

            if (timeDiff > 86400) { // 24 hours
                return res.status(401).json({
                    success: false,
                    error: 'Authentication expired',
                    message: 'Session expired. Please restart the app.'
                });
            }
        }

        urlParams.delete('hash');

        // Build data-check-string according to Telegram's algorithm
        const dataCheckString = Array.from(urlParams.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        // Generate secret key from bot token
        const secretKey = crypto
            .createHmac('sha256', 'WebAppData')
            .update(BOT_TOKEN)
            .digest();

        // Calculate hash
        const calculatedHash = crypto
            .createHmac('sha256', secretKey)
            .update(dataCheckString)
            .digest('hex');

        if (calculatedHash !== hash) {
            console.warn('⚠️ Invalid Telegram signature detected');
            return res.status(403).json({
                success: false,
                error: 'Authentication failed',
                message: 'Invalid data signature. Possible tampering detected.'
            });
        }

        // Extract and parse user data
        const userString = urlParams.get('user');
        if (!userString) {
            return res.status(401).json({
                success: false,
                error: 'User data missing',
                message: 'No user information in authentication payload'
            });
        }

        req.user = JSON.parse(userString);
        console.log(`✅ Authenticated user: ${req.user.id} (${req.user.first_name})`);
        next();

    } catch (error) {
        console.error('❌ Authentication error:', error);
        return res.status(500).json({
            success: false,
            error: 'Authentication processing failed',
            message: 'Unable to verify Telegram credentials'
        });
    }
};
