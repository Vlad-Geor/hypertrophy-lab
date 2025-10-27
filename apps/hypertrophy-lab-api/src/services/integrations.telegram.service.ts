import crypto from 'crypto';
import { db } from '../config/database.js';
import { loadEnv } from '../config/env.js';
import {
  findTokenForClaim,
  insertLinkToken,
  markTokenUsed,
} from '../repositories/integrations.repo.js';

const { TG_BOT_USERNAME } = loadEnv();

function genCode(len = 10) {
  return crypto.randomBytes(16).toString('base64url').replace(/[-_]/g, '').slice(0, len);
}

export async function createLinkService(params: { userId: string }) {
  const code = genCode(10);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await insertLinkToken({ userId: params.userId, code, expiresAt });
  return {
    code,
    deepLink: `https://t.me/${TG_BOT_USERNAME}?start=${code}`,
    expiresAt,
  };
}

export async function claimLinkService(params: { code: string; chatId: string }) {
  return db.transaction(async (trx) => {
    const tok = await findTokenForClaim(trx, params.code);
    if (!tok) return { ok: false, status: 404, error: 'invalid_or_expired' };

    // ensure chat not already linked to another user
    const existing = await trx('core.users')
      .where({ telegram_chat_id: params.chatId })
      .first('id');
    if (existing && existing.id !== tok.userId)
      return { ok: false, status: 409, error: 'chat_already_linked' };

    await trx('core.users')
      .where({ id: tok.userId })
      .update({
        telegram_chat_id: params.chatId,
        updated_at: trx.fn.now?.() || db.fn.now(),
      });

    await markTokenUsed(trx, tok.id);
    return { ok: true };
  });
}
