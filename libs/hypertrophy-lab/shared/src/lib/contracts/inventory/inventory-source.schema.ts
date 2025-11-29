import { z } from 'zod';

export const inventorySourceSchema = z.enum(['personal', 'group']);
