import { isoDateTime } from '@ikigaidev/contracts';
import { z } from 'zod';

export const targetSchema = z.object({
  id: z.uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  group: z.enum(['cognition', 'energy', 'sleep', 'heart', 'other']),
  color: z
    .string()
    .regex(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i)
    .optional(),
  icon: z.string().optional(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

export const listTargetsResponse = z.array(targetSchema);

export type Target = z.infer<typeof targetSchema>;
export type ListTargetsResponse = z.infer<typeof listTargetsResponse>;
