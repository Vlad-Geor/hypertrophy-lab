import { Router } from 'express';
import { getOrCreateAuth0User, logout } from '../controllers/auth.controller';

const router = Router();

router.get('/me', getOrCreateAuth0User);
// router.get('/telegram', telegramCallback); // Telegram hits this
router.post('/logout', logout);

export default router;
