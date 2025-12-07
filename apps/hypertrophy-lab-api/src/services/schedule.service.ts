import { CreatePlanRequest, UpdatePlanRequest } from '@ikigaidev/hl/contracts';
import { Knex } from 'knex';
import { db } from '../config/database.js';
import * as groupInventoryRepo from '../repositories/group-inventory.repo.js';
import * as inv from '../repositories/inventory.repo.js';
import * as repo from '../repositories/schedule.repo.js';
import * as groupsSvc from './groups.service.js';

type InventorySource = 'personal' | 'group';

type InventoryResolution = {
  inventorySource: InventorySource;
  userSupplementId: string | null;
  groupId: string | null;
  groupSupplementId: string | null;
};

type InventoryResolutionInput = Partial<InventoryResolution> & {
  inventorySource?: InventorySource;
};

async function resolveInventoryContext(
  userId: string,
  input: InventoryResolutionInput,
): Promise<InventoryResolution> {
  console.log('resolveContext input: ', input);

  const inventorySource: InventorySource = input.inventorySource ?? 'personal';

  if (inventorySource === 'group') {
    if (!input.groupId) throw new Error('groupId is required for group inventory');
    if (!input.groupSupplementId)
      throw new Error('groupSupplementId is required for group inventory');

    await groupsSvc.requireActiveMembership(userId, input.groupId);
    const supplement = await groupInventoryRepo.getGroupSupplement(
      input.groupId,
      input.groupSupplementId,
    );
    console.log('resolveInvContext, groupInvRepo.getGroupSupp: ', supplement);

    if (!supplement) throw new Error('Group supplement not found');

    return {
      inventorySource: 'group',
      userSupplementId: null,
      groupId: input.groupId,
      groupSupplementId: input.groupSupplementId,
    };
  }

  if (!input.userSupplementId) throw new Error('userSupplementId is required');
  const us = await repo.ensureUserSupplement(userId, input.userSupplementId);
  if (!us) throw new Error('User supplement not found');

  return {
    inventorySource: 'personal',
    userSupplementId: input.userSupplementId,
    groupId: null,
    groupSupplementId: null,
  };
}

export async function listPlans(params: { userId: string }) {
  return repo.listPlans(params.userId);
}

export async function createPlan(params: { userId: string; payload: CreatePlanRequest }) {
  const normalized = await resolveInventoryContext(params.userId, params.payload);
  console.log('createPlan params.payload', params.payload);
  console.log('normalized (create Plan)', normalized);
  return repo.createPlan({
    userId: params.userId,
    payload: { ...params.payload, ...normalized },
  });
}

export async function updatePlan(params: {
  userId: string;
  planId: string;
  patch: UpdatePlanRequest;
}) {
  let patch = { ...params.patch };

  if (
    patch.inventorySource !== undefined ||
    patch.userSupplementId !== undefined ||
    patch.groupId !== undefined ||
    patch.groupSupplementId !== undefined
  ) {
    const current = await repo.getPlanForUser(params.userId, params.planId);
    if (!current) throw new Error('Plan not found');
    const normalized = await resolveInventoryContext(params.userId, {
      inventorySource: patch.inventorySource ?? current.inventorySource ?? 'personal',
      userSupplementId:
        patch.userSupplementId !== undefined
          ? patch.userSupplementId
          : current.userSupplementId,
      groupId: patch.groupId !== undefined ? patch.groupId : current.groupId,
      groupSupplementId:
        patch.groupSupplementId !== undefined
          ? patch.groupSupplementId
          : current.groupSupplementId,
    });
    patch = {
      ...patch,
      ...normalized,
    };
  }

  await repo.updatePlan({ ...params, patch });
}

export async function deletePlan(params: { userId: string; planId: string }) {
  await repo.softDeletePlan(params);
}

// export async function patchLog(params: { userId: string; logId: string; patch: any }) {
// if you allow changing status/quantityUnits, you may need to adjust consumption here
// (left minimal for now)
// await repo.updateLog(params);
// }

