import fs from 'fs';
import path from 'path';
import { getManifestMetadata, fetchManifestComponent } from '@tier5/bungie-api';

export class ManifestEngine {
    private static readonly MANIFEST_DIR = path.join(process.cwd(), 'data');
    private static readonly CACHE_FILE = path.join(this.MANIFEST_DIR, 'items_cache.json');
    private static readonly VERSION_FILE = path.join(this.MANIFEST_DIR, 'manifest_version.txt');

    private static itemDb: Record<string, any> = {};


    public static async initialize(): Promise<void> {
        const apiKey = process.env['BUNGIE_API_KEY'];
        if (!apiKey) {
            console.error('[MANIFEST ENGINE] ❌ BUNGIE_API_KEY is missing from environment layout.');
            return;
        }

        try {
            if (!fs.existsSync(this.MANIFEST_DIR)) {
                fs.mkdirSync(this.MANIFEST_DIR, { recursive: true });
            }

            console.log('[MANIFEST ENGINE] 🔍 Checking Vanguard database freshness...');
            const metadata = await getManifestMetadata(apiKey);
            const remoteVersion = metadata.version;

            const localVersion = fs.existsSync(this.VERSION_FILE)
                ? fs.readFileSync(this.VERSION_FILE, 'utf-8').trim()
                : null;

            if (localVersion === remoteVersion && fs.existsSync(this.CACHE_FILE)) {
                console.log(`[MANIFEST ENGINE] 🧠 Cache is fresh (Version: ${remoteVersion}).  Loading into memory...`);
                this.loadCacheIntoMemory();
            } else {
                console.log(`[MANIFEST ENGINE] 🔄 Manifest outdated or missing.  Down-streaming latest definitions from Bungie...`);
                const relativeItemPath = metadata.jsonWorldComponentContentPaths.en.DestinyInventoryItemDefinition;

                await this.downloadComponent(relativeItemPath);
                fs.writeFileSync(this.VERSION_FILE, remoteVersion, 'utf-8');
                console.log(`[MANIFEST ENGINE] ✅ Successfully synced manifest version: ${remoteVersion}`);
            }
        } catch (error: any) {
            console.error('[MANIFEST ENGINE] ❌ Engine initialization critical failure:', error.message);
            if (fs.existsSync(this.CACHE_FILE)) {
                console.warn('[MANIFEST ENGINE] ⚠️ Loading stale offlien backup cache.');
                this.loadCacheIntoMemory();
            }
        }
    }

    public static getItemByHash(hash: number | string): any | null {
        return this.itemDb[hash.toString()] || null;
    }

    private static async downloadComponent(relativeUrl: string): Promise<void> {
        console.log(`[MANIFEST ENGINE] Requesting component extraction via bungie-api client layer...`);
        
        const data = await fetchManifestComponent(relativeUrl);

        fs.writeFileSync(this.CACHE_FILE, JSON.stringify(data), 'utf-8');
        this.itemDb = data;
        console.log(`[MANIFEST ENGINE] Successfully cached ${Object.keys(data).length} Destiny items.`);
    }

    private static loadCacheIntoMemory(): void {
        const rawData = fs.readFileSync(this.CACHE_FILE, 'utf-8');
        this.itemDb = JSON.parse(rawData);
        console.log(`[MANIFEST ENGINE] Memory hot-swap complete.  Loaded ${Object.keys(this.itemDb).length} item schemas.`);
    }
}