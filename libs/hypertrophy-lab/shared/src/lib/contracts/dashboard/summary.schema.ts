import { isoDateTime, uuid } from '@ikigaidev/contracts';
import { z } from 'zod';
import { supplementFormSchema } from '../supplement/supplement-catalog.schema';

export const dashboardCounters = z.object({
  totalSupplements: z.number().int().nonnegative(),
  lowStock: z.number().int().nonnegative(),
  expiringSoon: z.number().int().nonnegative(),
  openOrders: z.number().int().nonnegative(),
});

export const lowStockItem = z.object({
  userSupplementId: uuid,
  name: z.string(),
  onHand: z.number().int().nonnegative(),
  threshold: z.number().int().nonnegative(),
  form: supplementFormSchema.nullable().optional(),
});

export const expiringSoonItem = z.object({
  userSupplementId: uuid,
  name: z.string(),
  expiresOn: z.string(), // YYYY-MM-DD
  daysLeft: z.number().int().nonnegative(),
});

export const orderStatus = z.enum([
  'ordered',
  'in_transit',
  'arrived',
  'out_for_delivery',
  'delivered',
  'canceled',
]);
export type OrderStatus = z.infer<typeof orderStatus>;

export const orderSummary = z.object({
  id: uuid,
  label: z.string(), // e.g., "Omega 3"
  status: orderStatus,
  totalCostCents: z.number().int().nonnegative().nullable().optional(),
  createdAt: isoDateTime,
});

export const recentlyAddedItem = z.object({
  userSupplementId: uuid,
  name: z.string(),
  brand: z.string(),
  quantityUnits: z.number().int().nonnegative().optional(),
  createdAt: isoDateTime,
});

export const dashboardSummaryResponse = z.object({
  counters: dashboardCounters,
  latestOrders: z.array(orderSummary).default([]),
  recentlyAdded: z.array(recentlyAddedItem).default([]),
  lowStockAlerts: z.array(lowStockItem).default([]),
  expiringSoonItems: z.array(expiringSoonItem).default([]),
  totalMonthlyCostCents: z.number().nonnegative().default(0),
});
export type DashboardSummaryResponse = z.infer<typeof dashboardSummaryResponse>;
