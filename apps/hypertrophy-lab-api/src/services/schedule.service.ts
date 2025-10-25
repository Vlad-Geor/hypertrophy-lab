import { CreatePlanRequest, UpdatePlanRequest } from '@ikigaidev/hl/contracts';
import { Knex } from 'knex';
import { db } from '../config/database.js';
import * as inv from '../repositories/inventory.repo.js';
import * as repo from '../repositories/schedule.repo.js';

export async function listPlans(params: { userId: string }) {
  return repo.listPlans(params.userId);
}

export async function createPlan(params: { userId: string; payload: CreatePlanRequest }) {
  return repo.createPlan({ userId: params.userId, payload: params.payload });
}

export async function updatePlan(params: {
  userId: string;
  planId: string;
  patch: UpdatePlanRequest;
}) {
  await repo.updatePlan({ ...params });
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
  console.log('patchLog init, params: ', params);

  return db.transaction(async (trx) => {
    const cur = await repo.getLogWithConsumptions(userId, logId).transacting(trx);
    console.log('CURRENT: ', cur);
    console.log('PATCH: ', patch);

    if (!cur) throw new Error('Log not found');

    // derive new status/qty (fall back to current)
    const nextStatus = patch.status ?? cur.status;
    const nextQty = patch.quantityUnits ?? cur.quantityUnits ?? 0;

    // 1) restore previous consumption if any
    if (cur.status === 'taken' && cur.totalConsumed > 0) {
      await repo.restoreConsumptionsTx(trx, logId);
      await repo.deleteConsumptionsTx(trx, logId);
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

    console.log('LOGGING UPDATED: ', updated);

    // 3) re-consume if now taken with qty > 0
    if (nextStatus === 'taken' && nextQty > 0) {
      await repo.consumeStockTx(trx, logId, cur.userSupplementId, nextQty);
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

  if (cur.status === 'taken' && cur.totalConsumed > 0) {
    await repo.restoreConsumptionsTx(trx, logId);
    await repo.deleteConsumptionsTx(trx, logId);
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
    await repo.consumeStockTx(trx, logId, cur.userSupplementId, nextQty);
  }
  return updated;
}

export async function deleteLog(params: { userId: string; logId: string }) {
  await db.transaction(async (trx) => {
    // revert stock if any consumption
    const consumptions = await repo.getLogConsumptions(trx, params.logId);
    for (const c of consumptions) {
      await inv.incrementBatchUnits(trx, c.batch_id, c.units);
    }
    await repo.deleteLogConsumptions(trx, params.logId);
    await repo.deleteLog(trx, params.userId, params.logId);
  });
}

export async function createLog(
  userId: string,
  payload: {
    planId?: string;
    userSupplementId: string;
    date: string;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'bedtime';
    status: 'taken' | 'skipped' | 'pending';
    quantityUnits?: number;
    note?: string | null;
    consumeStock?: boolean;
  },
) {
  // If plan provided, validate and default quantity from plan
  let qty = payload.quantityUnits ?? 0;
  if (payload.planId) {
    const plan = await repo.getPlanForUser(userId, payload.planId);
    if (!plan) throw new Error('Plan not found');
    if (plan.timeOfDay !== payload.timeOfDay)
      throw new Error('Log time of day mismatch; Valid option: ' + plan.timeOfDay);
    if (plan.userSupplementId !== payload.userSupplementId)
      throw new Error('Plan/userSupplement mismatch');
    if (qty === 0) qty = plan.unitsPerDose ?? 0;
  }

  // Ownership check
  const us = await repo.ensureUserSupplement(userId, payload.userSupplementId);
  if (!us) throw new Error('User supplement not found');

  // Uniqueness guard
  const exists = await repo.getExistingLog(
    userId,
    payload.userSupplementId,
    payload.date,
    payload.timeOfDay,
  );
  if (exists) throw new Error('Log already exists for this slot');

  // Transaction: insert log, optional stock consumption
  return db.transaction(async (trx) => {
    const log = await repo.insertLogTx(trx, {
      userId,
      userSupplementId: payload.userSupplementId,
      planId: payload.planId ?? null,
      date: payload.date,
      timeOfDay: payload.timeOfDay,
      status: payload.status,
      quantityUnits: qty,
      note: payload.note ?? null,
    });

    if (payload.status === 'taken' && (payload.consumeStock ?? true) && qty > 0) {
      await repo.consumeStockTx(trx, log.id, payload.userSupplementId, qty);
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
  // index logs by (userSupplementId, timeOfDay)
  const logKey = (usId: string, tod: string) => `${usId}|${tod}`;
  const logMap = new Map<string, any>();
  logs.forEach((l) => logMap.set(logKey(l.userSupplementId, l.timeOfDay), l));

  // base items from plans
  const itemsFromPlans = plans.map((p) => {
    const l = logMap.get(logKey(p.userSupplementId, p.timeOfDay));

    return {
      timeOfDay: p.timeOfDay,
      planId: p.planId,
      userSupplementId: p.userSupplementId,
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
    const l = logMap.get(logKey(info.userSupplementId, info.timeOfDay));
    return {
      timeOfDay: info.timeOfDay,
      planId: null,
      userSupplementId: info.userSupplementId,
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
