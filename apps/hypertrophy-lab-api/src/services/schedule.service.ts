import { CreatePlanRequest, UpdatePlanRequest } from '@ikigaidev/hl/contracts';
import { db } from '../config/database';
import * as inv from '../repositories/inventory.repo';
import * as repo from '../repositories/schedule.repo';

export async function getDayView(params: { userId: string; date: string }) {
  const { userId, date } = params;
  return repo.buildDayView({ userId, date });
}

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

// export async function createLog(params: { userId: string; payload: CreateLogRequest }) {
//   const { userId, payload } = params;

//   return await db.transaction(async (trx) => {
//     // create log first
//     const log = await repo.createLog(trx, { userId, payload });

//     // stock consumption on 'taken'
//     const qty =
//       payload.quantityUnits ??
//       (await repo.getPlanUnitsOrDefault(trx, payload.planId, payload.userSupplementId)) ??
//       0;
//     if (payload.consumeStock && payload.status === 'taken' && qty > 0) {
//       // FIFO by expiry: NULLS LAST, then earliest expiry
//       const batches = await inv.getBatchesFIFO(trx, userId, payload.userSupplementId);
//       let remaining = qty;
//       const consumptions: Array<{ batchId: string; units: number }> = [];

//       for (const b of batches) {
//         if (remaining <= 0) break;
//         const use = Math.min(remaining, b.on_hand_units);
//         if (use > 0) {
//           await inv.decrementBatchUnits(trx, b.id, use);
//           consumptions.push({ batchId: b.id, units: use });
//           remaining -= use;
//         }
//       }

//       // record audit
//       for (const c of consumptions) {
//         await repo.recordConsumption(trx, {
//           logId: log.id,
//           batchId: c.batchId,
//           units: c.units,
//         });
//       }
//     }

//     // return full log
//     return repo.getLogById(trx, log.id);
//   });
// }

export async function patchLog(params: { userId: string; logId: string; patch: any }) {
  // if you allow changing status/quantityUnits, you may need to adjust consumption here
  // (left minimal for now)
  await repo.updateLog(params);
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
    status: 'taken' | 'skipped';
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

    const shouldConsume =
      payload.consumeStock !== false && payload.status === 'taken' && qty > 0;
    if (shouldConsume) {
      await repo.consumeStockTx(trx, log.id, payload.userSupplementId, qty);
    }

    return log;
  });
}
