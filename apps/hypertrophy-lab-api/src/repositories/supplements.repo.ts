/** @format */

import {
  AvailableQuerySupps,
  createCatalogRequest,
  CreateCatalogRequest,
} from '@ikigaidev/hl/contracts';
import { db } from '../config/database.js';

type CatalogRow = {
  id: string;
  brandId: string;
  name: string;
  form: string;
  images: unknown;
  brandName: string | null;
  onHand: number;
  earliestExpiry: string | null;
  userSupplementIds: string[];
  unitLabel: string;
  unitsPerContainer: number;
  servingUnits: number;
  hasInventory: boolean;
};

export async function findAvailable(userId: string, q: AvailableQuerySupps) {
  const sortCol = q.sort === 'brand' ? 'b.name' : q.sort === 'form' ? 'c.form' : 'c.name';

  const qb = db
    .from('nutrition.supplement_catalog as c')
    .leftJoin('nutrition.brands as b', 'b.id', 'c.brand_id')
    .whereNotExists(
      db
        .from('nutrition.user_supplements as us')
        .select(db.raw('1'))
        .where('us.user_id', userId)
        .whereRaw('us.catalog_id = c.id'),
    );

  if (q.q) {
    qb.andWhere((b) => {
      b.whereILike('c.name', `%${q.q}%`)
        .orWhereILike('b.name', `%${q.q}%`)
        .orWhereILike('c.form', `%${q.q}%`);
    });
  }

  return qb
    .select(
      'c.id',
      'c.name',
      'c.form',
      'c.brand_id as brandId',
      'b.name as brandName',
      'c.serving_units as servingUnits',
      'c.product_url as productUrl',
    )
    .orderBy(sortCol, q.dir)
    .limit(q.limit)
    .offset(q.offset);
}

export async function countAvailable(userId: string, q: AvailableQuerySupps) {
  const qb = db
    .from('nutrition.supplement_catalog as c')
    .leftJoin('nutrition.brands as b', 'b.id', 'c.brand_id')
    .whereNotExists(
      db
        .from('nutrition.user_supplements as us')
        .select(db.raw('1'))
        .where('us.user_id', userId)
        .whereRaw('us.catalog_id = c.id'),
    );

  if (q.q) {
    qb.andWhere((b) => {
      b.whereILike('c.name', `%${q.q}%`)
        .orWhereILike('b.name', `%${q.q}%`)
        .orWhereILike('c.form', `%${q.q}%`);
    });
  }

  const row = await qb.clearSelect().count<{ count: string }>({ count: '*' }).first();
  return Number(row?.count ?? 0);
}

export const listBrands = () =>
  db('nutrition.brands')
    .select('id', 'name', 'site', 'created_at as createdAt', 'updated_at as updatedAt')
    .orderBy('name', 'asc');

export const listTargets = () =>
  db('nutrition.targets')
    .select(
      'id',
      'slug',
      'name',
      'group',
      'color',
      'icon',
      'created_at as createdAt',
      'updated_at as UpdatedAt',
    )
    .orderBy(['group', 'name']);

export async function countCatalog(filters: {
  brandId?: string;
  targetId?: string;
  q?: string;
}): Promise<number> {
  const base = db('nutrition.supplement_catalog as c').modify((qb) => {
    if (filters.brandId) qb.where('c.brand_id', filters.brandId);
    if (filters.q) qb.whereILike('c.name', `%${filters.q}%`);
    if (filters.targetId)
      qb.whereExists(
        db('nutrition.catalog_targets as ct')
          .whereRaw('ct.catalog_id = c.id')
          .andWhere('ct.target_id', filters.targetId),
      );
  });
  const row = await base
    .clone()
    .clearSelect()
    .count<{ cnt: string }>({ cnt: '*' })
    .first();
  return Number(row?.cnt ?? 0);
}

