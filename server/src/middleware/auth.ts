import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Extend Express Request type to include user data
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const verifyTelegramWebAppData = (req: Request, res: Response, next: NextFunction) => {
    const initData = req.headers['x-telegram-init-data'];

    if (!initData || typeof initData !== 'string') {
        return res.status(401).json({ error: 'Auth data missing' });
    }

    // If in dev mode and using mock data, bypass
    // if (process.env.NODE_ENV === 'development' && initData === 'mock_token') {
    //     req.user = { id: 12345, first_name: 'Dev User' };
    //     return next();
    // }

    if (!TELEGRAM_BOT_TOKEN) {
        console.error('TELEGRAM_BOT_TOKEN is not defined');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    const urlParams = new URLSearchParams(initData);
    const hash = urlParams.get('hash');

    if (!hash) {
        return res.status(401).json({ error: 'Hash missing' });
    }

    urlParams.delete('hash');

    const dataCheckString = Array.from(urlParams.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    const secretKey = crypto
        .createHmac('sha256', 'WebAppData')
        .update(TELEGRAM_BOT_TOKEN)
        .digest();

    const calculatedHash = crypto
        .createHmac('sha256', secretKey)
        .update(dataCheckString)
        .digest('hex');

    if (calculatedHash === hash) {
        const userString = urlParams.get('user');
        if (userString) {
            req.user = JSON.parse(userString);
        }
        next();
    } else {
        return res.status(403).json({ error: 'Invalid data signature' });
    }
};
