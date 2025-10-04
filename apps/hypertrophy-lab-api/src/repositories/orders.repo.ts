import { db } from '../config/database';

export async function getLatestOrders(userId: string, limit: number) {
  return db('nutrition.orders')
    .select({
      id: 'id',
      label: 'supplier_name',
      status: 'status',
      totalCostCents: 'total_cost_cents',
      createdAt: 'created_at',
    })
    .where({ user_id: userId })
    .orderBy('created_at', 'desc')
    .limit(limit);
}
