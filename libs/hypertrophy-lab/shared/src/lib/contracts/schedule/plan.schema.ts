import { isoDateTime, timeOfDay, uuid, weekdays } from '@ikigaidev/contracts';
import { z } from 'zod';
import { inventorySourceSchema } from '../inventory/inventory-source.schema';

const planSourceSchema = z
  .object({
    inventorySource: inventorySourceSchema.default('personal'),
    groupId: uuid.nullable().optional(),
    groupSupplementId: uuid.nullable().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.inventorySource === 'group') {
      if (!val.groupId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'groupId is required when inventorySource is group',
          path: ['groupId'],
        });
      }
      if (!val.groupSupplementId) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'groupSupplementId is required when inventorySource is group',
          path: ['groupSupplementId'],
        });
      }
    }
  });

export const schedulePlanSchema = z
  .object({
    id: uuid,
    userId: uuid,
    userSupplementId: uuid.nullable(),
    unitsPerDose: z.number().int().min(1).default(1),
    timeOfDay,
    daysOfWeek: weekdays, // e.g., [1,3,5]
    notes: z.string().nullable().optional(),
    active: z.boolean().default(true),
    createdAt: isoDateTime,
    updatedAt: isoDateTime,
  })
  .merge(planSourceSchema);

// GET /schedule/plans
export const listPlansResponse = z.array(schedulePlanSchema);

// POST /schedule/plans
export const createPlanRequest = z
  .object({
    userSupplementId: uuid.nullable().optional(),
    unitsPerDose: z.number().int().min(1).default(1),
    timeOfDay,
    daysOfWeek: weekdays,
    notes: z.string().nullable().optional(),
  })
  .merge(planSourceSchema)
  .superRefine((val, ctx) => {
    if (val.inventorySource === 'personal' && !val.userSupplementId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'userSupplementId is required when inventorySource is personal',
        path: ['userSupplementId'],
      });
    }
  });

export const createPlanResponse = z.object({ id: uuid });

// PATCH /schedule/plans/:id
export const updatePlanRequest = z
  .object({
    unitsPerDose: z.number().int().min(1).optional(),
    timeOfDay: timeOfDay.optional(),
    daysOfWeek: weekdays.optional(),
    notes: z.string().nullable().optional(),
    active: z.boolean().optional(),
    userSupplementId: uuid.nullable().optional(),
  })
  .merge(
    z.object({
      inventorySource: inventorySourceSchema.optional(),
      groupId: uuid.nullable().optional(),
      groupSupplementId: uuid.nullable().optional(),
    }),
  );

export type SchedulePlan = z.infer<typeof schedulePlanSchema>;
export type ListPlansResponse = z.infer<typeof listPlansResponse>;
export type CreatePlanRequest = z.infer<typeof createPlanRequest>;
export type CreatePlanResponse = z.infer<typeof createPlanResponse>;
export type UpdatePlanRequest = z.infer<typeof updatePlanRequest>;
