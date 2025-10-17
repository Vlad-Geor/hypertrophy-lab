// services/schedule.telegram.service.ts (replace placeholders)
import { db } from '../config/database';
import * as repo from '../repositories/schedule.repo';

type Out = {
  ok: boolean;
  status?: 'taken' | 'skipped' | 'pending';
  error?: string;
  statusCode?: number;
};

export async function telegramActionService(p: {
  action: 't' | 's';
  logId: string;
  chatId: string;
}): Promise<Out> {
  return db.transaction(async (trx) => {
    const log = await repo.getLogForAction(trx, p.logId);
    if (!log)
      return { ok: false, error: 'not_found', status: 'pending', statusCode: 404 };
    if (String(log.telegram_chat_id) !== p.chatId)
      return { ok: false, error: 'forbidden', statusCode: 403 };

    // Idempotency and transitions
    if (p.action === 't') {
      if (log.status === 'taken') return { ok: true, status: 'taken' };
      if (log.status === 'pending') {
        await repo.setStatusTaken(trx, log);
        return { ok: true, status: 'taken' };
      }
      // skipped -> taken (optional): allow or block
      await repo.setStatusTaken(trx, log);
      return { ok: true, status: 'taken' };
    } else {
      // action === 's'
      if (log.status === 'skipped') return { ok: true, status: 'skipped' };
      if (log.status === 'taken') {
        await repo.revertTaken(trx, log); // add stock back, delete consumptions
        await repo.setStatusSkipped(trx, log.id);
        return { ok: true, status: 'skipped' };
      }
      // pending -> skipped
      await repo.setStatusSkipped(trx, log.id);
      return { ok: true, status: 'skipped' };
    }
  });
}
