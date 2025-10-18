// libs/tg-bot/src/service/send-reminder.ts
import type { Telegram } from 'telegraf';
import { Markup } from 'telegraf';
import type { Message } from 'telegraf/types';

export type SendReminderInput = {
  chatId: number | string;
  suppName: string;
  doseLabel?: string | null;
  doseUnits?: string | null;
  logId: string;
};

export async function sendReminder(
  telegram: Telegram,
  it: SendReminderInput,
): Promise<Message.TextMessage> {
  const text =
    `Time to take: ${it.suppName} • ${it.doseLabel ?? it.doseUnits ?? ''}`.trimEnd();
  const kb = Markup.inlineKeyboard([
    [
      Markup.button.callback(
        '✅ Take',
        `t:${it.logId}|${encodeURIComponent(it.suppName)}`,
      ),
      Markup.button.callback(
        '⏭ Skip',
        `s:${it.logId}|${encodeURIComponent(it.suppName)}`,
      ),
    ],
  ]);
  return telegram.sendMessage(it.chatId, text, { reply_markup: kb.reply_markup });
}
