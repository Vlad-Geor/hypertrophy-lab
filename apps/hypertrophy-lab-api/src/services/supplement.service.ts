import { createCatalogRequest, CreateCatalogRequest } from '@ikigaidev/hl/contracts';
import {} from '../repositories/supplements.repo';

import * as repo from '../repositories/supplements.repo';

export const listBrands = () => repo.listBrands();
export const listTargets = () => repo.listTargets();

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
  const page = Math.max(params.page ?? 1, 1);
  const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
  const offset = (page - 1) * limit;
  console.log('userId!: ', userId);

  const [total, items] = await Promise.all([
    repo.countCatalog({
      brandId: params.brandId,
      targetId: params.targetId,
      q: params.q,
    }),
    repo.listCatalog({
      brandId: params.brandId,
      targetId: params.targetId,
      q: params.q,
      limit,
      offset,
      userId,
    }),
  ]);

  return {
    items: items.map((i) => ({
      ...i,
      images: i.images ?? [],
      hasInventory:
        Array.isArray(i.userSupplementIds.length) && i.userSupplementIds.length > 0,
    })),
    page: { page, limit, total },
  };
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
