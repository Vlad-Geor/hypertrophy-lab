import * as repo from '../repositories/inventory.repo.js';
import * as suppRepo from '../repositories/supplements.repo.js';

export async function list(
  userId: string,
  params: {
    q?: string;
    archived?: boolean;
    page?: number;
    limit?: number;
    withoutPlan?: boolean;
  },
) {
  const page = Math.max(params.page ?? 1, 1);
  const limit = Math.min(Math.max(params.limit ?? 20, 1), 100);
  const offset = (page - 1) * limit;

  const [total, items] = await Promise.all([
    repo.countInventory(userId, {
      q: params.q,
      archived: params.archived,
      withoutPlan: params.withoutPlan,
    }),
    repo.listInventory(userId, {
      q: params.q,
      archived: params.archived,
      limit,
      offset,
      withoutPlan: params.withoutPlan,
    }),
  ]);

  return { items, page: { page, limit, total } };
}

export async function getOne(userId: string, id: string) {
  const base = await repo.getInventoryById(userId, id);
  if (!base) return null;
  const batches = await repo.listBatches(id);
  return {
    ...base,
    batches,
    cover: base.images?.[0] ?? null,
  };
}

export async function add(userId: string, payload: any) {
  // 1) Resolve (optional) catalogId and (optional) custom fields
  let catalogId: string | null = null;
  let custom = {
    customName: null as string | null,
    customForm: null as string | null,
    customUnitsPerContainer: null as number | null,
    customUnitLabel: null as string | null,
    customServingUnits: null as number | null,
  };

  switch (payload.kind) {
    case 'catalog': {
      catalogId = payload.catalogId;
      break;
    }
    case 'newCatalog': {
      const brandId = await suppRepo.ensureBrand(
        payload.brandId ?? null,
        payload.brandName ?? null,
      );
      catalogId = await suppRepo.createCatalog(
        {
          brandId,
          name: payload.name,
          form: payload.form ?? null,
          unitsPerContainer: payload.unitsPerContainer ?? null,
          unitLabel: payload.unitLabel ?? null,
          servingUnits: payload.servingUnits ?? null,
          images: payload.images ?? [],
          productUrl: payload.productUrl ?? null,
          safetyNotes: payload.safetyNotes ?? null,
        },
        userId,
      );
      await suppRepo.attachTargets(catalogId, payload.targetIds ?? []);
      break;
    }
    case 'custom': {
      custom = {
        customName: payload.customName ?? null,
        customForm: payload.customForm ?? null,
        customUnitsPerContainer: payload.customUnitsPerContainer ?? null,
        customUnitLabel: payload.customUnitLabel ?? null,
        customServingUnits: payload.customServingUnits ?? null,
      };
      break;
    }
    default:
      throw new Error('Unsupported kind');
  }

  // 2) Create the user_supplement (catalog-backed or custom)
  const userSupplementId = await repo.createNewCatalog(userId, catalogId, {
    nickname: payload.nickname ?? null,
    low: payload.lowStockThresholdUnits,
    ...custom,
  });

  // 3) Optional initial batch (do this once)
  if (payload.initialBatch) {
    await repo.createBatch(userSupplementId, payload.initialBatch);
  }

  return { userSupplementId };
}

export async function addBulkExisting(userId: string, items: any[]) {
  return repo.addBulkExisting(userId, items);
}

export const patch = (userId: string, id: string, patch: any) =>
  repo.updateInventory(userId, id, {
    nickname: patch.nickname ?? null,
    low_stock_threshold_units: patch.lowStockThresholdUnits,
    custom_name: patch.customName ?? null,
    custom_form: patch.customForm ?? null,
    custom_units_per_container: patch.customUnitsPerContainer ?? null,
    custom_unit_label: patch.customUnitLabel ?? null,
    custom_serving_units: patch.customServingUnits ?? null,
    archived_at: patch.archivedAt ?? null,
  });

export const archive = (userId: string, id: string) => repo.archiveInventory(userId, id);

export const addBatch = (userSupplementId: string, payload: any) =>
  repo.createBatch(userSupplementId, payload);
export const updateBatch = (batchId: string, patch: any) =>
  repo.updateBatch(batchId, patch);
export const deleteBatch = (batchId: string) => repo.deleteBatch(batchId);

export const lowStock = (userId: string) => repo.listLowStock(userId);
export const expiringSoon = (userId: string, withinDays: number) =>
  repo.listExpiringSoon(userId, withinDays);
