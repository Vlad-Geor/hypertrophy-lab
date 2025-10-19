// services/schedule.telegram.service.ts (replace placeholders)
import { db } from '../config/database.js';
import * as repo from '../repositories/schedule.repo.js';
import * as service from '../services/schedule.service.js';

type Out = {
  ok: boolean;
  status?: 'taken' | 'skipped' | 'pending';
  error?: string;
  statusCode?: number;
};

export async function telegramAction(p: {
  action: 't' | 's';
  logId: string;
  chatId: string;
}): Promise<Out> {
  return db.transaction(async (trx) => {
    const log = await repo.getLogForActionTx(trx, p.logId);
    const chatId = String(p.chatId);

    if (!log)
      return { ok: false, error: 'not_found', status: 'pending', statusCode: 404 };
    if (!log.telegramChatId || String(log.telegramChatId) !== chatId)
      return { ok: false, error: 'forbidden', statusCode: 403 };

    // Idempotency and transitions
    if (p.action === 't') {
      if (log.status === 'taken') {
        return { ok: true, status: 'taken' };
      } else {
        console.log('log status: ', log.status);

        await service.patchLogTx(trx, {
          logId: log.id,
          userId: log.userId,
          patch: { status: 'taken', quantityUnits: log.quantityUnits },
        });
        return { ok: true, status: 'taken' };
      }
    } else {
      // action === 's'
      if (log.status === 'skipped') return { ok: true, status: 'skipped' };
      await service.patchLogTx(trx, {
        logId: log.id,
        userId: log.userId,
        patch: { status: 'skipped' },
      });
      return { ok: true, status: 'skipped' };
    }
  });
}
