import { DashboardSummaryResponse } from '@ikigaidev/hl/contracts';
import * as inv from '../repositories/inventory.repo.js';
import * as orders from '../repositories/orders.repo.js';

export async function getSummary(params: {
  userId: string;
  withinDays: number;
}): Promise<DashboardSummaryResponse> {
  const { userId, withinDays } = params;

  const [
    counters,
    latestOrders,
    recentlyAdded,
    lowStockAlerts,
    expiringSoonItems,
    totalMonthlyCostCents,
  ] = await Promise.all([
    inv.getCounters(userId, withinDays),
    orders.getLatestOrders(userId, 10),
    inv.getRecentlyAdded(userId, 10),
    inv.getLowStock(userId, 20),
    inv.getExpiringSoon(userId, withinDays, 20),
    inv.getTotalMonthlyCostCents(userId),
  ]);

  return {
    counters,
    latestOrders,
    recentlyAdded,
    lowStockAlerts,
    expiringSoonItems,
    totalMonthlyCostCents,
  };
}
