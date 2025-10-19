import crypto from 'crypto';
import { db } from '../config/database.js';
import { telegram } from '../infra/telegram.js';
import { getDaySummary } from './schedule.service.js';

export async function sendMorningSummaries() {
  // leader-only
  const {
    rows: [{ ok }],
  } = await db.raw('select pg_try_advisory_lock(?,?) as ok', [43, 1]);
  if (!ok) return;

  try {
    const users = await db('core.users as u')
      .whereNotNull('u.telegram_chat_id')
      .whereRaw(
        `
        (now() at time zone u.tz)::time >= time '07:00'
        AND (now() at time zone u.tz)::time <  time '07:05'
        AND NOT EXISTS (
          SELECT 1 FROM core.daily_notifications dn
          WHERE dn.user_id=u.id
            AND dn.date=(now() at time zone u.tz)::date
            AND dn.type='morning_summary'
        )
      `,
      )
      .select('u.id', 'u.telegram_chat_id as chatId', 'u.tz')
      .orderBy('u.id')
      .limit(500);

    for (const u of users) {
      // small deterministic jitter to avoid burst
      const jitter = crypto.createHash('md5').update(u.id).digest()[0] % 20;
      await new Promise((r) => setTimeout(r, jitter * 100));

      const date = await today(u.tz);
      const summary = await getDaySummary({ userId: u.id, date }); // call service directly
      const text = formatSummary(summary);

      await telegram.sendMessage(u.chatId, text);

      await db('core.daily_notifications').insert({
        user_id: u.id,
        date,
        type: 'morning_summary',
        sent_at: db.fn.now(),
      });
    }
  } finally {
    await db.raw('select pg_advisory_unlock(?,?)', [43, 1]);
  }
}

async function today(tz: string) {
  const {
    rows: [x],
  } = await db.raw(`select to_char((now() at time zone ?)::date,'YYYY-MM-DD') d`, [tz]);
  return x.d as string;
}

function formatSummary(s: { date: string; total: number; groups: any[] }) {
  const lines = s.groups
    .map(
      (g) =>
        `🕒 ${g.time}\n` +
        g.items.map((i: any) => `• ${i.name} — ${i.dose} (${i.status})`).join('\n'),
    )
    .join('\n\n');
  return `Good morning.\n${s.total} supplements today.\n\n${lines}`;
}
