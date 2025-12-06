// libs/shared/contracts/src/schedule/log.schema.ts
import { isoDate, isoDateTime, timeOfDay, uuid } from '@ikigaidev/contracts';
import { z } from 'zod';
import { inventorySourceSchema } from '../inventory/inventory-source.schema';

export const intakeStatus = z.enum(['taken', 'skipped', 'pending']);

const logSourceSchema = z
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

export const scheduleLogSchema = z.object({
  id: uuid,
  userId: uuid,
  userSupplementId: uuid.nullable(),
  planId: uuid.nullable().optional(), // null for ad-hoc
  date: isoDate, // the day of the event
  timeOfDay,
  status: intakeStatus,
  quantityUnits: z.number().int().min(0).default(0), // usually = plan.unitsPerDose
  note: z.string().nullable().optional(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
}).merge(logSourceSchema);
export type ScheduleLog = z.infer<typeof scheduleLogSchema>;

// POST /schedule/logs
export const createLogRequest = z
  .object({
    planId: uuid.optional(),
    userSupplementId: uuid.nullable().optional(), // required for personal, optional otherwise
    date: isoDate,
    timeOfDay,
    status: intakeStatus,
    quantityUnits: z.number().int().min(0).optional(),
    note: z.string().nullable().optional(),
    // optional: let BE deduct from stock
    consumeStock: z.boolean().optional().default(true),
  })
  .merge(logSourceSchema)
  .superRefine((val, ctx) => {
    if (val.inventorySource === 'personal' && !val.userSupplementId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'userSupplementId is required when inventorySource is personal',
        path: ['userSupplementId'],
      });
    }
  });

export const updateLogRequest = createLogRequest.partial();

export type PatchLogRequest = z.infer<typeof updateLogRequest>;
export type CreateLogRequest = z.infer<typeof createLogRequest>;
export type IntakeStatus = z.infer<typeof intakeStatus>;
export const createLogResponse = scheduleLogSchema;
export type CreateLogResponse = z.infer<typeof createLogResponse>;
