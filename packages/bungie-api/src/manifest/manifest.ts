import { DestinyManifestMetadata } from "../types/tier5-models.js";
import { bungieClient } from "../live/client.js";

export async function getManifestMetadata(apiKey: string): Promise<DestinyManifestMetadata> {
    try {
        const response = await bungieClient.get<{ Response: DestinyManifestMetadata }>('/Destiny2/Manifest/', {
            headers: { 'X-API-Key': apiKey }
        });
        return response.data.Response;
    } catch (error: any) {
        console.error('Failed to pull Manifest routing metadata:', error.message);
        throw new Error('Could not fetch manifest paths from Bungie.');
    }
}

export async function fetchManifestComponent<T = any>(relativeUrl:string): Promise<T> {
    const BUNGIE_BASE_URL = 'https://www.bungie.net';
    const fullUrl = `${BUNGIE_BASE_URL}${relativeUrl}`;

    try {
        const response = await bungieClient.get<T>(fullUrl, {
            responseType: 'json'
        });
        return response.data
    } catch (error: any) {
        console.error(`[BUNGIE API] Failed downloading manifest component from ${fullUrl}:`, error.message);
        throw new Error('Failed to download requested Destiny 2 manifest component definition.');
    }
}