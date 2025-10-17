import { Router } from 'express';
import { getOrCreateAuth0User, logout } from '../controllers/auth.controller.js';

const r = Router();

r.get('/me', getOrCreateAuth0User);
// router.get('/telegram', telegramCallback); // Telegram hits this
r.post('/logout', logout);

export default r;
