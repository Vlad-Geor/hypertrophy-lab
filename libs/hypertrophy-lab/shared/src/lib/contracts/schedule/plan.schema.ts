import { isoDateTime, timeOfDay, uuid, weekdays } from '@ikigaidev/contracts';
import { z } from 'zod';

export const schedulePlanSchema = z.object({
  id: uuid,
  userId: uuid,
  userSupplementId: uuid,
  unitsPerDose: z.number().int().min(1).default(1),
  timeOfDay,
  daysOfWeek: weekdays, // e.g., [1,3,5]
  notes: z.string().nullable().optional(),
  active: z.boolean().default(true),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

// GET /schedule/plans
export const listPlansResponse = z.array(schedulePlanSchema);

// POST /schedule/plans
export const createPlanRequest = schedulePlanSchema.pick({
  userSupplementId: true,
  unitsPerDose: true,
  timeOfDay: true,
  daysOfWeek: true,
  notes: true,
});

export const createPlanResponse = z.object({ id: uuid });

// PATCH /schedule/plans/:id
export const updatePlanRequest = z.object({
  unitsPerDose: z.number().int().min(1).optional(),
  timeOfDay: timeOfDay.optional(),
  daysOfWeek: weekdays.optional(),
  notes: z.string().nullable().optional(),
  active: z.boolean().optional(),
});

export type SchedulePlan = z.infer<typeof schedulePlanSchema>;
export type ListPlansResponse = z.infer<typeof listPlansResponse>;
export type CreatePlanRequest = z.infer<typeof createPlanRequest>;
export type CreatePlanResponse = z.infer<typeof createPlanResponse>;
export type UpdatePlanRequest = z.infer<typeof updatePlanRequest>;
