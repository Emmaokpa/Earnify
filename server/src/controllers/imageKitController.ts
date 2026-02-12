import ImageKit from 'imagekit';
import { Request, Response } from 'express';

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

export const getImageKitAuth = async (req: Request, res: Response) => {
    try {
        const authenticationParameters = imagekit.getAuthenticationParameters();
        res.json(authenticationParameters);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get auth parameters' });
    }
};
