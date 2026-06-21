import express from 'express';
import cors from 'cors';
import { statusRouter } from './routes/status.router.js';
import { authRouter } from './routes/auth.router.js';
import { userRouter } from './routes/user.router.js';

const app = express();
const PORT = process.env.PORT || 7777;

app.use(cors({ origin: `http://localhost:4200` }));
app.use(express.json());

app.use('/api/status', statusRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
    console.log(`🚀 Tier 5 Backend running at http://localhost:${PORT}`);
});