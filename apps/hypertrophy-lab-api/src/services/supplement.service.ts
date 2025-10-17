import {
  AvailableQuerySupps,
  // AvailableQuerySupps,
  createCatalogRequest,
  CreateCatalogRequest,
} from '@ikigaidev/hl/contracts';

import * as repo from '../repositories/supplements.repo.js';

export const listBrands = () => repo.listBrands();
export const listTargets = () => repo.listTargets();

// service
export async function listCatalog(
  params: {
    brandId?: string;
    targetId?: string;
    q?: string;
    page?: number;
    limit?: number;
  },
  userId?: string,
) {
  const page = Math.max(1, Number(params.page ?? 1));
  const limit = Math.min(Math.max(Number(params.limit ?? 20), 1), 100);
  const offset = (page - 1) * limit;

  const { total, items } = await repo.listCatalog({
    brandId: params.brandId,
    targetId: params.targetId,
    q: params.q,
    userId,
    limit,
    offset,
  });

  return {
    items: items.map((i) => ({
      ...i,
      images: Array.isArray(i.images) ? i.images : [],
      hasInventory: Array.isArray(i.userSupplementIds) && i.userSupplementIds.length > 0,
      onHand: typeof i.onHand === 'string' ? Number(i.onHand) : (i.onHand ?? 0),
    })),
    page: { page, limit, total },
  };
}

export async function getAvailableCatalog(userId: string, q: AvailableQuerySupps) {
  const [items, total] = await Promise.all([
    repo.findAvailable(userId, q),
    repo.countAvailable(userId, q),
  ]);
  return { items, limit: q.limit, offset: q.offset, total };
}

export async function getCatalogById(id: string) {
  const item = await repo.getCatalogById(id);
  if (!item) return null;
  const targets = await repo.getCatalogTargets(id);
  return { ...item, images: item.images ?? [], targets };
}

export async function createCatalog(payload: CreateCatalogRequest, userId?: string) {
  createCatalogRequest.parse(payload);
  const brandId = await repo.ensureBrand(
    payload.brandId ?? null,
    payload.brandName ?? null,
  );
  payload.brandId = brandId;
  const id = await repo.createCatalog(payload, userId);
  await repo.attachTargets(id, payload.targetIds ?? []);
  return { id };
}

export const updateOwnCatalog = (userId: string, id: string, patch: any) =>
  repo.updateCatalogForOwner(id, userId, patch);

export const deleteOwnCatalog = (userId: string, id: string) =>
  repo.deleteCatalogForOwner(id, userId);
