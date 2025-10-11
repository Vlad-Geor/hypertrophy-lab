import { isoDateTime,  listQuerySchema,  pageMeta, paginationQuery, uuid } from '@ikigaidev/contracts';
import { z } from 'zod';
import { targetSchema } from './target.schema';

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

export const catalogTargetSchema = z.object({
  catalogId: uuid,
  targetId: uuid,
});

export const supplementCatalogSchema = z.object({
  id: uuid,
  brandId: uuid.nullable().optional(),
  brandName: z.string().nullable().optional(),
  targetIds: z.array(uuid),
  targets: z.array(targetSchema),
  name: z.string().min(1),
  description: z.string(),
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

export const supplementCatalogSummary = supplementCatalogSchema.pick({
  id: true,
  brandId: true,
  name: true,
  form: true,
  unitsPerContainer: true,
  servingUnits: true,
  images: true,
});

export const supplementCatalogItem = supplementCatalogSchema
  .omit({
    ean: true,
    upc: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({ onHand: z.number().optional(), hasInventory: z.boolean().optional() });

export const listCatalogQuery = z.object(paginationQuery).extend({
  q: z.string().trim().min(1).optional(),
  brandId: uuid.optional(),
  targetId: uuid.optional(),
});

export const listCatalogResponse = z.object({
  items: z.array(supplementCatalogItem),
  page: pageMeta,
});

export const getCatalogResponse = supplementCatalogSchema.extend({
  targets: z
    .array(z.object({ id: uuid, slug: z.string(), name: z.string() }))
    .default([]),
});

export const createCatalogRequest = z.object({
  brandId: uuid.optional(),
  brandName: z.string().min(1).optional(),
  name: z.string().min(1),
  form: supplementFormSchema.nullable().optional(),
  unitsPerContainer: z.number().int().positive().nullable().optional(),
  unitLabel: z.string().nullable().optional(),
  servingUnits: z.number().positive().nullable().optional(),
  targetIds: z.array(uuid).optional(),
  images: z.array(z.url()).default([]),
  productUrl: z.url().nullable().optional(),
  safetyNotes: z.string().nullable().optional(),
});

export const createCatalogResponse = z.object({ id: uuid });

export const availableSuppsQuery = listQuerySchema;

export type AvailableQuerySupps = z.infer<typeof availableSuppsQuery>;
export type CreateCatalogRequest = z.infer<typeof createCatalogRequest>;
export type CreateCatalogResponse = z.infer<typeof createCatalogResponse>;
export type SupplementCatalog = z.infer<typeof supplementCatalogSchema>;
export type SupplementCatalogItem = z.infer<typeof supplementCatalogItem>;
export type SupplementForm = z.infer<typeof supplementFormSchema>;
export type CatalogTarget = z.infer<typeof catalogTargetSchema>;
export type GetCatalogResponse = z.infer<typeof getCatalogResponse>;
export type SupplementCatalogSummary = z.infer<typeof supplementCatalogSummary>;
export type ListCatalogQuery = z.infer<typeof listCatalogQuery>;
export type ListCatalogResponse = z.infer<typeof listCatalogResponse>;