// STEP 3 — base + targets + user overlay
export async function listCatalog_overlay(params: {
  brandId?: string;
  targetId?: string;
  q?: string;
  userId?: string; // include to get overlay
  limit: number;
  offset: number;
}) {
  const baseRows = await db('nutrition.supplement_catalog as c')
    .where((w) => {
      w.where('c.visibility', 'public');
      if (params.userId) w.orWhere('c.owner_user_id', params.userId);
    })
    .select('c.id', 'c.name', 'c.visibility', 'c.owner_user_id');

  console.log('GPT log: ', baseRows);

  const ctAgg = db('nutrition.catalog_targets as ct')
    .leftJoin('nutrition.targets as t', 't.id', 'ct.target_id')
    .groupBy('ct.catalog_id')
    .select({ catalog_id: 'ct.catalog_id' })
    .select(
      db.raw(
        'COALESCE(ARRAY_AGG(DISTINCT ct.target_id), ARRAY[]::uuid[]) as "targetIds"',
      ),
      db.raw(
        `COALESCE(
           JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', t.id, 'slug', t.slug, 'name', t.name))
           FILTER (WHERE t.id IS NOT NULL),
           '[]'::json
         ) as "targets"`,
      ),
    )
    .as('ct_agg');

  console.log('params passed: ', params);

  const base = db('nutrition.supplement_catalog as c')
    .where((w) => {
      w.where('c.visibility', 'public');
      if (params.userId) w.orWhere('c.owner_user_id', params.userId);
    })
    .modify((qb) => {
      if (params.brandId) qb.andWhere('c.brand_id', params.brandId);
      if (params.q) qb.andWhereILike('c.name', `%${params.q}%`);
      if (params.targetId) {
        qb.whereExists(
          db('nutrition.catalog_targets as ct')
            .whereRaw('ct.catalog_id = c.id')
            .andWhere('ct.target_id', params.targetId),
        );
      }
    })
    .select('c.id')
    .as('base');

  const uroll = params.userId
    ? db('nutrition.user_supplements as us')
        .leftJoin('nutrition.batches as b2', 'b2.user_supplement_id', 'us.id')
        .where('us.user_id', params.userId)
        .whereNotNull('us.catalog_id')
        .whereNull('us.archived_at') // optional
        .groupBy('us.catalog_id')
        .select({
          catalog_id: 'us.catalog_id',
          on_hand: db.raw('COALESCE(SUM(b2.quantity_units), 0)'),
          earliest_expiry: db.raw('MIN(b2.expires_on)'),
          user_supplement_ids: db.raw('ARRAY_AGG(DISTINCT us.id)'),
        })
        .as('uroll')
    : null;

  const rows = await db('nutrition.supplement_catalog as c')
    .join(base, 'base.id', 'c.id')
    .leftJoin('nutrition.brands as b', 'b.id', 'c.brand_id')
    .leftJoin(ctAgg, 'ct_agg.catalog_id', 'c.id')
    .modify((qb) => {
      if (uroll) {
        qb.leftJoin(uroll, 'uroll.catalog_id', 'c.id').select(
          db.raw('COALESCE(uroll.on_hand, 0) as "onHand"'),
          db.raw('uroll.earliest_expiry as "earliestExpiry"'),
          db.raw(
            'COALESCE(uroll.user_supplement_ids, ARRAY[]::uuid[]) as "userSupplementIds"',
          ),
        );
      } else {
        qb.select(
          db.raw('0::int as "onHand"'),
          db.raw('NULL::date as "earliestExpiry"'),
          db.raw('ARRAY[]::uuid[] as "userSupplementIds"'),
        );
      }
    })
    .select(
      'c.id',
      'c.name',
      'c.form',
      'c.images',
      'b.name as brandName',
      'c.unit_label as unitLabel',
      'c.units_per_container as unitsPerContainer',
      'c.serving_units as servingUnits',
      db.raw('COALESCE(ct_agg."targetIds", ARRAY[]::uuid[]) as "targetIds"'),
      db.raw(`COALESCE(ct_agg."targets", '[]'::json) as "targets"`),
    )
    .orderByRaw('lower(c.name) asc')
    .limit(params.limit)
    .offset(params.offset);

  return rows;
}

// STEP 2 — base + targets (no user overlay yet)
export async function listCatalog_targets(params: {
  brandId?: string;
  targetId?: string;
  q?: string;
  userId?: string; // include to see owned private items
  limit: number;
  offset: number;
}) {
  const ctAgg = db('nutrition.catalog_targets as ct')
    .leftJoin('nutrition.targets as t', 't.id', 'ct.target_id')
    .groupBy('ct.catalog_id')
    .select({ catalog_id: 'ct.catalog_id' })
    .select(
      db.raw(
        'COALESCE(ARRAY_AGG(DISTINCT ct.target_id), ARRAY[]::uuid[]) as "targetIds"',
      ),
      db.raw(
        `COALESCE(
           JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', t.id, 'slug', t.slug, 'name', t.name))
           FILTER (WHERE t.id IS NOT NULL),
           '[]'::json
         ) as "targets"`,
      ),
    )
    .as('ct_agg');

  const base = db('nutrition.supplement_catalog as c')
    .where((w) => {
      w.where('c.visibility', 'public');
      if (params.userId) w.orWhere('c.owner_user_id', params.userId);
    })
    .modify((qb) => {
      if (params.brandId) qb.andWhere('c.brand_id', params.brandId);
      if (params.q) qb.andWhereILike('c.name', `%${params.q}%`);
      if (params.targetId) {
        qb.whereExists(
          db('nutrition.catalog_targets as ct')
            .whereRaw('ct.catalog_id = c.id')
            .andWhere('ct.target_id', params.targetId),
        );
      }
    })
    .select('c.id')
    .as('base');

  const rows = await db('nutrition.supplement_catalog as c')
    .join(base, 'base.id', 'c.id')
    .leftJoin(ctAgg, 'ct_agg.catalog_id', 'c.id')
    .select(
      'c.id',
      'c.name',
      db.raw('COALESCE(ct_agg."targetIds", ARRAY[]::uuid[]) as "targetIds"'),
      db.raw(`COALESCE(ct_agg."targets", '[]'::json) as "targets"`),
    )
    .orderByRaw('lower(c.name) asc')
    .limit(params.limit)
    .offset(params.offset);

  return rows;
}

