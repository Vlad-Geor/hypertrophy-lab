import { Router } from 'express';
import { logout, telegramCallback } from '../controllers/auth.controller';

const router = Router();

router.get('/auth/telegram', telegramCallback); // Telegram hits this
router.post('/logout', logout); // optional

export default router;
