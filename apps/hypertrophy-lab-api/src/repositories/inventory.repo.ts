import { Knex } from 'knex';
import { db } from '../config/database';
import { toNumber } from '../util/single-count';

export async function getBatchesFIFO(
  trx: Knex,
  userId: string,
  userSupplementId: string,
) {
  return trx('batches')
    .select('id', 'quantity_units as on_hand_units')
    .where({ user_id: userId, user_supplement_id: userSupplementId })
    .andWhere('quantity_units', '>', 0)
    .orderByRaw('expires_on IS NULL ASC, expires_on ASC, created_at ASC'); // NULLS LAST equivalent
}

export async function decrementBatchUnits(trx: Knex, batchId: string, units: number) {
  await trx('batches')
    .where({ id: batchId })
    .update({ quantity_units: trx.raw('GREATEST(quantity_units - ?, 0)', [units]) });
}

export async function incrementBatchUnits(trx: Knex, batchId: string, units: number) {
  await trx('batches')
    .where({ id: batchId })
    .update({ quantity_units: trx.raw('quantity_units + ?', [units]) });
}

// ----- Dashboard aggregates -----

export async function getCounters(userId: string, withinDays: number) {
  // totalSupplements
  const totalRow = await db('nutrition.user_supplements')
    .count<{ cnt: string | number | bigint }>({ cnt: 'id' })
    .where({ user_id: userId })
    .first();
  const totalSupplements = toNumber(totalRow?.cnt);

  // lowStock — count grouped lows via subquery
  const lowRow = await db
    .from(function () {
      this.select('us.id')
        .from({ us: 'user_supplements' })
        .leftJoin({ b: 'batches' }, 'b.user_supplement_id', 'us.id')
        .where('us.user_id', userId)
        .groupBy('us.id', 'us.low_stock_threshold_units', 'us.custom_name')
        .havingRaw(
          'COALESCE(SUM(b.quantity_units), 0) <= COALESCE(MAX(us.low_stock_threshold_units), 0)',
        )
        .as('low');
    })
    .count<{ cnt: string | number | bigint }>({ cnt: '*' })
    .first();
  const lowStock = toNumber(lowRow?.cnt);

  // expiringSoon
  const expRow = await db('nutrition.batches')
    .count<{ cnt: string | number | bigint }>({ cnt: 'id' })
    .where({ user_id: userId })
    .whereNotNull('expires_on')
    .andWhere('expires_on', '<=', db.raw(`CURRENT_DATE + INTERVAL '${withinDays} days'`))
    .first();
  const expiringSoon = toNumber(expRow?.cnt);

  // openOrders
  const openStatuses = ['ordered', 'in_transit', 'arrived', 'out_for_delivery'];
  const openRow = await db('nutrition.orders')
    .count<{ cnt: string | number | bigint }>({ cnt: 'id' })
    .where({ user_id: userId })
    .whereIn('status', openStatuses)
    .first();
  const openOrders = toNumber(openRow?.cnt);

  return { totalSupplements, lowStock, expiringSoon, openOrders };
}

export async function getRecentlyAdded(userId: string, limit: number) {
  return db('nutrition.user_supplements')
    .select({
      userSupplementId: 'id',
      name: db.raw(`COALESCE(custom_name, 'Supplement')`),
      quantityUnits: db.raw(`0`), // optional to compute from batches
      createdAt: 'created_at',
    })
    .where({ user_id: userId })
    .orderBy('created_at', 'desc')
    .limit(limit);
}

export async function getLowStock(userId: string, limit: number) {
  // rollup per user_supplement
  return db('nutrition.user_supplements as us')
    .select({
      userSupplementId: 'us.id',
      name: db.raw(`COALESCE(us.custom_name, 'Supplement')`),
      onHand: db.raw(`COALESCE(SUM(b.quantity_units), 0)`),
      threshold: db.raw(`COALESCE(MAX(us.low_stock_threshold_units), 0)`),
    })
    .leftJoin('nutrition.batches as b', 'b.user_supplement_id', 'us.id')
    .where('us.user_id', userId)
    .groupBy('us.id', 'us.custom_name')
    .havingRaw(
      `COALESCE(SUM(b.quantity_units), 0) <= COALESCE(MAX(us.low_stock_threshold_units), 0)`,
    )
    .orderByRaw(`COALESCE(SUM(b.quantity_units), 0) ASC`)
    .limit(limit);
}

export async function getExpiringSoon(userId: string, withinDays: number, limit: number) {
  return db('nutrition.batches as b')
    .select({
      userSupplementId: 'b.user_supplement_id',
      name: db.raw(`'Supplement'`),
      expiresOn: 'b.expires_on',
      daysLeft: db.raw(
        `GREATEST(0, DATE_PART('day', b.expires_on::timestamp - CURRENT_DATE::timestamp))`,
      ),
    })
    .where({ user_id: userId })
    .whereNotNull('expires_on')
    .andWhere('expires_on', '<=', db.raw(`CURRENT_DATE + INTERVAL '${withinDays} days'`))
    .orderBy('expires_on', 'asc')
    .limit(limit);
}

