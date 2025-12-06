import { z } from 'zod';

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

const groupSupplementTargetSchema = z.object({
  id: z.uuid(),
  slug: z.string(),
  name: z.string(),
});

export const groupSupplementSchema = z.object({
  id: z.uuid(),
  groupId: z.uuid(),
  groupName: z.string().optional(),
  catalogId: z.uuid().nullable(),
  nickname: z.string().max(120).nullish(),
  safetyNotes: z.string().nullish(),
  archivedAt: z.string().nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
  catalogName: z.string(),
  brandName: z.string(),
  onHandUnits: z.number(),
  onHand: z.number().optional(),
  images: z.array(z.string().url()).optional(),
  servingUnits: z.number().positive().nullable().optional(),
  targets: z.array(groupSupplementTargetSchema).optional(),
});
export type GroupSupplement = z.infer<typeof groupSupplementSchema>;

export type GroupSupplementListItem = GroupSupplement & {
  batches?: GroupBatch[];
};
