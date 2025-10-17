import { db } from '../config/database.js';

export async function insertLinkToken(input: {
  userId: string;
  code: string;
  expiresAt: Date;
}) {
  await db('core.telegram_link_tokens').insert({
    user_id: input.userId,
    code: input.code,
    expires_at: input.expiresAt,
  });
}

export async function findTokenForClaim(trx: any, code: string) {
  return trx('core.telegram_link_tokens')
    .whereRaw('code = ? AND used_at IS NULL AND expires_at > now()', [code])
    .forUpdate()
    .first(['id', 'user_id']);
}

export async function markTokenUsed(trx: any, id: string) {
  return trx('core.telegram_link_tokens').where({ id }).update({ used_at: trx.fn.now() });
}
