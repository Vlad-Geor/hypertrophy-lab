import { z } from 'zod';

// group consumptions
export const groupConsumptionSchema = z.object({
  id: z.uuid(),
  groupBatchId: z.uuid(),
  userId: z.uuid(),
  logId: z.uuid().nullable(),
  units: z.number().positive(),
  costApportionedCents: z.number().int().nonnegative(),
  consumedAt: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type GroupConsumption = z.infer<typeof groupConsumptionSchema>;
