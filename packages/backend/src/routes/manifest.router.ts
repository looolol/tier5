import { Router } from 'express';
import { hash } from '../controllers/manifest.controller.js';


const router = Router();

router.get('/:hash', hash);

export const manifestRouter = router;