export async function listCatalog_base(params: {
  brandId?: string;
  targetId?: string;
  q?: string;
  userId?: string;
  limit: number;
  offset: number;
}) {
  const rows = await db('nutrition.supplement_catalog as c')
    // visibility/ownership
    .where((w) => {
      w.where('c.visibility', 'public');
      if (params.userId) w.orWhere('c.owner_user_id', params.userId);
    })
    // optional filters
    .modify((qb) => {
      if (params.brandId) qb.andWhere('c.brand_id', params.brandId);
      if (params.q) qb.andWhereILike('c.name', `%${params.q}%`);
      if (params.targetId) {
        qb.whereExists(
          db('nutrition.catalog_targets as ct')
            .whereRaw('ct.catalog_id = c.id')
            .andWhere('ct.target_id', params.targetId),
        );
      }
    })
    .select('c.id', 'c.name') // minimal payload for verification
    .orderByRaw('lower(c.name) asc')
    .limit(params.limit)
    .offset(params.offset);

  return rows;
}

// repo
export async function listCatalog(params: {
  brandId?: string;
  targetId?: string;
  q?: string;
  userId?: string;
  limit: number;
  offset: number;
}): Promise<{ total: number; items: CatalogRow[] }> {
  const ctAgg = db('nutrition.catalog_targets as ct')
    .leftJoin('nutrition.targets as t', 't.id', 'ct.target_id')
    .groupBy('ct.catalog_id')
    .select({ catalog_id: 'ct.catalog_id' })
    .select(
      db.raw(
        'COALESCE(ARRAY_AGG(DISTINCT ct.target_id), ARRAY[]::uuid[]) as "targetIds"',
      ),
      db.raw(`COALESCE(
        JSON_AGG(DISTINCT JSONB_BUILD_OBJECT('id', t.id, 'slug', t.slug, 'name', t.name))
        FILTER (WHERE t.id IS NOT NULL),'[]'::json) as "targets"`),
    )
    .as('ct_agg');

  const base = db('nutrition.supplement_catalog as c')
    .where((w) => {
      w.where('c.visibility', 'public');
      if (params.userId) {
        w.orWhere('c.owner_user_id', params.userId);
        w.orWhereExists(
          db('nutrition.user_supplements as us')
            .whereRaw('us.catalog_id = c.id')
            .andWhere('us.user_id', params.userId),
        );
      }
    })
    .modify((qb) => {
      if (params.brandId) qb.andWhere('c.brand_id', params.brandId);
      if (params.q) qb.andWhereILike('c.name', `%${params.q}%`);
      if (params.targetId) {
        qb.whereExists(
          db('nutrition.catalog_targets as ct')
            .whereRaw('ct.catalog_id = c.id')
            .andWhere('ct.target_id', params.targetId),
        );
      }
    })
    .select('c.id')
    .as('base');

  const totalRow = await db
    .from(base)
    .countDistinct<{ total: string }>({ total: 'id' })
    .first();
  const total = Number(totalRow?.total ?? 0);

  const uroll = params.userId
    ? db('nutrition.user_supplements as us')
        .leftJoin('nutrition.batches as b2', 'b2.user_supplement_id', 'us.id')
        .where('us.user_id', params.userId)
        .whereNotNull('us.catalog_id')
        .whereNull('us.archived_at')
        .groupBy('us.catalog_id')
        .select({
          catalog_id: 'us.catalog_id',
          on_hand: db.raw('COALESCE(SUM(b2.quantity_units), 0)::int'),
          earliest_expiry: db.raw('MIN(b2.expires_on)'),
          user_supplement_ids: db.raw('ARRAY_AGG(DISTINCT us.id)'),
        })
        .as('uroll')
    : null;

  const items = await db('nutrition.supplement_catalog as c')
    .join(base, 'base.id', 'c.id')
    .leftJoin('nutrition.brands as b', 'b.id', 'c.brand_id')
    .leftJoin(ctAgg, 'ct_agg.catalog_id', 'c.id')
    .modify((qb) => {
      if (uroll) {
        qb.leftJoin(uroll, 'uroll.catalog_id', 'c.id').select(
          db.raw('COALESCE(uroll.on_hand, 0)::int as "onHand"'),
          db.raw('uroll.earliest_expiry as "earliestExpiry"'),
          db.raw(
            'COALESCE(uroll.user_supplement_ids, ARRAY[]::uuid[]) as "userSupplementIds"',
          ),
        );
      } else {
        qb.select(
          db.raw('0::int as "onHand"'),
          db.raw('NULL::date as "earliestExpiry"'),
          db.raw('ARRAY[]::uuid[] as "userSupplementIds"'),
        );
      }
    })
    .select(
      'c.id',
      'c.brand_id as brandId',
      'c.name',
      'c.form',
      'c.images',
      'b.name as brandName',
      'c.unit_label as unitLabel',
      'c.units_per_container as unitsPerContainer',
      'c.serving_units as servingUnits',
      'c.description',
      db.raw('COALESCE(ct_agg."targetIds", ARRAY[]::uuid[]) as "targetIds"'),
      db.raw(`COALESCE(ct_agg."targets", '[]'::json) as "targets"`),
    )
    .orderByRaw('lower(c.name) asc')
    .limit(params.limit)
    .offset(params.offset);

  return { total, items };
}

