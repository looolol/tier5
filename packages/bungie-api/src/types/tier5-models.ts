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
    membershipType: number;
    membershipId: string;
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

  
export interface HydratedItem {
    instanceId?: string;
    hash: number;
    name: string;
    icon: string;
    tier: string;
    itemType: string;
    slot: string;
    equipped?: boolean;
}

export interface CharacterSlots {
    kinetic: HydratedItem[];
    energy: HydratedItem[];
    power: HydratedItem[];
    helmet: HydratedItem[];
    gauntlets: HydratedItem[];
    chest: HydratedItem[];
    legs: HydratedItem[];
    classItem: HydratedItem[];
}

export interface DestinyCharacter {
    characterId: string;
    class:  GuardianClass;
    light: number;
    emblem: string;
    slots: CharacterSlots;
}

export interface InventorySummaryResponse {
    characters: DestinyCharacter[];
    vault: HydratedItem[];
}

export type GuardianClass = 'Warlock' | 'Hunter' | 'Titan' | 'Unknown';

export const CLASS_TYPE_MAP: Record<number, GuardianClass> = {
    0: 'Titan',
    1: 'Hunter',
    2: 'Warlock',
    3: 'Unknown'
};

export const BUCKET_MAP: Record<number, string> = {
    1498876634: 'kinetic',
    2465295065: 'energy',
    953998645: 'power',

    3448274439: 'helmet',
    3551918588: 'gauntlets',
    14239492: 'chest',
    20886954: 'legs',
    1585787867: 'classItem'
  };
