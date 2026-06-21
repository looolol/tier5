import { bungieClient } from "./client.js";
import { ApiStatusResponse } from '../types/tier5-models.js'

export async function getBungieStatus(apiKey: string): Promise<ApiStatusResponse> {
    try {
        const startTime = Date.now();

        const response = await bungieClient.get('/GlobalAlerts/', {
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
            timestamp: new Date().toISOString(),
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