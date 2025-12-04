// repositories/user.repository.ts
import { Request, RequestHandler } from 'express';
import { Knex } from 'knex';
import { db } from '../config/database.js';
import { toNumber } from '../util/single-count.js';

const USER_TABLE = 'users';
const CORE_USERS = 'core.users';

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
        tz: 'Asia/Jerusalem',
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

const userSelectColumns = [
  'u.id',
  'u.email',
  'u.email_verified as emailVerified',
  'u.display_name as displayName',
  'u.nickname',
  'u.picture_url as pictureUrl',
  'u.tz',
  'u.locale',
  'u.settings',
  'u.created_at as createdAt',
  'u.updated_at as updatedAt',
] as const;

export type UserRecord = {
  id: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  nickname: string | null;
  pictureUrl: string | null;
  tz: string;
  locale: string;
  settings: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
};

function applySearch<T extends Knex.QueryBuilder>(
  qb: T,
  q?: string,
) {
  if (!q) return qb;
  return qb.where((builder) =>
    builder
      .whereILike('u.email', `%${q}%`)
      .orWhereILike('u.display_name', `%${q}%`)
      .orWhereILike('u.nickname', `%${q}%`),
  );
}

export const countUsers = async (q?: string) => {
  const row = await applySearch(db(`${CORE_USERS} as u`).count<{ cnt: string | number | bigint }>({ cnt: '*' }), q).first();
  return toNumber(row?.cnt);
};

export const listUsers = (params: { limit: number; offset: number; q?: string }) =>
  applySearch(
    db(`${CORE_USERS} as u`)
      .select<UserRecord>(...userSelectColumns)
      .orderBy('u.created_at', 'desc')
      .limit(params.limit)
      .offset(params.offset),
    params.q,
  );

export const getUserById = (id: string) =>
  db(`${CORE_USERS} as u`).select<UserRecord>(...userSelectColumns).where('u.id', id).first();

export type UpdateUserInput = Partial<{
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  nickname: string | null;
  pictureUrl: string | null;
  tz: string;
  locale: string;
  settings: Record<string, unknown>;
}>;

export const updateUser = async (id: string, patch: UpdateUserInput) => {
  const update: Record<string, unknown> = {};
  if (patch.email !== undefined) update.email = patch.email;
  if (patch.emailVerified !== undefined) update.email_verified = patch.emailVerified;
  if (patch.displayName !== undefined) update.display_name = patch.displayName;
  if (patch.nickname !== undefined) update.nickname = patch.nickname;
  if (patch.pictureUrl !== undefined) update.picture_url = patch.pictureUrl;
  if (patch.tz !== undefined) update.tz = patch.tz;
  if (patch.locale !== undefined) update.locale = patch.locale;
  if (patch.settings !== undefined) update.settings = patch.settings;

  if (!Object.keys(update).length) {
    return getUserById(id);
  }

  const rows = await db(CORE_USERS)
    .update(update)
    .where({ id })
    .returning<UserRecord>([
      'id',
      'email',
      'email_verified as emailVerified',
      'display_name as displayName',
      'nickname',
      'picture_url as pictureUrl',
      'tz',
      'locale',
      'settings',
      'created_at as createdAt',
      'updated_at as updatedAt',
    ]);

  return rows[0] ?? null;
};

export const deleteUser = (id: string) => db(CORE_USERS).where({ id }).del();
