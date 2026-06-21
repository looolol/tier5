import { Router } from 'express';
import { getApiStatus } from '../controllers/status.controller.js';


const router = Router();

router.get('', getApiStatus);

export const statusRouter = router;