export const getCatalogById = (id: string) =>
  db('nutrition.supplement_catalog as c')
    .leftJoin('nutrition.brands as b', 'b.id', 'c.brand_id')
    .select(
      'c.id',
      'c.brand_id as brandId',
      'c.name',
      'c.form',
      'c.units_per_container as unitsPerContainer',
      'c.unit_label as unitLabel',
      'c.serving_units as servingUnits',
      'c.upc',
      'c.ean',
      'c.product_url as productUrl',
      'c.images',
      'c.safety_notes as safetyNotes',
      'c.created_at as createdAt',
      'c.updated_at as updatedAt',
      'b.name as brandName',
      'b.site as brandSite',
    )
    .where('c.id', id)
    .first();

export const getCatalogTargets = (catalogId: string) =>
  db('nutrition.catalog_targets as ct')
    .join('nutrition.targets as t', 't.id', 'ct.target_id')
    .select('t.id', 't.slug', 't.name')
    .where('ct.catalog_id', catalogId);

export async function ensureBrand(brandId?: string | null, brandName?: string | null) {
  if (brandId) return brandId;
  if (!brandName) return null;
  const [b] = await db('nutrition.brands')
    .insert({ name: brandName })
    .onConflict('name')
    .merge()
    .returning(['id']);
  return b.id as string;
}

export async function createCatalog(
  req: Exclude<CreateCatalogRequest, 'targetIds' | 'brandName'>,
  userId?: string,
) {
  createCatalogRequest.parse(req);
  const imagesJsonb = db.raw('?::jsonb', [JSON.stringify(req.images ?? [])]);

  const [row] = await db('nutrition.supplement_catalog')
    .insert({
      brand_id: req.brandId ?? null,
      name: req.name,
      form: req.form ?? null,
      units_per_container: req.unitsPerContainer ?? null,
      unit_label: req.unitLabel ?? null,
      serving_units: req.servingUnits ?? null,
      product_url: req.productUrl ?? null,
      safety_notes: req.safetyNotes ?? null,
      images: imagesJsonb,
      owner_user_id: userId ?? null,
      visibility: userId ? 'private' : 'public',
    })
    .returning(['id']);
  return row.id as string;
}

export function updateCatalogForOwner(id: string, ownerId: string, patch: any) {
  const data: any = {
    brand_id: patch.brandId ?? null,
    name: patch.name,
    form: patch.form ?? null,
    units_per_container: patch.unitsPerContainer ?? null,
    unit_label: patch.unitLabel ?? null,
    serving_units: patch.servingUnits ?? null,
    product_url: patch.productUrl ?? null,
    safety_notes: patch.safetyNotes ?? null,
    images: patch.images ?? [],
  };
  return db('nutrition.supplement_catalog')
    .where({ id, owner_user_id: ownerId }) // guard
    .update(data)
    .returning(['id']);
}

export function deleteCatalogForOwner(id: string, ownerId: string) {
  return db('nutrition.supplement_catalog')
    .where({ id, owner_user_id: ownerId }) // guard
    .del();
}

export const attachTargets = (catalogId: string, targetIds: string[]) =>
  targetIds.length
    ? db.batchInsert(
        'nutrition.catalog_targets',
        targetIds.map((t) => ({ catalog_id: catalogId, target_id: t })),
        100,
      )
    : Promise.resolve();
