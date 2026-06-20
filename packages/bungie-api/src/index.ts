export interface SystemStatus {
    status: string;
    version: string;
    timestamp: string;
}

export function getMockBungieStatus(): SystemStatus {
    return {
        status: "Tower Systems Operational",
        version: "Tier-5 v1.0.0-Alpha",
        timestamp: new Date().toISOString()
    };
}