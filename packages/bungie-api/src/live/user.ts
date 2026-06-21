import { bungieClient } from "./client.js";
import { BungieUserProfile } from "../types/tier5-models.js";

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