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

        const profile = response.data?.Response?.bungieNetUser;

        return {
            username: profile?.uniqueName || 'Unknown Guardian',
            displayName: profile?.displayName || 'Guardian',
            profilePicture: `https://www.bungie.net${profile?.profilePicturePath || '/img/profile/avatars/default.jpg'}`
        };
    } catch (error: any) {
        console.error('Bungie API Profile fetch failed:', error.response?.data || error.message);
        throw new Error('Failed to retrieve logged-in user profile data.');
    }
}