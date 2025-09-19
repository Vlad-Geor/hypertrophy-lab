import { isoDateTime, pageMeta, paginationQuery, uuid } from '@ikigaidev/contracts';
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

export const catalogTargetSchema = z.object({
  catalogId: uuid,
  targetId: uuid,
});

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

export const supplementCatalogSummary = supplementCatalogSchema.pick({
  id: true,
  brandId: true,
  name: true,
  form: true,
  images: true,
});

export const listCatalogQuery = paginationQuery.extend({
  q: z.string().trim().min(1).optional(),
  brandId: uuid.optional(),
  targetId: uuid.optional(),
});

export const listCatalogResponse = z.object({
  items: z.array(supplementCatalogSummary),
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

export type CreateCatalogRequest = z.infer<typeof createCatalogRequest>;
export type CreateCatalogResponse = z.infer<typeof createCatalogResponse>;
export type SupplementCatalog = z.infer<typeof supplementCatalogSchema>;
export type SupplementForm = z.infer<typeof supplementFormSchema>;
export type CatalogTarget = z.infer<typeof catalogTargetSchema>;
export type GetCatalogResponse = z.infer<typeof getCatalogResponse>;
export type SupplementCatalogSummary = z.infer<typeof supplementCatalogSummary>;
export type ListCatalogQuery = z.infer<typeof listCatalogQuery>;
export type ListCatalogResponse = z.infer<typeof listCatalogResponse>;
