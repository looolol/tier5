import { Request, Response } from 'express';
import { getBungieCurrentMembership } from '@tier-5/bungie-api';

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ error: 'Missing active session token.' });
        }

        const profileData = await getBungieCurrentMembership(authHeader, process.env.BUNGIE_API_KEY || '');
        return res.json(profileData);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
};