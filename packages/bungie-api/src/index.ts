import axios from 'axios';

export interface BungieOAuthConfig {
    clientId: string;
    clientSecret: string;
    apiKey: string;
}

export interface BungieTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in?: number;
    membership_id: string;
}

export function getBungieAuthUrl(clientId: string): string {
    return `https://www.bungie.net/en/OAuth/Authorize?client_id=${clientId}&response_type=code`;
}

export async function exchangeBungieCodeForToken(
    code: string,
    config: BungieOAuthConfig
): Promise<BungieTokenResponse> {
    try {
        const response = await axios.post(
            'https://www.bungie.net/platform/app/oauth/token/',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                client_id: config.clientId,
                client_secret: config.clientSecret,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlenoded',
                    'X-API-Key': config.apiKey,
                },
            }
        );

        return response.data;
    } catch (error: any) {
        console.error('Bungie API Library Error during token exchange:', error.response?.data || error.message);
        throw new Error('Failed to exchange authoriation code via Bungie API package');
    }
}

export async function getBungieStatus(apiKey: string) {
    try {
        const startTime = Date.now();

        const response = await axios.get('https://www.bungie.net/Platform/GlobalAlerts/', {
            headers: {
                'X-API-Key': apiKey,
            },
        });

        const latency = `${Date.now() - startTime} ms`;

        const alerts = response.data?.Response || [];
        const isOnline = response.status === 200;

        return {
            status: isOnline ? 'ONLINE' : 'OFFLINE',
            latency,
            alerts: alerts.map((alert: any) => ({
                body: alert.AlertHtml,
                type: alert.AlertType,
                timestamp: alert.AlertTimestamp,
            })),
            timestamp: new Date().toISOString()
        };
    } catch (error: any) {
        console.error('Bungie Status Check Failed:', error.message);
        return {
            status: 'DOWN',
            latency: '0ms',
            error: error.response?.data?.Message || 'Bungie API is unreachable.',
            timestamp: new Date().toISOString(),
        };
    }
}