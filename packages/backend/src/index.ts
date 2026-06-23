import express from 'express';
import cors from 'cors';
import { statusRouter } from './routes/status.router.js';
import { authRouter } from './routes/auth.router.js';
import { manifestRouter } from './routes/manifest.router.js';
import { userRouter } from './routes/user.router.js';
import { liveRouter } from './routes/live.router.js';
import { ManifestEngine } from './services/manifest-engine.js';


const app = express();
const PORT = process.env.PORT || 7777;

app.use(cors({ origin: 'localhost:4200 '}));
app.use(express.json());

app.use('/api/status', statusRouter);
app.use('/api/auth', authRouter);
app.use('/api/manifest', manifestRouter);
app.use('/api/user', userRouter);
app.use('/api/live', liveRouter);


async function startServer() {
    await ManifestEngine.initialize();

    app.listen(PORT, () => {
        console.log(`[SERVER] 🚀 Tier 5 secure backend processing on http://localhost:${PORT}`);
    });
}

startServer();