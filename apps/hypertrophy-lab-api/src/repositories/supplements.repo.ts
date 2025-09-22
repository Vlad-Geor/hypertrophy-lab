/** @format */

import { createCatalogRequest, CreateCatalogRequest } from '@ikigaidev/hl/contracts';
import { db } from '../config/database';

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

export async function listCatalog(params: {
  brandId?: string;
  targetId?: string;
  q?: string;
  limit: number;
  offset: number;
  userId?: string; // if present: include user overlay + show private items owned by user
}): Promise<CatalogRow[]> {
  const q = db<CatalogRow>('nutrition.supplement_catalog as c')
    .leftJoin('nutrition.brands as b', 'b.id', 'c.brand_id')
    .modify((qb) => {
      // visibility/ownership filter: public OR owned-by-user
      qb.where((w) => {
        w.where('c.visibility', 'public');
        if (params.userId) w.orWhere('c.owner_user_id', params.userId);
      });

      if (params.brandId) qb.andWhere('c.brand_id', params.brandId);
      if (params.q) qb.andWhereILike('c.name', `%${params.q}%`);
      if (params.targetId) {
        qb.whereExists(
          db('nutrition.catalog_targets as ct')
            .whereRaw('ct.catalog_id = c.id')
            .andWhere('ct.target_id', params.targetId),
        );
      }

      // user overlay (onHand, earliestExpiry, userSupplementIds)
      if (params.userId) {
        const uroll = db('nutrition.user_supplements as us')
          .leftJoin('nutrition.batches as b2', 'b2.user_supplement_id', 'us.id')
          .where('us.user_id', params.userId)
          .groupBy('us.catalog_id')
          .select({
            catalog_id: 'us.catalog_id',
            on_hand: db.raw('COALESCE(SUM(b2.quantity_units), 0)'),
            earliest_expiry: db.raw('MIN(b2.expires_on)'),
            user_supplement_ids: db.raw('ARRAY_AGG(DISTINCT us.id)'),
          })
          .as('uroll');

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
      'c.brand_id as brandId',
      'c.name',
      'c.form',
      'c.images',
      'b.name as brandName',
      'c.unit_label as unitLabel',
      'c.units_per_container as unitsPerContainer',
      'c.serving_units as servingUnits'
    )
    .orderByRaw('lower(c.name) asc')
    .limit(params.limit)
    .offset(params.offset);

  return (await q) ?? [];
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
