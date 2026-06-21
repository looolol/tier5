import { ComponentName, DestinyManifestMetadata } from "../types/tier5-models.js";
import { bungieClient } from "../live/client.js";


let manifestDb: Record<ComponentName, Record<string, any>> = {
    DestinyInventoryItemDefinition: {},
    DestinyStatDefinition: {},
    DestinySandboxPerkDefinition: {},
    DestinyPlugSetDefinition: {}
};


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

export function setManifestCache(component: ComponentName, data: Record<string, any>): void {
    manifestDb[component] = data;
}

export function getDefinitionByName(component: ComponentName, hash: number | string): any | null {
    return manifestDb[component]?.[hash.toString()] || null;
}

export function getItemByHash(hash: number | string): any | null {
    return getDefinitionByName('DestinyInventoryItemDefinition', hash);
}

export function getStatByHash(hash: number | string): any | null {
    return getDefinitionByName('DestinyStatDefinition', hash);
}

export function getPerkByHash(hash: number | string): any | null {
    return getDefinitionByName('DestinySandboxPerkDefinition', hash);
}

export function getPlugSetByHash(hash: number | string): any | null {
    return getDefinitionByName('DestinyPlugSetDefinition', hash);
}