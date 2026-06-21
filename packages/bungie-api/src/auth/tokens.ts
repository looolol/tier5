import axios from 'axios';
import { BungieOAuthConfig, BungieTokenResponse } from '../types/tier5-models.js';

export function getBungieAuthUrl(clientId: string): string {
    return `https://www.bungie.net/en/OAuth/Authorize?client_id=${clientId}&response_type=code&reauth=true`;
}

export async function exchangeBungieCodeForToken(
    code: string,
    config: BungieOAuthConfig
): Promise<BungieTokenResponse> {
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('code', code);
        params.append('client_id', config.clientId);
        params.append('client_secret', config.clientSecret);

        const response = await axios.post(
            'https://www.bungie.net/Platform/App/OAuth/Token/',
            params.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'X-API-Key': config.apiKey,
                },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error('Bungie API Library Error during token exchange:', error.response?.data || error.message);
        throw new Error('Failed to exchange authorization code via Bungie API package');
    }
}
