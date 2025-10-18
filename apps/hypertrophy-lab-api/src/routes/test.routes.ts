// routes/test.send-one.ts
import { sendReminder } from '@ikigaidev/tg-bot';
import { Router } from 'express';
import { db } from '../config/database.js';
import { telegram } from '../infra/telegram.js';
import { getPlanForUser } from '../repositories/schedule.repo.js';
import { createLog } from '../services/schedule.service.js';

const r = Router();

r.post('/send-one', async (req, res) => {
  const { userId, chatId, planId, units } = req.body;

  if (!userId || !chatId || !planId)
    return res.status(400).json({ ok: false, error: 'missing_fields' });

  const plan = await getPlanForUser(userId, planId);
  if (!plan) return res.status(404).json({ ok: false, error: 'plan_not_found' });

  const date = new Date().toISOString().slice(0, 10);

  const { id: logId } = await createLog(userId, {
    planId,
    userSupplementId: plan.userSupplementId,
    date,
    timeOfDay: plan.timeOfDay,
    status: 'pending',
    quantityUnits: units ?? plan.unitsPerDose,
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

  return res.json({ ok: true, logId });
});

export default r;
