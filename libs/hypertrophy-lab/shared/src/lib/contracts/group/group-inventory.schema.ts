import { z } from 'zod';

export const groupSupplementSchema = z.object({
  id: z.uuid(),
  groupId: z.uuid(),
  catalogId: z.uuid().nullable(),
  nickname: z.string().max(120).nullish(),
  safetyNotes: z.string().nullish(),
  archivedAt: z.string().nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type GroupSupplement = z.infer<typeof groupSupplementSchema>;

export const groupBatchSchema = z.object({
  id: z.uuid(),
  groupSupplementId: z.uuid(),
  lot: z.string().max(120).nullish(),
  qtyInitial: z.number().positive(),
  qtyRemaining: z.number().nonnegative(),
  units: z.string().max(24),
  costCents: z.number().int().nonnegative(),
  expiresOn: z.string().nullish(),
  receivedAt: z.string(),
  archivedAt: z.string().nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type GroupBatch = z.infer<typeof groupBatchSchema>;
