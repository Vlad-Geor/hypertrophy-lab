// libs/shared/contracts/src/schedule/day-view.schema.ts
import { isoDate, timeOfDay, uuid } from '@ikigaidev/contracts';
import { z } from 'zod';
import { supplementFormSchema } from '../supplement/supplement-catalog.schema';
import { intakeStatus } from './log.schema';

export const dayEntrySchema = z.object({
  timeOfDay,
  planId: uuid.nullable().optional(),
  userSupplementId: uuid,
  catalogId: uuid.nullable().optional(),
  brandName: z.string().nullable().optional(),
  name: z.string(), // nickname/custom/catalog resolved
  form: supplementFormSchema.nullable().optional(),
  unitsPerDose: z.number().int().min(0),
  notes: z.string().nullable().optional(), // plan notes / instructions
  status: z.union([intakeStatus, z.literal('pending')]).default('pending'),
  logId: uuid.optional(),
  onHand: z.number().int().nonnegative().default(0),
  earliestExpiry: z.string().nullable().optional(), // YYYY-MM-DD
});

export const dayScheduleResponse = z.object({
  date: isoDate,
  sections: z.array(
    z.object({
      timeOfDay,
      items: z.array(dayEntrySchema),
    }),
  ),
});
export type DayScheduleResponse = z.infer<typeof dayScheduleResponse>;
