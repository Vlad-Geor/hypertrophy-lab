import { sendReminder } from '@ikigaidev/tg-bot';
import * as crypto from 'crypto';
import { db } from '../config/database.js';
import { telegram } from '../infra/telegram.js';
import { createLog, fetchDuePlanInstances } from '../repositories/schedule.repo.js';

async function runBatch() {
  await db.transaction(async (trx) => {
    const due = await fetchDuePlanInstances(trx);
    for (const it of due) {
      const { id: logId } = await createLog(trx, {
        userId: it.userId,
        payload: {
          planId: it.planId,
          userSupplementId: it.userSupplementId,
          date: it.date,
          timeOfDay: it.timeOfDay,
          status: 'pending',
          quantityUnits: it.doseUnits ?? 0,
          consumeStock: false,
        },
      });
      await sendReminder(telegram, {
        chatId: String(it.chatId),
        logId: logId,
        suppName: it.name,
        doseUnits: it.doseUnits,
        doseLabel: it.doseLabel,
      });
      await trx('nutrition.schedule_logs')
        .where({ id: logId })
        .update({ notified_at: trx.fn.now() });
    }
  });
}

export async function sendDueRemindersService() {
  const {
    rows: [{ ok }],
  } = await db.raw('select pg_try_advisory_lock(?,?) ok', [42, 1]);
  if (!ok) return;

  try {
    const due = await fetchDuePlanInstances(); // [{ userId, chatId, name, dose, date, timeOfDay, userSupplementId, planId }]
    if (due.length === 0) return;

    const created = await db.transaction(async (trx) => {
      const out: Array<{ chatId: string; name: string; units: number; logId: string }> =
        [];
      for (const it of due) {
        const { id: logId } = await createLog(trx, {
          userId: it.userId,
          payload: {
            consumeStock: false,
            userSupplementId: it.userSupplementId,
            planId: it.planId ?? null,
            date: it.date,
            timeOfDay: it.timeOfDay,
            quantityUnits: it.doseUnits ?? 0,
            status: 'pending',
          },
        });
        out.push({
          chatId: String(it.chatId),
          name: it.name,
          units: it.doseUnits ?? 0,
          logId,
        });
      }
      return out;
    });

    // 2) jitter + send + mark notified (outside TX)
    for (const it of created) {
      const jitterSec = crypto.createHash('md5').update(it.chatId).digest()[0] % 30;
      await new Promise((r) => setTimeout(r, jitterSec * 1000));
      await sendReminder(telegram, {
        chatId: it.chatId,
        logId: it.logId,
        suppName: it.name,
        doseUnits: String(it.units),
      });
      await db('nutrition.schedule_logs')
        .where({ id: it.logId, status: 'pending' })
        .update({ notified_at: db.fn.now() });
    }
  } finally {
    await db.raw('select pg_advisory_unlock(?,?)', [42, 1]);
  }
}

// await db.transaction(async (trx) => {
//       for (const it of due) {
//         // dedupe: unique (user_id, user_supplement_id, date, time_of_day)
//         const { id: logId } = await createLog(trx, {
//           userId: it.userId,
//           payload: {
//             userSupplementId: it.userSupplementId,
//             planId: it.planId ?? null,
//             date: it.date,
//             timeOfDay: it.timeOfDay,
//             quantityUnits: it.doseUnits ?? 0,
//             consumeStock: true,
//             status: 'pending',
//           },
//         });

//         const hash = crypto.createHash('md5').update(it.userId).digest(); // deterministic
//         const jitterSec = hash[0] % 30; // 0–29s
//         await new Promise((r) => setTimeout(r, jitterSec * 1000));

//         await sendReminder(telegram, {
//           chatId: it.chatId,
//           suppName: it.name,
//           logId: logId,
//           doseLabel: it.doseLabel,
//           doseUnits: it.doseUnits,
//         });

//         await markNotifiedTx(trx, logId);
//       }
//     });
