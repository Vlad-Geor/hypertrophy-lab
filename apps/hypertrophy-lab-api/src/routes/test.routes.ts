import { sendReminder } from '@ikigaidev/tg-bot';
import { Router } from 'express';
import { db } from '../config/database';
import { telegram } from '../infra/telegram';
import { createLog } from '../repositories/schedule.repo';

const r = Router();

r.post('/send-one', async (req, res) => {
  const { userId, chatId, userSupplementId, units = 2 } = req.body;
  const date = new Date().toISOString().slice(0, 10);
  let logId;
  db.transaction(async (trx) => {
    logId = await createLog(trx, {
      userId,
      payload: {
        userSupplementId,
        planId: null,
        date,
        timeOfDay: 'morning',
        status: 'pending',
        quantityUnits: units,
        consumeStock: true,
      },
    });
  });

  await sendReminder(telegram, {
    chatId: chatId,
    logId,
    suppName: 'Magnesium',
    doseUnits: units,
  });
  await db('nutrition.schedule_logs')
    .where({ id: logId })
    .update({ notified_at: db.fn.now() });
  res.json({ ok: true, logId });
});

export default r;