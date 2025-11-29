import { z } from 'zod';
import { inventorySourceSchema } from '../inventory/inventory-source.schema';

export const scheduleLogExtension = z.object({
  inventorySource: inventorySourceSchema,
  groupId: z.uuid().nullable(),
  groupSupplementId: z.uuid().nullable(),
});
