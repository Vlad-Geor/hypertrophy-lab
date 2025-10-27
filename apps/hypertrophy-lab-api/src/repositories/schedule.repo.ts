import {
  CreateLogRequest,
  CreatePlanRequest,
  UpdatePlanRequest,
} from '@ikigaidev/hl/contracts';
import { Knex } from 'knex';
import { db } from '../config/database.js';

export async function getUserTz(userId: string): Promise<string> {
  const r = await db('core.users').where({ id: userId }).first('tz');
  return r?.tz || 'UTC';
}

/** One row per active plan for the date, with LEFT JOIN to existing log */
export async function fetchDaySummaryRows(userId: string, date: string) {
  return db('nutrition.schedule_plans as p')
    .join('nutrition.user_supplements as us', 'us.id', 'p.user_supplement_id')
    .leftJoin('nutrition.supplement_catalog as c', 'c.id', 'us.catalog_id')
    .leftJoin('nutrition.brands as b', 'b.id', 'c.brand_id')
    .leftJoin('nutrition.schedule_logs as l', function () {
      this.on('l.user_id', '=', 'p.user_id')
        .andOn('l.user_supplement_id', '=', 'p.user_supplement_id')
        .andOn('l.time_of_day', '=', 'p.time_of_day')
        .andOn(db.raw('l.date = ?', [date]));
    })
    .where({ 'p.user_id': userId, 'p.active': true })
    .select({
      planId: 'p.id',
      timeOfDay: 'p.time_of_day',
      name: db.raw(`coalesce(us.nickname, c.name, 'Supplement')`),
      doseUnits: db.raw(`coalesce(l.quantity_units, p.units_per_dose, 0)`),
      logId: 'l.id',
      logStatus: 'l.status',
    }).orderByRaw(`CASE p.time_of_day
        WHEN 'morning' THEN 1 WHEN 'afternoon' THEN 2
        WHEN 'evening' THEN 3 WHEN 'bedtime' THEN 4 ELSE 5 END, name asc`);
}

export async function listPlans(userId: string) {
  return db('nutrition.schedule_plans')
    .select('*')
    .where({ user_id: userId })
    .orderBy([
      { column: 'active', order: 'desc' },
      { column: 'time_of_day', order: 'asc' },
    ])
    .then((rows) => rows.map(mapPlanRow));
}

export async function createPlan(params: { userId: string; payload: CreatePlanRequest }) {
  const [row] = await db('nutrition.schedule_plans')
    .insert({
      user_id: params.userId,
      user_supplement_id: params.payload.userSupplementId,
      units_per_dose: params.payload.unitsPerDose ?? 1,
      time_of_day: params.payload.timeOfDay,
      days_of_week: db.raw('?', [params.payload.daysOfWeek]),
      notes: params.payload.notes ?? null,
    })
    .returning(['id']);
  return row.id as string;
}

export async function updatePlan(params: {
  userId: string;
  planId: string;
  patch: UpdatePlanRequest;
}) {
  const patch: any = {};
  if (params.patch.unitsPerDose !== undefined)
    patch.units_per_dose = params.patch.unitsPerDose;
  if (params.patch.timeOfDay !== undefined) patch.time_of_day = params.patch.timeOfDay;
  if (params.patch.daysOfWeek !== undefined)
    patch.days_of_week = db.raw('?', [params.patch.daysOfWeek]);
  if (params.patch.notes !== undefined) patch.notes = params.patch.notes;
  if (params.patch.active !== undefined) patch.active = params.patch.active;

  await db('nutrition.schedule_plans')
    .update(patch)
    .where({ id: params.planId, user_id: params.userId });
}

export async function softDeletePlan(params: { userId: string; planId: string }) {
  await db('nutrition.schedule_plans')
    .update({ active: false })
    .where({ id: params.planId, user_id: params.userId });
}

// ---------- Logs ----------

