import { Request, Response } from 'express';
import { ManifestEngine } from '../services/manifest-engine.js';

export const manifest = async (req: Request, res: Response): Promise<void> => {
    return;
}

export const hash = async (req: Request, res: Response) => {
    const hashParam = req.params.hash;
    const hash = Array.isArray(hashParam) ? hashParam[0] : hashParam;

    console.log(`Looking for hash ${hash}`)
    if (!hash) {
        return res.status(400).json({ error: 'Item hash is required.' });
    }

    const itemData = ManifestEngine.getItemByHash(hash);

    if (!itemData) {
        return res.status(404).json({ error: 'Item hash not found in local Manifest database.' });
    }

    return res.json({
        hash: itemData.hash,
        name: itemData.displayProperties?.name,
        icon: `https://www.bungie.net${itemData.displayProperties?.icon}`,
        itemType: itemData.itemTypeDisplayName,
        tier: itemData.inventory?.tierTypeName
    });
}