// libs/shared/contracts/src/schedule/log.schema.ts
import { isoDate, timeOfDay, isoDateTime, uuid } from '@ikigaidev/contracts';
import { z } from 'zod';

export const intakeStatus = z.enum(['taken', 'skipped', 'pending']);

export const scheduleLogSchema = z.object({
  id: uuid,
  userId: uuid,
  userSupplementId: uuid,
  planId: uuid.nullable().optional(), // null for ad-hoc
  date: isoDate, // the day of the event
  timeOfDay,
  status: intakeStatus,
  quantityUnits: z.number().int().min(0).default(0), // usually = plan.unitsPerDose
  note: z.string().nullable().optional(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});
export type ScheduleLog = z.infer<typeof scheduleLogSchema>;

// POST /schedule/logs
export const createLogRequest = z.object({
  planId: uuid.optional(),
  userSupplementId: uuid, // required (also when planId present)
  date: isoDate,
  timeOfDay,
  status: intakeStatus,
  quantityUnits: z.number().int().min(0).optional(),
  note: z.string().nullable().optional(),
  // optional: let BE deduct from stock
  consumeStock: z.boolean().default(true),
});

export const updateLogRequest = createLogRequest.partial();

export type PatchLogRequest = z.infer<typeof updateLogRequest>;
export type CreateLogRequest = z.infer<typeof createLogRequest>;
export type IntakeStatus = z.infer<typeof intakeStatus>;
export const createLogResponse = scheduleLogSchema;
export type CreateLogResponse = z.infer<typeof createLogResponse>;
