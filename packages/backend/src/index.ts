import express from 'express';
import cors from 'cors';
import { getBungieStatus } from '@tier-5/bungie-api';
import { authRouter } from './routes/auth.router.js';
import { userRouter } from './routes/user.router.js';

const app = express();
const PORT = process.env.PORT || 7777;

app.use(cors({ origin: `http://localhost:4200` }));
app.use(express.json());

app.get('/api/status', async (req, res) => {
    try {
        const apiKey = process.env.BUNGIE_API_KEY || '';
        const statusData = await getBungieStatus(apiKey);

        res.json({
            message: "Backend bridge functional!",
            ...statusData
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to retrieve live health status.' });
    }
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
    console.log(`🚀 Tier 5 Backend running at http://localhost:${PORT}`);
});