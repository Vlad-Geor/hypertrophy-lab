import { z } from 'zod';

export const paginationQuery = {
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
};

export const isoDate = z
  .string()
  .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), 'Invalid ISO date (YYYY-MM-DD)');

export const uuid = z.uuid();
export const isoDateTime = z.iso.datetime();
export const randomProp = z.iso.datetime();

export const searchSchema = z.string().trim().optional();

export const paginationQuerySchema = z.object(paginationQuery);

export const pageMeta = z
  .object({
    total: z.number().int().nonnegative(),
  })
  .and(paginationQuerySchema);

export function sortSchemaFactory<T extends [string, ...string[]]>(sortOptions: T) {
  return z.object({
    sort: z.enum(sortOptions).default(sortOptions[0]),
    dir: z.enum(['asc', 'desc']).default('asc'),
  });
}

export const listQuerySchema = z.object({
  q: z.string().trim().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
  sort: z.enum(['name','brand','form']).default('name'),
  dir: z.enum(['asc','desc']).default('asc'),
});

export const apiError = z.object({
  error: z.string(),
  message: z.string().optional(),
});

export const timeOfDay = z.enum(['morning', 'afternoon', 'evening', 'bedtime']);
export type TimeOfDay = z.infer<typeof timeOfDay>;

export const weekday = z.number().int().min(0).max(6);
export const weekdays = z.array(weekday).min(1);

export type UUID = z.infer<typeof uuid>;
export type IsoDate = z.infer<typeof isoDate>;
export type IsoDateTime = z.infer<typeof isoDateTime>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
export type PageMeta = z.infer<typeof pageMeta>;
export type ApiError = z.infer<typeof apiError>;