export async function createLog(
  trx: Knex,
  params: { userId: string; payload: CreateLogRequest },
) {
  const qty =
    params.payload.quantityUnits ??
    (await getPlanUnitsOrDefault(
      trx,
      params.payload.planId,
      params.payload.userSupplementId,
    )) ??
    0;

  const [row] = await trx('nutrition.schedule_logs')
    .insert({
      user_id: params.userId,
      user_supplement_id: params.payload.userSupplementId,
      plan_id: params.payload.planId ?? null,
      date: params.payload.date,
      time_of_day: params.payload.timeOfDay,
      status: params.payload.status,
      quantity_units: qty,
      note: params.payload.note ?? null,
    })
    .returning(['id']);
  return { id: row.id as string };
}

export async function getPlanUnitsOrDefault(
  trx: Knex,
  maybePlanId?: string,
  userSupplementId?: string,
) {
  if (maybePlanId) {
    const row = await trx('nutrition.schedule_plans')
      .select('units_per_dose')
      .where({ id: maybePlanId })
      .first();
    if (row) return Number(row.units_per_dose);
  }
  // fallback: 0 (or query user_supplements default dose if you store it)
  return 0;
}

export async function recordConsumption(
  trx: Knex,
  params: { logId: string; batchId: string; units: number },
) {
  await trx('nutrition.schedule_log_consumptions').insert({
    log_id: params.logId,
    batch_id: params.batchId,
    units: params.units,
  });
}

export async function getLogById(trx: Knex, id: string) {
  const row = await trx('nutrition.schedule_logs').select('*').where({ id }).first();
  return mapLogRow(row);
}

export async function updateLog(params: { userId: string; logId: string; patch: any }) {
  await db('nutrition.schedule_logs')
    .update(params.patch)
    .where({ id: params.logId, user_id: params.userId });
}

export async function getLogConsumptions(trx: Knex, logId: string) {
  return trx('nutrition.schedule_log_consumptions').select('*').where({ log_id: logId });
}

export async function deleteLogConsumptions(trx: Knex, logId: string) {
  await trx('nutrition.schedule_log_consumptions').where({ log_id: logId }).del();
}

export async function deleteLog(trx: Knex, userId: string, logId: string) {
  await trx('nutrition.schedule_logs').where({ id: logId, user_id: userId }).del();
}

// ---------- Day View ----------

