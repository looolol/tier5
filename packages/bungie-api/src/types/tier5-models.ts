export interface BungieOAuthConfig {
    clientId: string;
    clientSecret: string;
    apiKey: string;
}

export interface BungieTokenResponse {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in?: number,
    membership_id: string;
}

export interface BungieAlert {
    body: string;
    type: number;
    timestamp: string;
}

export interface ApiStatusResponse {
    status: 'ONLINE' | 'OFFLINE' | 'DOWN';
    latency: string;
    timestamp: string;
    alerts?: BungieAlert[];
    error?: string;
}

export interface BungieUserProfile {
    username: string;
    displayName: string;
    profilePicture: string;
}

export interface DestinyManifestMetadata {
    version: string;
    jsonWorldComponentContentPaths: {
        en: {
            DestinyInventoryItemDefinition: string;
            DestinyStatDefinition: string;
            DestinySandboxPerkDefinition: string;
            DestinyPlugSetDefinition: string;
        }
    }
}

export const MANIFEST_COMPONENTS = [
    'DestinyInventoryItemDefinition',
    'DestinyStatDefinition',
    'DestinySandboxPerkDefinition',
    'DestinyPlugSetDefinition'
] as const;

export type ComponentName = typeof MANIFEST_COMPONENTS[number];