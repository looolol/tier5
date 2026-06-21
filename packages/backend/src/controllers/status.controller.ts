import { Request, Response } from 'express';
import { getBungieStatus } from '@tier5/bungie-api';

export const getApiStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
        const apiKey = process.env.BUNGIE_API_KEY || '';
        const status = await getBungieStatus(apiKey);
        return res.json(status);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
