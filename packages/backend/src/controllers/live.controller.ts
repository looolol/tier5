import { Request, Response } from 'express';
import { getUserInventorySummary,  } from '@tier5/bungie-api';

  export const getUserInventory = async (req: Request, res: Response) => {
    console.log('[LIVE CONTROLLER] Getting user inventory...');
    try {
        const apiKey = process.env['BUNGIE_API_KEY']!;

        const accessToken = req.headers['authorization']?.replace('Bearer ', '') || '';
        const membershipType = Number(req.headers['x-membership-type']);
        const membershipId = req.headers['x-destiny-membership-id'] as string;

        if (!accessToken || !membershipId) {
            return res.status(401).json({ error: 'Missing active user credentials.' });
        }

        const inventorySummary = await getUserInventorySummary(
          apiKey,
          accessToken,
          membershipType,
          membershipId
        );
        console.log('[LIVE CONTROLLER] Success! Vault Length:', (await inventorySummary).vault.length);
        return res.status(200).json(inventorySummary);

    } catch (error: any) {
        console.log('[INVENTORY CONTROLLER] Aggregation Error:', error.message);
        return res.status(500).json({ error: 'Failed coordinating inventory matrix sync.' })
    }
  }