import * as inv from '../repositories/inventory.repo';
import * as orders from '../repositories/orders.repo';

export async function getSummary(params: { userId: string; withinDays: number }) {
  const { userId, withinDays } = params;

  const [counters, latestOrders, recentlyAdded, lowStockAlerts, expiringSoonItems] =
    await Promise.all([
      inv.getCounters(userId, withinDays),
      orders.getLatestOrders(userId, 10),
      inv.getRecentlyAdded(userId, 10),
      inv.getLowStock(userId, 20),
      inv.getExpiringSoon(userId, withinDays, 20),
    ]);

  return {
    counters,
    latestOrders,
    recentlyAdded,
    lowStockAlerts,
    expiringSoonItems,
  };
}
