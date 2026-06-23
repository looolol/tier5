import { bungieClient } from "./client.js";
import { BungieUserProfile, CharacterSlots, CLASS_TYPE_MAP, DestinyCharacter, HydratedItem, InventorySummaryResponse } from "../types/tier5-models.js";
import { hydrateItem } from "../manifest/manifest.js";

export async function getBungieCurrentMembership(authHeader: string, apiKey: string): Promise<BungieUserProfile> {
    try {
        const response = await bungieClient.get('/User/GetMembershipsForCurrentUser', {
            headers: {
                'Authorization': authHeader,
                'X-API-Key': apiKey,
            }
        });

        const root = response.data?.Response;
        const profile = root?.bungieNetUser;

        const primaryDestiny = root?.destinyMemberships?.[0];

        return {
            username: profile?.uniqueName || 'Unknown Guardian',
            displayName: profile?.displayName || 'Guardian',
            profilePicture: `https://www.bungie.net${profile?.profilePicturePath || '/img/profile/avatars/default.jpg'}`,
            membershipType: primaryDestiny ? Number(primaryDestiny.membershipType): 0,
            membershipId: primaryDestiny ? primaryDestiny.membershipId : ''
        };
    } catch (error: any) {
        console.error('Bungie API Profile fetch failed:', error.response?.data || error.message);
        throw new Error('Failed to retrieve logged-in user profile data.');
    }
}

export async function getProfileInventory(
    apiKey: string,
    accessToken: string,
    membershipType: number,
    destinyMembershipId: string
): Promise<any> {
    // 102: Profile Inventory
    // 200: Characters
    // 201: Character Inventories
    // 205: Character Equipment
    const components = '102,200,201,205';
    const url = `https://www.bungie.net/Platform/Destiny2/${membershipType}/Profile/${destinyMembershipId}/?components=${components}`;

    try {
        const response = await bungieClient.get(url, {
            headers: {
                'X-API-Key': apiKey,
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return response.data.Response;
    } catch (error: any) {
        console.error('[BUNGIE API] Failed fetching profile inventory:', error.message);
        throw new Error('Failed to retrieve inventory data from Bungie.');
    }
}


export async function getUserInventorySummary(
    apiKey: string,
    accessToken: string,
    membershipType: number,
    membershipId: string
): Promise<InventorySummaryResponse> {
    try {
        const rawProfile = await getProfileInventory(apiKey, accessToken, membershipType, membershipId);

        const rawCharactersData = rawProfile.characters.data;
        const rawCharactersEquip = rawProfile.characterEquipment.data;
        const rawCharactersInventories = rawProfile.characterInventories.data;
        const rawVaultInventory = rawProfile.profileInventory.data.items;

        const mappedCharacters = mapCharacters(
            rawCharactersData,
            rawCharactersEquip,
            rawCharactersInventories
        );

        const mappedVault = mapVault(rawVaultInventory);

        return {
            characters: mappedCharacters,
            vault: mappedVault
        }
    } catch (error: any) {
        console.log('Inventory Aggregation Error:', error.message);
        throw new Error('Failed coordinating inventory matrix sync.');
    }
}

function mapCharacters(
    rawCharactersData: any,
    rawCharactersEquip: any,
    rawCharcatersInventories: any
): DestinyCharacter[] {
    return Object.keys(rawCharactersData).map((charId) => {
        const charInfo = rawCharactersData[charId];
        const currentCharacter = formatCharacter(charId, charInfo);

        const equippedItems = rawCharactersEquip[charId]?.items || [];
        populateCharacterSlots(currentCharacter, equippedItems, true);

        const inventoryItems = rawCharcatersInventories[charId]?.items || [];
        populateCharacterSlots(currentCharacter, inventoryItems, false);

        return currentCharacter;
    });
}

function formatCharacter(charId: string, rawCharInfo: any): DestinyCharacter
{
    return {
        characterId: charId,
        class: CLASS_TYPE_MAP[rawCharInfo.classType] || 'Unknown',
        light: rawCharInfo.light,
        emblem: `https://www.bungie.net${rawCharInfo.emblemPath}`,
        slots: {
            kinetic: [], energy: [], power: [],
            helmet: [], gauntlets: [], chest: [], legs: [], classItem: []
        }
    };
}

function populateCharacterSlots(
    charcter: DestinyCharacter, 
    rawItems: any[],
    isEquipped: boolean
): void {
    rawItems.forEach((item) => {
        const hydrated = hydrateItem(item);
        if (hydrated) { 
            const slotKey = hydrated.slot as keyof CharacterSlots;
            if (charcter.slots[slotKey]) {
                charcter.slots[slotKey].push({ ...hydrated, equipped: isEquipped });
            }
        }
    });
}

function mapVault(rawVaultInventory: any): HydratedItem[] {
    const formattedVault: any[] = [];
    rawVaultInventory.forEach((item: any) => {
        const hydrated = hydrateItem(item);
        if (hydrated) {
            formattedVault.push(hydrated);
        }
    });
    return formattedVault;
}