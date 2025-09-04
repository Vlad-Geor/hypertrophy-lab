import { z } from 'zod';

export const TargetSchema = z.object({
  id: z.uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  group: z.enum(['cognition', 'energy', 'sleep', 'heart', 'other']),
  color: z
    .string()
    .regex(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i)
    .optional(),
  icon: z.string().optional(),
});

export const SupplementCatalogSchema = z.object({
  id: z.uuid(),
  brandName: z.string().min(1),
  name: z.string().min(1),
  form: z.enum(['capsule', 'tablet', 'powder', 'liquid', 'gummy']),
  unitsPerContainer: z.coerce.number().int().min(1),
  unitLabel: z.string().min(1),
  servingUnits: z.coerce.number().positive(),
  upc: z.string().optional(),
  images: z.array(z.url()).optional(),
  safetyNotes: z.string().optional(),
  commonTargets: z.array(TargetSchema).default([]),
});

export const UserSupplementSchema = z.object({
  id: z.uuid(),
  userId: z.uuid(),
  catalogId: z.uuid().optional(),
  nickname: z.string().optional(),
  lowStockThresholdUnits: z.coerce.number().int().min(0).default(0),
  archivedAt: z.iso.datetime().optional(),
});

export type Target = z.infer<typeof TargetSchema>;
export type SupplementCatalog = z.infer<typeof SupplementCatalogSchema>;
export type UserSupplement = z.infer<typeof UserSupplementSchema>;
