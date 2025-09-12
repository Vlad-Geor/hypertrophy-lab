import { isoDate, isoDateTime, uuid } from '@ikigaidev/contracts';
import { z } from 'zod';

export const batchSchema = z.object({
  id: uuid,
  userSupplementId: uuid,
  quantityUnits: z.number().int().nonnegative(),
  expires_on: isoDate.nullable().optional(),
  receivedAt: isoDateTime.nullable().optional(),
  costCents: z.number().int().nullable().optional(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

export type Batch = z.infer<typeof batchSchema>;
