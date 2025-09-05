import { isoDateTime, uuid } from '@ikigaidev/shared/contracts';
import { z } from 'zod';

export const supplementFormSchema = z.enum([
  'capsule',
  'tablet',
  'softgel',
  'powder',
  'liquid',
  'gummy',
  'spray',
  'drops',
  'other',
]);

export type SupplementForm = z.infer<typeof supplementFormSchema>;

export const catalogTargetSchema = z.object({
  catalogId: uuid,
  targetId: uuid,
});

export type CatalogTarget = z.infer<typeof catalogTargetSchema>;

export const supplementCatalogSchema = z.object({
  id: uuid,
  brandId: uuid.nullable().optional(),
  name: z.string().min(1),
  form: supplementFormSchema.nullable().optional(),
  unitsPerContainer: z.number().int().positive().nullable().optional(),
  unitLabel: z.string().nullable().optional(),
  servingUnits: z.number().positive().nullable().optional(),
  upc: z.string().nullable().optional(),
  ean: z.string().nullable().optional(),
  productUrl: z.url().nullable().optional(),
  images: z.array(z.url()).default([]),
  safetyNotes: z.string().nullable().optional(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

export type SupplementCatalog = z.infer<typeof supplementCatalogSchema>;
