import fs from 'fs';
import path from 'path';
import { getManifestMetadata, fetchManifestComponent, MANIFEST_COMPONENTS, ComponentName } from '@tier5/bungie-api';

export class ManifestEngine {
    private static readonly MANIFEST_DIR = path.join(process.cwd(), 'data');
    private static readonly CACHE_FILE = path.join(this.MANIFEST_DIR, 'items_cache.json');
    private static readonly VERSION_FILE = path.join(this.MANIFEST_DIR, 'manifest_version.txt');

    private static db: Record<ComponentName, Record<string, any>> = {
        DestinyInventoryItemDefinition: {},
        DestinyStatDefinition: {},
        DestinySandboxPerkDefinition: {},
        DestinyPlugSetDefinition: {}
    };


    public static async initialize(): Promise<void> {
        const apiKey = process.env['BUNGIE_API_KEY'];
        if (!apiKey) {
            console.error('[MANIFEST ENGINE] ❌ BUNGIE_API_KEY is missing from environment layout.');
            return;
        }

        let allFilesExist = false;

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

            allFilesExist = MANIFEST_COMPONENTS.every(comp => 
                fs.existsSync(path.join(this.MANIFEST_DIR, `${comp}.json`))
            );

            if (localVersion === remoteVersion && allFilesExist) {
                console.log(`[MANIFEST ENGINE] 🧠 All components fresh (Version: ${remoteVersion}).  Loading to memory...`);
                this.loadAllCachesIntoMemory();
            } else {
                console.log(`[MANIFEST ENGINE] 🔄 Manifest outdated or missing.  Initiating parallel downstream download...`);

                const paths = metadata.jsonWorldComponentContentPaths.en;
                const downloadTasks = MANIFEST_COMPONENTS.map(componentName => {
                    const relativeUrl = paths[componentName];
                    return this.downloadAndCacheComponent(componentName, relativeUrl);
                });

                await Promise.all(downloadTasks);
                fs.writeFileSync(this.VERSION_FILE, remoteVersion, 'utf-8');
                console.log(`[MANIFEST ENGINE] ✅ All components synchronized to version: ${remoteVersion}`);

                this.debugEngineStartup();
            }
        } catch (error: any) {
            console.error('[MANIFEST ENGINE] ❌ Critical pipeline initialization failure:', error.message);
            if (allFilesExist) {
                console.warn('[MANIFEST ENGINE] ⚠️ Initializatio failed.  Rolling back to offline storage caches.');
                this.loadAllCachesIntoMemory();
            }
        }
    }

    public static getDefinitionByName(component: ComponentName, hash: number | string): any | null {
        return this.db[component]?.[hash.toString()] || null;
    }

    public static getItemsByHash(hash: number | string): any | null {
        return this.getDefinitionByName('DestinyInventoryItemDefinition', hash);
    }

    private static async downloadAndCacheComponent(component: ComponentName, relativeUrl: string): Promise<void> {
        console.log(`[MANIFEST ENGINE] 📥 Downloading component: ${component}..`);
        
        const data = await fetchManifestComponent(relativeUrl);

        const targetFilePath = path.join(this.MANIFEST_DIR, `${component}.json`);
        fs.writeFileSync(targetFilePath, JSON.stringify(data), 'utf-8');

        this.db[component] = data;
        console.log(`[MANIFEST ENGINE] 💾 Cached ${Object.keys(data).length} elements for ${component}`);
    }

    private static loadAllCachesIntoMemory(): void {
        MANIFEST_COMPONENTS.forEach(component => {
            const targetFilePath = path.join(this.MANIFEST_DIR, `${component}.json`);
            const rawData = fs.readFileSync(targetFilePath, 'utf-8');
            this.db[component] = JSON.parse(rawData);
            console.log(`[MANIFEST ENGINE] 🧠 Loaded ${Object.keys(this.db[component]).length} keys into memory for: ${component}`);
        });
    }

    private static debugEngineStartup(): void {
        console.log('--- [MANIFEST ENGINE LIVE VERIFICATION] ---');
        const itemsCount = Object.keys(this.db.DestinyInventoryItemDefinition).length;
        const statsCount = Object.keys(this.db.DestinyStatDefinition).length;
        const perksCount = Object.keys(this.db.DestinySandboxPerkDefinition).length;
        const plugSetCount = Object.keys(this.db.DestinyPlugSetDefinition).length;
        
        console.log(`Available Items: ${itemsCount}`);
        console.log(`Available Stats: ${statsCount}`);
        console.log(`Available Perks: ${perksCount}`);
        console.log(`Available Plug Sets: ${plugSetCount}`);
        console.log('-------------------------------------------');
      }
}