export async function buildDayView(params: { userId: string; date: string }) {
  const { userId, date } = params;

  // plans active matching weekday (0..6)
  const weekdayIndex = new Date(date + 'T00:00:00Z').getUTCDay();

  // get plans
  const plans = await db('nutrition.schedule_plans as p')
    .select(
      'p.id as plan_id',
      'p.user_supplement_id',
      'p.units_per_dose',
      'p.time_of_day',
      'p.days_of_week',
      'p.notes',
      'us.catalog_id',
      'sc.name as catalog_name',
      'b.name as brand_name',
    )
    .join('nutrition.user_supplements as us', 'us.id', 'p.user_supplement_id')
    .leftJoin('nutrition.supplement_catalog as sc', 'sc.id', 'us.catalog_id')
    .leftJoin('nutrition.brands as b', 'b.id', 'sc.brand_id')
    .where('p.user_id', userId)
    .andWhere('p.active', true)
    .andWhereRaw('? = ANY(p.days_of_week)', [weekdayIndex]);

  // logs for that date
  const logs = await db('nutrition.schedule_logs')
    .select('*')
    .where({ user_id: userId, date });

  // stock snapshot per user_supplement
  const stocks = await db('nutrition.batches')
    .select('user_supplement_id')
    .sum({ on_hand: 'quantity_units' })
    .min({ earliest_expiry: db.raw("NULLIF(expires_on::text, '')::date") })
    .where({ user_id: userId })
    .groupBy('user_supplement_id');

  const stockMap = new Map<string, { on_hand: number; earliest_expiry: string | null }>();
  for (const s of stocks) {
    stockMap.set(String(s.user_supplement_id), {
      on_hand: Number(s.on_hand ?? 0),
      earliest_expiry: (s as any).earliest_expiry
        ? String((s as any).earliest_expiry)
        : null,
    });
  }

  // prepare entries by time_of_day
  const sections = ['morning', 'afternoon', 'evening', 'bedtime'].map((t) => ({
    timeOfDay: t,
    items: [] as any[],
  }));

  // map plans → pending entries
  for (const p of plans) {
    const st = stockMap.get(String(p.user_supplement_id)) ?? {
      on_hand: 0,
      earliest_expiry: null,
    };

    // does a log exist for this supplement/slot/date?
    const log = logs.find(
      (l) =>
        String(l.user_supplement_id) === String(p.user_supplement_id) &&
        l.time_of_day === p.time_of_day,
    );

    const name = (p.catalog_name ?? '').trim() || 'Supplement';
    const section = sections.find((s) => s.timeOfDay === p.time_of_day)!;
    section.items.push({
      timeOfDay: p.time_of_day,
      planId: p.plan_id,
      userSupplementId: p.user_supplement_id,
      catalogId: p.catalog_id ?? null,
      brandName: p.brand_name ?? null,
      name,
      form: null, // populate if you have it on catalog
      unitsPerDose: Number(p.units_per_dose),
      notes: p.notes ?? null,
      status: log ? log.status : 'pending',
      logId: log?.id,
      onHand: st.on_hand,
      earliestExpiry: st.earliest_expiry,
    });
  }

  // include ad-hoc logs (with no plan) for that date
  for (const l of logs) {
    if (!l.plan_id) {
      const st = stockMap.get(String(l.user_supplement_id)) ?? {
        on_hand: 0,
        earliest_expiry: null,
      };
      const section = sections.find((s) => s.timeOfDay === l.time_of_day)!;
      section.items.push({
        timeOfDay: l.time_of_day,
        planId: null,
        userSupplementId: l.user_supplement_id,
        catalogId: null,
        brandName: null,
        name: 'Ad-hoc supplement',
        form: null,
        unitsPerDose: Number(l.quantity_units ?? 0),
        notes: l.note ?? null,
        status: l.status,
        logId: l.id,
        onHand: st.on_hand,
        earliestExpiry: st.earliest_expiry,
      });
    }
  }

  return { date, sections };
}

