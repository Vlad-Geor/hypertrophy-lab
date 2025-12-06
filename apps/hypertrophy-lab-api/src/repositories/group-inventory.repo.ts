import { Knex } from 'knex';
import { db } from '../config/database.js';
import { Target } from '@ikigaidev/hl/contracts';

type TargetSummary = {
  id: string;
  slug: string;
  name: string;
};

export type GroupSupplementRow = {
  id: string;
  groupId: string;
  groupName?: string | null;
  catalogId: string | null;
  nickname: string | null;
  safetyNotes: string | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  catalogName?: string | null;
  brandName?: string | null;
  onHandUnits?: number;
  onHand?: number;
  images?: string[] | null;
  unitsPerContainer?: number | null;
  servingUnits?: number | null;
  targets?: TargetSummary[];
};

export type GroupBatchRow = {
  id: string;
  groupSupplementId: string;
  lot: string | null;
  qtyInitial: string;
  qtyRemaining: string;
  units: string;
  costCents: number;
  expiresOn: Date | null;
  receivedAt: Date | null;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type GroupConsumptionRow = {
  id: string;
  groupBatchId: string;
  userId: string;
  logId: string | null;
  units: string;
  costApportionedCents: number;
  consumedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

const supplementSelect = [
  'gs.id',
  'gs.group_id as groupId',
  'gs.catalog_id as catalogId',
  'gs.nickname',
  'gs.safety_notes as safetyNotes',
  'gs.archived_at as archivedAt',
  'gs.created_at as createdAt',
  'gs.updated_at as updatedAt',
  'sc.name as catalogName',
  'br.name as brandName',
  'g.name as groupName',
  'sc.images',
  'sc.units_per_container as unitsPerContainer',
  'sc.serving_units as servingUnits',
] as const;

const batchSelect = [
  'gb.id',
  'gb.group_supplement_id as groupSupplementId',
  'gb.lot',
  'gb.qty_initial as qtyInitial',
  'gb.qty_remaining as qtyRemaining',
  'gb.units',
  'gb.cost_cents as costCents',
  'gb.expires_on as expiresOn',
  'gb.received_at as receivedAt',
  'gb.archived_at as archivedAt',
  'gb.created_at as createdAt',
  'gb.updated_at as updatedAt',
] as const;

const batchReturning = [
  'id',
  'group_supplement_id as groupSupplementId',
  'lot',
  'qty_initial as qtyInitial',
  'qty_remaining as qtyRemaining',
  'units',
  'cost_cents as costCents',
  'expires_on as expiresOn',
  'received_at as receivedAt',
  'archived_at as archivedAt',
  'created_at as createdAt',
  'updated_at as updatedAt',
] as const;

const buildTargetsAgg = () =>
  db('nutrition.catalog_targets as ct')
    .leftJoin('nutrition.targets as t', 't.id', 'ct.target_id')
    .groupBy('ct.catalog_id')
    .select({ catalog_id: 'ct.catalog_id' })
    .select(
      db.raw(
        `COALESCE(
          JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', t.id, 'slug', t.slug, 'name', t.name))
          FILTER (WHERE t.id IS NOT NULL),
          '[]'::json
        ) as targets`,
      ),
    )
    .as('ct_agg');

export const listGroupSupplements = async (
  groupId: string,
  opts?: { includeArchived?: boolean },
): Promise<GroupSupplementRow[]> => {
  const totals = db('nutrition.group_batches as gb')
    .select('gb.group_supplement_id')
    .sum<{ qty: string }>({ qty: 'gb.qty_remaining' })
    .groupBy('gb.group_supplement_id')
    .as('totals');
  const targetAgg = buildTargetsAgg();

  const query = db<GroupSupplementRow, GroupSupplementRow[]>(
    'nutrition.group_supplements as gs',
  )
    .leftJoin('core.groups as g', 'g.id', 'gs.group_id')
    .leftJoin('nutrition.supplement_catalog as sc', 'sc.id', 'gs.catalog_id')
    .leftJoin('nutrition.brands as br', 'br.id', 'sc.brand_id')
    .leftJoin(totals, 'totals.group_supplement_id', 'gs.id')
    .leftJoin(targetAgg, 'ct_agg.catalog_id', 'gs.catalog_id')
    .select(
      ...supplementSelect,
      db.raw('COALESCE(totals.qty, 0)::float as "onHandUnits"'),
      db.raw('COALESCE(totals.qty, 0)::float as "onHand"'),
      db.raw(`COALESCE(ct_agg.targets, '[]'::json) as targets`),
    )
    .where('gs.group_id', groupId)
    .orderBy('gs.created_at', 'asc');

  if (!opts?.includeArchived) {
    query.whereNull('gs.archived_at');
  }

  const rows = await query; // rows: GroupSupplementRow[]
  return rows;
};

export const getGroupSupplement = (groupId: string, id: string) =>
  db('nutrition.group_supplements as gs')
    .leftJoin('core.groups as g', 'g.id', 'gs.group_id')
    .leftJoin('nutrition.supplement_catalog as sc', 'sc.id', 'gs.catalog_id')
    .leftJoin('nutrition.brands as br', 'br.id', 'sc.brand_id')
    .leftJoin(buildTargetsAgg(), 'ct_agg.catalog_id', 'gs.catalog_id')
    .select<GroupSupplementRow>(
      ...supplementSelect,
      db.raw(`COALESCE(ct_agg.targets, '[]'::json) as targets`),
    )
    .where('gs.group_id', groupId)
    .andWhere('gs.id', id)
    .first();

export const listBatches = (groupSupplementId: string) =>
  db('nutrition.group_batches as gb')
    .select<GroupBatchRow>(...batchSelect)
    .where('gb.group_supplement_id', groupSupplementId)
    .orderBy('gb.created_at', 'desc');

export const listBatchesForSupplements = async (
  groupSupplementIds: string[],
): Promise<GroupBatchRow[]> => {
  if (!groupSupplementIds.length) return [];

  const rows = await db<GroupBatchRow, GroupBatchRow[]>('nutrition.group_batches as gb')
    .select(...batchSelect)
    .whereIn('gb.group_supplement_id', groupSupplementIds)
    .orderBy('gb.created_at', 'desc');

  return rows;
};

export const insertSupplementTx = (
  trx: Knex,
  data: {
    groupId: string;
    catalogId?: string | null;
    nickname?: string | null;
    safetyNotes?: string | null;
  },
) =>
  trx('nutrition.group_supplements')
    .insert({
      group_id: data.groupId,
      catalog_id: data.catalogId ?? null,
      nickname: data.nickname ?? null,
      safety_notes: data.safetyNotes ?? null,
    })
    .returning<GroupSupplementRow[]>([
      'id',
      'group_id as groupId',
      'catalog_id as catalogId',
      'nickname',
      'safety_notes as safetyNotes',
      'archived_at as archivedAt',
      'created_at as createdAt',
      'updated_at as updatedAt',
    ]);

export const updateSupplement = (
  groupId: string,
  id: string,
  patch: {
    nickname?: string | null;
    safetyNotes?: string | null;
    archivedAt?: Date | null;
  },
) => {
  const update: Record<string, unknown> = {};
  if (patch.nickname !== undefined) update.nickname = patch.nickname;
  if (patch.safetyNotes !== undefined) update.safety_notes = patch.safetyNotes;
  if (patch.archivedAt !== undefined) update.archived_at = patch.archivedAt;

  if (!Object.keys(update).length) return Promise.resolve([] as GroupSupplementRow[]);

  return db('nutrition.group_supplements')
    .update(update)
    .where({ id })
    .andWhere('group_id', groupId)
    .returning<
      GroupSupplementRow[]
    >(['id', 'group_id as groupId', 'catalog_id as catalogId', 'nickname', 'safety_notes as safetyNotes', 'archived_at as archivedAt', 'created_at as createdAt', 'updated_at as updatedAt']);
};

export const insertBatchTx = (
  trx: Knex,
  data: {
    groupSupplementId: string;
    lot?: string | null;
    qtyInitial: number;
    qtyRemaining?: number;
    units: string;
    costCents?: number;
    expiresOn?: string | null;
    receivedAt?: string | null;
  },
    ) =>
  trx('nutrition.group_batches')
    .insert({
      group_supplement_id: data.groupSupplementId,
      lot: data.lot ?? null,
      qty_initial: data.qtyInitial,
      qty_remaining: data.qtyRemaining ?? data.qtyInitial,
      units: data.units,
      cost_cents: data.costCents ?? 0,
      expires_on: data.expiresOn ?? null,
      received_at: data.receivedAt ?? null,
    })
    .returning<GroupBatchRow[]>(batchReturning);

export const updateBatch = (
  groupId: string,
  batchId: string,
  patch: Partial<{
    lot: string | null;
    qtyInitial: number;
    qtyRemaining: number;
    units: string;
    costCents: number;
    expiresOn: string | null;
    receivedAt: string | null;
    archivedAt: string | null;
  }>,
) => {
  const update: Record<string, unknown> = {};

  if (patch.lot !== undefined) update.lot = patch.lot;
  if (patch.qtyInitial !== undefined) update.qty_initial = patch.qtyInitial;
  if (patch.qtyRemaining !== undefined) update.qty_remaining = patch.qtyRemaining;
  if (patch.units !== undefined) update.units = patch.units;
  if (patch.costCents !== undefined) update.cost_cents = patch.costCents;
  if (patch.expiresOn !== undefined) update.expires_on = patch.expiresOn;
  if (patch.receivedAt !== undefined) update.received_at = patch.receivedAt;
  if (patch.archivedAt !== undefined) update.archived_at = patch.archivedAt;

  if (!Object.keys(update).length) return Promise.resolve([] as GroupBatchRow[]);

    return db('nutrition.group_batches as gb')
      .update(update)
    .where('gb.id', batchId)
    .whereExists(function () {
      this.select(1)
        .from('nutrition.group_supplements as gs')
        .whereRaw('gs.id = gb.group_supplement_id')
        .andWhere('gs.group_id', groupId);
    })
      .returning<GroupBatchRow[]>(batchReturning);
};

export const deleteBatch = (groupId: string, batchId: string) =>
  db('nutrition.group_batches as gb')
    .where('gb.id', batchId)
    .whereExists(function () {
      this.select(1)
        .from('nutrition.group_supplements as gs')
        .whereRaw('gs.id = gb.group_supplement_id')
        .andWhere('gs.group_id', groupId);
    })
    .del();

export const getBatch = (groupId: string, batchId: string, executor: Knex = db) =>
  executor('nutrition.group_batches as gb')
    .join('nutrition.group_supplements as gs', 'gs.id', 'gb.group_supplement_id')
    .select<GroupBatchRow & { groupId: string }>(
      ...batchSelect,
      executor.raw('gs.group_id as "groupId"'),
    )
    .where('gb.id', batchId)
    .andWhere('gs.group_id', groupId)
    .first();

export const decrementBatchUnitsTx = (trx: Knex, batchId: string, units: number) =>
  trx('nutrition.group_batches')
    .where({ id: batchId })
    .update({
      qty_remaining: trx.raw('GREATEST(qty_remaining - ?, 0)', [units]),
    });

export const insertConsumptionTx = (
  trx: Knex,
  data: {
    groupBatchId: string;
    userId: string;
    logId?: string | null;
    units: number;
    costApportionedCents?: number;
  },
) =>
  trx('nutrition.group_consumptions')
    .insert({
      group_batch_id: data.groupBatchId,
      user_id: data.userId,
      log_id: data.logId ?? null,
      units: data.units,
      cost_apportioned_cents: data.costApportionedCents ?? 0,
    })
    .returning<GroupConsumptionRow[]>([
      'id',
      'group_batch_id as groupBatchId',
      'user_id as userId',
      'log_id as logId',
      'units',
      'cost_apportioned_cents as costApportionedCents',
      'consumed_at as consumedAt',
      'created_at as createdAt',
      'updated_at as updatedAt',
    ]);
