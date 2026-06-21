import { Request, Response } from 'express';
import { getProfileInventory, getItemByHash } from '@tier5/bungie-api';

const CLASS_TYPE_MAP: Record<number, string> = {
    0: 'Titan',
    1: 'Hunter',
    2: 'Warlock',
    3: 'Unknown'
};

const BUCKET_MAP: Record<number, string> = {
    1498876634: 'kinetic',
    2465295065: 'energy',
    953998645: 'power',

    3448274439: 'helmet',
    3551918588: 'gauntlets',
    14239492: 'chest',
    20886954: 'legs',
    1585787867: 'classItem'
  };

  export const getUserInventorySummary = async (req: Request, res: Response) => {
    try {
        const apiKey = process.env['BUNGIE_API_KEY']!;

        const accessToken = req.headers['authorization']?.replace('Bearer ', '') || '';
        const membershipType = Number(req.headers['x-membership-type']);
        const destinyMembershipId = req.headers['x-destiny-membership-id'] as string;

        if (!accessToken || !destinyMembershipId) {
            return res.status(401).json({ error: 'Missing active user credentials.' });
        }

        const rawProfile = await getProfileInventory(apiKey, accessToken, membershipType, destinyMembershipId);

        const charactersData = rawProfile.characters.data;
        const characterEquip = rawProfile.characterEquipment.data;
        const characterInventories = rawProfile.characterInventories.data;
        const vaultInventory = rawProfile.profileInventory.data.items;

        const formattedCharacters: Record<string, any> = {};

        const hydrateItem = (item: any) => {
            const manifestDetails = getItemByHash(item.itemHash);
            if (!manifestDetails) return null;

            const bucketHash = manifestDetails.inventory?.bucketTypeHash || 
                manifestDetails.equippingBlock?.equipmentSlotTypeHash;

            const slotKey = BUCKET_MAP[bucketHash];
            if (!slotKey) {
                console.log(`⚠️ [Dropped Item] ${manifestDetails.displayProperties?.name} | Type: ${manifestDetails.itemTypeDisplayName} | Missing Hash: ${bucketHash}`);
                return null; // Skip non-tracked items like materials or bounties for now
            }

            return {
                instanceId: item.itemInstanceId,
                hash: item.itemHash,
                name: manifestDetails.displayProperties?.name,
                icon: `https://www.bungie.net${manifestDetails.displayProperties?.icon}`,
                tier: manifestDetails.inventory?.tierTypeName,
                itemType: manifestDetails.itemTypeDisplayName,
                slot: slotKey
            };
        };

        Object.keys(charactersData).forEach((charId) => {
            const charInfo = charactersData[charId];

            formattedCharacters[charId] = {
                chararcterId: charId,
                class: CLASS_TYPE_MAP[charInfo.classType] || 'Unknown',
                light: charInfo.light,
                emblem: `https://www.bungie.net${charInfo.emblemPath}`,
                slots: {
                    kinetic: [], energy: [], power: [],
                    helmet: [], gauntlets: [], chest: [], legs: [], classItem: []
                }
            };

            const equippedItems = characterEquip[charId]?.items || [];
            equippedItems.forEach((item: any) => {
                const hydrated = hydrateItem(item);
                if (hydrated) {
                    formattedCharacters[charId].slots[hydrated.slot].push({ ...hydrated, equipped: true });
                }
            });

            const inventoryItems = characterInventories[charId]?.item || [];
            inventoryItems.forEach((item: any) => {
                const hydrated = hydrateItem(item);
                if (hydrated) {
                    formattedCharacters[charId].slots[hydrated.slot].push({ ...hydrated, equipped: false });
                }
            });
        });

        const formattedVault: any[] = [];
        vaultInventory.forEach((item: any) => {
            const hydrated = hydrateItem(item);
            if (hydrated) {
                formattedVault.push(hydrated);
            }
        });

        return res.json({
            characters: Object.values(formattedCharacters),
            vault: formattedVault
        });

    } catch (error: any) {
        console.log('INVENTORY CONTROLLER] Aggregation Error:', error.message);
        return res.status(500).json({ error: 'Failed coordinating inventory matrix sync.' })
    }
  }