export async function patchLog(params: { userId: string; logId: string; patch: any }) {
  const { userId, logId, patch } = params;
  return db.transaction(async (trx) => {
    const cur = await repo.getLogWithConsumptions(userId, logId).transacting(trx);
    if (!cur) throw new Error('Log not found');

    // derive new status/qty (fall back to current)
    const nextStatus = patch.status ?? cur.status;
    const nextQty = patch.quantityUnits ?? cur.quantityUnits ?? 0;

    // 1) restore previous consumption if any
    const inventorySource: InventorySource = cur.inventorySource ?? 'personal';
    const userSupplementId = cur.userSupplementId ?? null;
    const groupSupplementId = cur.groupSupplementId ?? null;

    if (cur.status === 'taken' && cur.totalConsumed > 0) {
      if (inventorySource === 'group') {
        await repo.restoreGroupConsumptionsTx(trx, logId);
        await repo.deleteGroupConsumptionsTx(trx, logId);
      } else {
        await repo.restoreConsumptionsTx(trx, logId);
        await repo.deleteConsumptionsTx(trx, logId);
      }
    }

    // 2) update log fields
    const updated = await repo.updateLogTx(trx, {
      userId,
      logId,
      patch: {
        status: nextStatus,
        quantity_units: nextQty,
        note: patch.note ?? cur.note,
        time_of_day: patch.timeOfDay ?? cur.timeOfDay,
      },
    });

    // 3) re-consume if now taken with qty > 0
    if (nextStatus === 'taken' && nextQty > 0) {
      if (inventorySource === 'group') {
        if (!groupSupplementId) throw new Error('Group supplement missing on log');
        await repo.consumeGroupStockTx(trx, logId, groupSupplementId, nextQty, userId);
      } else {
        if (!userSupplementId) throw new Error('User supplement missing on log');
        await repo.consumePersonalStockTx(trx, logId, userSupplementId, nextQty);
      }
    }

    return updated;
  });
}

// services/logs.service.ts
export async function patchLogTx(
  trx: Knex.Transaction,
  params: { userId: string; logId: string; patch: any },
) {
  const { userId, logId, patch } = params;
  console.log('patchTx params: ', params);

  const cur = await repo.getLogWithConsumptionsTx(trx, userId, logId);
  if (!cur) throw new Error('Log not found');

  const nextStatus = patch.status ?? cur.status;
  const nextQty = patch.quantityUnits ?? cur.quantityUnits ?? 0;
  const inventorySource: InventorySource = cur.inventorySource ?? 'personal';
  const groupSupplementId = cur.groupSupplementId ?? null;
  const userSupplementId = cur.userSupplementId ?? null;

  if (cur.status === 'taken' && cur.totalConsumed > 0) {
    if (inventorySource === 'group') {
      await repo.restoreGroupConsumptionsTx(trx, logId);
      await repo.deleteGroupConsumptionsTx(trx, logId);
    } else {
      await repo.restoreConsumptionsTx(trx, logId);
      await repo.deleteConsumptionsTx(trx, logId);
    }
  }

  const updated = await repo.updateLogTx(trx, {
    userId,
    logId,
    patch: {
      status: nextStatus,
      quantity_units: nextQty,
      note: patch.note ?? cur.note,
      time_of_day: patch.timeOfDay ?? cur.timeOfDay,
    },
  });

  if (nextStatus === 'taken' && nextQty > 0) {
    if (inventorySource === 'group') {
      if (!groupSupplementId) throw new Error('Group supplement missing on log');
      await repo.consumeGroupStockTx(trx, logId, groupSupplementId, nextQty, userId);
    } else {
      if (!userSupplementId) throw new Error('User supplement missing on log');
      await repo.consumePersonalStockTx(trx, logId, userSupplementId, nextQty);
    }
  }
  return updated;
}

export async function deleteLog(params: { userId: string; logId: string }) {
  await db.transaction(async (trx) => {
    const log = await repo.getLogById(trx, params.logId);
    if (!log) return;
    if (log.inventorySource === 'group') {
      await repo.restoreGroupConsumptionsTx(trx, params.logId);
      await repo.deleteGroupConsumptionsTx(trx, params.logId);
    } else {
      const consumptions = await repo.getLogConsumptions(trx, params.logId);
      for (const c of consumptions) {
        await inv.incrementBatchUnits(trx, c.batch_id, c.units);
      }
      await repo.deleteLogConsumptions(trx, params.logId);
    }
    await repo.deleteLog(trx, params.userId, params.logId);
  });
}

