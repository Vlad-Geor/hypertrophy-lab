import { z } from 'zod';

export const isoDate = z
  .string()
  .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), 'Invalid ISO date (YYYY-MM-DD)');

export const uuid = z.uuid();
export const isoDateTime = z.iso.datetime();

export type UUID = z.infer<typeof uuid>;
export type IsoDate = z.infer<typeof isoDate>;
export type IsoDateTime = z.infer<typeof isoDateTime>;
