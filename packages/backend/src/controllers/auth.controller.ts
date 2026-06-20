import { Request, Response } from 'express';
import { getBungieAuthUrl, exchangeBungieCodeForToken } from '@tier-5/bungie-api';


export const loginWithBungie = (req: Request, res: Response): void => {
    const clientId = process.env.BUNGIE_CLIENT_ID || '';
    const authUrl = getBungieAuthUrl(clientId);
    res.redirect(authUrl);
};

export const handleBungieCallback = async (req: Request, res: Response): Promise<void> => {
    const code = req.query.code as string;

    if (!code) {
        res.status(400).json({ error: 'No authorization code provided from Bungie.' });
        return;
    }

    try {
        const tokens = await exchangeBungieCodeForToken(code, {
            clientId: process.env.BUNGIE_CLIENT_ID || '',
            clientSecret: process.env.BUNGIE_CLIENT_SECRET || '',
            apiKey: process.env.BUNGIE_API_KEY || '',
        });

        res.redirect(`https://tier5.local/auth/callback?token=${tokens.access_token}`);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};