function mapPlanRow(r: any) {
  return {
    id: r.id,
    userId: r.user_id,
    userSupplementId: r.user_supplement_id,
    unitsPerDose: Number(r.units_per_dose),
    timeOfDay: r.time_of_day,
    daysOfWeek: r.days_of_week,
    notes: r.notes,
    active: !!r.active,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function mapLogRow(r: any) {
  return {
    id: r.id,
    userId: r.user_id,
    userSupplementId: r.user_supplement_id,
    planId: r.plan_id,
    date: r.date,
    timeOfDay: r.time_of_day,
    status: r.status,
    quantityUnits: Number(r.quantity_units),
    note: r.note,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

export const getPlanForUser = (userId: string, planId: string) =>
  db('nutrition.schedule_plans')
    .select(
      'id',
      'user_supplement_id as userSupplementId',
      'units_per_dose as unitsPerDose',
      'time_of_day as timeOfDay',
      'days_of_week as daysOfWeek',
      'active',
    )
    .where({ id: planId, user_id: userId })
    .first();

export const ensureUserSupplement = (userId: string, userSupplementId: string) =>
  db('nutrition.user_supplements')
    .where({ id: userSupplementId, user_id: userId })
    .first();

export const getExistingLog = (
  userId: string,
  userSupplementId: string,
  date: string,
  timeOfDay: string,
) =>
  db('nutrition.schedule_logs')
    .where({
      user_id: userId,
      user_supplement_id: userSupplementId,
      date,
      time_of_day: timeOfDay,
    })
    .first();

export const insertLogTx = (
  trx: any,
  log: {
    userId: string;
    userSupplementId: string;
    planId?: string | null;
    date: string;
    timeOfDay: string;
    status: 'taken' | 'skipped' | 'pending';
    quantityUnits: number;
    note?: string | null;
  },
) =>
  trx('nutrition.schedule_logs')
    .insert({
      user_id: log.userId,
      user_supplement_id: log.userSupplementId,
      plan_id: log.planId ?? null,
      date: log.date,
      time_of_day: log.timeOfDay,
      status: log.status,
      quantity_units: log.quantityUnits,
      note: log.note ?? null,
    })
    .returning([
      'id',
      'user_id as userId',
      'user_supplement_id as userSupplementId',
      'plan_id as planId',
      'date',
      'time_of_day as timeOfDay',
      'status',
      'quantity_units as quantityUnits',
      'note',
      'created_at as createdAt',
      'updated_at as updatedAt',
    ])
    .then((r) => r[0]);

export async function getPlansForDay(userId: string, weekday: number) {
  const inv = db('nutrition.batches as bat')
    .select('bat.user_supplement_id')
    .select(
      db.raw('COALESCE(SUM(bat.quantity_units),0)::int AS on_hand'),
      db.raw('MIN(bat.expires_on) AS earliest_expiry'),
    )
    .groupBy('bat.user_supplement_id')
    .as('inv');

  const weekdayArr = [Number(weekday)];

  return db('nutrition.schedule_plans as p')
    .join('nutrition.user_supplements as us', 'us.id', 'p.user_supplement_id')
    .leftJoin('nutrition.supplement_catalog as c', 'c.id', 'us.catalog_id')
    .leftJoin('nutrition.brands as b', 'b.id', 'c.brand_id')
    .leftJoin(inv, 'inv.user_supplement_id', 'us.id')
    .where('p.user_id', userId)
    .andWhere('p.active', true)
    .andWhereRaw('p.days_of_week && ?::smallint[]', [weekdayArr]) // ← key fix
    .select({
      planId: 'p.id',
      userSupplementId: 'us.id',
      catalogId: 'c.id',
      timeOfDay: 'p.time_of_day',
      unitsPerDose: 'p.units_per_dose',
      notes: 'p.notes',
      brandName: 'b.name',
      name: db.raw('COALESCE(us.custom_name, c.name)'),
      form: db.raw('COALESCE(us.custom_form, c.form)'),
      onHand: db.raw('COALESCE(??.??, 0)', ['inv', 'on_hand']),
      earliestExpiry: db.raw('??.??', ['inv', 'earliest_expiry']),
    })
    .orderBy([{ column: 'p.time_of_day' }, { column: 'name' }]);
}

export function getLogsForDate(userId: string, date: string) {
  return db('nutrition.schedule_logs').where({ user_id: userId, date }).select({
    id: 'id',
    userSupplementId: 'user_supplement_id',
    planId: 'plan_id',
    timeOfDay: 'time_of_day',
    status: 'status',
    quantityUnits: 'quantity_units',
    note: 'note',
  });
}

export function getAdhocLoggedSupplements(userId: string, date: string) {
  // logs without a plan need minimal supplement info to display
  return db('nutrition.schedule_logs as l')
    .join('nutrition.user_supplements as us', 'us.id', 'l.user_supplement_id')
    .leftJoin('nutrition.supplement_catalog as c', 'c.id', 'us.catalog_id')
    .leftJoin('nutrition.brands as b', 'b.id', 'c.brand_id')
    .leftJoin(
      db('nutrition.batches as bat')
        .select('bat.user_supplement_id')
        .sum({ on_hand: 'bat.quantity_units' })
        .min({ earliest_expiry: 'bat.expires_on' }) // ← alias the MIN
        .groupBy('bat.user_supplement_id')
        .as('inv'),
      'inv.user_supplement_id',
      'us.id',
    )
    .where({ 'l.user_id': userId, 'l.date': date })
    .whereNull('l.plan_id')
    .select({
      userSupplementId: 'us.id',
      catalogId: 'c.id',
      brandName: 'b.name',
      name: db.raw('COALESCE(us.custom_name, c.name)'),
      form: db.raw('COALESCE(us.custom_form, c.form)'),
      onHand: db.raw('COALESCE(??.??, 0)', ['inv', 'on_hand']), // safe identifiers
      earliestExpiry: db.raw('??.??', ['inv', 'earliest_expiry']), // safe identifiers
      timeOfDay: 'l.time_of_day',
    });
}

export const selectFifoBatchesTx = (trx: any, userSupplementId: string) =>
  trx('nutrition.batches')
    .select('id', 'quantity_units')
    .where({ user_supplement_id: userSupplementId })
    .andWhere('quantity_units', '>', 0)
    .orderByRaw('expires_on IS NULL, expires_on ASC, created_at ASC');

export async function consumeStockTx(
  trx: any,
  logId: string,
  userSupplementId: string,
  units: number,
) {
  console.log('trying to consumeStockTX');

  let remaining = units;
  const batches = await selectFifoBatchesTx(trx, userSupplementId);

  for (const b of batches) {
    if (remaining <= 0) break;
    const use = Math.min(remaining, b.quantityUnits);

    if (use <= 0) continue;
    await trx('nutrition.batches')
      .update({ quantity_units: trx.raw('quantity_units - ?', [use]) })
      .where({ id: b.id });
    await trx('nutrition.schedule_log_consumptions').insert({
      log_id: logId,
      batch_id: b.id,
      units: use,
    });
    remaining -= use;
  }
  return units - remaining; // consumed
}

// Patch Methods + Helpers (TX)
export const getLogWithConsumptions = (userId: string, logId: string) =>
  db('nutrition.schedule_logs as l')
    .leftJoin(
      db('nutrition.schedule_log_consumptions')
        .select('log_id')
        .sum({ total_consumed: 'units' })
        .groupBy('log_id')
        .as('lc'),
      'lc.log_id',
      'l.id',
    )
    .where({ 'l.id': logId, 'l.user_id': userId })
    .first()
    .select(
      'l.id',
      'l.user_id',
      'l.user_supplement_id',
      'l.status',
      'l.quantity_units',
      'l.time_of_day',
      'l.note',
      db.raw('COALESCE(lc.total_consumed, 0) as total_consumed'),
    );

export const getLogWithConsumptionsTx = (trx: Knex, userId: string, logId: string) =>
  trx('nutrition.schedule_logs as l')
    .leftJoin(
      db('nutrition.schedule_log_consumptions')
        .select('log_id')
        .sum({ total_consumed: 'units' })
        .groupBy('log_id')
        .as('lc'),
      'lc.log_id',
      'l.id',
    )
    .where({ 'l.id': logId, 'l.user_id': userId })
    .first()
    .select(
      'l.id',
      'l.user_id',
      'l.user_supplement_id',
      'l.status',
      'l.quantity_units',
      'l.time_of_day',
      'l.note',
      db.raw('COALESCE(lc.total_consumed, 0) as total_consumed'),
    );

export async function restoreConsumptionsTx(trx: any, logId: string) {
  // add back consumed units to each batch
  const rows = await trx('nutrition.schedule_log_consumptions')
    .where({ log_id: logId })
    .select('batch_id', 'units');
  for (const r of rows) {
    await trx('nutrition.batches')
      .where({ id: r.batchId })
      .update({ quantity_units: trx.raw('quantity_units + ?', [r.units]) });
  }
}

export const deleteConsumptionsTx = (trx: any, logId: string) =>
  trx('nutrition.schedule_log_consumptions').where({ log_id: logId }).del();

export const updateLogTx = (
  trx: any,
  params: { userId: string; logId: string; patch: any },
) =>
  trx('nutrition.schedule_logs')
    .update(params.patch)
    .where({ id: params.logId, user_id: params.userId })
    .returning([
      'id',
      'user_id as userId',
      'user_supplement_id as userSupplementId',
      'plan_id as planId',
      'date',
      'time_of_day as timeOfDay',
      'status',
      'quantity_units as quantityUnits',
      'note',
      'created_at as createdAt',
      'updated_at as updatedAt',
    ])
    .then((r) => r[0]);

export async function getLogForActionTx(trx: Knex.Transaction, logId: string) {
  return trx('nutrition.schedule_logs as l')
    .join('core.users as u', 'u.id', 'l.user_id')
    .select(
      'l.id',
      'l.user_id',
      'l.user_supplement_id',
      'l.quantity_units',
      'l.status',
      'u.telegram_chat_id',
    )
    .where('l.id', logId)
    .first()
    .forUpdate(); // lock row for idempotency
}

export async function setStatusTakenTx(trx: Knex.Transaction, log: any) {
  // your FIFO consumption here
  await consumeStockTx(trx, log.id, log.user_supplement_id, log.quantity_units);
  // await trx('nutrition.schedule_logs').where({ id: log.id }).update({
  //   status: 'taken',
  //   updated_at: trx.fn.now(),
  // });
}

export async function setStatusSkippedTx(trx: Knex.Transaction, logId: string) {
  await trx('nutrition.schedule_logs').where({ id: logId }).update({
    status: 'skipped',
    updated_at: trx.fn.now(),
  });
}

export async function revertTakenTx(trx: Knex.Transaction, logId: string) {
  const rows = await trx('nutrition.schedule_log_consumptions')
    .where({ log_id: logId })
    .select('batch_id', 'units')
    .forUpdate();

  if (rows.length === 0) return;

  for (const r of rows) {
    await trx('nutrition.batches')
      .where({ id: r.batch_id })
      .increment('quantity_units', r.units);
  }

  await trx('nutrition.schedule_log_consumptions').where({ log_id: logId }).del();
}

export async function markNotifiedTx(trx: Knex.Transaction, logId: string) {
  await trx('nutrition.schedule_logs')
    .where({ id: logId, status: 'pending' })
    .update({ notified_at: trx.fn.now() });
}

export async function fetchDuePlanInstances(trx?: Knex.Transaction) {
  const k = (trx ?? db) as Knex;
  return k('nutrition.schedule_plans as p')
    .join('core.users as u', 'u.id', 'p.user_id')
    .join('nutrition.v_user_supplements as vus', 'vus.id', 'p.user_supplement_id')
    .whereNotNull('u.telegram_chat_id')
    .where({ 'p.active': true })
    .whereRaw(
      `
      CASE p.time_of_day
        WHEN 'morning'   THEN ((now() AT TIME ZONE u.tz)::time >= time '00:05'
                            AND (now() AT TIME ZONE u.tz)::time <  time '23:55')
        WHEN 'afternoon' THEN ((now() AT TIME ZONE u.tz)::time >= time '12:00'
                            AND (now() AT TIME ZONE u.tz)::time <  time '16:05')
        WHEN 'evening'   THEN ((now() AT TIME ZONE u.tz)::time >= time '17:00'
                            AND (now() AT TIME ZONE u.tz)::time <  time '21:05')
        WHEN 'bedtime'   THEN ((now() AT TIME ZONE u.tz)::time >= time '21:00'
                            AND (now() AT TIME ZONE u.tz)::time <= time '23:59:59')
      END
    `,
    )
    .andWhereRaw(
      `
      NOT EXISTS (
        SELECT 1 FROM nutrition.schedule_logs l
        WHERE l.user_id = p.user_id
          AND l.user_supplement_id = p.user_supplement_id
          AND l.date = (now() AT TIME ZONE u.tz)::date
          AND l.time_of_day = p.time_of_day
      )
    `,
    )
    .select({
      userId: 'p.user_id',
      chatId: 'u.telegram_chat_id',
      name: 'vus.display_name',
      doseUnits: 'p.units_per_dose',
      doseLabel: k.raw(`p.units_per_dose::text`),
      date: k.raw('(now() AT TIME ZONE u.tz)::date'),
      timeOfDay: 'p.time_of_day',
      userSupplementId: 'p.user_supplement_id',
      planId: 'p.id',
      images: 'vus.images',
    });
}
