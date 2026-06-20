import { Router } from 'express';
import { loginWithBungie, handleBungieCallback } from '../controllers/auth.controller.js'

const router = Router();

router.get('/login', loginWithBungie);
router.get('/callback', handleBungieCallback);

export const authRouter = router;