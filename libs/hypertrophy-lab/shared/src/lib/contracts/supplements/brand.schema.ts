import { isoDateTime, uuid } from '@ikigaidev/contracts';
import { z } from 'zod';

export const brandSchema = z.object({
  id: uuid,
  name: z.string().min(1),
  site: z.url().nullable().optional(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

export type Brand = z.infer<typeof brandSchema>;