// ******************************************************** NEW

export function listInventory(
  userId: string,
  params: {
    q?: string;
    archived?: boolean;
    limit: number;
    offset: number;
    withoutPlan?: boolean;
  },
) {
  const archived = params.archived ?? false;
  const base = db('nutrition.user_supplements as us')
    .leftJoin('nutrition.supplement_catalog as c', 'c.id', 'us.catalog_id')
    .leftJoin('nutrition.brands as b', 'b.id', 'c.brand_id')
    .modify((qb) => {
      if (params.withoutPlan) {
        qb.leftJoin(
          'nutrition.schedule_plans as ns',
          'ns.user_supplement_id',
          'us.id',
        ).whereNull('ns.id');
      }
    })
    .leftJoin(
      db('nutrition.batches')
        .select('user_supplement_id')
        .sum({ on_hand: 'quantity_units' })
        .min({ earliest_expiry: 'expires_on' })
        .groupBy('user_supplement_id')
        .as('roll'),
      'roll.user_supplement_id',
      'us.id',
    )
    .where('us.user_id', userId)
    .modify((qb) => {
      if (!archived) qb.whereNull('us.archived_at');
      if (params.q) {
        qb.where((builder) => {
          builder
            .whereILike('us.custom_name', `%${params.q}%`)
            .orWhereILike('c.name', `%${params.q}%`);
        });
      }
    });

  return base
    .clone()
    .select(
      'us.id',
      'us.user_id as userId',
      'us.catalog_id as catalogId',
      'us.nickname',
      'us.low_stock_threshold_units as lowStockThresholdUnits',
      'us.archived_at as archivedAt',
      'us.created_at as createdAt',
      'us.updated_at as updatedAt',
      'c.name as catalogName',
      'c.serving_units as servingUnits',
      'b.name as brandName',
      'c.form',
      'c.images',
      'c.units_per_container as unitsPerContainer',
      'roll.on_hand as onHand',
      'roll.earliest_expiry as earliestExpiry',
      db.raw(
        `COALESCE((
     SELECT jsonb_agg(jsonb_build_object('id', s.id, 'slug', s.slug, 'name', s.name) ORDER BY s.slug)
     FROM (
       SELECT DISTINCT t.id, t.slug, t.name
       FROM nutrition.catalog_targets ct
       JOIN nutrition.targets t ON t.id = ct.target_id
       WHERE ct.catalog_id = c.id
     ) AS s
   ), '[]'::jsonb) AS targets`,
      ),
    )
    .orderBy('us.created_at', 'desc')
    .limit(params.limit)
    .offset(params.offset);
}

export async function countInventory(
  userId: string,
  params: { q?: string; archived?: boolean, withoutPlan?: boolean },
) {
  const archived = params.archived ?? false;
  const base = db('nutrition.user_supplements as us')
  .modify((qb) => {
      if (params.withoutPlan) {
        qb.leftJoin(
          'nutrition.schedule_plans as ns',
          'ns.user_supplement_id',
          'us.id',
        ).whereNull('ns.id');
      }
    })
    .where('us.user_id', userId)
    .modify((qb) => {
      if (!archived) qb.whereNull('us.archived_at');
      if (params.q) qb.whereILike('us.custom_name', `%${params.q}%`);
    });
  const row = await base.clearSelect().count<{ cnt: string }>({ cnt: '*' }).first();
  return Number(row?.cnt ?? 0);
}

export const getInventoryById = (userId: string, id: string) =>
  db('nutrition.user_supplements as us')
    .leftJoin('nutrition.supplement_catalog as c', 'c.id', 'us.catalog_id')
    .leftJoin('nutrition.brands as b', 'b.id', 'c.brand_id')
    .select('us.*', 'c.name as catalogName', 'b.name as brandName', 'c.form', 'c.images')
    .where('us.user_id', userId)
    .andWhere('us.id', id)
    .first();

export const listBatches = (userSupplementId: string) =>
  db('nutrition.batches')
    .select(
      'id',
      'user_supplement_id as userSupplementId',
      'quantity_units as quantityUnits',
      'expires_on as expiresOn',
      'received_at as receivedAt',
      'cost_cents as costCents',
      'created_at as createdAt',
      'updated_at as updatedAt',
    )
    .where({ user_supplement_id: userSupplementId })
    .orderBy([
      { column: 'expires_on', order: 'asc' },
      { column: 'created_at', order: 'asc' },
    ]);

export async function createFromCatalog(
  userId: string,
  catalogId: string,
  data: { nickname?: string; low?: number },
) {
  const [row] = await db('nutrition.user_supplements')
    .insert({
      user_id: userId,
      catalog_id: catalogId,
      nickname: data.nickname ?? null,
      low_stock_threshold_units: data.low ?? 0,
    })
    .returning(['id']);
  return row.id as string;
}

