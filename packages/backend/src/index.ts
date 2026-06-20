import express from 'express';
import cors from 'cors';
import { getMockBungieStatus } from "@tier-5/bungie-api";

const app = express();
const PORT = 7777;

app.use(cors({ origin: 'http://localhost:4200' }));

app.get('/api/status', (req, res) => {
    const statusData = getMockBungieStatus();
    res.json({
        message: "Backend bridge functional!",
        apiClientData: statusData
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Tier 5 Backend running at http://localhost:${PORT}`);
});