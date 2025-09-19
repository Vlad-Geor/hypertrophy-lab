// repositories/user.repository.ts
import { Request, RequestHandler } from 'express';
import { db } from '../config/database';

const USER_TABLE = 'users';

export type Claims = {
  sub: string;
  email?: string | null;
  emailVerified: string;
  displayName?: string | null;
  nickname?: string | null;
  picture?: string | null;
};

export async function upsertUserFromAuth0(claims: Claims) {
  const provider = 'auth0';
  const externalId = claims.sub;
  const email = claims.email ?? null;
  const emailVerified = claims.emailVerified;
  const displayName = claims.displayName;
  const nickname = claims.nickname;
  const picture = claims.picture;

  return db.transaction(async (tx) => {
    // Try to fetch identity + user in one go
    const existing = await tx('core.auth_identities as ai')
      .join('core.users as u', 'u.id', 'ai.user_id')
      .select(
        'u.id',
        'u.email',
        'u.display_name',
        'u.nickname',
        'u.picture_url',
        'u.tz',
        'u.locale',
        'u.settings',
        'u.created_at',
        'u.updated_at',
      )
      .where({ 'ai.provider': provider, 'ai.external_id': externalId })
      .first();

    if (existing) return existing;

    // Create user
    const [user] = await tx('core.users')
      .insert({
        email: email ?? `no-email+${externalId}@example.local`,
        emailVerified: emailVerified ?? false,
        displayName: displayName ?? null,
        nickname: nickname ?? null,
        pictureUrl: picture ?? null,
        tz: 'UTC',
        locale: 'en',
        settings: {}, // pg driver serializes to jsonb
      })
      .returning([
        'id',
        'email',
        'display_name',
        'nickname',
        'picture_url',
        'tz',
        'locale',
        'settings',
        'created_at',
        'updated_at',
      ]);

    await tx.raw(
      `
        INSERT INTO core.auth_identities (user_id, provider, external_id, email, profile)
        VALUES (?, ?, ?, ?, ?::jsonb)
        ON CONFLICT (provider, external_id)
        DO UPDATE SET email = EXCLUDED.email
        `,
      [user.id, provider, externalId, email, JSON.stringify({})],
    );

    return user;
  });
}

export async function upsertByTelegramId(data: {
  telegramId: string;
  username: string;
  firstName: string;
  avatar_url: string;
}) {
  const existing = await db(USER_TABLE).where({ telegram_id: data.telegramId }).first();
  if (existing) {
    await db(USER_TABLE)
      .update({
        username: data.username,
        first_name: data.firstName,
        avatar_url: data.avatar_url,
      })
      .where({ telegram_id: data.telegramId });
    return { ...existing, ...data };
  }
  const [id] = await db(USER_TABLE)
    .insert({
      telegram_id: data.telegramId,
      username: data.username,
      first_name: data.firstName,
      avatar_url: data.avatar_url,
    })
    .returning('id');
  return { id, ...data };
}

export const hydrateUser: RequestHandler = async (req: Request, _res, next) => {
  try {
    if (!req.auth?.payload?.sub) return next();

    const sub = req.auth.payload.sub;

    const row = await db('core.auth_identities as ai')
      .join('core.users as u', 'u.id', 'ai.user_id')
      .select(
        'u.id',
        'u.email',
        'u.display_name as displayName',
        'u.nickname',
        'u.picture_url as pictureUrl',
        'u.tz',
        'u.locale',
      )
      .where('ai.external_id', sub)
      .first();

    if (row) req.user = row;
    next();
  } catch (err) {
    next(err);
  }
};
