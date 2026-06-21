import { Router } from 'express';
import { getUserInventorySummary } from '../controllers/live.controller.js';


const router = Router();

router.get('/inventory', getUserInventorySummary);

export const liveRouter = router;