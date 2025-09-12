import { isoDateTime, uuid } from '@ikigaidev/contracts';
import { z } from 'zod';

export const brandSchema = z.object({
  id: uuid,
  name: z.string().min(1),
  site: z.url().nullable().optional(),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
});

export const listBrandsResponse = z.array(brandSchema);

export type Brand = z.infer<typeof brandSchema>;
export type ListBrandsResponse = z.infer<typeof listBrandsResponse>;
