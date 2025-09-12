import { z } from 'zod';
import { isoDateTime, uuid } from '../primitives';

export const userSchema = z.object({
  id: uuid,
  email: z.email().nullable().optional(),
  emailVerified: z.boolean().default(false),
  displayName: z.string().nullable().optional(),
  nickname: z.string().nullable().optional(),
  pictureUrl: z.url().nullable().optional(),
  tz: z.string().default('UTC'),
  locale: z.string().default('en'),
  settings: z.record(z.string(), z.unknown()).default({}),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

// Auth identities
export const authIdentitySchema = z.object({
  id: uuid,
  userId: uuid,
  provider: z.enum(['auth0', 'telegram']),
  externalId: z.string(),
  email: z.email().nullable().optional(),
  username: z.string().nullable().optional(),
  profile: z.record(z.string(), z.unknown()).default({}),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

export const bootstrapResponse = z.object({
  brands: z.array(z.object({ id: uuid, name: z.string() })).default([]),
  targets: z
    .array(z.object({ id: uuid, slug: z.string(), name: z.string() }))
    .default([]),
});

export const meResponse = userSchema;

export type User = z.infer<typeof userSchema>;
export type MeResponse = z.infer<typeof meResponse>;
export type AuthIdentity = z.infer<typeof authIdentitySchema>;
export type BootstrapResponse = z.infer<typeof bootstrapResponse>;
