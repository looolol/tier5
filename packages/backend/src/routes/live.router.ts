import { Router } from 'express';
import { getUserInventory } from '../controllers/live.controller.js';


const router = Router();

router.get('/inventory', getUserInventory);

export const liveRouter = router;