export async function createLog(
  userId: string,
  payload: {
    planId?: string;
    inventorySource?: InventorySource;
    userSupplementId?: string | null;
    groupId?: string | null;
    groupSupplementId?: string | null;
    date: string;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'bedtime';
    status: 'taken' | 'skipped' | 'pending';
    quantityUnits?: number;
    note?: string | null;
    consumeStock?: boolean;
  },
) {
  let qty = payload.quantityUnits ?? 0;
  let sourceInput: InventoryResolutionInput = {
    inventorySource: payload.inventorySource,
    userSupplementId: payload.userSupplementId ?? null,
    groupId: payload.groupId ?? null,
    groupSupplementId: payload.groupSupplementId ?? null,
  };

  if (payload.planId) {
    const plan = await repo.getPlanForUser(userId, payload.planId);
    if (!plan) throw new Error('Plan not found');
    if (plan.timeOfDay !== payload.timeOfDay)
      throw new Error('Log time of day mismatch; Valid option: ' + plan.timeOfDay);
    sourceInput = {
      inventorySource: plan.inventorySource ?? 'personal',
      userSupplementId: plan.userSupplementId,
      groupId: plan.groupId,
      groupSupplementId: plan.groupSupplementId,
    };
    if (qty === 0) qty = plan.unitsPerDose ?? 0;
  }

  const normalized = await resolveInventoryContext(userId, sourceInput);

  const exists = await repo.getExistingLog({
    userId,
    inventorySource: normalized.inventorySource,
    userSupplementId: normalized.userSupplementId,
    groupSupplementId: normalized.groupSupplementId,
    date: payload.date,
    timeOfDay: payload.timeOfDay,
  });
  if (exists) throw new Error('Log already exists for this slot');

  // Transaction: insert log, optional stock consumption
  return db.transaction(async (trx) => {
    const log = await repo.insertLogTx(trx, {
      userId,
      inventorySource: normalized.inventorySource,
      userSupplementId: normalized.userSupplementId,
      groupId: normalized.groupId,
      groupSupplementId: normalized.groupSupplementId,
      planId: payload.planId ?? null,
      date: payload.date,
      timeOfDay: payload.timeOfDay,
      status: payload.status,
      quantityUnits: qty,
      note: payload.note ?? null,
    });

    if (payload.status === 'taken' && (payload.consumeStock ?? true) && qty > 0) {
      if (normalized.inventorySource === 'group') {
        if (!normalized.groupSupplementId) throw new Error('Group supplement missing');
        await repo.consumeGroupStockTx(
          trx,
          log.id,
          normalized.groupSupplementId,
          qty,
          userId,
        );
      } else if (normalized.userSupplementId) {
        await repo.consumePersonalStockTx(trx, log.id, normalized.userSupplementId, qty);
      }
    }
    return log;
  });
}

const SLOTS = ['morning', 'afternoon', 'evening', 'bedtime'] as const;

export type DaySummary = {
  date: string;
  total: number;
  firstTime?: 'morning' | 'afternoon' | 'evening' | 'bedtime';
  groups: Array<{
    time: 'morning' | 'afternoon' | 'evening' | 'bedtime';
    items: Array<{
      name: string;
      dose: number;
      status: 'pending' | 'taken' | 'skipped';
      logId?: string;
    }>;
  }>;
};

const ORDER: Array<DaySummary['firstTime']> = [
  'morning',
  'afternoon',
  'evening',
  'bedtime',
];

