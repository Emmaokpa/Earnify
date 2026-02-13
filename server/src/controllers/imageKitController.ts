import ImageKit from 'imagekit';
import { Request, Response } from 'express';

let imagekit: ImageKit | null = null;

// Only initialize if credentials are present
if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
    imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
}

export const getImageKitAuth = async (req: Request, res: Response) => {
    try {
        if (!imagekit) {
            return res.status(503).json({ error: 'ImageKit not configured' });
        }
        const authenticationParameters = imagekit.getAuthenticationParameters();
        res.json(authenticationParameters);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get auth parameters' });
    }
};
