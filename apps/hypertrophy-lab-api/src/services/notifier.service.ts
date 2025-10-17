import { sendReminder } from '@ikigaidev/tg-bot';
import { db } from '../config/database.js';
import { telegram } from '../infra/telegram.js';
import {
  createLog,
  fetchDuePlanInstances,
  markNotified,
} from '../repositories/schedule.repo.js';

export async function sendDueRemindersService() {
  const due = await fetchDuePlanInstances(); // [{ userId, chatId, name, dose, date, timeOfDay, userSupplementId, planId }]
  if (due.length === 0) return;

  await db.transaction(async (trx) => {
    for (const it of due) {
      // dedupe: unique (user_id, user_supplement_id, date, time_of_day)
      const { id: logId } = await createLog(trx, {
        userId: it.userId,
        payload: {
          userSupplementId: it.userSupplementId,
          planId: it.planId ?? null,
          date: it.date,
          timeOfDay: it.timeOfDay,
          quantityUnits: it.doseUnits ?? 0,
          consumeStock: true,
          status: 'pending',
        },
      });

      await sendReminder(telegram, {
        chatId: it.chatId,
        suppName: it.name,
        logId: logId,
        doseLabel: it.doseLabel,
        doseUnits: it.doseUnits,
      });

      // await sendReminder(
      //   it.chatId,
      //   ,
      //   Markup.inlineKeyboard([
      //     [
      //       Markup.button.callback('✅ Take', `t:${logId}`),
      //       Markup.button.callback('⏭ Skip', `s:${logId}`),
      //     ],
      //   ]),
      // );

      await markNotified(trx, logId);
    }
  });
}
