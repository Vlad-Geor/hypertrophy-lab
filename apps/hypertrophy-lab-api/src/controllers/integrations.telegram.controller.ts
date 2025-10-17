import type { Request, Response } from 'express';
import {
  claimLinkService,
  createLinkService,
} from '../services/integrations.telegram.service.js';

export async function createLinkController(req: Request, res: Response) {
  try {
    const userId = req.user.id;
    const out = await createLinkService({ userId });
    res.json(out);
  } catch (err) {
    res.status(500).json(`err: ${err}`);
  }
}

export async function claimLinkController(req: Request, res: Response) {
  const { code, telegram_chat_id } = req.body; // from bot
  console.log('req body: ', req.body);

  if (!code || !telegram_chat_id)
    return res.status(400).json({ ok: false, error: 'missing' });
  const out = await claimLinkService({ code, chatId: String(telegram_chat_id) });
  if (!out.ok) return res.status(out.status || 400).json(out);
  res.json(out);
}
