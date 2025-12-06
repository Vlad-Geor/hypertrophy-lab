import { db } from '../config/database.js';
import * as groupRepo from '../repositories/group-inventory.repo.js';
import type { GroupRow, MembershipRow } from '../repositories/groups.repo.js';
import { httpError } from '../util/http-error.js';
import * as groups from './groups.service.js';

type ListOptions = {
  includeArchived?: boolean;
  includeBatches?: boolean;
  withoutPlan?: boolean;
};

export async function listSupplements(
  userId: string,
  groupId: string,
  opts: ListOptions = {},
) {
  await groups.requireActiveMembership(userId, groupId);
  const supplements = await groupRepo.listGroupSupplements(groupId, {
    includeArchived: opts.includeArchived,
    withoutPlanForUserId: opts.withoutPlan ? userId : undefined,
  });

  if (!opts.includeBatches) return supplements;

  const ids = supplements.map((s) => s.id);
  const batches = await groupRepo.listBatchesForSupplements(ids);
  const bySupplement = new Map<string, groupRepo.GroupBatchRow[]>();
  for (const batch of batches) {
    const list = bySupplement.get(batch.groupSupplementId) ?? [];
    list.push(batch);
    bySupplement.set(batch.groupSupplementId, list);
  }

  return supplements.map((supplement) => ({
    ...supplement,
    batches: bySupplement.get(supplement.id) ?? [],
  }));
}

export async function listUserSupplements(
  userId: string,
  opts: { withoutPlan?: boolean } = {},
) {
  const groupsList = (await groups.listGroups(userId)) as unknown as Array<
    GroupRow & { role: MembershipRow['role'] }
  >;
  if (!groupsList.length) return [];

  const results = await Promise.all(
    groupsList.map((g) =>
      groupRepo.listGroupSupplements(g.id, {
        includeArchived: false,
        withoutPlanForUserId: opts.withoutPlan ? userId : undefined,
      }),
    ),
  );

  return results.flat();
}

export async function getSupplement(
  userId: string,
  groupId: string,
  supplementId: string,
) {
  await groups.requireActiveMembership(userId, groupId);
  const supplement = await groupRepo.getGroupSupplement(groupId, supplementId);
  if (!supplement) throw httpError(404, 'Supplement not found');
  const batches = await groupRepo.listBatches(supplementId);
  return { ...supplement, batches };
}

export async function createSupplement(
  userId: string,
  groupId: string,
  payload: {
    catalogId?: string | null;
    nickname?: string | null;
    safetyNotes?: string | null;
    initialBatch?: {
      lot?: string | null;
      qtyInitial: number;
      qtyRemaining?: number;
      units: string;
      costCents?: number;
      expiresOn?: string | null;
      receivedAt?: string | null;
    };
  },
) {
  const membership = await groups.requireActiveMembership(userId, groupId);
  groups.ensureManager(membership);

  return db.transaction(async (trx) => {
    const [supplement] = await groupRepo.insertSupplementTx(trx, {
      groupId,
      catalogId: payload.catalogId ?? null,
      nickname: payload.nickname ?? null,
      safetyNotes: payload.safetyNotes ?? null,
    });

    if (payload.initialBatch) {
      await groupRepo.insertBatchTx(trx, {
        groupSupplementId: supplement.id,
        lot: payload.initialBatch.lot ?? null,
        qtyInitial: payload.initialBatch.qtyInitial,
        qtyRemaining:
          payload.initialBatch.qtyRemaining ?? payload.initialBatch.qtyInitial,
        units: payload.initialBatch.units,
        costCents: payload.initialBatch.costCents ?? 0,
        expiresOn: payload.initialBatch.expiresOn ?? null,
        receivedAt: payload.initialBatch.receivedAt ?? null,
      });
    }

    return supplement;
  });
}

export async function updateSupplement(
  userId: string,
  groupId: string,
  supplementId: string,
  patch: {
    nickname?: string | null;
    safetyNotes?: string | null;
    archivedAt?: Date | null;
  },
) {
  const membership = await groups.requireActiveMembership(userId, groupId);
  groups.ensureManager(membership);
  const [updated] = await groupRepo.updateSupplement(groupId, supplementId, patch);
  if (!updated) throw httpError(404, 'Supplement not found');
  return updated;
}

export async function archiveSupplement(
  userId: string,
  groupId: string,
  supplementId: string,
) {
  await updateSupplement(userId, groupId, supplementId, { archivedAt: new Date() });
}

export async function addBatch(
  userId: string,
  groupId: string,
  supplementId: string,
  payload: {
    lot?: string | null;
    qtyInitial: number;
    qtyRemaining?: number;
    units: string;
    costCents?: number;
    expiresOn?: string | null;
    receivedAt?: string | null;
  },
) {
  const membership = await groups.requireActiveMembership(userId, groupId);
  groups.ensureManager(membership);

  const supplement = await groupRepo.getGroupSupplement(groupId, supplementId);
  if (!supplement) throw httpError(404, 'Supplement not found');

  const [batch] = await groupRepo.insertBatchTx(db, {
    groupSupplementId: supplement.id,
    lot: payload.lot ?? null,
    qtyInitial: payload.qtyInitial,
    qtyRemaining: payload.qtyRemaining ?? payload.qtyInitial,
    units: payload.units,
    costCents: payload.costCents ?? 0,
    expiresOn: payload.expiresOn ?? null,
    receivedAt: payload.receivedAt ?? null,
  });
  return batch;
}

export async function updateBatch(
  userId: string,
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
) {
  const membership = await groups.requireActiveMembership(userId, groupId);
  groups.ensureManager(membership);
  const rows = await groupRepo.updateBatch(groupId, batchId, patch);
  if (!rows.length) throw httpError(404, 'Batch not found');
  return rows[0];
}

export async function deleteBatch(userId: string, groupId: string, batchId: string) {
  const membership = await groups.requireActiveMembership(userId, groupId);
  groups.ensureManager(membership);
  const deleted = await groupRepo.deleteBatch(groupId, batchId);
  if (!deleted) throw httpError(404, 'Batch not found');
}

export async function recordConsumption(
  userId: string,
  groupId: string,
  payload: {
    groupBatchId: string;
    units: number;
    logId?: string | null;
    costApportionedCents?: number;
  },
) {
  await groups.requireActiveMembership(userId, groupId);

  return db.transaction(async (trx) => {
    const batch = await groupRepo.getBatch(groupId, payload.groupBatchId, trx);
    if (!batch) throw httpError(404, 'Batch not found');

    const remaining = Number(batch.qtyRemaining ?? '0');
    if (payload.units > remaining) {
      throw httpError(400, 'Not enough inventory remaining in this batch');
    }

    await groupRepo.decrementBatchUnitsTx(trx, batch.id, payload.units);
    const [consumption] = await groupRepo.insertConsumptionTx(trx, {
      groupBatchId: batch.id,
      userId,
      logId: payload.logId ?? null,
      units: payload.units,
      costApportionedCents: payload.costApportionedCents ?? 0,
    });

    return consumption;
  });
}
