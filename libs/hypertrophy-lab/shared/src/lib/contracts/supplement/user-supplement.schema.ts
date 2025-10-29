import {
  isoDate,
  isoDateTime,
  pageMeta,
  paginationQuerySchema,
  uuid,
} from '@ikigaidev/contracts';
import { z } from 'zod';
import { batchSchema } from './batch.schema';
import {
  severityLevel,
  supplementCatalogSchema,
  supplementFormSchema,
  supplementPurpose,
} from './supplement-catalog.schema';

export const userSupplementSchema = z.object({
  id: uuid,
  userId: uuid,
  catalogId: uuid.nullable().optional(),
  nickname: z.string().nullable().optional(),
  lowStockThresholdUnits: z.number().int().nonnegative(),
  purposeCategory: z.enum([
    'medical_treatment',
    'symptom_or_deficiency_support',
    'baseline_wellness',
    'optimization_performance',
    'situational_acute',
    'experimental',
  ]),
  criticalityLevel: z.enum(['high', 'medium', 'low']),

  customName: z.string().nullable().optional(),
  customForm: supplementFormSchema.nullable().optional(),
  customUnitsPerContainer: z.number().int().positive().nullable().optional(),
  customUnitLabel: z.string().nullable().optional(),
  customServingUnits: z.number().positive().nullable().optional(),

  archivedAt: isoDateTime.nullable().optional(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

export const inventoryComputed = z.object({
  onHand: z.number().int().nonnegative().default(0),
  earliestExpiry: isoDate.nullable().optional(),
  brandName: z.string().nullable().optional(),
  catalogName: z.string().nullable().optional(),
  form: supplementFormSchema.nullable().optional(),
  cover: z.url().nullable().optional(),
});

export const listInventoryQuery = paginationQuerySchema.extend({
  archived: z.coerce.boolean().optional(),
  q: z.string().trim().min(1).optional(),
});

export const inventoryItemSummary = userSupplementSchema
  .pick({
    id: true,
    userId: true,
    catalogId: true,
    nickname: true,
    lowStockThresholdUnits: true,
    archivedAt: true,
    createdAt: true,
    updatedAt: true,
  })
  .and(inventoryComputed)
  .and(
    supplementCatalogSchema.pick({
      images: true,
      targets: true,
      unitsPerContainer: true,
      servingUnits: true,
    }),
  );

export const listInventoryResponse = z.object({
  items: z.array(inventoryItemSummary),
  page: pageMeta,
});

export const getInventoryItemResponse = userSupplementSchema
  .extend({ batches: z.array(batchSchema).default([]) })
  .and(inventoryComputed);

// POST /inventory — discriminated union
const commonAdd = {
  nickname: z.string().min(1).optional(),
  lowStockThresholdUnits: z.number().int().min(0).default(0),
  initialBatch: z
    .object({
      quantityUnits: z.number().int().min(0),
      expiresOn: isoDate.nullable().optional(),
      receivedAt: z.string().datetime().nullable().optional(),
      costCents: z.number().int().nullable().optional(),
    })
    .optional(),
};

export const addInventoryFromCatalog = z.object({
  kind: z.literal('catalog'),
  catalogId: uuid,
  ...commonAdd,
});

export const addInventoryNewCatalog = z.object({
  kind: z.literal('newCatalog'),
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
  ...commonAdd,
});

export const addInventoryCustom = z.object({
  kind: z.literal('custom'),
  customName: z.string().min(1),
  customForm: supplementFormSchema.nullable().optional(),
  customUnitsPerContainer: z.number().int().positive().nullable().optional(),
  customUnitLabel: z.string().nullable().optional(),
  customServingUnits: z.number().positive().nullable().optional(),
  ...commonAdd,
});

export const addInventoryRequest = z.discriminatedUnion('kind', [
  addInventoryFromCatalog,
  addInventoryNewCatalog,
  addInventoryCustom,
]);

export const addInventoryResponse = z.object({ userSupplementId: uuid });

// PATCH /inventory/:id
export const updateInventoryRequest = z.object({
  nickname: z.string().nullable().optional(),
  lowStockThresholdUnits: z.number().int().min(0).optional(),
  // Custom-only fields (ignored if catalog-backed)
  customName: z.string().nullable().optional(),
  customForm: supplementFormSchema.nullable().optional(),
  customUnitsPerContainer: z.number().int().positive().nullable().optional(),
  customUnitLabel: z.string().nullable().optional(),
  customServingUnits: z.number().positive().nullable().optional(),
  archivedAt: isoDateTime.nullable().optional(),
});

// DELETE /inventory/:id
export const deleteInventoryResponse = z.object({ ok: z.boolean() });

// Batches endpoints
export const createBatchRequest = z.object({
  quantityUnits: z.number().int().min(0),
  expiresOn: isoDate.nullable().optional(),
  receivedAt: isoDateTime.nullable().optional(),
  costCents: z.number().int().nullable().optional(),
});

export const createBatchResponse = batchSchema;

export const updateBatchRequest = z.object({
  quantityUnits: z.number().int().min(0).optional(),
  expiresOn: isoDate.nullable().optional(),
  receivedAt: isoDateTime.nullable().optional(),
  costCents: z.number().int().nullable().optional(),
});

export const updateBatchResponse = batchSchema;

export const deleteBatchResponse = z.object({ ok: z.boolean() });

export const listExpiringSoonResponse = z.array(inventoryItemSummary);

const bulkExistingItem = z.object({
  catalogId: uuid,
  nickname: z.string().optional(),
  lowStockThresholdUnits: z.number().int().min(0).default(0),
  initialBatch: z
    .object({
      quantityUnits: z.number().int().min(0),
      expiresOn: isoDate.nullable().optional(),
      receivedAt: isoDateTime.nullable().optional(),
      costCents: z.number().int().nullable().optional(),
    })
    .optional(),
  severity: severityLevel,
  purpose: supplementPurpose,
  settings: z
    .object({
      lowStockAlertsEnabled: z.boolean().optional(),
      reorderReminderDays: z.number().int().min(0).optional(),
      intakeRemindersEnabled: z.boolean().optional(),
    })
    .default({}),
});
export const addInventoryBulkExistingRequest = z.object({
  items: z.array(bulkExistingItem).max(50),
});
export const addInventoryBulkExistingResponse = z.object({
  results: z.array(z.object({ index: z.number(), userSupplementId: uuid })),
});

// Helpers
export const listLowStockResponse = z.array(inventoryItemSummary);

export const listExpiringSoonQuery = z.object({
  withinDays: z.coerce.number().int().min(1).max(365).default(30),
});

export type AddInventoryBulkExistingResponse = z.infer<
  typeof addInventoryBulkExistingResponse
>;
export type AddInventoryBulkExistingRequest = z.infer<
  typeof addInventoryBulkExistingRequest
>;

export type BulkExistingItem = z.infer<typeof bulkExistingItem>;
export type UserSupplement = z.infer<typeof userSupplementSchema>;
export type ListInventoryQuery = z.infer<typeof listInventoryQuery>;
export type InventoryItemSummary = z.infer<typeof inventoryItemSummary>;
export type ListInventoryResponse = z.infer<typeof listInventoryResponse>;
export type GetInventoryItemResponse = z.infer<typeof getInventoryItemResponse>;
export type AddInventoryRequest = z.infer<typeof addInventoryRequest>;
export type AddInventoryResponse = z.infer<typeof addInventoryResponse>;
export type UpdateInventoryRequest = z.infer<typeof updateInventoryRequest>;
export type DeleteInventoryResponse = z.infer<typeof deleteInventoryResponse>;
export type CreateBatchRequest = z.infer<typeof createBatchRequest>;
export type CreateBatchResponse = z.infer<typeof createBatchResponse>;
export type UpdateBatchRequest = z.infer<typeof updateBatchRequest>;
export type ListLowStockResponse = z.infer<typeof listLowStockResponse>;
export type ListExpiringSoonQuery = z.infer<typeof listExpiringSoonQuery>;
export type ListExpiringSoonResponse = z.infer<typeof listExpiringSoonResponse>;
export type UpdateBatchResponse = z.infer<typeof updateBatchResponse>;
export type DeleteBatchResponse = z.infer<typeof deleteBatchResponse>;
