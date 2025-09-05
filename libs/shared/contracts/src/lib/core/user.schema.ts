import { z } from 'zod';
import { isoDateTime, uuid } from '../primitives';

export const userSchema = z.object({
  id: uuid,
  email: z.email(),
  tz: z.string().default('UTC'),
  locale: z.string().default('en'),
  settings: z.record(z.string(), z.unknown()).default({}),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

export type User = z.infer<typeof userSchema>;

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

export type AuthIdentity = z.infer<typeof authIdentitySchema>;