export async function getDaySummary(p: { userId: string; date?: string }) {
  const tz = await repo.getUserTz(p.userId);
  const date = p.date && p.date.length ? p.date : await inferTodayInTz(tz);
  const rows = await repo.fetchDaySummaryRows(p.userId, date);

  const byTime = new Map<string, DaySummary['groups'][number]>();

  for (const r of rows) {
    if (!byTime.has(r.timeOfDay))
      byTime.set(r.timeOfDay, { time: r.timeOfDay, items: [] });
    byTime.get(r.timeOfDay).items.push({
      name: r.name,
      dose: r.doseUnits ?? 0,
      status: (r.logStatus as any) || 'pending',
      logId: r.logId || undefined,
    });
  }

  const groups = ORDER.map((t) => byTime.get(t)).filter(Boolean) as DaySummary['groups'];

  const firstTime = groups[0]?.time;
  const total = rows.length;

  const out: DaySummary = { date, total, firstTime, groups };
  return out;
}

async function inferTodayInTz(tz: string) {
  const r = await db.raw(
    `select to_char((now() at time zone ?)::date, 'YYYY-MM-DD') as d`,
    [tz],
  );
  return r.rows[0].d as string; // e.g. "2025-10-19"
}

export async function getDayView(userId: string, date: string) {
  const weekday = new Date(date + 'T00:00:00Z').getUTCDay(); // 0..6
  const [plans, logs, adHocInfos] = await Promise.all([
    repo.getPlansForDay(userId, weekday),
    repo.getLogsForDate(userId, date),
    repo.getAdhocLoggedSupplements(userId, date),
  ]);
  const logKey = (
    source: InventorySource,
    userSupplementId: string | null,
    groupSupplementId: string | null,
    tod: string,
  ) => `${source}|${userSupplementId ?? 'null'}|${groupSupplementId ?? 'null'}|${tod}`;
  const logMap = new Map<string, any>();
  logs.forEach((l) =>
    logMap.set(
      logKey(
        l.inventorySource ?? 'personal',
        l.userSupplementId ?? null,
        l.groupSupplementId ?? null,
        l.timeOfDay,
      ),
      l,
    ),
  );

  // base items from plans
  const itemsFromPlans = plans.map((p) => {
    const l = logMap.get(
      logKey(
        p.inventorySource ?? 'personal',
        p.userSupplementId ?? null,
        p.groupSupplementId ?? null,
        p.timeOfDay,
      ),
    );

    return {
      timeOfDay: p.timeOfDay,
      planId: p.planId,
      inventorySource: p.inventorySource ?? 'personal',
      userSupplementId: p.userSupplementId,
      groupId: p.groupId ?? null,
      groupSupplementId: p.groupSupplementId ?? null,
      catalogId: p.catalogId,
      brandName: p.brandName ?? null,
      name: p.name,
      form: p.form ?? null,
      unitsPerDose: p.unitsPerDose ?? 0,
      notes: p.notes ?? null,
      status: l ? l.status : 'pending',
      logId: l?.id,
      onHand: Number(p.onHand) || 0,
      earliestExpiry: p.earliestExpiry ?? null,
    };
  });

  // add ad-hoc logs (no plan)
  const adHoc = adHocInfos.map((info) => {
    const l = logMap.get(
      logKey(
        info.inventorySource ?? 'personal',
        info.userSupplementId ?? null,
        info.groupSupplementId ?? null,
        info.timeOfDay,
      ),
    );
    return {
      timeOfDay: info.timeOfDay,
      planId: null,
      inventorySource: info.inventorySource ?? 'personal',
      userSupplementId: info.userSupplementId,
      groupId: info.groupId ?? null,
      groupSupplementId: info.groupSupplementId ?? null,
      catalogId: info.catalogId ?? null,
      brandName: info.brandName ?? null,
      name: info.name,
      form: info.form ?? null,
      unitsPerDose: l?.quantityUnits ?? 0,
      notes: l?.note ?? null,
      status: l?.status ?? 'pending',
      logId: l?.id,
      onHand: Number(info.onHand) || 0,
      earliestExpiry: info.earliestExpiry ?? null,
    };
  });

  const all = [...itemsFromPlans, ...adHoc];

  // group into sections by slot
  const sections = SLOTS.map((tod) => ({
    timeOfDay: tod,
    items: all.filter((i) => i.timeOfDay === tod),
  }));

  return { date, sections };
}
