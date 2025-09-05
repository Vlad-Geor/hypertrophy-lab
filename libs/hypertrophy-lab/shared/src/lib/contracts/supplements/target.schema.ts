import { z } from 'zod';

export const TargetSchema = z.object({
  id: z.uuid(),
  slug: z.string().min(1),
  name: z.string().min(1),
  group: z.enum(['cognition', 'energy', 'sleep', 'heart', 'other']),
  color: z
    .string()
    .regex(/^#([0-9a-f]{6}|[0-9a-f]{3})$/i)
    .optional(),
  icon: z.string().optional(),
});

export type Target = z.infer<typeof TargetSchema>;
