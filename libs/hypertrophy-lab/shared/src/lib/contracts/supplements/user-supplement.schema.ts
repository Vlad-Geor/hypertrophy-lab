import { isoDateTime, uuid } from '@ikigaidev/contracts';
import { z } from 'zod';
import { supplementFormSchema } from './supplement-catalog.schema';

export const userSupplementSchema = z.object({
  id: uuid,
  userId: uuid,
  catalogId: uuid.nullable().optional(),
  nickname: z.string().nullable().optional(),
  lowStockThresholdUnits: z.number().int().nonnegative(),
  customName: z.string().nullable().optional(),
  customForm: supplementFormSchema.nullable().optional(),
  customUnitsPerContainer: z.number().int().positive().nullable().optional(),
  customUnitLabel: z.string().nullable().optional(),
  customServingUnits: z.number().positive().nullable().optional(),
  archivedAt: isoDateTime.nullable().optional(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});
export type UserSupplement = z.infer<typeof userSupplementSchema>;