export async function createNewCatalog(
  userId: string,
  catalogId: string | null,
  payload: {
    customName?: string | null;
    customForm?: string | null;
    customUnitsPerContainer?: number | null;
    customUnitLabel?: string | null;
    customServingUnits?: number | null;
    nickname?: string | null;
    low?: number;
  },
) {
  const [row] = await db('nutrition.user_supplements')
    .insert({
      user_id: userId,
      catalog_id: catalogId,
      nickname: payload.nickname ?? null,
      low_stock_threshold_units: payload.low ?? 0,
      custom_name: payload.customName ?? null,
      custom_form: payload.customForm ?? null,
      custom_units_per_container: payload.customUnitsPerContainer ?? null,
      custom_unit_label: payload.customUnitLabel ?? null,
      custom_serving_units: payload.customServingUnits ?? null,
    })
    .returning(['id']);
  return row.id as string;
}

export async function addBulkExisting(
  userId: string,
  items: any[],
): Promise<{ index: number; userSupplementId: string }[]> {
  return db.transaction(async (trx) => {
    const results: { index: number; userSupplementId: string }[] = [];

    // batch insert user_supplements
    const rows = await trx('nutrition.user_supplements')
      .insert(
        items.map((i) => ({
          user_id: userId,
          catalog_id: i.catalogId,
          nickname: i.nickname ?? null,
          low_stock_threshold_units: i.lowStockThresholdUnits ?? 0,
          // custom_* stay null for catalog-backed
          custom_name: null,
          custom_form: null,
          custom_units_per_container: null,
          custom_unit_label: null,
          custom_serving_units: null,
          settings: i.settings ?? {},
        })),
      )
      .returning(['id']);

    // optional initial batches
    for (let i = 0; i < items.length; i++) {
      const ub = items[i].initialBatch;
      if (ub) {
        await trx('nutrition.batches').insert({
          user_supplement_id: rows[i].id,
          quantity_units: ub.quantityUnits,
          expires_on: ub.expiresOn ?? null,
          received_at: ub.receivedAt ?? null,
          cost_cents: ub.costCents ?? null,
        });
      }
      results.push({ index: i, userSupplementId: rows[i].id });
    }

    return results;
  });
}

export const updateInventory = (userId: string, id: string, patch: any) =>
  db('nutrition.user_supplements').update(patch).where({ id, user_id: userId });

export const archiveInventory = (userId: string, id: string) =>
  db('nutrition.user_supplements')
    .update({ archived_at: db.fn.now() })
    .where({ id, user_id: userId });

export const createBatch = (userSupplementId: string, payload: any) =>
  db('nutrition.batches')
    .insert({
      user_supplement_id: userSupplementId,
      quantity_units: payload.quantityUnits,
      expires_on: payload.expiresOn ?? null,
      received_at: payload.receivedAt ?? null,
      cost_cents: payload.costCents ?? null,
    })
    .returning([
      'id',
      'user_supplement_id as userSupplementId',
      'quantity_units as quantityUnits',
      'expires_on as expiresOn',
      'received_at as receivedAt',
      'cost_cents as costCents',
      'created_at as createdAt',
      'updated_at as UpdatedAt',
    ]);

export const updateBatch = (batchId: string, patch: any) =>
  db('nutrition.batches')
    .update({
      quantity_units: patch.quantityUnits,
      expires_on: patch.expiresOn ?? null,
      received_at: patch.receivedAt ?? null,
      cost_cents: patch.costCents ?? null,
    })
    .where({ id: batchId })
    .returning([
      'id',
      'user_supplement_id as userSupplementId',
      'quantity_units as quantityUnits',
      'expires_on as ExpiresOn',
      'received_at as receivedAt',
      'cost_cents as costCents',
      'created_at as createdAt',
      'updated_at as updatedAt',
    ]);

export const deleteBatch = (batchId: string) =>
  db('nutrition.batches').where({ id: batchId }).del();

export const listLowStock = (userId: string) =>
  db('nutrition.user_supplements as us')
    .leftJoin('nutrition.batches as b', 'b.user_supplement_id', 'us.id')
    .select(
      'us.id',
      'us.user_id as userId',
      'us.catalog_id as catalogId',
      'us.nickname',
      db.raw('COALESCE(SUM(b.quantity_units),0) as onHand'),
      db.raw('COALESCE(us.low_stock_threshold_units,0) as threshold'),
    )
    .where('us.user_id', userId)
    .groupBy(
      'us.id',
      'us.user_id',
      'us.catalog_id',
      'us.nickname',
      'us.low_stock_threshold_units',
    )
    .havingRaw(
      'COALESCE(SUM(b.quantity_units),0) <= COALESCE(us.low_stock_threshold_units,0)',
    )
    .orderByRaw('COALESCE(SUM(b.quantity_units),0) ASC');

export const listExpiringSoon = (userId: string, withinDays: number) =>
  db('nutrition.batches')
    .select('user_supplement_id as userSupplementId', 'expires_on as expiresOn')
    .where({ user_id: userId })
    .whereNotNull('expires_on')
    .andWhere('expires_on', '<=', db.raw(`CURRENT_DATE + INTERVAL '${withinDays} days'`))
    .orderBy('expires_on', 'asc');
