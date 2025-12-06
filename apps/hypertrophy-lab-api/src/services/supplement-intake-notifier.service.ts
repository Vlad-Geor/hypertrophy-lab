import { sendReminder } from '@ikigaidev/tg-bot';
import * as crypto from 'crypto';
import { db } from '../config/database.js';
import { telegram } from '../infra/telegram.js';
import { createLog, fetchDuePlanInstances } from '../repositories/schedule.repo.js';

export async function sendDueRemindersService() {
  const r = await db.raw('select pg_try_advisory_lock(?,?) AS ok', [42, 1]);
  const got = r.rows?.[0].ok === true;

  if (!got) return;

  try {
    const due = await fetchDuePlanInstances(); // now includes inventorySource + group info

    if (due.length === 0) return;

    const created = await db.transaction(async (trx) => {
      const out: Array<{
        chatId: string;
        name: string;
        units: number;
        logId: string;
        images: string[];
      }> = [];
      for (const it of due) {
        const { id: logId } = await createLog(trx, {
          userId: it.userId,
          payload: {
            consumeStock: false,
            inventorySource: it.inventorySource ?? 'personal',
            userSupplementId:
              it.inventorySource === 'group' ? null : (it.userSupplementId ?? null),
            groupId: it.inventorySource === 'group' ? (it.groupId ?? null) : null,
            groupSupplementId:
              it.inventorySource === 'group' ? (it.groupSupplementId ?? null) : null,
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
          images: it.images,
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
        images: it.images ?? ['bla'],
      });
      await db('nutrition.schedule_logs')
        .where({ id: it.logId, status: 'pending' })
        .update({ notified_at: db.fn.now() });
    }
  } finally {
    await db.raw('select pg_advisory_unlock(?,?)', [42, 1]);
  }
}
