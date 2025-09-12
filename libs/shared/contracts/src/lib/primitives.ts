import { z } from 'zod';

export const isoDate = z
  .string()
  .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), 'Invalid ISO date (YYYY-MM-DD)');

export const uuid = z.uuid();
export const isoDateTime = z.iso.datetime();

export const paginationQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const pageMeta = z.object({
  total: z.number().int().nonnegative(),
  limit: z.number().int(),
  offset: z.number().int(),
});

export const apiError = z.object({
  error: z.string(),
  message: z.string().optional(),
});

export const timeOfDay = z.enum(['morning','afternoon','evening','bedtime']);
export type TimeOfDay = z.infer<typeof timeOfDay>;

export const weekday = z.number().int().min(0).max(6);
export const weekdays = z.array(weekday).min(1);

export type UUID = z.infer<typeof uuid>;
export type IsoDate = z.infer<typeof isoDate>;
export type IsoDateTime = z.infer<typeof isoDateTime>;
export type PaginationQuery = z.infer<typeof paginationQuery>;
export type PageMeta = z.infer<typeof pageMeta>;
export type ApiError = z.infer<typeof apiError>;